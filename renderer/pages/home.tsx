import React, { useEffect, useState } from 'react'
import SplashScreen from '@/pages/splash'
import StandbyScreen from '@/pages/standby'
import UpdateScreen from './updatescreen';

export default function HomePage() {
  const[page, setPage] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setPage(1);
    }, 1500);
  }, [])
  return (
    <UpdateScreen />
  )
}
