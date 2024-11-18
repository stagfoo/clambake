import { loadDB, saveDB } from './db-yaml';
import type { Todo } from '../types';

export async function loadTodos(): Promise<{ result?: Todo[], error?: any }> {
  return loadDB();
}

export async function saveTodos(todos: Todo[]): Promise<{ result?: boolean, error?: any }> {
  return saveDB(todos);
} 