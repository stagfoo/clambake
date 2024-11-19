import { Emitter } from 'mitt';
import { Store } from './store';

export interface Entity {
  id: string;
}

export class EntityCRUD<T extends Entity, S = any> {
  private store: Store<S>;
  private stateKey: keyof S;

  constructor(store: Store<S>, stateKey: keyof S) {
    this.store = store;
    this.stateKey = stateKey;
  }

  // Exposed reducers object for easy importing
  public reducers = {
    // Create new item
    create: (item: T) => {
      this.store.setState(draft => {
        const items = draft[this.stateKey] as unknown as T[];
        items.push(item);
      });
    },

    // Update item by id
    update: (id: string, updates: Partial<T>) => {
      this.store.setState(draft => {
        const items = draft[this.stateKey] as unknown as T[];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items[index] = { ...items[index], ...updates };
        }
      });
    },

    // Replace all items
    setAll: (items: T[]) => {
      this.store.setState(draft => {
        const state = draft as Record<keyof S, unknown>;
        state[this.stateKey] = items;
      });
    },

    // Delete item by id
    delete: (id: string) => {
      this.store.setState(draft => {
        const items = draft[this.stateKey] as unknown as T[];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items.splice(index, 1);
        }
      });
    }
  };

  // Read method to get items from state
  public getItems(): T[] {
    return this.store.getState()[this.stateKey] as unknown as T[];
  }

  // Auto-wire common actions to reducers
  public wireActions(actions: Emitter<any>) {
    actions.on(`create_${String(this.stateKey)}`, (payload: T) => {
      this.reducers.create(payload);
    });

    actions.on(`update_${String(this.stateKey)}`, (payload: { id: string, updates: Partial<T> }) => {
      this.reducers.update(payload.id, payload.updates);
    });

    actions.on(`delete_${String(this.stateKey)}`, (id: string) => {
      this.reducers.delete(id);
    });

    actions.on(`set_${String(this.stateKey)}`, (items: T[]) => {
      this.reducers.setAll(items);
    });
  }
}