import React from 'react';

interface InstructionBadgeProps {
  text: string;
  variant?: 'primary' | 'dark';
}

export default function InstructionBadge({ text }: InstructionBadgeProps) {
  return (
    <div className={`relative inline-flex items-center text-white bg-blue-700 px-5 py-1.5 rounded-full backdrop-blur-md`}>
      <span className="text-[15px] font-black uppercase tracking-[0.15em]">
        {text}
      </span>
    </div>
  );
}