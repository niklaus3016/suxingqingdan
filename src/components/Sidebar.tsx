import React, { useState } from 'react';
import { Category, TodoItem } from '../types';
import { Folder, FolderPlus, Edit3, Trash2, Check, X, FolderSymlink } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  items: TodoItem[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onCreateCategory: (name: string) => void;
  onUpdateCategoryName: (id: string, name: string) => void;
  onDeleteCategory: (id: string, deleteStrategy: 'only-folder' | 'folder-and-items') => void;
}

export default function Sidebar({
  categories,
  items,
  activeCategoryId,
  onSelectCategory,
  onCreateCategory,
  onUpdateCategoryName,
  onDeleteCategory,
}: SidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState('');
  const [showAddNewInput, setShowAddNewInput] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [pendingDeleteCat, setPendingDeleteCat] = useState<Category | null>(null);

  // Calculate count for each category
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') {
      return items.length; // "全部清单" gets all notes
    }
    return items.filter(item => item.categoryId === catId).length;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderInput.trim()) {
      onCreateCategory(newFolderInput.trim());
      setNewFolderInput('');
      setShowAddNewInput(false);
    }
  };

  const handleStartRename = (cat: Category) => {
    if (cat.isDefault) return;
    setEditingCategoryId(cat.id);
    setEditNameValue(cat.name);
  };

  const handleSaveRename = (catId: string) => {
    if (editNameValue.trim()) {
      onUpdateCategoryName(catId, editNameValue.trim());
      setEditingCategoryId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#18181a] border-r border-gray-200/60 dark:border-zinc-800">
      {/* Header section */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <span>📁</span> 文件夹分类
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-gray-200/50 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
        >
          {isEditing ? '完成' : '管理'}
        </button>
      </div>

      {/* Main Categories Scroller */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          const count = getCategoryCount(cat.id);
          const isRenaming = editingCategoryId === cat.id;

          return (
            <div key={cat.id} className="relative group">
              {isRenaming ? (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-900 rounded-lg border border-blue-600/30 shadow-sm mx-1">
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm font-medium text-gray-800 dark:text-zinc-100 focus:outline-none p-0"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(cat.id);
                    }}
                  />
                  <button
                    onClick={() => handleSaveRename(cat.id)}
                    className="p-1 hover:bg-green-50 rounded text-green-600 dark:text-green-400 focus:outline-none"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingCategoryId(null)}
                    className="p-1 hover:bg-red-50 rounded text-rose-500 focus:outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => !isEditing && onSelectCategory(cat.id)}
                    disabled={isEditing}
                    className={`flex-1 text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-sm transition-all relative ${
                      isActive && !isEditing
                        ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/10'
                        : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-200/40 dark:hover:bg-zinc-800/45'
                    } ${isEditing ? 'opacity-85' : ''}`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className={isActive && !isEditing ? 'text-white' : 'text-blue-600'}>
                        {cat.id === 'all' ? '🏷️' : '📁'}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    {!isEditing && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-gray-200/50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>

                  {/* Editing Action overlay buttons */}
                  {isEditing && !cat.isDefault && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-gray-50 dark:bg-[#18181a] shadow-md border border-gray-100 dark:border-zinc-800 p-0.5 rounded-md gap-0.5">
                      <button
                        onClick={() => handleStartRename(cat)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded text-gray-500 dark:text-zinc-400 focus:outline-none"
                        title="重命名"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPendingDeleteCat(cat)}
                        className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded text-rose-500 focus:outline-none"
                        title="删除分类"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* inline folder additive creator */}
        {showAddNewInput ? (
          <form onSubmit={handleCreateSubmit} className="mt-4 px-2">
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-zinc-900 border border-blue-600/40 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="新分类名称..."
                value={newFolderInput}
                onChange={(e) => setNewFolderInput(e.target.value)}
                className="flex-1 bg-transparent border-none text-xs focus:outline-none text-gray-800 dark:text-zinc-100 p-0.5"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 hover:bg-green-50 dark:hover:bg-green-950/30 rounded text-green-600 dark:text-green-400 focus:outline-none"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddNewInput(false);
                  setNewFolderInput('');
                }}
                className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded text-rose-500 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddNewInput(true)}
            className="w-full mt-3 px-3 py-2 border border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-600 dark:hover:border-blue-600 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-white dark:hover:bg-zinc-900/30 transition-all focus:outline-none"
          >
            <FolderPlus className="w-4 h-4" />
            新建文件夹分类
          </button>
        )}
      </div>



      {/* Complex dual deletion validation modal */}
      {pendingDeleteCat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-rose-500">⚠️</span> 删除文件夹确认
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
              你正在删除文件夹分类 <strong className="text-gray-800 dark:text-zinc-200">“{pendingDeleteCat.name}”</strong>。
              如果其包含清单待办，请选择如何处理关联的事项：
            </p>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => {
                  onDeleteCategory(pendingDeleteCat.id, 'only-folder');
                  setPendingDeleteCat(null);
                }}
                className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center justify-between transition-colors focus:outline-none"
              >
                <span>仅删除文件夹 (保留待办，移至默认分类)</span>
                <span className="text-lg">📂</span>
              </button>

              <button
                onClick={() => {
                  onDeleteCategory(pendingDeleteCat.id, 'folder-and-items');
                  setPendingDeleteCat(null);
                }}
                className="w-full py-2.5 px-3 bg-red-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors focus:outline-none"
              >
                <span>全部删除 (同时销毁文件夹中所有待办)</span>
                <span className="text-lg">💥</span>
              </button>

              <button
                onClick={() => setPendingDeleteCat(null)}
                className="w-full py-2 px-3 border border-gray-200 dark:border-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium text-center text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
