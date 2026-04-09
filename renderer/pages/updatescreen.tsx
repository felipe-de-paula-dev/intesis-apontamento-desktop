import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, AlertCircle, Check } from 'lucide-react';
import FeedbackScreen from './feedback';

type UpdateStatus = 'checking' | 'downloading' | 'ready' | 'error';

export default function UpdateScreen() {
  const [status, setStatus] = useState<UpdateStatus>('checking');
  const [progress, setProgress] = useState(0);
  const [version, setVersion] = useState('...');

  useEffect(() => {

    if (!window.ipc) {
      console.warn('window.ipc não disponível (modo dev sem Electron?)');
      return;
    }

    const unsubsStatus = window.ipc.on('update-status', (s: UpdateStatus) => setStatus(s));
    const unsubsProgress = window.ipc.on('update-progress', (p: number) => setProgress(Math.round(p)));
    const unsubsVersion = window.ipc.on('update-version', (v: string) => setVersion(v));

    window.ipc.send('check-update');

    return () => {
      unsubsStatus();
      unsubsProgress();
      unsubsVersion();
    };
  }, []);

  useEffect(() => {
    if (status === 'ready') {
      const timer = setTimeout(() => {
        window.ipc.send('restart-app'); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === 'ready') {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center animate-in fade-in duration-500">
        <FeedbackScreen 
          color="emerald"
          icon={Check}
          title="Tudo Pronto!"
          subtitle={`Versão ${version} instalada.`}
          message="O sistema será reiniciado em instantes"
        />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center animate-in zoom-in-95">
        <FeedbackScreen 
          color="rose"
          icon={AlertCircle}
          title="Falha no Update"
          subtitle="Ocorreu um erro ao baixar os arquivos."
          message="Verifique sua conexão e tente novamente"
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        
        <div className={`w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8`}>
          {status === 'checking' ? (
            <RefreshCw className="text-blue-600 w-10 h-10 animate-spin stroke-[2.5px]" />
          ) : (
            <Download className="text-blue-600 w-10 h-10 animate-bounce stroke-[2.5px]" />
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
          {status === 'checking' ? 'Buscando Melhorias' : 'Atualizando Sistema'}
        </h1>
        
        <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
          {status === 'checking' 
            ? 'Aguarde enquanto verificamos novas atualizações...' 
            : `Baixando pacotes da versão ${version}...`}
        </p>

        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {progress}% concluído
          </span>
          {status === 'checking' && (
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] animate-pulse">
              Conectando servidor...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}