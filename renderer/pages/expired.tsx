import React from 'react';
import { CreditCard, Key, PhoneCall, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ExpiredScreen() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in duration-500">
        
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard className="text-rose-600 w-10 h-10 stroke-[2.5px]" />
        </div>

        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
          Plano Expirado
        </h1>
        <p className="text-slate-500 text-sm mb-10 leading-relaxed">
          O período de licença deste terminal terminou. <br />
          Renove sua assinatura para continuar as operações.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <button 
            className="flex items-center justify-center gap-3 w-full p-4 border text-blue-600 font-black rounded-2xl hover:bg-blue-600 hover:text-white hover:cursor-pointer transition-all uppercase text-[12px] tracking-widest"
            onClick={() => router.push('/activation')}
          >
            <Key size={16} /> Ativar Sistema
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-3 w-full p-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-600 hover:bg-slate-50 transition-all hover:cursor-pointer uppercase text-[12px] tracking-widest"
          >
            <RefreshCw size={16} /> Tentar Novamente
          </button>
        </div>

        <p className="mt-10 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Cod. Erro: LIC_EXP_04
        </p>
      </div>
    </div>
  );
}