'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loading from "@/components/animation/loading"; 

export default function LoadingProvider() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return loading ? <Loading /> : null;
}