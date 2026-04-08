import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeOff } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useState } from 'react';

interface SoundContextType {
  volume: number[];
  isOpen: boolean;
  setVolume: (val: number[]) => void;
  setIsOpen: (val: boolean) => void;
  playSound: (type: 'login' | 'error' | 'success') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const hiddenRoutes = ['/cards'];
  const isHidden = hiddenRoutes.includes(router.pathname);
  const [volume, setVolume] = useState([0]);
  const [isOpen, setIsOpen] = useState(true);

  const playSound = (type: string) => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = volume[0];
    audio.play().catch(() => console.warn("Áudio bloqueado ou não encontrado"));
  };

  return (
    <SoundContext.Provider value={{ volume, isOpen, setVolume, setIsOpen, playSound }}>
      {children}
      {!isHidden && (
        <div className={`absolute flex gap-2 right-5 bottom-5 items-center volume-control`}>
            <div className={`
                flex items-center gap-2 transition-all duration-300 ease-in-out
                ${!isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
                `}>
                <Slider
                    value={volume}
                    max={1}
                    step={0.01}
                    className="w-32"
                    onValueChange={(val) => setVolume(val)}
                />
            </div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
            {volume[0] == 0 ? <VolumeOff size={24} /> : <Volume2 size={24} />}
            </button>
      </div>)}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound deve ser usado dentro de um SoundProvider");
  return context;
};