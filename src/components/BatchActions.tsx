import React, { useState } from 'react';
import { Category } from '../types';
import { Trash2, CheckCircle, Circle, FolderSymlink, X } from 'lucide-react';

interface BatchActionsProps {
  selectedCount: number;
  categories: Category[];
  onMarkComplete: (completed: boolean) => void;
  onMoveCategory: (catId: string) => void;
  onDeleteSelected: () => void;
  onClose: () => void;
}

export default function BatchActions({
  selectedCount,
  categories,
  onMarkComplete,
  onMoveCategory,
  onDeleteSelected,
  onClose,
}: BatchActionsProps) {
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-t-2xl z-40 px-4 py-3 pb-safe animate-slide-up flex flex-col gap-2 select-none">
      
      {/* Title info bar */}
      <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-gray-100 dark:border-zinc-800">
        <span className="text-blue-600 dark:text-blue-450 font-mono">
          已选择 {selectedCount} 项待办清单
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1 flex items-center gap-0.5 focus:outline-none"
        >
          取消多选 <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Buttons dashboard */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 relative">
        {/* Toggle complete */}
        <button
          onClick={() => onMarkComplete(true)}
          disabled={selectedCount === 0}
          className="py-2.5 px-1 bg-gray-50 dark:bg-zinc-850 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-[11px] font-medium text-gray-700 dark:text-zinc-300 flex flex-col items-center gap-1.5 transition-all text-center focus:outline-none"
        >
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>标记完成</span>
        </button>

        {/* Toggle uncomplete */}
        <button
          onClick={() => onMarkComplete(false)}
          disabled={selectedCount === 0}
          className="py-2.5 px-1 bg-gray-50 dark:bg-zinc-850 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-[11px] font-medium text-gray-700 dark:text-zinc-300 flex flex-col items-center gap-1.5 transition-all text-center focus:outline-none"
        >
          <Circle className="w-4 h-4 text-blue-500" />
          <span>标记未完成</span>
        </button>

        {/* Migrate folder */}
        <div className="relative flex flex-col">
          <button
            onClick={() => setShowFolderDropdown(!showFolderDropdown)}
            disabled={selectedCount === 0}
            className="w-full py-2.5 px-1 bg-gray-50 dark:bg-zinc-850 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-[11px] font-medium text-gray-700 dark:text-zinc-300 flex flex-col items-center gap-1.5 transition-all text-center focus:outline-none"
          >
            <FolderSymlink className="w-4 h-4 text-blue-500" />
            <span className="truncate w-full px-1">移动分类</span>
          </button>

          {/* Folder dropdown picker */}
          {showFolderDropdown && selectedCount > 0 && (
            <div className="absolute bottom-[115%] left-0 right-0 z-50 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl py-1 max-h-40 overflow-y-auto">
              <span className="block px-3 py-1.5 text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-extrabold border-b border-gray-100 dark:border-zinc-700">移至目标：</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onMoveCategory(cat.id);
                    setShowFolderDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-zinc-200 truncate outline-none"
                >
                  📁 {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete batch */}
        <button
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className="py-2.5 px-1 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100/75 dark:hover:bg-rose-950/40 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-[11px] font-medium text-rose-600 dark:text-rose-450 flex flex-col items-center gap-1.5 transition-all text-center focus:outline-none"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>批量删除</span>
        </button>
      </div>
    </div>
  );
}
