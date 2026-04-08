import React, { useState, useEffect } from 'react';


export default function ClockDisplay() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
      <div className="relative sp text-[10rem] tracking-[-5px] font-[1000] text-gray-900 leading-none drop-shadow-sm tabular-nums">
        {time || "00:00:00"}
      </div>
  );
}