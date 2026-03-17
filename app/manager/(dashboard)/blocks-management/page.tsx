'use client';
import React, { useState, useEffect } from 'react';
import { 
  createSchema, 
  deleteSchema, 
  getSchemasList, 
  updateSchema,
  getSchemaAssignations, 
  upsertSchemaAssignation, 
  deleteSchemaAssignationById 
} from '@/apiHandlers/schema';
import { CreateSchemaData, Schema, SchemaBlock } from '@/types/BlockSchemas';
import { Spinner } from '@/components/Spinner';
import { Toast } from '@/components/Toast';
import { calculateMondayOfTheWeek, calculateSundayOfTheWeek, getWeekDaysCardsData, WeekDayTuple } from '@/utils/Date';

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const parseTime = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h * 60) + m;
};

const BLOCK_STYLES: Record<string, { label: string, color: string }> = {
  ["WORKING"]: { label: 'Working', color: 'bg-blue-500 text-blue-500 border-blue-500/30 dark:border-blue-500/50' },
  ["REST"]: { label: 'Rest', color: 'bg-slate-400 text-slate-500 border-slate-300 dark:border-slate-600 dark:text-slate-400' },
  ["EXTRA_TIME"]: { label: 'Extra Time', color: 'bg-amber-500 text-amber-600 border-amber-500/30 dark:border-amber-500/50 dark:text-amber-500' },
};

const initialLoading = {
  isFetchingBlockSchemas: false,
  isFetchingAssignations: false,
  isCreatingBlockSchema: false,
  isEditingBlockSchema: null as number | null,
  isDeletingBlockSchema: null as number | null,
  isAssigningBlockSchema: null as string | null,
  isUnassigningBlockSchema: null as number | null,
};

export default function BlocksManagement() {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [assignations, setAssignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [toastError, setToastError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [assigningDate, setAssigningDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSchemaId, setEditingSchemaId] = useState<number | null>(null);

  const [schemaName, setSchemaName] = useState("");
  const [blocksForm, setBlocksForm] = useState<any[]>([]);

  useEffect(() => {
    fetchSchemas();
  }, []);

  useEffect(() => {
    fetchWeekAssignations(selectedDate);
  }, [selectedDate]);

  const fetchSchemas = async () => {
    setLoading(prev => ({ ...prev, isFetchingBlockSchemas: true }));
    try {
      const data = await getSchemasList(1, 50);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setSchemas(list);
    } catch (error) { 
      setToastError("Failed to fetch schemas."); 
    } finally { setLoading(prev => ({ ...prev, isFetchingBlockSchemas: false })); }
  };

  const fetchWeekAssignations = async (baseDate: string) => {
    setLoading(prev => ({ ...prev, isFetchingAssignations: true }));
    const monday = calculateMondayOfTheWeek(baseDate);
    const sunday = calculateSundayOfTheWeek(baseDate);

    try {
      const data = await getSchemaAssignations(monday, sunday);
      setAssignations(Array.isArray(data) ? data : []);
    } catch (error) { 
      setToastError("Failed to fetch weekly assignments."); 
    } finally { setLoading(prev => ({ ...prev, isFetchingAssignations: false })); }
  };

  const handleAssign = async (date: string, schemaId: number) => {
    if (!schemaId) return;
    setLoading(prev => ({ ...prev, isAssigningBlockSchema: date }));
    try {
      await upsertSchemaAssignation(date, schemaId);
      await fetchWeekAssignations(selectedDate);
    } catch (error) { 
      setToastError("Failed to assign schema."); 
    } finally { setLoading(prev => ({ ...prev, isAssigningBlockSchema: null })); }
  };

  const handleUnassign = async (assignationId: number) => {
    setLoading(prev => ({ ...prev, isUnassigningBlockSchema: assignationId }));
    try {
      await deleteSchemaAssignationById(assignationId);
      await fetchWeekAssignations(selectedDate);
    } catch (error) { 
      setToastError("Failed to unassign schema."); 
    } finally { setLoading(prev => ({ ...prev, isUnassigningBlockSchema: null })); }
  };

  const handleDeleteSchema = async (id: number) => {
    if (!confirm("Delete this schema? This action cannot be undone.")) return;
    setLoading(prev => ({ ...prev, isDeletingBlockSchema: id }));
    try {
      await deleteSchema(id);
      await fetchSchemas();
      fetchWeekAssignations(selectedDate);
    } catch (error) { 
      setToastError("Failed to delete schema."); 
    } finally { setLoading(prev => ({ ...prev, isDeletingBlockSchema: null })); }
  };

  const handleSaveSchema = async () => {
    if (!schemaName.trim()) return alert("Schema name is required");
    const formattedBlocks = blocksForm.map((b) => ({
      name: b.name || null,
      startMinutesFromMidnight: parseTime(b.startTime),
      endMinutesFromMidnight: parseTime(b.endTime),
      blockType: b.blockType,
    })) as SchemaBlock[];

    if (editingSchemaId) {
      setLoading(prev => ({ ...prev, isEditingBlockSchema: editingSchemaId }));
    } else {
      setLoading(prev => ({ ...prev, isCreatingBlockSchema: true }));
    }

    try {
      if (editingSchemaId) {
        await updateSchema(editingSchemaId, { name: schemaName, blocks: formattedBlocks });
      } else {
        await createSchema({ name: schemaName, blocks: formattedBlocks });
      }
      setShowModal(false);
      await fetchSchemas();
    } catch (error) { 
      setToastError("Failed to save schema."); 
    } finally {
      setLoading(prev => ({ ...prev, isEditingBlockSchema: null, isCreatingBlockSchema: false }));
    }
  };

  // ... (rest of the helper functions: getWeekDates, openCreateModal, openEditModal, etc. remain the same)
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

  const openCreateModal = () => {
    setEditingSchemaId(null);
    setSchemaName("");
    setBlocksForm([{ id: Date.now(), name: "", startTime: "08:00", endTime: "17:00", blockType: "WORKING" }]);
    setShowModal(true);
  };

  const openEditModal = (schema: Schema) => {
    setEditingSchemaId(schema.id);
    setSchemaName(schema.name);
    setBlocksForm(schema.blocks.map(b => ({
      ...b,
      startTime: formatTime(b.startMinutesFromMidnight),
      endTime: formatTime(b.endMinutesFromMidnight)
    })));
    setShowModal(true);
  };

  const addBlockRow = () => setBlocksForm([...blocksForm, { id: Date.now(), name: "", startTime: "08:00", endTime: "09:00", blockType: "WORKING" }]);
  const removeBlockRow = (index: number) => setBlocksForm(blocksForm.filter((_, i) => i !== index));
  const updateBlockRow = (index: number, field: string, value: any) => {
    const updated = [...blocksForm];
    updated[index][field] = value;
    setBlocksForm(updated);
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      
      
{/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-1 block">Schedules</label>
          <h1 className="text-2xl font-black dark:text-white">Blocks Management</h1>
        </div>
        <button 
          onClick={showModal ? () => setShowModal(false) : openCreateModal}
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-500 transition-all"
        >
          {showModal ? 'Close Modal' : 'New Schema'}
        </button>
      </div>

      {/* Weekly Assignation Section */}
      <section className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Weekly Schema Schedule</h3>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none dark:text-white shadow-sm"
          />
        </div>

        {loading.isFetchingAssignations ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="w-8 h-8" color="text-indigo-500" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-4">Fetching Week Plan...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {getWeekDaysCardsData(selectedDate).map((weekDayTuple: WeekDayTuple) => {
              const assignation = assignations.find(a => a.date?.toString().split('T')[0] === weekDayTuple[0]);
              const assignedSchema = schemas.find(s => s.id === assignation?.schemaId);
              const isUnassigning = loading.isUnassigningBlockSchema === assignation?.id;
              const isAssigning = loading.isAssigningBlockSchema === weekDayTuple[0];

              return (
                <div key={weekDayTuple[0]} className="group relative bg-white dark:bg-[#1a1f2b] p-5 rounded-[2.2rem] border-2 border-transparent hover:border-indigo-500/20 transition-all flex flex-col items-center min-h-[160px] shadow-sm">
                  <div className="text-center mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {weekDayTuple[3]}
                    </p>
                    <p className="text-sm font-black dark:text-white">
                      {weekDayTuple[2]} <span className="opacity-20">/</span> {weekDayTuple[1]}
                    </p>
                  </div>

                  {assignation ? (
                    <div className="w-full mt-auto">
                      <div className="bg-indigo-500 shadow-lg py-3 px-2 rounded-2xl mb-3">
                        <p className="text-[10px] font-black uppercase text-white text-center truncate">
                          {assignedSchema?.name || 'Active Schema'}
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
                      className="w-full mt-auto py-4 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center transition-all group-hover:bg-indigo-500/5"
                    >
                      {isAssigning ? <Spinner size="w-4 h-4" color="text-indigo-500" /> : <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-indigo-500">+ Assign</span>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Schemas List */}
      {loading.isFetchingBlockSchemas ? (
        <div className="flex flex-col items-center py-20">
          <Spinner size="w-12 h-12" color="text-indigo-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">Loading Schemas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {schemas.map((schema) => {
            const isDeleting = loading.isDeletingBlockSchema === schema.id;
            return (
              <div key={schema.id} className="relative bg-white dark:bg-[#1e2330] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button onClick={() => openEditModal(schema)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors px-3 py-1 bg-slate-50 dark:bg-black/20 rounded-lg">
                    Edit
                  </button>
                  <button 
                    disabled={isDeleting}
                    onClick={() => handleDeleteSchema(schema.id)} 
                    className="text-slate-300 hover:text-red-500 transition-colors p-2 bg-slate-50 dark:bg-black/20 rounded-lg flex items-center justify-center"
                  >
                    {isDeleting ? <Spinner size="w-4 h-4" color="text-red-500" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>}
                  </button>
                </div>

                <h4 className="text-lg font-black dark:text-white uppercase tracking-tight mb-6 pr-32">{schema.name}</h4>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  {schema.blocks?.sort((a,b) => a.startMinutesFromMidnight - b.startMinutesFromMidnight).map((block, idx) => {
                    const style = BLOCK_STYLES[block.blockType] || BLOCK_STYLES["WORKING"];
                    return (
                      <div key={idx} className={`flex flex-col justify-center px-4 py-3 rounded-2xl border ${style.color} bg-opacity-10 dark:bg-opacity-5`}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${style.color.split(' ')[0]}`} />
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-80 text-gray-50">{style.label}</span>
                        </div>
                        <p className="text-sm font-bold text-white">
                          {formatTime(block.startMinutesFromMidnight)} - {formatTime(block.endMinutesFromMidnight)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal logic for Create/Edit stays similar but with button loaders */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-[#1e2330] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/10 flex flex-col">
            <h2 className="text-xl font-black dark:text-white mb-8">{editingSchemaId ? 'Edit Schema' : 'Create New Schema'}</h2>
            
            <input 
              type="text" value={schemaName} onChange={(e) => setSchemaName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/20 dark:text-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-indigo-500 mb-8" 
              placeholder="Schema Name"
            />

            {/* Blocks Rows */}
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex justify-between items-end mb-4">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Time Blocks</label>
                <button onClick={addBlockRow} className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl transition-colors">
                  + Add Block
                </button>
              </div>

              {blocksForm.map((block, index) => (
                <div key={block.id || index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5 relative group">
                  
                  {/* Optional Name */}
                  <div className="md:col-span-3">
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Block Name (Opt)</label>
                    <input 
                      type="text" value={block.name} onChange={(e) => updateBlockRow(index, 'name', e.target.value)} placeholder="e.g. Lunch" 
                      className="w-full bg-white dark:bg-[#1e2330] text-xs font-bold px-3 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 dark:text-white"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="md:col-span-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Start Time</label>
                    <input 
                      type="time" required value={block.startTime} onChange={(e) => updateBlockRow(index, 'startTime', e.target.value)}
                      className="w-full bg-white dark:bg-[#1e2330] text-xs font-bold px-3 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>

                  {/* End Time */}
                  <div className="md:col-span-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">End Time</label>
                    <input 
                      type="time" required value={block.endTime} onChange={(e) => updateBlockRow(index, 'endTime', e.target.value)}
                      className="w-full bg-white dark:bg-[#1e2330] text-xs font-bold px-3 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                    />
                  </div>

                  {/* Type Selector */}
                  <div className="md:col-span-4">
                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Block Type</label>
                    <select 
                      value={block.blockType} onChange={(e) => updateBlockRow(index, 'blockType', e.target.value)}
                      className="w-full bg-white dark:bg-[#1e2330] text-xs font-bold px-3 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 outline-none focus:border-indigo-500 dark:text-white appearance-none"
                    >
                      <option value={"WORKING"}>Working</option>
                      <option value={"REST"}>Rest</option>
                      {/* <option value={"EXTRA_TIME"}>Extra Time</option> */}
                    </select>
                  </div>

                  {/* Delete Row */}
                  <div className="md:col-span-1 flex justify-center md:justify-end mt-4 md:mt-0">
                    <button onClick={() => removeBlockRow(index)} className="text-slate-300 hover:text-red-500 transition-colors p-2 bg-white dark:bg-[#1e2330] rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                </div>
              ))}
              {blocksForm.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                   <p className="text-xs font-bold text-slate-400">No blocks added. Please add at least one.</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-8 py-4 bg-slate-100 text-[10px] font-black uppercase rounded-xl">Cancel</button>
              <button 
                disabled={loading.isCreatingBlockSchema || loading.isEditingBlockSchema !== null}
                onClick={handleSaveSchema} 
                className="px-10 py-4 bg-indigo-500 text-white text-[10px] font-black uppercase rounded-xl flex items-center gap-3"
              >
                {(loading.isCreatingBlockSchema || loading.isEditingBlockSchema) ? <Spinner size="w-3 h-3" /> : 'Save Schema'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignation Selection Modal */}
      {assigningDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setAssigningDate(null)} />
          <div className="relative bg-white dark:bg-[#1e2330] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black dark:text-white">Select a Schema</h3>
            <div className="space-y-3 mt-6">
              {schemas.map((schema) => (
                <button
                  key={schema.id}
                  onClick={() => { handleAssign(assigningDate, schema.id as number); setAssigningDate(null); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-transparent hover:border-indigo-500 transition-all group"
                >
                  <span className="text-sm font-bold dark:text-slate-200 group-hover:text-indigo-500">{schema.name}</span>
                  <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <svg className="w-3 h-3 text-white group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {toastError && <Toast message={toastError} onClose={() => setToastError(null)} />}

    </div>
  );
}