import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TodoItem, Category, ThemeMode } from './types';
import {
  getStoredItems,
  saveStoredItems,
  getStoredCategories,
  saveStoredCategories,
  getStoredTheme,
  setStoredTheme,
} from './utils/storage';
import Sidebar from './components/Sidebar';
import TaskItem from './components/TaskItem';
import TaskEditor from './components/TaskEditor';
import SettingsModal from './components/SettingsModal';
import BatchActions from './components/BatchActions';
import { PrivacyModal, AgreementModal, DeclineConfirmModal } from './components/PrivacyAgreement';
import { PrivacyPolicyContent, UserAgreementContent } from './components/AgreementContent';
import {
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  ChevronRight,
  ListTodo,
  Check,
  Undo2,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function App() {
  // --- Persistent Local States ---
  const [items, setItems] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [theme, setTheme] = useState<ThemeMode>('system');

  // --- Privacy Agreement States ---
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementModalType, setAgreementModalType] = useState<'privacy' | 'agreement' | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  // --- UI/UX Interactive States ---
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<TodoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-select Batch mode
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Drawer / Side panels toggles
  const [showSidebarDrawer, setShowSidebarDrawer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Undo system (caches state right before critical edits)
  const [undoState, setUndoState] = useState<{
    items: TodoItem[];
    categories: Category[];
  } | null>(null);
  const [undoMessage, setUndoMessage] = useState<string | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Initial Storage
  useEffect(() => {
    setItems(getStoredItems());
    setCategories(getStoredCategories());
    setTheme(getStoredTheme());

    // Check if user has agreed to privacy policy
    const hasAgreed = localStorage.getItem('suxing_privacy_agreed');
    if (!hasAgreed) {
      setShowPrivacyModal(true);
    }
  }, []);

  // System Theme Application
  useEffect(() => {
    const handleThemeChange = () => {
      if (theme === 'system') {
        const matchesDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', matchesDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    handleThemeChange();
    setStoredTheme(theme);

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', handleThemeChange);
      return () => media.removeEventListener('change', handleThemeChange);
    }
  }, [theme]);

  // Sync state writes instantly to localStorage
  const updateItemsAndPersist = (newItems: TodoItem[]) => {
    setItems(newItems);
    saveStoredItems(newItems);
  };

  const updateCategoriesAndPersist = (newCats: Category[]) => {
    setCategories(newCats);
    saveStoredCategories(newCats);
  };

  // --- Undo Trigger Utility ---
  const triggerUndoBackup = (message: string) => {
    setUndoState({
      items: [...items],
      categories: [...categories],
    });
    setUndoMessage(message);

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setUndoMessage(null);
      setUndoState(null);
    }, 6000); // 6s toast visibility
  };

  const executeUndoRestore = () => {
    if (undoState) {
      setItems(undoState.items);
      saveStoredItems(undoState.items);
      setCategories(undoState.categories);
      saveStoredCategories(undoState.categories);
      setUndoState(null);
      setUndoMessage(null);
    }
  };

  // --- Privacy Agreement Handlers ---
  const handlePrivacyAccept = () => {
    localStorage.setItem('suxing_privacy_agreed', 'true');
    localStorage.setItem('suxing_privacy_agreed_date', Date.now().toString());
    setShowPrivacyModal(false);
  };

  const handlePrivacyDecline = () => {
    setShowDeclineModal(true);
  };

  const handleDeclineCancel = () => {
    setShowDeclineModal(false);
  };

  const handleDeclineConfirm = () => {
    // Clear all data and show privacy modal again
    localStorage.clear();
    setItems([]);
    setCategories(getStoredCategories());
    setShowDeclineModal(false);
    setShowPrivacyModal(true);
  };

  const handleOpenAgreement = () => {
    setAgreementModalType('agreement');
    setShowAgreementModal(true);
  };

  const handleOpenPrivacy = () => {
    setAgreementModalType('privacy');
    setShowAgreementModal(true);
  };

  const handleCloseAgreement = () => {
    setShowAgreementModal(false);
    setAgreementModalType(null);
  };

  // --- Task Operations Actions ---
  const handleItemSave = (updatedFields: Partial<TodoItem>) => {
    if (!updatedFields.id) return;
    const next = items.map((itm) => {
      if (itm.id === updatedFields.id) {
        return { ...itm, ...updatedFields } as TodoItem;
      }
      return itm;
    });
    updateItemsAndPersist(next);
  };

  const handleItemClose = () => {
    if (activeItem) {
      // Blank item cleanup validation: Empty title & notes
      const currentFreshObj = items.find((itm) => itm.id === activeItem.id);
      if (currentFreshObj && !currentFreshObj.title.trim() && !currentFreshObj.notes.trim()) {
        const filtered = items.filter((itm) => itm.id !== activeItem.id);
        updateItemsAndPersist(filtered);
      }
    }
    setActiveItem(null);
  };

  const handleItemDelete = (id: string) => {
    triggerUndoBackup('已删除一条清单待办');
    const filtered = items.filter((itm) => itm.id !== id);
    updateItemsAndPersist(filtered);
    if (activeItem?.id === id) {
      setActiveItem(null);
    }
  };

  const handleItemDuplicate = (original: TodoItem) => {
    const fresh: TodoItem = {
      ...original,
      id: `copy-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${original.title} (副本)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: Math.max(...items.map((i) => i.order), 0) + 1,
    };
    updateItemsAndPersist([...items, fresh]);
  };

  const handleItemMoveCategory = (itemId: string, targetCatId: string) => {
    const targetFolder = categories.find((c) => c.id === targetCatId);
    if (!targetFolder) return;

    triggerUndoBackup(`已将清单移至 [${targetFolder.name}]`);
    const next = items.map((itm) => {
      if (itm.id === itemId) {
        return { ...itm, categoryId: targetCatId, updatedAt: Date.now() };
      }
      return itm;
    });
    updateItemsAndPersist(next);
  };

  const handleToggleComplete = (id: string) => {
    const next = items.map((itm) => {
      if (itm.id === id) {
        return { ...itm, completed: !itm.completed, updatedAt: Date.now() };
      }
      return itm;
    });
    updateItemsAndPersist(next);
  };

  // --- Folder Categories Action Rules ---
  const handleCreateCategory = (name: string) => {
    const fresh: Category = {
      id: `cat-${Date.now()}`,
      name,
      isDefault: false,
      createdAt: Date.now(),
    };
    updateCategoriesAndPersist([...categories, fresh]);
  };

  const handleUpdateCategoryName = (id: string, name: string) => {
    const next = categories.map((cat) => {
      if (cat.id === id) {
        return { ...cat, name };
      }
      return cat;
    });
    updateCategoriesAndPersist(next);
  };

  const handleDeleteCategory = (catId: string, deleteStrategy: 'only-folder' | 'folder-and-items') => {
    triggerUndoBackup('已删除文件夹分类');
    
    // Safety fallback: standard move items inside or destroy outright
    if (deleteStrategy === 'only-folder') {
      const resetItems = items.map((itm) => {
        if (itm.categoryId === catId) {
          return { ...itm, categoryId: 'all' };
        }
        return itm;
      });
      updateItemsAndPersist(resetItems);
    } else {
      const filteredItems = items.filter((itm) => itm.categoryId !== catId);
      updateItemsAndPersist(filteredItems);
    }

    const filteredCats = categories.filter((c) => c.id !== catId);
    updateCategoriesAndPersist(filteredCats);

    if (activeCategoryId === catId) {
      setActiveCategoryId('all');
    }
  };

  // --- Mass Batch Operations Operations ---
  const handleToggleSelectItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((i) => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const handleBatchMarkComplete = (completed: boolean) => {
    triggerUndoBackup(`批量标为${completed ? '已完成' : '未完成'}`);
    const next = items.map((itm) => {
      if (selectedItemIds.includes(itm.id)) {
        return { ...itm, completed, updatedAt: Date.now() };
      }
      return itm;
    });
    updateItemsAndPersist(next);
    setIsBatchMode(false);
    setSelectedItemIds([]);
  };

  const handleBatchMoveCategory = (catId: string) => {
    const targetFolder = categories.find((c) => c.id === catId);
    if (!targetFolder) return;

    triggerUndoBackup(`批量移动清单至 [${targetFolder.name}]`);
    const next = items.map((itm) => {
      if (selectedItemIds.includes(itm.id)) {
        return { ...itm, categoryId: catId, updatedAt: Date.now() };
      }
      return itm;
    });
    updateItemsAndPersist(next);
    setIsBatchMode(false);
    setSelectedItemIds([]);
  };

  const handleBatchDelete = () => {
    triggerUndoBackup('已批量删除所选清单');
    const next = items.filter((itm) => !selectedItemIds.includes(itm.id));
    updateItemsAndPersist(next);
    setIsBatchMode(false);
    setSelectedItemIds([]);
  };

  // --- Global Clears / Resets ---
  const handleClearCompleted = () => {
    triggerUndoBackup('已清空已完成事务');
    const filtered = items.filter((itm) => !itm.completed);
    updateItemsAndPersist(filtered);
  };

  const handleResetAllAll = () => {
    localStorage.clear();
    setItems([]);
    setCategories(getStoredCategories());
    setActiveCategoryId('all');
    setActiveItem(null);
    setIsBatchMode(false);
    setSelectedItemIds([]);
    setTheme('system');
    alert('应用数据已全部清空恢复出厂状态');
  };

  const handleAddNewTaskFast = () => {
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) : 0;
    const fresh: TodoItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: '',
      notes: '',
      completed: false,
      categoryId: activeCategoryId === 'all' ? 'all' : activeCategoryId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: maxOrder + 1,
    };
    // Append to list instantly
    updateItemsAndPersist([...items, fresh]);
    // Set as active editor focused
    setActiveItem(fresh);
  };

  // Rapidly trigger another empty element during editor mode (Enter Key rapid loop)
  const handleEditorSpawnNext = () => {
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) : 0;
    const fresh: TodoItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: '',
      notes: '',
      completed: false,
      categoryId: activeCategoryId === 'all' ? 'all' : activeCategoryId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: maxOrder + 1,
    };
    updateItemsAndPersist([...items, fresh]);
    setActiveItem(fresh); // Swaps focused target actively
  };

  // --- Query Searches and Calculations ---
  const sortedFilteredList = useMemo(() => {
    let list = [...items];

    // 1. Category folder matching
    if (activeCategoryId !== 'all') {
      list = list.filter((itm) => itm.categoryId === activeCategoryId);
    }

    // 2. Search query matching (fuzzy text on title & notes)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (itm) =>
          itm.title.toLowerCase().includes(q) ||
          itm.notes.toLowerCase().includes(q)
      );
    }

    // 3. Apply Multi-criterion sorting (Always keep uncompleted items on top, completed items at the bottom by default, sorted by newest creation date first)
    list.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.createdAt - a.createdAt;
    });

    return list;
  }, [items, activeCategoryId, searchQuery]);

  // Read selected active folder name
  const currentCategoryName = useMemo(() => {
    if (activeCategoryId === 'all') return '全部清单';
    const folder = categories.find((c) => c.id === activeCategoryId);
    return folder ? folder.name : '全部清单';
  }, [activeCategoryId, categories]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#09090b] text-gray-900 dark:text-zinc-50 flex items-center justify-center font-sans transition-colors duration-300">
      
      {/* 
        MAIN MOBILE CONTAINER
        On real phone screens, this fills the screen perfectly.
        On desktops, it displays as an elegant centered mobile card panel with fine shadows,
        eliminating unnecessary decorative larping bezels or fake status bars.
      */}
      <div className="w-full max-w-md h-screen md:h-[812px] md:my-auto bg-white dark:bg-[#121212] overflow-hidden md:rounded-3xl shadow-xl dark:shadow-2xl border border-transparent dark:border-zinc-800 md:border-gray-200/50 relative flex flex-col transition-all duration-300">
        
        {/* 
          SIDEBAR DRAWER COMPONENT
          Slides inside the mobile viewport boundaries
        */}
        <div
          className={`absolute inset-y-0 left-0 w-4/5 max-w-[280px] h-full transition-transform duration-300 ease-out z-50 transform bg-white dark:bg-[#121212] ${
            showSidebarDrawer ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            categories={categories}
            items={items}
            activeCategoryId={activeCategoryId}
            onSelectCategory={(id) => {
              setActiveCategoryId(id);
              setShowSidebarDrawer(false); // Clean drawer close
            }}
            onCreateCategory={handleCreateCategory}
            onUpdateCategoryName={handleUpdateCategoryName}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>

        {/* Backdrop for active Sidebar drawer on mobile viewport */}
        {showSidebarDrawer && (
          <div
            onClick={() => setShowSidebarDrawer(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity duration-300 cursor-pointer animate-fade-in"
          />
        )}

          {/* 
            MAIN WORKSPACE BODY CONTAINER
          */}
          <div className="flex-1 flex flex-col h-full bg-gray-50/40 dark:bg-[#121212] overflow-hidden relative">
            
            {/* 
              PRIMARY SUBHEADER / MAIN ACTION PANEL
            */}
            <header className="px-5 pt-5 pb-3.5 bg-white dark:bg-[#121212] flex flex-col gap-3.5 select-none z-10 border-b border-gray-100 dark:border-zinc-800/40">
              
              {/* Brand Logo Line */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSidebarDrawer(true)}
                    className="p-2 text-gray-500 active:text-blue-600 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all focus:outline-none touch-target block"
                    title="展开文件夹分类"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="flex flex-col pt-1.5 pb-0.5">
                    <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-sky-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-display select-none">
                      速行清单
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Select All Multiple batch process triggers */}
                  <button
                    onClick={() => {
                      setIsBatchMode(!isBatchMode);
                      setSelectedItemIds([]); // Wipe cache
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none ${
                      isBatchMode
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-blue-600 hover:bg-blue-600/5'
                    }`}
                  >
                    {isBatchMode ? '取消多选' : '批量操作'}
                  </button>

                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none touch-target"
                    title="设置"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Fuzzy Searchbar */}
              <div className="flex flex-col gap-2">
                
                {/* Micro Input search wrapper */}
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="输入关键词检索标题或备注内容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm py-2.5 pl-10 pr-9 bg-gray-100/80 dark:bg-zinc-850/60 focus:bg-white dark:focus:bg-zinc-900 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 rounded-xl outline-none focus:ring-1 focus:ring-blue-600/30 border border-transparent focus:border-blue-600/20 transition-all font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 p-1 rounded-full bg-gray-200 dark:bg-zinc-700 hover:text-rose-500 text-gray-500 transition-colors focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

            </header>

            {/* 
              MAIN LIST AREA VIEWPORT
            */}
            <div className="flex-1 overflow-y-auto pb-24">
              {sortedFilteredList.length > 0 ? (
                <div className="divide-y divide-gray-100/50 dark:divide-zinc-805">
                  {sortedFilteredList.map((itm, index) => {
                    const isSelected = selectedItemIds.includes(itm.id);
                    return (
                      <div key={itm.id} className="relative flex items-center">
                        <div className="flex-1">
                          <TaskItem
                            item={itm}
                            categories={categories}
                            isBatchMode={isBatchMode}
                            isSelected={isSelected}
                            onToggleSelect={handleToggleSelectItem}
                            onToggleComplete={handleToggleComplete}
                            onOpen={(clicked) => {
                              setActiveItem(clicked);
                              // Close sidebar on small viewports
                              if (showSidebarDrawer) setShowSidebarDrawer(false);
                            }}
                            onDelete={handleItemDelete}
                            onDuplicate={handleItemDuplicate}
                            onMoveCategory={handleItemMoveCategory}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Pure minimal empty states */
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center select-none animate-fade-in">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-full flex items-center justify-center text-xl mb-4 border border-blue-600/10">
                    {searchQuery ? '🔍' : '📝'}
                  </div>
                  <h4 className="text-base font-bold text-gray-700 dark:text-zinc-300">
                    {searchQuery ? '无检索结果' : '清单空荡荡 ✍️'}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 max-w-xs leading-normal">
                    {searchQuery
                      ? '换一个简单的词检索，或者清除检索框即可查看全部'
                      : `本栏目暂无待办。点击下方“新建事项”开始闪电式拟定！支持自动实时保存哦。`}
                  </p>
                </div>
              )}
            </div>

            {/* 
              IMMEDIATE BOTTOM ACTIONS FOOTER
            */}
            {!isBatchMode && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white/95 to-white/70 dark:from-[#121212] dark:via-[#121212]/95 dark:to-[#121212]/70 backdrop-blur-sm z-30 select-none border-t border-gray-100 dark:border-zinc-850 flex items-center justify-between pb-safe">
                
                {/* Stats counting */}
                <div className="text-xs text-gray-400 dark:text-zinc-500 font-mono pl-1">
                  共计 {sortedFilteredList.length} 条代办项
                </div>

                {/* Massive Android floating styled click trigger to add task */}
                <button
                  onClick={handleAddNewTaskFast}
                  className="flex items-center gap-1.5 px-5 py-3 bg-blue-600 active:bg-blue-700 hover:scale-[1.02] text-white font-semibold text-xs rounded-full shadow-lg shadow-blue-600/25 dark:shadow-blue-950/20 hover:shadow-xl transition-all duration-200 outline-none select-none hover:cursor-pointer touch-target"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>极速新建事项</span>
                </button>

              </div>
            )}

            {/* 
              IMMERSIVE FULLSCREEN EDITOR DRAWER
              Slides up or covers when a note is active. Autoresolves empty states.
            */}
            {activeItem && (
              <div className="absolute inset-0 bg-white dark:bg-[#121212] z-50 animate-slide-up">
                <TaskEditor
                  item={activeItem}
                  categories={categories}
                  onSave={handleItemSave}
                  onClose={handleItemClose}
                  onDelete={handleItemDelete}
                  onNextItem={handleEditorSpawnNext}
                  isMobile={true}
                />
              </div>
            )}

            {/* 
              UI MASS BATCH MUTATOR CONTROLLER
            */}
            {isBatchMode && (
              <BatchActions
                selectedCount={selectedItemIds.length}
                categories={categories.filter((c) => c.id !== 'all')}
                onMarkComplete={handleBatchMarkComplete}
                onMoveCategory={handleBatchMoveCategory}
                onDeleteSelected={handleBatchDelete}
                onClose={() => {
                  setIsBatchMode(false);
                  setSelectedItemIds([]);
                }}
              />
            )}

          </div>

        </div>

        {/* 
          UNDO TOAST BANNER
          Universal undo state manager with graceful popover indicators.
        */}
        {undoMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-80 bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-2xl p-3.5 z-[120] flex items-center justify-between text-xs animate-scale-in">
            <div className="flex items-center gap-2">
              <span className="text-blue-550 animate-spin">♻️</span>
              <span className="font-semibold text-zinc-100">{undoMessage}</span>
            </div>
            <button
              onClick={executeUndoRestore}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 font-bold rounded text-white flex items-center gap-1 transition-all"
            >
              <Undo2 className="w-3.5 h-3.5" /> 撤销
            </button>
          </div>
        )}

        {/* 
          SETTINGS CONFIGURATION MODAL VIEWPORT
        */}
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            onClearCompleted={handleClearCompleted}
            onResetAll={handleResetAllAll}
            onImportSuccess={(cats, itms) => {
              setCategories(cats);
              saveStoredCategories(cats);
              setItems(itms);
              saveStoredItems(itms);
            }}
          />
        )}

        {/* 
          PRIVACY AGREEMENT MODAL
        */}
        {showPrivacyModal && (
          <PrivacyModal
            onAccept={handlePrivacyAccept}
            onDecline={handlePrivacyDecline}
            onOpenAgreement={handleOpenAgreement}
            onOpenPrivacy={handleOpenPrivacy}
          />
        )}

        {/* 
          AGREEMENT DETAIL MODAL
        */}
        <AgreementModal
          show={showAgreementModal}
          onClose={handleCloseAgreement}
          title={agreementModalType === 'privacy' ? '隐私政策' : '用户服务协议'}
          content={agreementModalType === 'privacy' ? <PrivacyPolicyContent /> : <UserAgreementContent />}
        />

        {/* 
          DECLINE CONFIRMATION MODAL
        */}
        <DeclineConfirmModal
          show={showDeclineModal}
          onCancel={handleDeclineCancel}
          onConfirm={handleDeclineConfirm}
        />

    </div>
  );
}
