import React from 'react'
import type { AppProps } from 'next/app'

import "../styles/globals.css"
import { SoundProvider } from '@/contexts/SoundContext'
import { UserProvider } from '@/contexts/UserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SoundProvider>
        <Component {...pageProps} />
      </SoundProvider>
    </UserProvider>
  );
}

export default MyApp
