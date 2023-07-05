import { create } from 'zustand';

export type Node = {
  id: string;
  index: number;
  indexLabel: string;
  nodes: Node[];
  root: boolean;
  parentId: string | null;
}

type NodeTreeState = {
  nodeTree: Node;
  flattenTree: () => Node[];
  createNode: (parentId: string) => void;
  deleteNode: (node: Node) => void;
}

export const TREE_SEP = '_'

export const useNodes = create<NodeTreeState>((set, get) => ({
  nodeTree: {
    id: crypto.randomUUID(),
    index: 1,
    indexLabel: '1',
    nodes: [],
    root: true,
    parentId: null,
    messages: [{
      id: crypto.randomUUID(),
      role: 'system',
      content: `
        For the next responses, take these rules:
          - Always answer in Markdown
          - Answer always in Portugues, for every language being received
          - Be precise and use the minimum words you can to answer a message
          - Don't make introductions about yourself, just answer
      `,
    }],
  },
  flattenTree: () => flattenTree(get().nodeTree),
  createNode: (parentId: string) => {
    const rawNodeTree = { ...get().nodeTree };

    const parentNode = findNodeById(parentId, rawNodeTree);

    if (!parentNode) return;

    const [lastSibling] = findSiblingsByParentId(parentId, rawNodeTree);

    const nodeId = crypto.randomUUID();
    const nodeIndex = lastSibling?.index ? lastSibling.index + 1 : 1;
    
    parentNode.nodes.push({ 
      id: nodeId,
      index: lastSibling?.index ? lastSibling.index + 1 : 1,
      indexLabel: '',
      nodes: [],
      root: false,
      parentId,
    });

    const genealogy = findGenealogyById(nodeId, rawNodeTree);

    // const messages: Message[] = [];
  
    // genealogy.forEach(node => node.messages.forEach(message => messages.push({
    //   ...message,
    //   role: 'system'
    // })));

    // parentNode.nodes[parentNode.nodes.length - 1].messages = messages;

    parentNode.nodes[parentNode.nodes.length - 1].indexLabel = [
      ...genealogy.map(n => n.index),
      nodeIndex
    ].join('.');

    set({ nodeTree: rawNodeTree });
  },
  deleteNode: (node: Node) => {
    if (!node.parentId) return false;

    const rawNodeTree = { ...get().nodeTree };

    const parentNode = findNodeById(node.parentId, rawNodeTree);

    if (!parentNode) return false;

    parentNode.nodes = parentNode.nodes.filter(n => n.id !== node.id)
  
    set({ nodeTree: rawNodeTree });

    return true;
  },
}));

export function findNodeById(id: string, node: Node): Node | null {
  if (node.id === id) return node;

  if (!node.nodes.length) return null;

  for (const childNode of node.nodes) {
    const foundNode = findNodeById(id, childNode);

    if (foundNode) return foundNode;
  }

  return null;
}

export function findSiblingsByParentId(parentId: string, node: Node) {
  const nodes = flattenTree(node);

  return nodes.filter(n => n.parentId === parentId).sort((a, b) => b.index - a.index);
}

export function findGenealogyById(id: string, node: Node): Node[] {
  if (node.id === id) return [];

  for (const childNode of node.nodes) {
    const genealogy = findGenealogyById(id, childNode);

    if (genealogy) return [node, ...genealogy];
  }

  return [];
}

export function flattenTree(rootNode: Node): Node[] {
  const flattenedNodes: Node[] = [];

  function traverse(node: Node, level: number) {
    flattenedNodes.push(node); // Adiciona o nó atual ao array resultante

    for (const childNode of node.nodes) {
      traverse(childNode, level + 1); // Chama recursivamente para os nós filhos
    }
  }

  traverse(rootNode, 0);

  return flattenedNodes;
}