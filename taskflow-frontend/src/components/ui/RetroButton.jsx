import React from 'react';

const RetroButton = ({ children, onClick, className = '', type = 'button', variant = 'primary' }) => {
  const baseClasses = "px-4 py-2 font-bold brutal-border brutal-shadow-sm brutal-btn-active text-center cursor-pointer";
  
  const variants = {
    primary: "bg-retro-pink text-retro-black",
    secondary: "bg-retro-white text-retro-black",
  };

  return (
    <button 
      type={type} 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default RetroButton;
