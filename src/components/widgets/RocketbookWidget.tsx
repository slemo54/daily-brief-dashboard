import { RocketbookNote } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface RocketbookWidgetProps {
  notes?: RocketbookNote[];
}

export function RocketbookWidget({ notes = [] }: RocketbookWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          📓 Rocketbook Notes ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {notes.slice(0, 5).map((note, index) => (
            <a
              key={index}
              href={note.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{note.title}</div>
                <div className="text-xs text-muted-foreground">{note.date}</div>
                <div className="flex gap-1 mt-1">
                  {note.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </a>
          ))}
          {notes.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Nessuna nota disponibile</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
