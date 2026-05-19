'use client';

import { useEffect, useState } from 'react';

export const useLiveNow = (intervalMs: number = 1_000): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return now;
};
