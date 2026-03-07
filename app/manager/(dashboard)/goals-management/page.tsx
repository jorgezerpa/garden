'use client';
import React, { useState, useEffect } from 'react';
import { createGoal, deleteGoal, getCompanyGoals, updateGoal } from '@/apiHandlers/admin';
import { GoalData } from '@/types/Goals';

const EMPTY_GOAL: GoalData = { 
  name: "", 
  seeds: 0, 
  leads: 0, 
  sales: 0, 
  numberOfCalls: 0, 
  numberOfLongCalls: 0, 
  talkTimeMinutes: 0 
};

export default function GoalsManagement() {
  // --- States ---
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [newGoal, setNewGoal] = useState<GoalData>(EMPTY_GOAL);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatingGoal, setUpdatingGoal] = useState<GoalData>(EMPTY_GOAL);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getCompanyGoals();
      setGoals(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreation = async () => {
    try {
      await createGoal(newGoal);
      await fetchGoals();
      setNewGoal(EMPTY_GOAL);
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (goalId: number) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteGoal(goalId);
      await fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (goal: GoalData) => {
    // Assuming goal has an 'id' property from the API
    setEditingId(goal.id as number);
    setUpdatingGoal(goal);
  };

  const handleUpdate = async (goalId: number) => {
    try {
      await updateGoal(goalId, updatingGoal);
      await fetchGoals();
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* 1. Title Section */}
      <div className="flex justify-between items-center">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-green-500 mb-1 block">Organization</label>
          <h1 className="text-2xl font-black dark:text-white">Performance Goals</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white"
        >
          {showAddForm ? 'Close Form' : 'Create New Goal'}
        </button>
      </div>

      {/* 2. Add New Goal Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-[#1e2330] border border-green-500/30 rounded-[2rem] p-8 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <h5 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-6">Configure New Objective</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Goal Name</label>
              <input 
                type="text" 
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="e.g. Q3 Sales Push" 
                className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-green-500" 
              />
            </div>
            {['seeds', 'leads', 'sales', 'numberOfCalls', 'numberOfLongCalls', 'talkTimeMinutes'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-2">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input 
                  type="number" 
                  value={(newGoal as any)[field]}
                  onChange={(e) => setNewGoal({...newGoal, [field]: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-green-500" 
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleCreation}
              className="px-10 py-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-600 transition-all"
            >
              Save New Goal
            </button>
          </div>
        </div>
      )}

      {/* 3. Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {goals.map((goal) => {
          const isEditing = editingId === goal.id;
          
          return (
            <div key={goal.id} className="relative bg-white dark:bg-[#1e2330] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 shadow-sm transition-all hover:shadow-md overflow-hidden group">
              {/* Delete Button (Top Right) */}
              <button 
                onClick={() => handleDelete(goal.id as number)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Card Content */}
              <div className="space-y-4">
                <div className="mb-4">
                  {isEditing ? (
                    <input 
                      className="w-full bg-slate-50 dark:bg-black/30 text-xs font-black border border-green-500/50 rounded-lg px-2 py-1 outline-none dark:text-white"
                      value={updatingGoal.name}
                      onChange={(e) => setUpdatingGoal({...updatingGoal, name: e.target.value})}
                    />
                  ) : (
                    <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{goal.name}</h4>
                  )}
                  <div className="h-1 w-8 bg-green-500 mt-2 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  {[
                    { label: 'Seeds', key: 'seeds' },
                    { label: 'Leads', key: 'leads' },
                    { label: 'Sales', key: 'sales' },
                    { label: 'Calls', key: 'numberOfCalls' },
                    { label: 'Long Calls', key: 'numberOfLongCalls' },
                    { label: 'Mins', key: 'talkTimeMinutes' },
                  ].map((param) => (
                    <div key={param.key}>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">{param.label}</span>
                      {isEditing ? (
                        <input 
                          type="number"
                          className="w-full bg-slate-50 dark:bg-black/30 text-[11px] font-bold border border-slate-200 dark:border-white/10 rounded-md px-2 py-1 outline-none dark:text-white"
                          value={(updatingGoal as any)[param.key]}
                          onChange={(e) => setUpdatingGoal({...updatingGoal, [param.key]: parseInt(e.target.value) || 0})}
                        />
                      ) : (
                        <span className="text-[13px] font-black dark:text-slate-200">{(goal as any)[param.key]}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 mt-2 border-t border-slate-50 dark:border-white/5 flex gap-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => handleUpdate(goal.id as number)}
                        className="flex-1 py-2 bg-green-500 text-white text-[9px] font-black uppercase rounded-xl shadow-lg shadow-green-500/20"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 text-[9px] font-black uppercase rounded-xl"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => startEditing(goal)}
                      className="w-full py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase tracking-widest rounded-xl hover:border-amber-500/50 hover:text-amber-500 transition-all"
                    >
                      Edit Goal
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}