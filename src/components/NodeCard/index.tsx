'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useChat } from 'ai/react';
import { Plus, X } from 'lucide-react';
import { ArcherContainerRef, ArcherElement } from 'react-archer';
import Draggable from 'react-draggable'; //
import ReactMarkdown from 'react-markdown';
import { AnchorPositionType } from 'react-archer/lib/types';
import remarkGfm from "remark-gfm";

import { Node, findGenealogyById, useNodes } from '@/store/nodes';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AppMessage, useMessages } from '@/store/messages';

type NodeCardProps = {
  node: Node;
  relations?: {
    targetId: string;
    targetAnchor: AnchorPositionType;
    sourceAnchor: AnchorPositionType;
    order?: number;
    label?: React.ReactNode | null | undefined;
  }[];
  container: ArcherContainerRef | null
}

export function NodeCard({ node, relations, container }: NodeCardProps) {
  useNodes(state => state.nodeTree);
  const createNode = useNodes(state => state.createNode);
  const deleteNode = useNodes(state => state.deleteNode);

  const createMessage = useMessages(state => state.createMessage)

  const getMessagesByNodeId = useMessages(state => state.getMessagesByNodeId);
  const getContextMessagesByNodeId = useMessages(state => state.getContextMessagesByNodeId);

  async function handleAddNode() { createNode(node.id); };

  async function handleDeleteNode() {  if (node.parentId) deleteNode(node); };

  async function handleOnMessage(message: AppMessage) { createMessage(message); };

  const messages = getMessagesByNodeId(node.id);
  const contextMessages = getContextMessagesByNodeId(node.id);

  return (
    <Draggable
      onDrag={() => container?.refreshScreen()}
      onStop={() => container?.refreshScreen()}
      positionOffset={{ x: '-50%', y: '-50%' }}
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 shadow-lg z-20 inline-block">
        <ArcherElement id={node.id} relations={relations}>
          <div className="p-3 bg-white border-1 border-gray-50 min-w-[500px] max-w-[700px] rounded-md hover:cursor-grab">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-700">
                <Badge>{node.indexLabel}</Badge>
              </h2>
              <div className="flex items-center gap-1">
                {!node.root && <Button 
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
            <MessageList messages={messages} />
            <SubmitMessageContainer contextMessages={contextMessages} onMessage={handleOnMessage} nodeId={node.id} />
          </div>
        </ArcherElement>
      </div>
    </Draggable>
  )
}

type MessageListProps = {
  messages: AppMessage[];
}

function MessageList({ messages }: MessageListProps) {
  const messagesToRender = messages.filter(message => message.role !== 'system');

  return (
    <div className="message-list flex flex-col w-full gap-1 max-h-[500px] overflow-y-auto">
      {messagesToRender.map(message => (
        <div key={message.id}>
          {message.role === 'assistant' ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose">
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="flex flex-col w-full">
              <p className="font-bold">{message.content}</p>
              <div className="flex h-0.5 bg-gray-100 w-full my-2"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

type SubmitMessageContainerProps = {
  nodeId: string;
  contextMessages?: AppMessage[];
  onMessage: (message: AppMessage) => void;
}

function SubmitMessageContainer({ nodeId, contextMessages = [], onMessage }: SubmitMessageContainerProps) {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/message',    
    initialMessages: contextMessages,
    onFinish: (message) => {
      onMessage({ nodeId, ...message});
      setMessages([]);
    },
  });

  async function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    onMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      nodeId,
    });

    handleSubmit(e);
  }

  const contextMessageIds = contextMessages.map(m => m.id);
  const filteredMessages = messages.filter(message => !contextMessageIds.includes(message.id));

  const lastMessage = filteredMessages[filteredMessages.length - 1];

  return (
    <div className="flex flex-col w-full mt-4">
      {lastMessage && lastMessage.role === 'assistant' && (
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose">
          {lastMessage.content}
        </ReactMarkdown>
      )}
      <form onSubmit={handleSendMessage} className="flex w-full h-10">
        <Input value={input} id="name" onChange={handleInputChange} />
        <Button size="sm" className="h-full ml-2">SEND</Button>
      </form>
    </div>
  )
}