'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/apiHandlers/auth';
import jwt from 'jsonwebtoken';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      logoutUser("/")
      return 
    }
    const decoded = jwt.decode(token) as any;
    
    if(!decoded.role || decoded.role !== "AGENT") {
      logoutUser("/")
      return 
    }
  }, [router]);

  return (
    <div>
      {children}      
    </div>
  );
}