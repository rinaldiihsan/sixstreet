import React from 'react';

const AccordionSection = ({ title, isActive, onToggle, children }) => {
  return (
    <div className="w-full border border-gray-200 -md overflow-hidden">
      <button className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors duration-200" onClick={onToggle}>
        <span className="text-lg font-garamond font-bold text-[#333333]">{title}</span>
        <span className="text-xl font-garamond font-bold text-[#333333] transition-transform duration-200">{isActive ? '−' : '+'}</span>
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4 border-t border-gray-200">{children}</div>
      </div>
    </div>
  );
};

export default AccordionSection;
