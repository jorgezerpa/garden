'use client';
import React, { useState, useEffect } from 'react';
import { 
  createGoal, deleteGoal, getCompanyGoals, updateGoal, 
  getAssignations, upsertAssignation, deleteAssignationById 
} from '@/apiHandlers/admin';
import { GoalData } from '@/types/Goals';
import { Spinner } from '@/components/Spinner';
import { Toast } from '@/components/Toast';
import { calculateMondayOfTheWeek, calculateSundayOfTheWeek, getWeekDaysCardsData, WeekDayTuple } from '@/utils/Date';

const EMPTY_GOAL: GoalData = { 
  name: "", seeds: 0, leads: 0, sales: 0, numberOfCalls: 0, numberOfLongCalls: 0, talkTimeMinutes: 0 
};

const initialLoading = {
  isFetchingWeeklyGoalSchedule: false,
  isFetchingGoals: false,
  isUnassigning: null as number | null,
  isAssigning: null as string | null,
  isCreatingGoal: false,
  isEditingGoal: null as number | null,
  isDeletingGoal: null as number | null,
};

export default function GoalsManagement() {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [assignations, setAssignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [toastError, setToastError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [newGoal, setNewGoal] = useState<GoalData>(EMPTY_GOAL);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatingGoal, setUpdatingGoal] = useState<GoalData>(EMPTY_GOAL);
  const [showAddForm, setShowAddForm] = useState(false);
  const [assigningDate, setAssigningDate] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    fetchWeekAssignations(selectedDate);
  }, [selectedDate]);

  const fetchGoals = async () => {
    setLoading(prev => ({ ...prev, isFetchingGoals: true }));
    try {
      const data = await getCompanyGoals();
      setGoals(data);
    } catch (error) { 
      setToastError("Failed to fetch goals."); 
    } finally { setLoading(prev => ({ ...prev, isFetchingGoals: false })); }
  };

  const fetchWeekAssignations = async (baseDate: string) => {
    setLoading(prev => ({ ...prev, isFetchingWeeklyGoalSchedule: true }));
    
    const monday = calculateMondayOfTheWeek(baseDate);
    const sunday = calculateSundayOfTheWeek(baseDate);

    try {
      const data = await getAssignations(monday, sunday);
      setAssignations(data);
    } catch (error) { 
      setToastError("Failed to fetch schedule."); 
    } finally { setLoading(prev => ({ ...prev, isFetchingWeeklyGoalSchedule: false })); }
  };

  const handleAssign = async (date: string, goalId: number) => {
    if (!goalId) return;
    setLoading(prev => ({ ...prev, isAssigning: date }));
    try {
      await upsertAssignation(date, goalId);
      await fetchWeekAssignations(selectedDate);
    } catch (error) { 
      setToastError("Failed to assign goal."); 
    } finally { setLoading(prev => ({ ...prev, isAssigning: null })); }
  };

  const handleUnassign = async (assignationId: number) => {
    setLoading(prev => ({ ...prev, isUnassigning: assignationId }));
    try {
      await deleteAssignationById(assignationId);
      await fetchWeekAssignations(selectedDate);
    } catch (error) { 
      setToastError("Failed to unassign goal."); 
    } finally { setLoading(prev => ({ ...prev, isUnassigning: null })); }
  };

  const handleCreation = async () => {
    setLoading(prev => ({ ...prev, isCreatingGoal: true }));
    try {
      await createGoal(newGoal);
      await fetchGoals();
      setNewGoal(EMPTY_GOAL);
      setShowAddForm(false);
    } catch (error) { 
      setToastError("Failed to create goal."); 
    } finally { setLoading(prev => ({ ...prev, isCreatingGoal: false })); }
  };

  const handleDelete = async (goalId: number) => {
    if (!confirm("Delete this goal?")) return;
    setLoading(prev => ({ ...prev, isDeletingGoal: goalId }));
    try {
      await deleteGoal(goalId);
      await fetchGoals();
    } catch (error) { 
      setToastError("Failed to delete goal."); 
    } finally { setLoading(prev => ({ ...prev, isDeletingGoal: null })); }
  };

  const handleUpdate = async (goalId: number) => {
    setLoading(prev => ({ ...prev, isEditingGoal: goalId }));
    try {
      await updateGoal(goalId, updatingGoal);
      await fetchGoals();
      setEditingId(null);
    } catch (error) { 
      setToastError("Failed to update goal."); 
    } finally { setLoading(prev => ({ ...prev, isEditingGoal: null })); }
  };

  const getWeekDates = () => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      {toastError && <Toast message={toastError} onClose={() => setToastError(null)} />}
      
      <div className="flex justify-between items-end">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-green-500 mb-1 block">Management</label>
          <h1 className="text-2xl font-black dark:text-white">Strategy & Goals</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-green-500 transition-all"
        >
          {showAddForm ? 'Cancel' : 'New Goal Definition'}
        </button>
      </div>

      <section className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Weekly Goal Schedule</h3>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none dark:text-white"
          />
        </div>

        {loading.isFetchingWeeklyGoalSchedule ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="w-8 h-8" color="text-green-500" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-4">Loading Schedule...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {getWeekDaysCardsData(selectedDate).map((weekDayTuple: WeekDayTuple) => {
              const assignation = assignations.find(a => a.date.toString().split('T')[0] === weekDayTuple[0]);
              const assignedGoal = goals.find(g => g.id === assignation?.goalId);
              const isUnassigning = loading.isUnassigning === assignation?.id;
              const isAssigning = loading.isAssigning === weekDayTuple[0];

              return (
                <div key={weekDayTuple[0]} className="group relative bg-white dark:bg-[#1a1f2b] p-5 rounded-[2.2rem] border-2 border-transparent hover:border-green-500/20 transition-all flex flex-col items-center min-h-[160px] shadow-sm">
                  <div className="text-center mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      { weekDayTuple[3] }
                    </p>
                    <p className="text-sm font-black dark:text-white">
                      {weekDayTuple[2]} <span className="opacity-20">/</span> {weekDayTuple[1]}
                    </p>
                  </div>

                  {assignation ? (
                    <div className="w-full mt-auto text-center">
                      <div className="bg-green-500 shadow-lg py-3 px-2 rounded-2xl mb-3">
                        <p className="text-[10px] font-black uppercase text-white truncate">
                          {assignedGoal?.name || 'Active Goal'}
                        </p>
                      </div>
                      <button 
                        disabled={isUnassigning}
                        onClick={() => handleUnassign(assignation.id)}
                        className="w-full text-[9px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors flex justify-center items-center gap-2"
                      >
                        {isUnassigning ? <Spinner size="w-3 h-3" /> : 'Unassign'}
                      </button>
                    </div>
                  ) : (
                    <button 
                      disabled={isAssigning}
                      onClick={() => setAssigningDate(weekDayTuple[0])}
                      className="w-full mt-auto py-4 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center group-hover:bg-green-500/5 transition-all"
                    >
                      {isAssigning ? <Spinner size="w-4 h-4" color="text-green-500" /> : <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-green-500">+ Assign</span>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showAddForm && (
        <div className="bg-white dark:bg-[#1e2330] border border-green-500/30 rounded-[2rem] p-8 shadow-xl">
          <h5 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-6 text-center">Configure New Objective</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Goal Name</label>
              <input type="text" value={newGoal.name} onChange={(e) => setNewGoal({...newGoal, name: e.target.value})} className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-green-500" />
            </div>
            {['seeds', 'leads', 'sales', 'numberOfCalls', 'numberOfLongCalls', 'talkTimeMinutes'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-2">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input type="number" value={(newGoal as any)[field]} onChange={(e) => setNewGoal({...newGoal, [field]: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-black/20 dark:text-gray-200 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-green-500" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button 
              disabled={loading.isCreatingGoal}
              onClick={handleCreation} 
              className="px-10 py-3 bg-green-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center gap-3 transition-all"
            >
              {loading.isCreatingGoal ? <Spinner size="w-3 h-3" /> : 'Save New Goal'}
            </button>
          </div>
        </div>
      )}

      {loading.isFetchingGoals ? (
        <div className="flex flex-col items-center py-20">
          <Spinner size="w-12 h-12" color="text-green-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">Syncing Objectives...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {goals.map((goal) => {
            const isEditing = editingId === goal.id;
            const isDeleting = loading.isDeletingGoal === goal.id;
            const isUpdating = loading.isEditingGoal === goal.id;

            return (
              <div key={goal.id} className="relative bg-white dark:bg-[#1e2330] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <button 
                  disabled={isDeleting}
                  onClick={() => handleDelete(goal.id as number)} 
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2"
                >
                  {isDeleting ? <Spinner size="w-3 h-3" color="text-red-500" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>}
                </button>
                <div className="space-y-4">
                  <div className="mb-4">
                    {isEditing ? (
                      <input className="w-full bg-slate-50 dark:bg-black/30 text-xs font-black border border-green-500/50 rounded-lg px-2 py-1 outline-none dark:text-white" value={updatingGoal.name} onChange={(e) => setUpdatingGoal({...updatingGoal, name: e.target.value})} />
                    ) : (
                      <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{goal.name}</h4>
                    )}
                    <div className="h-1 w-8 bg-green-500 mt-2 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    {[{ label: 'Seeds', key: 'seeds' }, { label: 'Leads', key: 'leads' }, { label: 'Sales', key: 'sales' }, { label: 'Calls', key: 'numberOfCalls' }, { label: 'Long Calls', key: 'numberOfLongCalls' }, { label: 'Mins', key: 'talkTimeMinutes' }].map((param) => (
                      <div key={param.key}>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">{param.label}</span>
                        {isEditing ? (
                          <input type="number" className="w-full bg-slate-50 dark:bg-black/30 text-[11px] font-bold border border-slate-200 rounded-md px-2 py-1 outline-none dark:text-white" value={(updatingGoal as any)[param.key]} onChange={(e) => setUpdatingGoal({...updatingGoal, [param.key]: parseInt(e.target.value) || 0})} />
                        ) : (
                          <span className="text-[13px] font-black dark:text-slate-200">{(goal as any)[param.key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 mt-2 border-t border-slate-50 dark:border-white/5 flex gap-2">
                    {isEditing ? (
                      <>
                        <button disabled={isUpdating} onClick={() => handleUpdate(goal.id as number)} className="flex-1 py-2 bg-green-500 text-white text-[9px] font-black uppercase rounded-xl flex justify-center items-center gap-2">
                          {isUpdating ? <Spinner size="w-3 h-3" /> : 'Save'}
                        </button>
                        <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 text-[9px] font-black uppercase rounded-xl">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => { setEditingId(goal.id as number); setUpdatingGoal(goal); }} className="w-full py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-100 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase rounded-xl transition-all">Edit Goal</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {assigningDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setAssigningDate(null)} />
          <div className="relative bg-white dark:bg-[#1e2330] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black dark:text-white">Select a Goal</h3>
            <p className="text-[10px] font-black uppercase text-green-500 tracking-widest mt-1 mb-6">Assigning for {new Date(assigningDate).toLocaleDateString()}</p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => { handleAssign(assigningDate, goal.id as number); setAssigningDate(null); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 hover:border-green-500 border border-transparent transition-all group"
                >
                  <span className="text-sm font-bold dark:text-slate-200 group-hover:text-green-500">{goal.name}</span>
                  <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setAssigningDate(null)} className="mt-8 w-full py-4 text-[10px] font-black uppercase text-slate-400">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}