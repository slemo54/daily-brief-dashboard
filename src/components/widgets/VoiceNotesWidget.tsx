'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Save, Trash2 } from 'lucide-react';

interface VoiceNote {
  id: string;
  text: string;
  timestamp: string;
  duration: number;
}

export function VoiceNotesWidget() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('voice-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    
    // Check browser support
    if (typeof window !== 'undefined' && 
        !('webkitSpeechRecognition' in window) && 
        !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('voice-notes', JSON.stringify(notes));
  }, [notes]);

  const startRecording = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'it-IT';

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + ' ' + finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        recognitionRef.current?.start();
      }
    };

    startTimeRef.current = Date.now();
    recognitionRef.current.start();
    setIsRecording(true);
    setTranscript('');
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const saveNote = () => {
    if (!transcript.trim()) return;
    
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const newNote: VoiceNote = {
      id: Date.now().toString(),
      text: transcript.trim(),
      timestamp: new Date().toLocaleString('it-IT'),
      duration,
    };
    
    setNotes((prev) => [newNote, ...prev]);
    setTranscript('');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  if (!isSupported) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-[#ef4444]/10">
            <Mic className="w-4 h-4 text-[#ef4444]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Note Vocali</span>
        </div>
        
        <p className="text-sm text-[#6b7280]">
          Il tuo browser non supporta il riconoscimento vocale. 
          Usa Chrome o Safari per questa funzione.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#22c55e]/10">
            <Mic className="w-4 h-4 text-[#22c55e]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Note Vocali</span>
        </div>
        <span className="text-xs text-[#6b7280]">{notes.length} note</span>
      </div>

      {/* Recording Controls */}
      <div className="flex gap-2 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">Registra</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white transition-all animate-pulse"
          >
            <Square className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Stop</span>
          </button>
        )}
        
        {transcript && !isRecording && (
          <button
            onClick={saveNote}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#22c55e]/10 hover:bg-[#22c55e]/20 text-[#22c55e] transition-all"
          >
            <Save className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Transcript */}
      {isRecording && (
        <div className="mb-4 p-3 rounded-xl bg-[#1a1a1a] border border-[#ef4444]/30">
          <p className="text-sm text-[#ebebeb] animate-pulse">{transcript || 'Ascoltando...'}</p>
        </div>
      )}

      {/* Saved Notes */}
      {notes.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notes.slice(0, 5).map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] group"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-[#ebebeb] flex-1 line-clamp-2">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#ef4444]/10 text-[#6b7280] hover:text-[#ef4444] transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-[#6b7280]">{note.timestamp}</span>
                <span className="text-xs text-[#6b7280]">• {note.duration}s</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
