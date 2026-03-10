'use client';
import { useState, useEffect } from 'react';
import { addAgent, editAgent, getAgentsList, removeAgent } from '@/apiHandlers/admin';
import { Spinner } from '@/components/Spinner';

interface Agent {
  id: number;
  leadDeskId: number;
  name: string;
  user: {
    email: string;
  };
  agentToThird: { agentServiceIdentifier: number | string }[];
}

const initialLoading = {
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isFetchingAgents: false, // Adapted for Agents context
};

export default function AgentsManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(initialLoading);

  const [expanded, setExpanded] = useState<{ id: number | null; mode: 'details' | 'modify' | null }>({
    id: null,
    mode: null,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', email: '', password: '', leadDeskId: '' });
  const [updatingInputs, setUpdatingInputs] = useState({ name: '', email: '', password: '', leadDeskId: '' });

  const fetchAgents = async () => {
    setLoading((prev) => ({ ...prev, isFetchingAgents: true }));
    try {
      const response = await getAgentsList(1, 200);
      setAgents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, isFetchingAgents: false }));
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // --- Handlers ---
  const toggleExpand = (id: number, mode: 'details' | 'modify', agent?: Agent) => {
    if (expanded.id === id && expanded.mode === mode) {
      setExpanded({ id: null, mode: null });
      setUpdatingInputs({ email: '', name: '', password: '', leadDeskId: '' });
    } else {
      setExpanded({ id, mode });
      if (agent) {
        setUpdatingInputs({
          email: agent.user.email,
          name: agent.name,
          password: '',
          leadDeskId: String(agent.agentToThird[0]?.agentServiceIdentifier || ''),
        });
      }
    }
  };

  const handleCreation = async () => {
    setLoading((prev) => ({ ...prev, isCreating: true }));
    try {
      await addAgent({
        name: newAgent.name,
        email: newAgent.email,
        password: newAgent.password,
        leadDeskId: newAgent.leadDeskId,
      });
      await fetchAgents();
      setNewAgent({ name: '', email: '', password: '', leadDeskId: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, isCreating: false }));
    }
  };

  const handleTerminate = async (agentId: number) => {
    setLoading((prev) => ({ ...prev, isDeleting: true }));
    try {
      await removeAgent(agentId);
      await fetchAgents();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleUpdate = async (id: number) => {
    setLoading((prev) => ({ ...prev, isUpdating: true }));
    try {
      await editAgent(id, {
        email: updatingInputs.email,
        name: updatingInputs.name,
        password: updatingInputs.password,
        leadDeskId: updatingInputs.leadDeskId,
      });
      await fetchAgents();
      setExpanded({ id: null, mode: null });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, isUpdating: false }));
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
          {showAddForm ? 'Cancel New Agent' : 'Add Agent'}
        </button>

        {showAddForm && (
          <div className="w-full mt-6 bg-white dark:bg-[#1e2330] border border-green-500/30 rounded-[2rem] p-8 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl">
            <h5 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-6 text-center">
              Register New Team Member
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <input
                type="text"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                placeholder="Full Name"
                className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none"
              />
              <input
                type="email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                placeholder="Email Address"
                className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none"
              />
              <input
                type="text"
                value={newAgent.leadDeskId}
                onChange={(e) => setNewAgent({ ...newAgent, leadDeskId: e.target.value })}
                placeholder="LeadDesk Id"
                className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none"
              />
              <input
                type="password"
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                placeholder="Password"
                className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none"
              />
            </div>
            <div className="mt-8 flex justify-center">
              <button
                disabled={loading.isCreating}
                onClick={handleCreation}
                className="px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-500 transition-all flex items-center gap-3 shadow-md"
              >
                {loading.isCreating ? <><Spinner size="w-3 h-3" color="text-green-500" /> Processing...</> : 'Create Agent'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {loading.isFetchingAgents ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="w-10 h-10" color="text-green-500" />
            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Agents Registry</p>
          </div>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="bg-white dark:bg-[#1e2330] rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden transition-all shadow-sm">
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 font-black text-xl">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black dark:text-white leading-none">{agent.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{agent.user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(agent.id, 'modify', agent)}
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    expanded.id === agent.id && expanded.mode === 'modify'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Modify User
                </button>
              </div>

              {expanded.id === agent.id && expanded.mode === 'modify' && (
                <div className="px-6 pb-8 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrative Actions</h5>
                        <button
                          disabled={loading.isDeleting}
                          onClick={() => handleTerminate(agent.id)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all"
                        >
                          {loading.isDeleting ? <Spinner size="w-3 h-3" /> : 'Terminate'}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Edit Credentials & IDs</h5>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <input
                            onChange={(e) => setUpdatingInputs({ ...updatingInputs, name: e.target.value })}
                            value={updatingInputs.name}
                            placeholder="Name"
                            className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                          />
                          <input
                            onChange={(e) => setUpdatingInputs({ ...updatingInputs, email: e.target.value })}
                            value={updatingInputs.email}
                            placeholder="Email"
                            className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                          />
                          <input
                            onChange={(e) => setUpdatingInputs({ ...updatingInputs, leadDeskId: e.target.value })}
                            value={updatingInputs.leadDeskId}
                            placeholder="LeadDesk ID"
                            className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                          />
                          <input
                            onChange={(e) => setUpdatingInputs({ ...updatingInputs, password: e.target.value })}
                            value={updatingInputs.password}
                            type="password"
                            placeholder="New Password"
                            className="bg-white dark:bg-black/40 dark:text-gray-300 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          disabled={loading.isUpdating}
                          onClick={() => handleUpdate(agent.id)}
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