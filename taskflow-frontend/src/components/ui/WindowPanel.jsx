import React from 'react';

const WindowPanel = ({ title, children, className = '', type = 'main', headerClassName = 'bg-white text-retro-black' }) => {
  return (
    <div className={`bg-retro-white brutal-border brutal-shadow flex flex-col ${className}`}>
      {/* Top Bar */}
      <div className={`border-b-2 border-retro-black px-3 py-2 flex items-center justify-between relative ${headerClassName}`}>
        <div className="flex gap-2 items-center">
          {type === 'main' && (
            <>
              <div className="w-3 h-3 rounded-full bg-retro-red brutal-border"></div>
              <div className="w-3 h-3 rounded-full bg-retro-yellow brutal-border"></div>
              <div className="w-3 h-3 rounded-full bg-retro-green brutal-border"></div>
            </>
          )}
          {type === 'card' && (
            <div className="font-bold flex-1 text-sm">{title}</div>
          )}
        </div>
        
        {type === 'main' && <div className="font-bold absolute left-1/2 -translate-x-1/2">{title}</div>}
        
        {type === 'card' && (
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-retro-red brutal-border"></div>
            <div className="w-3 h-3 rounded-full bg-retro-yellow brutal-border"></div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default WindowPanel;
