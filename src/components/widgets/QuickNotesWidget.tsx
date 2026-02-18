'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';

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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
          <span>📝 Quick Notes</span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={saveNotes}>
              <Save className={`w-4 h-4 ${saved ? 'text-green-500' : ''}`} />
            </Button>
            <Button size="sm" variant="ghost" onClick={clearNotes}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea
          placeholder="Scrivi i tuoi appunti qui..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] resize-none"
        />
        {saved && (
          <p className="text-xs text-green-500 mt-2">Salvato! ✅</p>
        )}
      </CardContent>
    </Card>
  );
}
