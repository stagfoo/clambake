import { State, store } from '../domain';
import { EntityCRUD } from '../lib/entity-reducer';
import { YAMLStore } from '../lib/yaml-store';


export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
  } 

const normalizers = {
    save: (todos: Todo[]) => todos,
    load: (todos: Todo[]) => todos
}

export const todoReducer = new EntityCRUD<Todo, State>(store, 'todos');
export const todoModule = new YAMLStore<Todo>({
  dbPath: 'todos.yaml',
  saveNormalizer: normalizers.save,
  loadNormalizer: normalizers.load
});