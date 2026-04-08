import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  helperText?: string;
  autoFocus?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  onSubmit,
  placeholder = "••••",
  helperText = "ou digite sua senha de acesso",
  autoFocus = true
}: PasswordInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handleGlobalClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.length > 0) {
      onSubmit();
    }
  };

  return (
    <div className="relative group flex flex-col items-center space-y-2">
      <input
        ref={inputRef}
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="relative bg-white border-2 border-gray-100 outline-none text-gray-900 text-[15px] font-black tracking-[12px] w-64 text-center py-3 rounded-[30px] shadow-xl focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-100 transition-all placeholder:text-gray-200"
        placeholder={placeholder}
        autoComplete="off"
      />
        <span className="text-gray-400 w-[80%] text-center font-bold text-xs uppercase tracking-widest">
          {helperText}
        </span>
    </div>
  );
}