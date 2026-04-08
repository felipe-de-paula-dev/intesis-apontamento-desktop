import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, CheckCircle2, PauseCircle, XCircle, Send, Check } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import FeedbackScreen from './feedback'; // Certifique-se de que o caminho está correto

const actions = [
  { id: 'finish', label: 'Concluir Tarefa', icon: CheckCircle2, color: 'bg-emerald-600 hover:bg-emerald-700', shadow: 'shadow-emerald-200' },
  { id: 'pause', label: 'Pausar Operação', icon: PauseCircle, color: 'bg-amber-500 hover:bg-amber-600', shadow: 'shadow-amber-200' },
  { id: 'cancel', label: 'Cancelar', icon: XCircle, color: 'bg-rose-600 hover:bg-rose-700', shadow: 'shadow-rose-200' },
  { id: 'back', label: 'Voltar', icon: ArrowLeft, color: 'bg-slate-500 hover:bg-slate-600', shadow: 'shadow-slate-200' },
];

const REASONS = ["Falta de Material", "Manutenção de Máquina", "Troca de Turno", "Problema de Qualidade"];

const Menu = () => {
  const [view, setView] = useState<'menu' | 'reasons' | 'success'>('menu'); 
  const [selectedAction, setSelectedAction] = useState(null);
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [feedback, setFeedback] = useState({ title: '', color: 'emerald' as any, icon: Check, subtitle: '' });
  const [timeLogin, setTimeLogin] = useState("");
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleAction = (action) => {
    setSelectedAction(action); 
    if (action.id === 'pause' || action.id === 'cancel') {
      setView('reasons');
    } else if (action.id === 'finish') {
      handleFinish(action);
    } else {
      router.push('/standby');
    }
  };

  const handleSubmit = () => {
    encerrar();
    handleFinish(selectedAction);
  };

  const handleFinish = (action) => {
    const configs = {
      finish: { title: 'CONCLUÍDO', subtitle: 'Tarefa finalizada!', color: 'emerald' as const, icon: Check },
      pause: { title: 'PAUSADO', subtitle: 'Operação interrompida.', color: 'amber' as const, icon: PauseCircle },
      cancel: { title: 'CANCELADO', subtitle: 'Operação anulada.', color: 'rose' as const, icon: XCircle }
    };

    const currentConfig = configs[action?.id] || configs.finish;

    encerrar();
    setTimeLogin(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setFeedback(currentConfig);
    setView('success');
    setTimeout(() => router.push('/standby'), 2500);
  };

  const encerrar = () => {
    setUser((prevUser) => ({
      ...prevUser!,
      ocupado: false,
      of: ''
    }));
  };

  return (
    <div className="h-screen w-screen bg-[#f0f4f8] flex flex-col items-center justify-center p-6 font-['Inter'] overflow-hidden">
      
      {view === 'menu' && (
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl space-y-6 border border-white animate-in fade-in zoom-in-95 duration-300">
          <div className="w-full flex justify-center">
            <img src="/images/logo_intesis_preta.png" alt="Logo" className="h-12 object-contain" />
          </div>
          <header className="text-center space-y-1">
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Operação Ativa</h1>
            <p className="text-gray-500 text-sm">
              OF <span className="font-bold text-blue-600 underline">{user?.id}</span> aberta.
            </p>
          </header>
          <div className="grid grid-cols-1 gap-2.5">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                className={`${action.color} ${action.shadow} group flex flex-row items-center p-4 rounded-2xl shadow-md transition-all active:scale-95 text-white cursor-pointer`}
              >
                <action.icon className="w-5 h-5 mr-4 opacity-90 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'reasons' && (
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl space-y-5 animate-in slide-in-from-right-4 duration-300">
          <header className="text-center">
            <h2 className={`text-lg font-black uppercase tracking-tight ${selectedAction?.id === 'cancel' ? 'text-rose-600' : 'text-amber-600'}`}>
              Motivo: {selectedAction?.label}
            </h2>
          </header>
          <div className="space-y-2">
            {REASONS.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`w-full flex items-center p-4 rounded-xl border-2 transition-all text-left ${reason === r ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${reason === r ? 'border-blue-500' : 'border-gray-300'}`}>
                  {reason === r && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <span className="font-bold text-xs uppercase tracking-wide">{r}</span>
              </button>
            ))}
            <button
              onClick={() => setReason('Outros')}
              className={`w-full flex flex-col p-4 rounded-xl border-2 transition-all text-left ${reason === 'Outros' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-600'}`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${reason === 'Outros' ? 'border-blue-500' : 'border-gray-300'}`}>
                  {reason === 'Outros' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <span className="font-bold text-xs uppercase tracking-wide">Outros</span>
              </div>
              {reason === 'Outros' && (
                <textarea 
                  autoFocus 
                  className="mt-3 p-3 w-full rounded-lg border border-gray-200 focus:outline-none text-gray-800 text-sm bg-white" 
                  placeholder="Especifique..." 
                  value={otherReason} 
                  onChange={(e) => setOtherReason(e.target.value)} 
                />
              )}
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView("menu")} className="flex-1 p-4 bg-gray-100 text-gray-500 font-bold rounded-xl uppercase text-[10px] tracking-widest">Voltar</button>
            <button 
              disabled={!reason || (reason === 'Outros' && !otherReason)} 
              onClick={handleSubmit} 
              className="flex-[2] p-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
            >
              Confirmar <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {view === 'success' && (
        <FeedbackScreen 
          color={feedback.color}
          icon={feedback.icon}
          title={feedback.title}
          subtitle={feedback.subtitle}
          timeLogin={timeLogin}
        />
      )}

    </div>
  );
};

export default Menu;