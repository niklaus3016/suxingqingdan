export interface TodoItem {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  categoryId: string;
  createdAt: number;
  updatedAt: number;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: number;
}

export type SortType = 'newest' | 'uncompleted_first' | 'custom';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface HistoryState {
  items: TodoItem[];
  categories: Category[];
}
