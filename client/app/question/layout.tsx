import React, { ReactNode } from 'react';
import { TimeProvider } from '@/context/TimeContext';

export default function PollLayout({ children }: { children: ReactNode }) {
  return (
    <TimeProvider initialSeconds={60}>
      {children}
    </TimeProvider>
  );
}
