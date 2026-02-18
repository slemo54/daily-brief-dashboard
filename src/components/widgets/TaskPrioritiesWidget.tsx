'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export function TaskPrioritiesWidget() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Review PRs', priority: 'high', completed: false },
    { id: '2', text: 'Update documentation', priority: 'medium', completed: false },
    { id: '3', text: 'Team meeting', priority: 'high', completed: true },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, {
      id: Date.now().toString(),
      text: newTask,
      priority: newPriority,
      completed: false,
    }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          ✅ Task Priorities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nuovo task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="px-2 rounded-md bg-secondary text-sm"
          >
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Bassa</option>
          </select>
          <Button size="sm" onClick={addTask}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-2 p-2 rounded-lg ${task.completed ? 'opacity-50' : ''}`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="text-muted-foreground hover:text-primary"
              >
                {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              
              <span className={`flex-1 ${task.completed ? 'line-through' : ''}`}>
                {task.text}
              </span>
              
              <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="text-muted-foreground hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
