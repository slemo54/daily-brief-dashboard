'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Flag } from 'lucide-react';

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

  const priorityConfig = {
    high: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', label: 'Alta' },
    medium: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', label: 'Media' },
    low: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', label: 'Bassa' },
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#22c55e]/10">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Task Priorities</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
          <span className="text-xs text-[#6b7280]">{completedCount}/{tasks.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-[#1a1a1a] rounded-full mb-5 overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 rounded-full bg-[#22c55e] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Nuovo task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="input-glass flex-1 px-4 py-2.5 rounded-xl text-sm text-[#ebebeb] placeholder:text-[#6b7280]"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
          className="input-glass px-3 py-2.5 rounded-xl text-sm text-[#9ca3af] cursor-pointer bg-[#1a1a1a]"
        >
          <option value="high" className="bg-[#1a1a1a]">Alta</option>
          <option value="medium" className="bg-[#1a1a1a]">Media</option>
          <option value="low" className="bg-[#1a1a1a]">Bassa</option>
        </select>
        
        <button
          onClick={addTask}
          className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`
              flex items-center gap-3 p-3 rounded-xl transition-all duration-300
              ${task.completed ? 'opacity-50' : 'hover:bg-[#1a1a1a]'}
            `}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
              ) : (
                <Circle className="w-5 h-5 text-[#6b7280] hover:text-[#9ca3af] transition-colors" />
              )}
            </button>
            
            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-[#6b7280]' : 'text-[#ebebeb]'}`}>
              {task.text}
            </span>
            
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
              style={{ 
                backgroundColor: priorityConfig[task.priority].bgColor,
                color: priorityConfig[task.priority].color 
              }}
            >
              <Flag className="w-3 h-3" />
              {priorityConfig[task.priority].label}
            </div>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-[#ef4444]/10 text-[#6b7280] hover:text-[#ef4444] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
