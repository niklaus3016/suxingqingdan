import React, { useState, useEffect, useRef } from 'react';
import { TodoItem, Category } from '../types';
import { MoreHorizontal, Trash2, Copy, Move, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  item: TodoItem;
  categories: Category[];
  isBatchMode: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onOpen: (item: TodoItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: TodoItem) => void;
  onMoveCategory: (id: string, newCatId: string) => void;
}

export default function TaskItem({
  item,
  categories,
  isBatchMode,
  isSelected = false,
  onToggleSelect,
  onToggleComplete,
  onOpen,
  onDelete,
  onDuplicate,
  onMoveCategory,
}: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMovePicker, setShowMovePicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowMovePicker(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Support long press gesture to trigger context action menu (mobile-behavior)
  const handleTouchStart = () => {
    if (isBatchMode) return;
    longPressTimer.current = setTimeout(() => {
      setShowMenu(true);
      if (navigator.vibrate) {
        navigator.vibrate(50); // Haptic feedback on Android if supported
      }
    }, 600); // 600ms hold
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // If clicking check box or menu trigger or batch state, don't open details
    const target = e.target as HTMLElement;
    if (target.closest('.no-click-through')) {
      return;
    }
    if (isBatchMode) {
      if (onToggleSelect) onToggleSelect(item.id);
    } else {
      onOpen(item);
    }
  };

  const formattedDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const now = new Date();
    
    // Check if today
    if (d.toDateString() === now.toDateString()) {
      return `今天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return `昨天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  // Find category label
  const itemCategory = categories.find(c => c.id === item.categoryId);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleItemClick}
      className={`group relative flex items-start gap-3 p-4 bg-white dark:bg-[#1c1c1e] border-b border-gray-100 dark:border-zinc-800/60 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer ${
        isSelected ? 'bg-blue-600/[0.04] dark:bg-blue-600/[0.03]' : ''
      }`}
    >
      {/* Batch control checkbox on left */}
      {isBatchMode && (
        <div className="no-click-through flex items-center pr-1 self-center">
          <button
            onClick={() => onToggleSelect && onToggleSelect(item.id)}
            className="focus:outline-none touch-target flex items-center justify-center"
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              isSelected 
                ? 'bg-blue-600 border-blue-600 text-white scale-110' 
                : 'border-gray-300 dark:border-zinc-600 bg-transparent'
            }`}>
              {isSelected && (
                <svg className="w-3.5 h-3.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Todo checkbox */}
      <div className="no-click-through flex items-start justify-center pt-0.5">
        <button
          onClick={() => onToggleComplete(item.id)}
          className="focus:outline-none touch-target flex items-center justify-center -m-1 p-1"
          aria-label={item.completed ? '标记为未完成' : '标记为已完成'}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            item.completed
              ? 'bg-blue-600 border-blue-600 text-white scale-100'
              : 'border-gray-400 dark:border-zinc-500 hover:border-blue-600 dark:hover:border-blue-400 bg-transparent'
          }`}>
            {item.completed && (
              <svg className="w-3 h-3 stroke-[3.5] animate-scale-in" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Core task text space */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Title and notes summary */}
        <h3 className={`text-base font-normal tracking-wide transition-all ${
          item.completed
            ? 'text-gray-400 dark:text-zinc-500 line-through decoration-gray-400 dark:decoration-zinc-500/70 font-light'
            : 'text-gray-900 dark:text-zinc-100'
        } break-words whitespace-pre-wrap`}>
          {item.title || <span className="text-gray-300 dark:text-zinc-600 italic font-mono text-sm">无标题待办 ({formattedDate(item.createdAt)})</span>}
        </h3>
        
        {item.notes && (
          <p className={`text-sm mt-1 break-words line-clamp-2 ${
            item.completed
              ? 'text-gray-300 dark:text-zinc-600 line-through'
              : 'text-gray-500 dark:text-zinc-400'
          }`}>
            {item.notes}
          </p>
        )}

        {/* Metadata pills */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px] font-mono tracking-wide text-gray-400 dark:text-zinc-500">
            {formattedDate(item.updatedAt)}
          </span>
          {itemCategory && (
            <span className={`px-2 py-0.5 text-[10px] rounded-full scale-95 origin-left ${
              item.completed
                ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800/50 dark:text-zinc-600'
                : 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400/80 border border-blue-500/10'
            }`}>
              📁 {itemCategory.name}
            </span>
          )}
        </div>
      </div>

      {/* Action Popover Context Trigger */}
      {!isBatchMode && (
        <div className="no-click-through absolute right-2 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 active:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full focus:outline-none touch-target"
            aria-label="操作菜单"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Floating iPhone style Bubble Context Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="no-click-through absolute right-4 top-1/2 -translate-y-[85%] z-30 w-48 bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 text-sm ring-1 ring-black/5 animate-scale-in"
        >
          <button
            onClick={() => {
              onOpen(item);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-zinc-200 flex items-center gap-2"
          >
            <span>📝</span> 编辑内容
          </button>
          
          <button
            onClick={() => {
              onDuplicate(item);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-zinc-200 flex items-center gap-2"
          >
            <Copy className="w-4 h-4 text-gray-400" /> 复制清单
          </button>

          {/* Inline Move Category drawer trigger */}
          <div className="border-t border-gray-100 dark:border-zinc-800/80 my-1"></div>
          
          <div className="relative">
            <button
              onClick={() => setShowMovePicker(!showMovePicker)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-zinc-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Move className="w-4 h-4 text-gray-400" /> 移动分类
              </span>
              <span className="text-[10px] text-gray-400">▶</span>
            </button>

            {showMovePicker && (
              <div className="absolute right-[102%] top-0 z-40 w-40 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onMoveCategory(item.id, cat.id);
                      setShowMovePicker(false);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-zinc-800 truncate block ${
                      item.categoryId === cat.id ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-zinc-300'
                    }`}
                  >
                    📁 {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800/80 my-1"></div>

          <button
            onClick={() => {
              onDelete(item.id);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> 删除清单
          </button>
        </div>
      )}
    </div>
  );
}
