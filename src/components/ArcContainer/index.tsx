'use client';

import React, { useState } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { create } from 'zustand';

type Node = {
  id: string;
  parentId?: string;
  message?: string;
  response?: string;
}

type NodeState = {
  nodes: Node[];
  addNode: (parentId: string) => void;
  updateNode: (id: string, data: Omit<Node, 'id'>) => void;
  deleteNode: (id: string) => void;
}

const useNodes = create<NodeState>((set) => ({
  nodes: [{
    id: 'root',
  }],
  addNode: (parentId: string) => set(state => ({
    nodes: [
      ...state.nodes, 
      { 
        id: `${parentId}_${state.nodes.filter(node => node.id.includes(parentId)).length}`, 
        parentId 
      }
    ]
  })),
  updateNode: (id: string, data: Omit<Node, 'id'>) => set(state => {
    console.log(id, data)
    const node = state.nodes.find(node => node.id === id);

    if (!node) return state;
    console.log('node', node)

    node.message = data.message;
    node.response = data.response;

    console.log(node)
    return state;
  }),
  deleteNode: (id: string) => set(state => {
    const nodeIndex = state.nodes.findIndex(node => node.id === id);

    if (!nodeIndex) return state;

    state.nodes = state.nodes.filter(node => node.id !== id);

    return state;
  })
}))

export const ArcContainer = () => {
  const nodes = useNodes(state => state.nodes);

  const depths = {} as Record<number, true>;

  nodes.forEach(node => {
    const depth = node.id.split('_').length;

    if (!depths[depth]) {
      depths[depth] = true;
    };
  });

  const depthLayers = Object.keys(depths).length;

  console.log(
    nodes
    .filter(node => node.id.split('_').length === 2)
    .map(node => node)
  )

  return (
    <ArcherContainer strokeColor="#4f4f4f" strokeWidth={2}>
      <div className="flex flex-col items-center p-12 w-screen">
        {Array.from(Array(depthLayers), (v, index) => index + 1).map(depth => (
          <div key={`depth_${depth}`} className="flex items-center justify-center w-full mb-20 gap-10" id={`depth_${depth}`}>
            {nodes.filter(node => node.id.split('_').length === depth).map(node => (
              <ArcherElement
                key={node.id}
                id={node.id}
                relations={nodes
                  .filter(n => n.id.split('_').length === depth + 1 && n.id.includes(node.id))
                  .sort()
                  .map(n => ({ targetId: n.id, targetAnchor: 'top',  sourceAnchor: 'bottom' }))
                }
              >
                <div>
                  <NodeCard id={node.id}>
                  </NodeCard>
                </div>
              </ArcherElement>
            ))}
          </div>
        ))}
      </div>
    </ArcherContainer>
  );
};

const sendMessageSchema = z.object({
  message: z
    .string()
    .min(10, 'The message must have at least 10 characters')
    .max(144, 'The message characters limit is 144')
});

type NodeCardProps = {
  id: string;
  parentId?: string;
  children?: React.ReactNode;
}

function NodeCard({ id, parentId }: NodeCardProps) {
  const nodes = useNodes(state => state.nodes);
  const addNode = useNodes(state => state.addNode);
  const updateNode = useNodes(state => state.updateNode);
  const deleteNode = useNodes(state => state.deleteNode);

  const [response, setResponse] = useState('');
  
  const sendMessageForm = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
  });

  async function handleSendMessageSubmit(values: z.infer<typeof sendMessageSchema>) {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = response.body;

    if (!data) throw new Error('No response body');

    const reader = data.getReader();

    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();

      done = doneReading;

      const chunkValue = decoder.decode(value);

      setResponse(resp => {
        const response = resp += chunkValue;

        if (doneReading) {
          updateNode(id, {
            message: values.message,
            response: response
          });
        }

        return response;
      })
    }
  }
  
  async function handleAddNode() {
    addNode(parentId || id);
    console.log(nodes)
  }

  async function handleDeleteNode() {
    if (!parentId) return;

    deleteNode(id);
  }

  return (
    <div className="p-3 bg-gray-50 min-w-[400px] max-w-[500px] mb-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-700">{id}</h2>
        <div className="flex items-center gap-1">
          {parentId && <Button 
            type="submit"
            variant="ghost"
            size="sm"
            className="dark py-1 px-2"
            title="Add node"
            onClick={handleDeleteNode}
          >
            <X className="h-4" />
          </Button>}
            <Button 
              type="submit"
              variant="ghost"
              size="sm"
              className="dark py-1 px-2"
              title="Add node"
              onClick={handleAddNode}
            >
              <Plus className="h-4" />
            </Button>
        </div>
      </div>
      {!response && <Form {...sendMessageForm}>
        <form className="grid gap-2" onSubmit={sendMessageForm.handleSubmit(handleSendMessageSubmit)}>
          <FormField
            control={sendMessageForm.control}
            name="message"
            render={({ field }) => (  
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="List 3 types of Japanese food" 
                    className="resize-none"
                    {...field}
                  ></Textarea>
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={!sendMessageForm.formState.isValid}>SEND</Button>
        </form>
      </Form>}
      {response && <p>{response}</p>}
    </div>
  )
}