import { create } from 'zustand';
import { Message } from 'ai';

import { findGenealogyById, useNodes } from './nodes';

export type AppMessage = {
  nodeId: string;
} & Message;

type MessagesState = {
  messages: AppMessage[];
  createMessage: (message: Omit<AppMessage, 'id'>) => AppMessage;
  deleteMessage: (messageId: string) => void;
  getMessagesByNodeId: (nodeId: string) => AppMessage[];
  getContextMessagesByNodeId: (nodeId: string) => AppMessage[];
}

export const useMessages = create<MessagesState>((set, get) => ({
  messages: [],
  createMessage: (data: Omit<AppMessage, 'id'>) => {
    const message = { ...data, id: crypto.randomUUID() };

    set({ messages: [...get().messages, message] });

    return message;
  },
  deleteMessage: (messageId: string) => {
    set({ messages: get().messages.filter(message => message.id !== messageId )});
  },
  getMessagesByNodeId: (nodeId: string) => {
    return get().messages.filter(message => message.nodeId === nodeId);
  },
  getContextMessagesByNodeId: (nodeId: string) => {
    const genealogy = findGenealogyById(nodeId, useNodes.getState().nodeTree);
    const geanologyNodeIds = genealogy.map(g => g.id);
    
    return get().messages
      .filter(message => geanologyNodeIds.includes(message.nodeId))
      .map(message => ({ ...message, role: 'system' }));
  }
}));