import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DroppableColumn = ({ id, title, titleClassName, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col border-2 border-retro-black bg-white transition-colors h-full ${isOver ? 'bg-gray-200' : ''}`}
    >
      <div className={`text-white py-2 text-center font-bold text-sm border-b-2 border-retro-black ${titleClassName}`}>
        {title}
      </div>
      <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[100px]">
        {children}
      </div>
    </div>
  );
};
export default DroppableColumn;
