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
import { BlockType, CreateSchemaData, Schema, SchemaBlock } from '@/types/BlockSchemas';

// Helper to convert minutes to HH:MM string
const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// Helper to convert HH:MM string to minutes
const parseTime = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h * 60) + m;
};

// UI Config for Block Types
const BLOCK_STYLES: Record<string, { label: string, color: string }> = {
  ["WORKING"]: { label: 'Working', color: 'bg-blue-500 text-blue-500 border-blue-500/30 dark:border-blue-500/50' },
  ["REST"]: { label: 'Rest', color: 'bg-slate-400 text-slate-500 border-slate-300 dark:border-slate-600 dark:text-slate-400' },
  ["EXTRA_TIME"]: { label: 'Extra Time', color: 'bg-amber-500 text-amber-600 border-amber-500/30 dark:border-amber-500/50 dark:text-amber-500' },
};

export default function BlocksManagement() {
  // --- States ---
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [assignations, setAssignations] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [assigningDate, setAssigningDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSchemaId, setEditingSchemaId] = useState<number | null>(null);

  // Form State
  const [schemaName, setSchemaName] = useState("");
  const [blocksForm, setBlocksForm] = useState<any[]>([]);

  useEffect(() => {
    fetchSchemas();
    fetchWeekAssignations(selectedDate);
  }, [selectedDate]);

  const fetchSchemas = async () => {
    try {
      const data = await getSchemasList(1, 50); // Assuming pagination support
      // Normalize data in case endpoint returns { data: [] } vs []
      const list = Array.isArray(data) ? data : (data?.data || []);
      setSchemas(list);
    } catch (error) { console.error(error); }
  };


  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
  };

  const fetchWeekAssignations = async (baseDate: string) => {
    const date = new Date(baseDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(date.setDate(diff));
    const sunday = new Date(date.setDate(diff + 6));

    try {
      const data = await getSchemaAssignations(
        formatDate(monday), 
        formatDate(sunday)
      );

      setAssignations(Array.isArray(data) ? data : []);
    } catch (error) { 
      console.error(error); 
  }
};

  // --- Handlers ---
  const handleAssign = async (date: string, schemaId: number) => {
    if (!schemaId) return;
    try {
      await upsertSchemaAssignation(date, schemaId);
      fetchWeekAssignations(selectedDate);
    } catch (error) { console.error(error); }
  };

  const handleUnassign = async (assignationId: number) => {
    try {
      await deleteSchemaAssignationById(assignationId);
      fetchWeekAssignations(selectedDate);
    } catch (error) { console.error(error); }
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

  // Schema Handlers
  const handleDeleteSchema = async (id: number) => {
    if (!confirm("Delete this schema? This action cannot be undone.")) return;
    try {
      await deleteSchema(id);
      fetchSchemas();
      fetchWeekAssignations(selectedDate)
    } catch (error) { console.error(error); }
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

  const handleSaveSchema = async () => {
    if (!schemaName.trim()) return alert("Schema name is required");
    
    const formattedBlocks = blocksForm.map((b) => ({
      name: b.name || null,
      startMinutesFromMidnight: parseTime(b.startTime),
      endMinutesFromMidnight: parseTime(b.endTime),
      blockType: b.blockType,
    })) as SchemaBlock[];
    try {
      if (editingSchemaId) {
        // Based on the provided type, the update payload uses 'block' instead of 'blocks'
        await updateSchema(editingSchemaId, { name: schemaName, blocks: formattedBlocks });
      } else {
        const newSchema: CreateSchemaData = { name: schemaName, blocks: formattedBlocks };
        await createSchema(newSchema);
      }
      setShowModal(false);
      fetchSchemas();
    } catch (error) { console.error(error); }
  };

  const addBlockRow = () => {
    setBlocksForm([...blocksForm, { id: Date.now(), name: "", startTime: "08:00", endTime: "09:00", blockType: "WORKING" }]);
  };

  const removeBlockRow = (index: number) => {
    setBlocksForm(blocksForm.filter((_, i) => i !== index));
  };

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
          <div className="relative">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {getWeekDates().map((date, i) => {
            const dateStr = [
              date.getFullYear(),
              String(date.getMonth() + 1).padStart(2, '0'),
              String(date.getDate()).padStart(2, '0')
            ].join('-');
            
            const assignation = assignations.find(a => a.date?.toString().split('T')[0] === dateStr);
            const assignedSchema = schemas.find(s => s.id === assignation?.schemaId);

            return (
              <div key={dateStr} className="group relative bg-white dark:bg-[#1a1f2b] p-5 rounded-[2.2rem] border-2 border-transparent hover:border-indigo-500/20 transition-all flex flex-col items-center min-h-[160px] shadow-sm">
                
                {/* Date Display */}
                <div className="text-center mb-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-sm font-black dark:text-white">
                    {date.getDate()} <span className="opacity-20">/</span> {date.getMonth() + 1}
                  </p>
                </div>

                {assignation ? (
                  <div className="w-full mt-auto animate-in fade-in zoom-in duration-300">
                    <div className="bg-indigo-500 shadow-[0_10px_20px_-5px_rgba(99,102,241,0.3)] py-3 px-2 rounded-2xl mb-3">
                      <p className="text-[10px] font-black uppercase text-white text-center truncate">
                        {assignedSchema?.name || 'Active Schema'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUnassign(assignation.id)}
                      className="w-full text-[9px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors tracking-widest"
                    >
                      Unassign
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAssigningDate(dateStr)}
                    className="w-full mt-auto py-4 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all"
                  >
                    <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-indigo-500">+ Assign</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Schemas List (1-Column Grid) */}
      <div className="grid grid-cols-1 gap-6">
        {schemas.map((schema) => (
          <div key={schema.id} className="relative bg-white dark:bg-[#1e2330] rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group">
            
            {/* Top right actions */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <button onClick={() => openEditModal(schema)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors px-3 py-1 bg-slate-50 dark:bg-black/20 rounded-lg">
                Edit
              </button>
              <button onClick={() => handleDeleteSchema(schema.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2 bg-slate-50 dark:bg-black/20 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Schema Header */}
            <h4 className="text-lg font-black dark:text-white uppercase tracking-tight mb-6 pr-32">{schema.name}</h4>

            {/* Blocks Visualizer */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              {schema.blocks?.sort((a,b) => a.startMinutesFromMidnight - b.startMinutesFromMidnight).map((block, idx) => {
                const style = BLOCK_STYLES[block.blockType] || BLOCK_STYLES["WORKING"];
                return (
                  <div key={idx} className={`flex flex-col justify-center px-4 py-3 rounded-2xl border ${style.color} bg-opacity-10 dark:bg-opacity-5`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${style.color.split(' ')[0]}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-80">
                        {style.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold dark:text-white">
                      {formatTime(block.startMinutesFromMidnight)} - {formatTime(block.endMinutesFromMidnight)}
                    </p>
                    {block.name && (
                      <span className="text-[10px] font-semibold mt-1 opacity-70 truncate max-w-[120px]">
                        {block.name}
                      </span>
                    )}
                  </div>
                );
              })}
              {(!schema.blocks || schema.blocks.length === 0) && (
                <p className="text-xs font-bold text-slate-400 italic">No blocks defined.</p>
              )}
            </div>
          </div>
        ))}
        {schemas.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1e2330] rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No schemas available</p>
          </div>
        )}
      </div>

      {/* Create/Edit Schema Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white dark:bg-[#1e2330] w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/10 flex flex-col">
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Schema Configuration</h5>
                <h2 className="text-xl font-black dark:text-white">{editingSchemaId ? 'Edit Schema' : 'Create New Schema'}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Schema Name Input */}
            <div className="space-y-2 mb-8">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Schema Name</label>
              <input 
                type="text" 
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                placeholder="e.g. Standard Weekday Shift" 
                className="w-full bg-slate-50 dark:bg-black/20 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>

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

            {/* Actions */}
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button onClick={handleSaveSchema} disabled={blocksForm.length === 0} className="px-10 py-4 bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)]">
                Save Schema
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Assignation Selection Modal */}
      {assigningDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setAssigningDate(null)} />
          
          <div className="relative bg-white dark:bg-[#1e2330] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
            <div className="mb-6">
              <h3 className="text-xl font-black dark:text-white">Select a Schema</h3>
              <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">
                Assigning for {new Date(assigningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {schemas.map((schema) => (
                <button
                  key={schema.id}
                  onClick={() => {
                    handleAssign(assigningDate, schema.id as number);
                    setAssigningDate(null);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-transparent hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group"
                >
                  <span className="text-sm font-bold dark:text-slate-200 group-hover:text-indigo-500">{schema.name}</span>
                  <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              ))}
              {schemas.length === 0 && (
                <p className="text-xs font-bold text-slate-400 text-center py-4">No schemas available to assign.</p>
              )}
            </div>

            <button 
              onClick={() => setAssigningDate(null)}
              className="mt-8 w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}