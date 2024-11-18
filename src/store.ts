import { produce } from 'immer';
import type { Todo } from './types';

export interface State {
  todos: Todo[];
  view: string;
}

const defaultState: State = {
  todos: [],
  view: 'HOME'
};

// Create a store class to manage state
export class Store {
    private state: State;
    private listeners: ((state: State) => void)[];
  
    constructor(initialState: State) {
      this.state = initialState;
      this.listeners = [];
    }
  
    getState(): State {
      return this.state;
    }
  
    setState(recipe: (draft: State) => void): void {
      const newState = produce(this.state, recipe);
      if (newState !== this.state) {
        this.state = newState;
        this.notify();
      }
    }
  
    subscribe(listener: (state: State) => void): () => void {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  
    private notify(): void {
      this.listeners.forEach(listener => listener(this.state));
    }
  }

export const store = new Store(defaultState);