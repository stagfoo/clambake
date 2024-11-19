import { State } from '../domain';
import { EntityCRUD } from '../lib/entity-reducer';
import { Store } from '../lib/store';
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
export const createTodos = (store: Store<State>) => ({
    crud: new EntityCRUD<Todo, State>(store, 'todos'),
    yamlDB: new YAMLStore<Todo>({
        entityName: 'todos',
        dbPath: 'todos.yaml',
        saveNormalizer: normalizers.save,
        loadNormalizer: normalizers.load
    })
})