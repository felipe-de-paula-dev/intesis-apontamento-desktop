import React from 'react';
import { Activity } from 'lucide-react';

interface OperationHeaderProps {
  id: string | string[] | undefined;
  task: string | string[] | undefined;
}

export default function OperationHeader({ id, task }: OperationHeaderProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl"></div>
      
      <div className="relative flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-blue-100 px-4 py-3 rounded-3xl shadow-lg shadow-blue-100/50">
        <div className="text-left">
          <p className="text-blue-500 text-xs font-black uppercase tracking-[0.1em] mb-1">
            Operação Atual
          </p>
          <h2 className="text-gray-900 text-xl font-black tracking-tight">
            OF: {id} • {task}
          </h2>
        </div>
      </div>
    </div>
  );
}