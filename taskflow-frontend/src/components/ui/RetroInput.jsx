import React from 'react';

const RetroInput = ({ label, id, type = 'text', value, onChange, placeholder, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor={id} className="font-bold text-sm">{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-3 py-2 bg-retro-white brutal-border focus:outline-none focus:bg-white"
      />
    </div>
  );
};

export default RetroInput;
