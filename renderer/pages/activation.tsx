import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { Key, Monitor, Check, X } from 'lucide-react';
import FeedbackScreen from './feedback'; 

type ActivationState = 'idle' | 'success' | 'error';

export default function ActivationScreen() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<ActivationState>('idle');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleActivation = () => {
    if (key === '1234-5678') { 
      localStorage.setItem('terminal_key', key);
      setStatus('success');
      
      setTimeout(() => {
        router.push('/standby');
      }, 2500);
    } else {
      setStatus('error');
      
      setTimeout(() => {
        setStatus('idle');
        setKey('');
      }, 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center">
        <FeedbackScreen 
          color="emerald"
          icon={Check}
          title="Terminal 01 Ativado"
          subtitle="Licença vinculada com sucesso."
        />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center">
        <FeedbackScreen 
          color="rose"
          icon={X}
          title="Falha na Chave"
          subtitle="Esta chave de ativação é inválida."
          message="Verifique o código e tente novamente"
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
          <Key className="text-white w-10 h-10 stroke-[2.5px]" />
        </div>

        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
          Ativar Terminal
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Insira a chave de ativação abaixo para <br /> liberar o uso deste dispositivo.
        </p>

        <div className="space-y-4">
          <input 
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center font-mono font-bold text-lg focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:opacity-30"
          />
          
          <button 
            onClick={handleActivation} 
            disabled={key.length < 4}
            className="w-full p-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-100 disabled:opacity-30 disabled:shadow-none"
          >
            Vincular Terminal
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400">
          <Monitor size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            ID: {mounted ? window.navigator.userAgent.slice(0, 15) : '---'}
          </span>
        </div>
      </div>
    </div>
  );
}