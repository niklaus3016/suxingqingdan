import React, { useState, useEffect, useRef } from 'react';
import { TodoItem, Category } from '../types';
import { ChevronLeft, Trash2, Folder, Calendar, ArrowLeftRight, Clock } from 'lucide-react';

interface TaskEditorProps {
  item: TodoItem;
  categories: Category[];
  onSave: (updatedItem: Partial<TodoItem>) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onNextItem: () => void; // For Enter to create next empty item
  isMobile: boolean;
}

export default function TaskEditor({
  item,
  categories,
  onSave,
  onClose,
  onDelete,
  onNextItem,
  isMobile,
}: TaskEditorProps) {
  const [title, setTitle] = useState(item.title);
  const [notes, setNotes] = useState(item.notes);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [completed, setCompleted] = useState(item.completed);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Text Undo/Redo stacks for internal inputs
  const [history, setHistory] = useState<{ title: string; notes: string }[]>([{ title: item.title, notes: item.notes }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const titleRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const isSelfChanging = useRef(false);

  // Sync state if active item changes
  useEffect(() => {
    setTitle(item.title);
    setNotes(item.notes);
    setCategoryId(item.categoryId);
    setCompleted(item.completed);
    setHistory([{ title: item.title, notes: item.notes }]);
    setHistoryIndex(0);
    
    // Auto-focus title if it's a freshly created blank item
    if (!item.title && !item.notes) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [item.id]);

  // Handle auto-save trigger on content changes
  useEffect(() => {
    // Prevent run on initial load
    if (title === item.title && notes === item.notes && categoryId === item.categoryId && completed === item.completed) {
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      onSave({
        id: item.id,
        title: title.trim(),
        notes: notes,
        categoryId,
        completed,
        updatedAt: Date.now(),
      });
      setSaveStatus('saved');
    }, 400); // Debounce to prevent heavy continuous renders

    return () => clearTimeout(timer);
  }, [title, notes, categoryId, completed]);

  // Keep internal input undo/redo system updated
  const pushHistory = (newTitle: string, newNotes: string) => {
    if (isSelfChanging.current) return;
    const nextHistory = history.slice(0, historyIndex + 1);
    const lastState = nextHistory[nextHistory.length - 1];
    
    if (lastState && lastState.title === newTitle && lastState.notes === newNotes) {
      return;
    }

    const updatedHistory = [...nextHistory, { title: newTitle, notes: newNotes }];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    pushHistory(val, notes);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    pushHistory(title, val);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isSelfChanging.current = true;
      const prevIdx = historyIndex - 1;
      const prevState = history[prevIdx];
      setTitle(prevState.title);
      setNotes(prevState.notes);
      setHistoryIndex(prevIdx);
      setTimeout(() => {
        isSelfChanging.current = false;
      }, 50);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isSelfChanging.current = true;
      const nextIdx = historyIndex + 1;
      const nextState = history[nextIdx];
      setTitle(nextState.title);
      setNotes(nextState.notes);
      setHistoryIndex(nextIdx);
      setTimeout(() => {
        isSelfChanging.current = false;
      }, 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // If Enter in Title field, move focus to Details textarea or trigger rapid creation
      if (e.currentTarget === titleRef.current) {
        e.preventDefault();
        notesRef.current?.focus();
      }
    }
  };

  // Support Ctrl+Enter anywhere in this page to create a new blank note immediately!
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSave({
        id: item.id,
        title: title.trim(),
        notes: notes,
        categoryId,
        completed,
        updatedAt: Date.now(),
      });
      onNextItem();
    }
  };

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // Human descriptive text for category
  const activeCategory = categories.find(c => c.id === categoryId);

  return (
    <div 
      className="flex flex-col h-full bg-white dark:bg-[#121212] select-text"
      onKeyDown={handleEditorKeyDown}
    >
      {/* Immersive Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-blue-600 py-1.5 px-2 -ml-2 rounded-lg active:bg-gray-100 dark:active:bg-zinc-800 transition-colors focus:outline-none touch-target"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          <span className="text-base font-medium">返回</span>
        </button>

        {/* Status indicator and save states */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono">
            {saveStatus === 'saving' ? '正在自动保存...' : '已实时保存'}
          </span>
          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className={`p-1.5 rounded-md focus:outline-none transition-opacity ${
                historyIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white dark:hover:bg-zinc-700 active:scale-95'
              }`}
              title="撤销"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-md focus:outline-none transition-opacity ${
                historyIndex >= history.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-white dark:hover:bg-zinc-700 active:scale-95'
              }`}
              title="重做"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={() => {
              onDelete(item.id);
            }}
            className="p-2 text-red-500 rounded-lg active:bg-red-50 dark:active:bg-red-950/20 transition-colors focus:outline-none touch-target"
            title="查看和删除"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Quick action toolbar (Completed state & folder mapping) */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-zinc-400 border-b border-gray-100 dark:border-zinc-800/80 pb-3">
          {/* Complete checking */}
          <button
            onClick={() => setCompleted(!completed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
              completed
                ? 'bg-blue-600/10 border-blue-600/30 text-blue-600'
                : 'bg-gray-100 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
              completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-500 dark:border-zinc-400'
            }`}>
              {completed && (
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>{completed ? '已完成' : '设为已完成'}</span>
          </button>

          {/* Folder Category Select */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 relative">
            <Folder className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-transparent border-none appearance-none font-medium text-gray-700 dark:text-zinc-200 focus:outline-none pr-4 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="dark:bg-zinc-900 dark:text-zinc-200">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-1 text-gray-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>最后修改于 {formatTime(item.updatedAt)}</span>
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            placeholder="事项标题"
            className="w-full text-xl md:text-2xl font-semibold text-gray-900 dark:text-zinc-50 border-none outline-none focus:ring-0 placeholder-gray-300 dark:placeholder-zinc-600 bg-transparent py-1"
          />
        </div>

        {/* Notes Paragraph */}
        <div className="flex-1 flex flex-col min-h-[250px]">
          <textarea
            ref={notesRef}
            value={notes}
            onChange={handleNotesChange}
            placeholder="在此输入详细备注或补充内容..."
            className="w-full flex-1 text-base leading-relaxed text-gray-700 dark:text-zinc-300 border-none outline-none focus:ring-0 placeholder-gray-300 dark:placeholder-zinc-600 bg-transparent resize-none py-1 align-top"
          />
        </div>
      </div>


    </div>
  );
}
