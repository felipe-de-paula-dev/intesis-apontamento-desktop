import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        router.push("/expired");
      }, 250);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`
      flex flex-col items-center justify-center h-screen w-full 
      bg-[#f4f4f9] transition-opacity duration-250 ease-in-out
      ${fadeOut ? 'opacity-0' : 'opacity-100'}
    `}>
      <div className="flex flex-col gap-8 items-center">
        
        <img 
          src="/images/logo_intesis_preta.png" 
          alt="Logo Intesis" 
          className="w-48 h-auto"
        />

        <div className="w-[300px] h-[12px] bg-gray-200 rounded-full overflow-hidden relative">
          <div className="
            absolute h-full w-[40%] bg-green-600 rounded-full
            animate-progress-slide
          " />
        </div>
        
      </div>
    </div>
  );
};

export default SplashScreen;