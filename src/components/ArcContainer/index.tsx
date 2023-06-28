'use client';

import React, { useRef } from 'react';
import { ArcherContainer, ArcherContainerRef } from 'react-archer';
import { ZoomIn, ZoomOut } from 'lucide-react';

import { TREE_SEP, useNodes } from '@/store/nodes';

import { Button } from '@/components/ui/button';
import { NodeCard } from '@/components/NodeCard';

export const ArcContainer = () => {
  const nodeTree = useNodes(state => state.nodeTree);
  const flattenTree = useNodes(state => state.flattenTree);

  const containerRef = useRef<ArcherContainerRef | null>(null);

  const nodesContainerRef = useRef<HTMLDivElement | null>(null);

  const zoom = useRef<number>(1);

  function handleZoomOut() {
    const nodesContainer = nodesContainerRef.current;

    if (!nodesContainer) return;

    if (zoom.current - 0.1 <= 0.5) return;

    zoom.current -= 0.1;

    nodesContainer.style.transform = `scale(${zoom.current})`;
    containerRef.current?.refreshScreen();
  }

  function handleZoomIn() {
    const nodesContainer = nodesContainerRef.current;

    if (!nodesContainer) return;

    if (zoom.current + 0.1 >= 1.5) return;

    zoom.current += 0.1;

    nodesContainer.style.transform = `scale(${zoom.current})`;
    containerRef.current?.refreshScreen();
  }

  const nodes = flattenTree();

  console.log('nodeTree', nodeTree);
  
  return (
    <ArcherContainer ref={containerRef} strokeColor="#4f4f4f" strokeWidth={2} className="h-full w-full">
      <div className="flex gap-2 absolute right-4 top-4 z-30">
        <Button size="sm" variant="default" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="default" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <div ref={nodesContainerRef} id="nodes-container" className="h-full w-full z-10">
        {nodes.map(node => (
          <NodeCard
            key={node.id}
            node={node}
            relations={node.nodes.map(n => ({ targetId: n.id, targetAnchor: 'top',  sourceAnchor: 'bottom' }))
            }
            container={containerRef.current}
          />
        ))
        }
      </div>
    </ArcherContainer>
  );
};