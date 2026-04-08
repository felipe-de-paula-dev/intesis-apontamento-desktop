import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Play, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import FeedbackScreen from './feedback';
import OperationHeader from './operationheader';
import ClockDisplay from './clockdisplay';
import PasswordInput from './passwordinput';
import InstructionBadge from './instructionbadge';

type ScreenState = 'standby' | 'started' | 'error';

const ConfirmStartScreen = () => {
  const [screen, setScreen] = useState<ScreenState>('standby');
  const [password, setPassword] = useState('');
  const [timeLogin, setTimeLogin] = useState('');
  
  const router = useRouter();
  const { id, task, estimatedTime } = router.query;
  const { user, setUser } = useUser();

  const iniciarTrabalho = (idDaOf: string | string[] | undefined) => {
    setUser((prevUser) => ({
      ...prevUser!,
      ocupado: true,
      of: String(idDaOf)
    }));
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const handleAuth = () => {
    if (password === user?.password) {
      iniciarTrabalho(id);
      setTimeLogin(getCurrentTime());
      setScreen('started');
      setTimeout(() => router.push('/standby'), 4000);
    } else {
      setScreen('error');
      setTimeout(() => {
        setScreen('standby');
        setPassword('');
      }, 2000);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-amber-50 flex flex-col items-center justify-center p-6 font-['Inter'] overflow-hidden relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent"></div>
      
      {screen === 'standby' && (
        <div className="relative flex flex-col items-center space-y-10 animate-in fade-in zoom-in duration-700 w-full max-w-5xl">
          
          <OperationHeader id={id} task={task} />

          <div className="text-center space-y-8">
            <ClockDisplay />
            <InstructionBadge text="Pronto para Iniciar?" variant="dark" />
          </div>

          <PasswordInput
            value={password}
            onChange={setPassword}
            onSubmit={handleAuth}
            helperText="Passe o crachá ou digite a senha"
          />
        </div>
      )}

      {screen === 'started' && (
        <FeedbackScreen 
          color="amber"
          icon={Play}
          title="Trabalho Iniciado"
          subtitle={`Bom trabalho, ${user?.nome || 'Usuário'}`}
          timeLogin={timeLogin}
          message={`Tempo estimado: ${estimatedTime} min`}
        />
      )}

      {screen === 'error' && (
        <FeedbackScreen 
          color="rose"
          icon={X}
          title="Acesso Negado"
          subtitle="Cartão não reconhecido ou sem permissão nesta OF."
          timeLogin={getCurrentTime()}
          message="Tente novamente em instantes"
        />
      )}
    </div>
  );
};

export default ConfirmStartScreen;