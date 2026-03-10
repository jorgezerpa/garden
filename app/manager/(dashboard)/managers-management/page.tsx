'use client';
import { useState, useEffect } from 'react';
import { addManager, editManager, getManagersList, removeManager } from '@/apiHandlers/admin';
import { Spinner } from '@/components/Spinner';

interface Manager {
  id: number;
  name: string;
  email: string;
  user: {
    email: string;
  };
}

// Initial state for the loading object
const initialLoading = {
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isFetchingManagers: false,
};

export default function ManagersManagement() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(initialLoading); // Structured loading state
  
  const [expanded, setExpanded] = useState<{ id: number | null, mode: 'details' | 'modify' | null }>({
    id: null,
    mode: null
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newManager, setNewManager] = useState({ name: '', email: '', password: '' });
  const [updatingInputs, setUpdatingInputs] = useState({ name: '', email: '', password: '' });

  const fetchManagers = async () => {
    setLoading(prev => ({ ...prev, isFetchingManagers: true }));
    try {
      const managers = await getManagersList(1, 200);
      setManagers(managers.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, isFetchingManagers: false }));
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // --- Handlers ---
  const toggleExpand = (id: number, mode: 'details' | 'modify', manager?: any) => {
    if (expanded.id === id && expanded.mode === mode) {
      setExpanded({ id: null, mode: null });
      setUpdatingInputs({ email: "", name: "", password: "" });
    } else {
      setExpanded({ id, mode });
      if (manager) setUpdatingInputs({ email: manager.email, name: manager.name, password: "" });
    }
  };

  const handleCreation = async () => {
    setLoading(prev => ({ ...prev, isCreating: true }));
    try {
      await addManager({ name: newManager.name, email: newManager.email, password: newManager.password });
      await fetchManagers();
      setNewManager({ name: '', email: '', password: '' });
      setShowAddForm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, isCreating: false }));
    }
  };

  const handleTerminate = async (manager: any) => {
    setLoading(prev => ({ ...prev, isDeleting: true }));
    try {
      await removeManager(manager.id);
      await fetchManagers();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleUpdate = async (id: number) => {
    setLoading(prev => ({ ...prev, isUpdating: true }));
    try {
      await editManager(id, { email: updatingInputs.email, name: updatingInputs.name, password: updatingInputs.password });
      await fetchManagers();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, isUpdating: false }));
    }
  };

  return (
    <div className="space-y-8 pb-20 font-sans">

      {/* --- ADD AGENT CENTER BUTTON --- */}
      <div className="flex flex-col items-center">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg shadow-green-500/20"
        >
          {showAddForm ? 'Cancel New Manager' : 'Add Manager'}
        </button>

        {showAddForm && (
          <div className="w-full mt-6 bg-white dark:bg-[#1e2330] border border-green-500/30 rounded-[2rem] p-8 shadow-xl">
             <h5 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-6 text-center">Register New Team Member</h5>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input value={newManager.name} onChange={(e) => setNewManager({...newManager, name: e.target.value})} placeholder="Full Name" className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none" />
                <input value={newManager.email} onChange={(e) => setNewManager({...newManager, email: e.target.value})} placeholder="Email Address" className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none" />
                <input type="password" value={newManager.password} onChange={(e) => setNewManager({...newManager, password: e.target.value})} placeholder="Password" className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none" />
             </div>
             <div className="mt-8 flex justify-center">
                <button 
                  onClick={handleCreation}
                  disabled={loading.isCreating}
                  className="px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-md flex items-center gap-2"
                >
                  {loading.isCreating ? <><Spinner size="w-3 h-3" /> Creating...</> : 'Create Manager'}
                </button>
             </div>
          </div>
        )}
      </div>

      {/* --- LIST AREA --- */}
      <div className="space-y-4">
        {loading.isFetchingManagers ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner size="w-10 h-10" color="text-green-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
          </div>
        ) : (
          managers.map((manager) => (
            <div key={manager.id} className="bg-white dark:bg-[#1e2330] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 font-black text-xl">
                    {manager.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black dark:text-white leading-none">{manager.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{manager.email}</p>
                  </div>
                </div>

                <button 
                  onClick={() => toggleExpand(manager.id, 'modify', manager)}
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    expanded.id === manager.id && expanded.mode === 'modify' 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Modify User
                </button>
              </div>

              {/* DROPDOWN: MODIFY */}
              {expanded.id === manager.id && expanded.mode === 'modify' && (
                <div className="px-6 pb-8 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
                    <div className="flex flex-col gap-8">
                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrative Actions</h5>
                        <button 
                          onClick={() => handleTerminate(manager)}
                          disabled={loading.isDeleting}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all"
                        >
                          {loading.isDeleting ? <Spinner size="w-3 h-3" /> : 'Terminate'}
                        </button>
                      </div>

                      <div className="flex-1">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Edit Credentials</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input onChange={(e)=>setUpdatingInputs(c => ({...c, name: e.target.value}))} value={updatingInputs.name} className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none" placeholder="Name" />
                          <input onChange={(e)=>setUpdatingInputs(c => ({...c, email: e.target.value}))} value={updatingInputs.email} className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none" placeholder="Email" />
                          <input onChange={(e)=>setUpdatingInputs(c => ({...c, password: e.target.value}))} value={updatingInputs.password} type="password" className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none" placeholder="New Password" />
                        </div>
                      </div>

                      <div className="flex items-end">
                        <button 
                          onClick={() => handleUpdate(manager.id)}
                          disabled={loading.isUpdating}
                          className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase rounded-xl hover:bg-green-500 transition-all flex items-center gap-2"
                        >
                          {loading.isUpdating ? <Spinner size="w-3 h-3" /> : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}