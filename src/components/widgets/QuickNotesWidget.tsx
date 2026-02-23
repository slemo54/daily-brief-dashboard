'use client';

import { useState, useEffect } from 'react';
import { Save, Trash2, FileText } from 'lucide-react';

export function QuickNotesWidget() {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('quickNotes');
    if (savedNotes) setNotes(savedNotes);
  }, []);

  const saveNotes = () => {
    localStorage.setItem('quickNotes', notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearNotes = () => {
    setNotes('');
    localStorage.removeItem('quickNotes');
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#f59e0b]/10">
            <FileText className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Quick Notes</span>
        </div>
        
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-[#22c55e] animate-pulse">Salvato! ✓</span>
          )}
          <button
            onClick={saveNotes}
            className="btn-glass w-8 h-8 rounded-lg flex items-center justify-center"
            title="Salva note"
          >
            <Save className={`w-4 h-4 ${saved ? 'text-[#22c55e]' : 'text-[#9ca3af]'}`} />
          </button>
          
          <button
            onClick={clearNotes}
            className="btn-glass w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#ef4444]/10 hover:border-[#ef4444]/30"
            title="Cancella note"
          >
            <Trash2 className="w-4 h-4 text-[#9ca3af] hover:text-[#ef4444]" />
          </button>
        </div>
      </div>

      <textarea
        placeholder="Scrivi i tuoi appunti qui..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="input-glass w-full min-h-[150px] p-4 rounded-xl text-sm text-[#ebebeb] placeholder:text-[#6b7280] resize-none custom-scrollbar"
      />
    </div>
  );
}
