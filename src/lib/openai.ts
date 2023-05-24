// export const fetchOpenAIResponse = async () => {
//   const requestBody = {
//     prompt: message,
//     model: 'text-davinci-003', // Modelo GPT-3.5
//     max_tokens: 100,
//   };

//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
//     },
//     responseType: 'stream',
//   };

//   try {
//     const response = await axios.post(
//       'https://api.openai.com/v1/engines/davinci-codex/completions',
//       requestBody,
//       config
//     );

//     const streamReader = response.data.pipeThrough(new TextDecoderStream());
//     const reader = streamReader.getReader();

//     let result = '';

//     while (true) {
//       const { done, value } = await reader.read();

//       if (done) break;

//       result += value;
//       setResponse(result);
//     }
//   } catch (error) {
//     console.error('Failed to fetch OpenAI response:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };

