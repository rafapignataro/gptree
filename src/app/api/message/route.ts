import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from "eventsource-parser";

type ChatGPTAgent = "user" | "system";

type ChatGPTMessage = {
  role: ChatGPTAgent;
  content: string;
}

type FetchStreamParams =   {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI API Key");

export async function fetchStream(params: FetchStreamParams) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(params),
  });

  let counter = 0;

  const stream = new ReadableStream({
    async start(controller) {
      function push(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const { data } = event;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            console.log(json.choices);
            const text = json.choices[0].delta?.content || "";

            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }

            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (err) {
            controller.error(err);
          }
        }
      }

      const parser = createParser(push);

      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

export const POST = async (req: Request) => {
  const { message } = await req.json();

  if (!message) return new Response('Missing message', { status: 400 });

  const stream = await fetchStream({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  });

  return new Response(stream);
};