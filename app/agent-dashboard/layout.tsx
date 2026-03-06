'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // @DRY@dev this logic is repeated in 2 layouts, find a better way 
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/manager/sign-in');
    }
  }, [router]);

  return (
    <div>
      {children}      
    </div>
  );
}