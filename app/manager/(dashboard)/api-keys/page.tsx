'use client'
import React, { useState, useEffect } from 'react';
import { generateKeyPair, getPublicKey, deleteKeyPair } from '@/apiHandlers/auth';

interface KeyPair {
  public: string;
  private: string;
}

export default function APIKeys() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [existingPublicKey, setExistingPublicKey] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newKeys, setNewKeys] = useState<KeyPair | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchKey();
  }, []);

  const fetchKey = async () => {
    try {
      const data = await getPublicKey();
      if (data && data?.publicKey) {
        setExistingPublicKey(data.publicKey);
      } else {
        setExistingPublicKey(null);
      }
    } catch (err) {
      // @todo instead of setting null, set an error feedback like "error fetching"
      setExistingPublicKey(null);
    }
  };

  const handleDelete = async (): Promise<void> => {
    // @todo use custom modal
    if (!confirm("Are you sure? This will immediately revoke access for any services using this key.")) return;
    
    setIsDeleting(true);
    try {
      await deleteKeyPair();
      setExistingPublicKey(null); // Clear the UI
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete the key pair. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerate = async (): Promise<void> => {
    setModalStep(2);
    setIsLoading(true);
    try {
      const data = await generateKeyPair();
      setNewKeys({ public: data.publicKey, private: data.secretKey });
      setExistingPublicKey(data.publicKey);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setModalStep(1);
    setNewKeys(null);
    setIsLoading(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] p-4 md:p-8 transition-colors duration-500 font-sans text-slate-800 dark:text-slate-200">
      
      {/* --- Header --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">
            API <span className="text-green-500">Keys</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
            Manage secure access to the garden infrastructure
          </p>
        </div>

        <div className="group relative">
          <button 
            disabled={!!existingPublicKey}
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-white/10 disabled:text-slate-500 disabled:cursor-not-allowed text-[#0f1219] text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-sm transition-all active:scale-95"
          >
            Generate New Key-Pair
          </button>
          
          {existingPublicKey && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-black text-white text-[9px] font-bold uppercase tracking-wider text-center rounded-sm pointer-events-none">
              Delete actual key before generating another
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
            </div>
          )}
        </div>
      </header>

      {/* --- Table --- */}
      <div className="overflow-x-auto border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-6 py-4">Public Key</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {existingPublicKey ? (
              <tr className="group transition-colors">
                <td className="px-6 py-4 font-mono text-xs opacity-70">
                  {existingPublicKey}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-[10px] font-black uppercase text-red-500/60 hover:text-red-500 disabled:text-slate-400 tracking-tighter transition-colors"
                  >
                    {isDeleting ? 'DELETING...' : 'DELETE KEY PAIR'}
                  </button>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  No active key-pair found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


{/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-[#161a23] border border-slate-200 dark:border-white/10 w-full max-w-md p-8 shadow-2xl">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">✕</button>

            {modalStep === 1 ? (
              <div className="space-y-6">
                <div className="w-12 h-1 bg-red-500" />
                <h3 className="text-sm font-black uppercase tracking-widest">Security Warning</h3>
                <div className="space-y-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  <p>• We <span className="text-red-500 underline font-bold">never</span> store your private keys on our servers. If lost, we cannot recover it.</p>
                  <p>• Keep it in a secure place. Only fully trusted parties should have access to this key.</p>
                </div>
                <button 
                  onClick={handleGenerate}
                  className="w-full py-4 bg-slate-800 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  I Understand, Generate Keys
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="inline-block w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Generating Secure Pair...</p>
                  </div>
                ) : newKeys && (
                  <div className="text-left space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-green-500">Success</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block">Public Key</label>
                        <div className="flex bg-slate-100 dark:bg-black/40 p-3 rounded-sm border border-slate-200 dark:border-white/5 items-center justify-between">
                          <code className="text-[10px] font-mono truncate mr-2">{newKeys.public}</code>
                          <button onClick={() => navigator.clipboard.writeText(newKeys.public)} className="text-[10px] font-black text-green-500 hover:underline">COPY</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-500 mb-1 block italic text-red-400">Private Key (Save Now)</label>
                        <div className="flex bg-slate-100 dark:bg-black/40 p-3 rounded-sm border border-red-500/20 items-center justify-between">
                          <code className="text-[10px] font-mono truncate mr-2 text-red-400">{newKeys.private}</code>
                          <button onClick={() => navigator.clipboard.writeText(newKeys.private)} className="text-[10px] font-black text-green-500 hover:underline">COPY</button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={closeModal}
                      className="w-full py-3 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                      Close & Destroy View
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}



    </div>
  );
}