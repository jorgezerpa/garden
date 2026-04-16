'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Mock() {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callIdRef = useRef(100);

  // Helper to add logs to the UI
  const addLog = (msg: string) => setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  const toggleSimulation = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      addLog("⏹️ Simulation stopped.");
    } else {
      if (!publicKey || !secretKey) return;
      setIsRunning(true);
      addLog("🚀 Starting simulation...");

      intervalRef.current = setInterval(async () => {
        const auth = `Basic ${Buffer.from(`${publicKey}:${secretKey}`).toString('base64')}`;
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/leaddesk/webhook`, {
            params: { last_call_id: callIdRef.current, isSimulation: true },
            headers: { Authorization: auth }
          });
          addLog(`✅ Call ${callIdRef.current} success: ${JSON.stringify(res.data)}`);
          callIdRef.current++;
        } catch (err: any) {
          addLog(`❌ Call ${callIdRef.current} failed: ${err.message}`);
        }
      }, 8000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Webhook Simulator</h2>
      
      <div className="flex flex-col gap-3 mb-4">
        <input 
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Public Key" 
          value={publicKey} 
          onChange={(e) => setPublicKey(e.target.value)} 
        />
        <input 
          type="password"
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Secret Key" 
          value={secretKey} 
          onChange={(e) => setSecretKey(e.target.value)} 
        />
        <button 
          onClick={toggleSimulation}
          className={`py-2 px-4 rounded font-semibold text-white transition ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isRunning ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-xs shadow-inner">
        {logs.map((log, i) => <div key={i} className="mb-1 border-b border-gray-800 pb-1">{log}</div>)}
      </div>
    </div>
  );
}