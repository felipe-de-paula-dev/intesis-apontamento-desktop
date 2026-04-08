import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Check, X } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { users, useUser } from '@/contexts/UserContext';
import FeedbackScreen from './feedback';
import ClockDisplay from './clockdisplay';
import InstructionBadge from './instructionbadge';
import PasswordInput from './passwordinput';

type ScreenState = 'standby' | 'success' | 'error';

const StandbyScreen = () => {
  const { playSound } = useSound();
  const [screen, setScreen] = useState<ScreenState>('standby');
  const [timeLogin, setTimeLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser, user } = useUser();

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const handleAuth = () => {
    const dbUser = users.find(u => u.password === password);
    
    if (dbUser) {
      const isUserAlreadyWorking = user && user.password === password && user.ocupado;
      
      if (isUserAlreadyWorking) {
        router.push('/menu');
        return;
      }
      
      setUser({
        ...dbUser,
        ocupado: false,
        of: ''
      });
      
      setScreen('success');
      playSound('login');
      setTimeLogin(getCurrentTime());
      
      setTimeout(() => {
        router.push('/cards');
      }, 2000);
    } else {
      setTimeLogin(getCurrentTime());
      setScreen('error');
      playSound('error');
      
      setTimeout(() => {
        setScreen('standby');
        setPassword('');
      }, 3000);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col items-center justify-center p-6 font-['Inter'] overflow-hidden relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
      
      {screen === 'standby' && (
        <div className="relative flex flex-col items-center space-y-12 animate-in fade-in zoom-in duration-700">
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <img 
              src="/images/logo_intesis_preta.png" 
              alt="Logo" 
              className="relative h-20 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
            />
          </div>
          
          <div className="text-center space-y-8">
            <ClockDisplay />
            <InstructionBadge text="Aproxime seu Crachá" variant="primary" />
          </div>

          <PasswordInput
            value={password}
            onChange={setPassword}
            onSubmit={handleAuth}
            helperText="ou digite sua senha de acesso"
          />
        </div>
      )}

      {screen === 'success' && (
        <FeedbackScreen 
          color="emerald"
          icon={Check}
          title="Autenticado"
          subtitle={`Olá, ${user?.nome || 'Usuário'}`}
          timeLogin={timeLogin}
        />
      )}

      {screen === 'error' && (
        <FeedbackScreen 
          color="rose"
          icon={X}
          title="Acesso Negado"
          subtitle="Cartão não reconhecido ou sem permissão."
          timeLogin={timeLogin}
          message="Tente novamente em instantes"
        />
      )}
    </div>
  );
};

export default StandbyScreen;