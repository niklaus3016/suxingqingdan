import { TodoItem, Category } from '../types';

const ITEMS_KEY = 'suxing_items';
const CATEGORIES_KEY = 'suxing_categories';
const THEME_KEY = 'suxing_theme';

export const getStoredTheme = (): 'system' | 'light' | 'dark' => {
  const t = localStorage.getItem(THEME_KEY);
  if (t === 'light' || t === 'dark' || t === 'system') return t;
  return 'system';
};

export const setStoredTheme = (theme: 'system' | 'light' | 'dark') => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getStoredCategories = (): Category[] => {
  const data = localStorage.getItem(CATEGORIES_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Failed to parse categories', e);
    }
  }
  // Default directories mirroring Apple Notes categories
  const defaults: Category[] = [
    { id: 'all', name: '全部清单', isDefault: true, createdAt: Date.now() },
    { id: 'work', name: '工作事项', isDefault: false, createdAt: Date.now() + 1 },
    { id: 'life', name: '生活日常', isDefault: false, createdAt: Date.now() + 2 },
    { id: 'ideas', name: '灵感备忘', isDefault: false, createdAt: Date.now() + 3 },
  ];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaults));
  return defaults;
};

export const saveStoredCategories = (categories: Category[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getStoredItems = (): TodoItem[] => {
  const data = localStorage.getItem(ITEMS_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Filter out any previous sample instruction items
        return parsed.filter(item => !item.id.startsWith('sample-'));
      }
    } catch (e) {
      console.error('Failed to parse items', e);
    }
  }
  // Safe default empty array
  const samples: TodoItem[] = [];
  localStorage.setItem(ITEMS_KEY, JSON.stringify(samples));
  return samples;
};

export const saveStoredItems = (items: TodoItem[]) => {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
};

// Calculate size of local storage data in KB
export const getStorageSizeWithLabel = (): string => {
  try {
    let totalBytes = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        const value = localStorage.getItem(key);
        if (value) {
          totalBytes += (key.length + value.length) * 2; // Roughly 2 bytes per char in UTF-16
        }
      }
    }
    if (totalBytes < 1024) {
      return `${totalBytes} Bytes`;
    } else if (totalBytes < 1024 * 1024) {
      return `${(totalBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  } catch (e) {
    return '0.00 KB';
  }
};

// Export to text/JSON backup
export const exportBackupData = (): { jsonString: string; filename: string } => {
  const backup = {
    version: '1.0',
    timestamp: Date.now(),
    categories: getStoredCategories(),
    items: getStoredItems(),
  };
  const jsonString = JSON.stringify(backup, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `suxing_backup_${dateStr}.json`;
  return { jsonString, filename };
};

// Validate and import data
export interface ImportResult {
  success: boolean;
  message: string;
  categories?: Category[];
  items?: TodoItem[];
}

export const importBackupData = (jsonText: string): ImportResult => {
  try {
    const data = JSON.parse(jsonText);
    
    // Check shape of imported data
    if (!data.categories || !Array.isArray(data.categories)) {
      return { success: false, message: '备份文件格式不正确：缺少分类数据' };
    }
    if (!data.items || !Array.isArray(data.items)) {
      return { success: false, message: '备份文件格式不正确：缺少清单数据' };
    }

    // Basic structural validation
    const categoriesValid = data.categories.every((c: any) => c.id && c.name);
    const itemsValid = data.items.every((i: any) => i.id && typeof i.title === 'string');

    if (!categoriesValid || !itemsValid) {
      return { success: false, message: '备份数据字段验证失败' };
    }

    return {
      success: true,
      message: '备份恢复成功',
      categories: data.categories,
      items: data.items,
    };
  } catch (e) {
    return { success: false, message: '解析 JSON 备份文件失败，请确保文件未损坏' };
  }
};
