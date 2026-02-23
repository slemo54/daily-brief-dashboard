'use client';

import { useState, useEffect } from 'react';
import { Mail, AlertCircle, Clock, CheckCircle, FileText, Send, RefreshCw } from 'lucide-react';

interface EmailCategory {
  id: string;
  name: string;
  count: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

interface EmailDraft {
  id: string;
  recipient: string;
  subject: string;
  preview: string;
  category: string;
  timestamp: string;
}

const defaultCategories: EmailCategory[] = [
  { id: 'urgent', name: 'Urgenti', count: 0, priority: 'urgent', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'invoices', name: 'Fatture', count: 0, priority: 'high', icon: <FileText className="w-4 h-4" /> },
  { id: 'clients', name: 'Clienti', count: 0, priority: 'high', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'newsletter', name: 'Newsletter', count: 0, priority: 'low', icon: <Mail className="w-4 h-4" /> },
];

const defaultDrafts: EmailDraft[] = [
  { id: '1', recipient: 'Elena Zilotova', subject: 'Re: Progetto Website', preview: 'Grazie per la tua email. Ti confermo...', category: 'Clienti', timestamp: '2h fa' },
  { id: '2', recipient: 'Wine2Wine Team', subject: 'Aggiornamento Evento', preview: 'Ecco l\'agenda aggiornata per...', category: 'Progetti', timestamp: '5h fa' },
];

const priorityColors = {
  urgent: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
  high: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  medium: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
  low: 'bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20',
};

export function EmailAssistantWidget() {
  const [categories, setCategories] = useState<EmailCategory[]>(defaultCategories);
  const [drafts, setDrafts] = useState<EmailDraft[]>(defaultDrafts);
  const [lastSync, setLastSync] = useState<string>('Mai');
  const [isSyncing, setIsSyncing] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('email-assistant-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.categories) setCategories(data.categories);
        if (data.drafts) setDrafts(data.drafts);
        if (data.lastSync) setLastSync(data.lastSync);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('email-assistant-data', JSON.stringify({
      categories,
      drafts,
      lastSync,
    }));
  }, [categories, drafts, lastSync]);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync - in real implementation this would call Gmail API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastSync(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
    setIsSyncing(false);
  };

  const totalEmails = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#8b5cf6]/10">
            <Mail className="w-4 h-4 text-[#8b5cf6]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Email Assistant</span>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
          title="Sincronizza con Gmail"
        >
          <RefreshCw className={`w-4 h-4 text-[#6b7280] ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
          <div className="text-2xl font-bold text-[#ebebeb]">{totalEmails}</div>
          <div className="text-xs text-[#6b7280]">Email da processare</div>
        </div>
        <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
          <div className="text-2xl font-bold text-[#ebebeb]">{drafts.length}</div>
          <div className="text-xs text-[#6b7280]">Bozze pronte</div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2 mb-5">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${priorityColors[category.priority]}`}>
                {category.icon}
              </div>
              <span className="text-sm text-[#ebebeb]">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {category.count > 0 && (
                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${priorityColors[category.priority]}`}>
                  {category.count}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Draft Replies */}
      {drafts.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Bozze Rapide</span>
          </div>
          <div className="space-y-2">
            {drafts.slice(0, 2).map((draft) => (
              <div
                key={draft.id}
                className="p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-[#ebebeb] group-hover:text-[#8b5cf6] transition-colors">
                    {draft.recipient}
                  </span>
                  <span className="text-xs text-[#6b7280]">{draft.timestamp}</span>
                </div>
                <p className="text-xs text-[#9ca3af] line-clamp-1 mb-1">{draft.subject}</p>
                <p className="text-xs text-[#6b7280] line-clamp-1">{draft.preview}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#2a2a2a] text-[#9ca3af]">
                    {draft.category}
                  </span>
                  <button className="flex items-center gap-1 text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors ml-auto">
                    <Send className="w-3 h-3" />
                    Invia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
          <Clock className="w-3 h-3" />
          Sync: {lastSync}
        </div>
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
        >
          Apri Gmail →
        </a>
      </div>

      {/* Setup Notice */}
      <div className="mt-4 p-3 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/20">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-[#f59e0b] font-medium mb-1">Configurazione richiesta</p>
            <p className="text-xs text-[#9ca3af]">
              Per il sync automatico con Gmail, configura le API credentials in Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
