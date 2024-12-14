'use client'

import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidthPage = pathname === '/' || pathname === '/about';

  return (
    <div className={isFullWidthPage ? 'contentAreaFull' : 'contentArea'}>
      {children}
    </div>
  );
}