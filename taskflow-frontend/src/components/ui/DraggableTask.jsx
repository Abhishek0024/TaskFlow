import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
    data: task
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  const isDone = task.status === 'DONE';

  if (isDone) {
    return (
      <div 
        ref={setNodeRef} style={style} {...listeners} {...attributes}
        className={`border-2 border-retro-black p-3 bg-gray-100 opacity-70 cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-brutal' : ''}`}
      >
        <h4 className="font-bold mb-4 text-gray-500 line-through">{task.title}</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-auto">COMPLETED</p>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={`border-2 border-retro-black p-3 brutal-shadow-sm bg-white relative group cursor-grab active:cursor-grabbing ${isDragging ? 'rotate-2 scale-105 z-50' : ''} ${task.status === 'IN_PROGRESS' ? 'bg-retro-pink bg-opacity-30 border-dashed' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold border border-retro-black px-1">TASK_{task.id}</span>
      </div>
      <h4 className="font-bold mb-2 leading-tight">{task.title}</h4>
      <p className="text-[11px] text-gray-700 mb-4 line-clamp-3">{task.description}</p>
      <div className="flex justify-between items-end mt-auto">
        <div className="w-6 h-6 bg-pink-300 brutal-border"></div>
        {task.deadline && <span className="text-[10px] font-bold">Due: {task.deadline}</span>}
      </div>
    </div>
  );
};
export default DraggableTask;
