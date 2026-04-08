import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useUser } from '@/contexts/UserContext';
import { LayoutGrid } from 'lucide-react';

interface OF {
  id: string;
  task: string;
  center: string;
  quantity: number;
  estimatedTime: string;
  status: 'aguardando' | 'producao' | 'pausa';
}

const CardsScreen = () => {
  const router = useRouter();
  const [time, setTime] = useState('');
  const [greeting, setGreeting] = useState('Olá, João');
  const [period, setPeriod] = useState<'morning' | 'afternoon' | 'night'>('afternoon');
  const { user } = useUser();

  const [ordens] = useState<OF[]>([
    { id: '2024-001', task: 'Corte de Chapas', center: 'Guilhotina CNC 02', quantity: 150, estimatedTime: '25', status: 'aguardando' },
    { id: '2024-002', task: 'Dobra de Perfis', center: 'Dobradeira Hidráulica', quantity: 80, estimatedTime: '35', status: 'aguardando' }
  ]);

  useEffect(() => {
    const updateHeader = () => {
      const now = new Date();
      const hour = now.getHours();
      
      setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

      const name = user?.nome || 'Operador';
      if (hour >= 5 && hour < 12) {
        setPeriod('morning');
        setGreeting(`Bom dia, ${name}`);
      } else if (hour >= 12 && hour < 18) {
        setPeriod('afternoon');
        setGreeting(`Boa tarde, ${name}`);
      } else {
        setPeriod('night');
        setGreeting(`Boa noite, ${name}`);
      }
    };

    updateHeader();
    const timer = setInterval(updateHeader, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOF = (of) => {
      router.push({
      pathname: '/confirm',
      query: { 
        id: of.id, 
        task: of.task, 
        estimatedTime: of.estimatedTime 
      }
    });
  };

  const handleLogout = () => {
    setTimeout(() => router.push('/standby'), 250);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-1000 theme-${period} bg-var-bg`}>
      <nav className="bg-var-nav text-white px-10 py-4 flex justify-between items-center shadow-lg z-10 transition-colors duration-1000">
        <div className="h-12">
          <img src="/images/logo_intesis_branco.png" alt="Logo" className="h-full object-contain" />
        </div>
        <div className="text-right font-medium opacity-90 leading-tight">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          <br />
          <span className="text-xl font-bold">{time}</span>
        </div>
      </nav>

      <main className="flex-1 p-12 max-w-7xl mx-auto w-full mb-24">
        <header className="relative pl-6 mb-10 border-l-8 border-var-primary rounded-sm transition-all duration-1000">
          <h1 className="text-4xl font-extrabold text-var-welcome tracking-tight">
            {greeting}
          </h1>
          <p className="text-slate-500 text-lg mt-1">Acompanhe o progresso das Ordens de Fabricação (OF).</p>
          <div className="hidden md:flex items-center gap-2 text-var-welcome py-2 rounded-2xl font-black text-xs uppercase tracking-widest">
            {ordens.length} Ordens disponíveis
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {ordens.map((of) => (
            <div 
              key={of.id} 
              className="bg-var-card border border-black/5 rounded-2xl p-6 shadow-md hover:-translate-y-1 hover:border-var-primary transition-all cursor-pointer group"
              onClick={() => handleSelectOF(of)}
           >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-black/5">
                <h3 className="text-xl font-bold text-slate-800">OF: {of.id}</h3>
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  of.status === 'aguardando' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {of.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900">{of.task}</p>
                <p className="text-slate-600"><strong>Centro:</strong> {of.center}</p>
                
                <div className="flex justify-between mt-6 p-4 bg-var-footer rounded-xl font-medium text-slate-700 transition-colors duration-1000">
                  <p><strong>Quantidade:</strong> {of.quantity} Peças</p>
                  <p><strong>Tempo Estimado:</strong> {of.estimatedTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-5 bg-var-card border-t border-black/5 flex justify-end z-20 transition-colors duration-1000">
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors shadow-lg active:scale-95"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair do Sistema
        </button>
      </footer>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CardsScreen), { ssr: false });