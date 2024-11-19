import { produce } from 'immer';
// Create a store class to manage state
export class Store<T> {
    private state: T;
    private listeners: ((state: T) => void)[];
  
    constructor(initialState: T) {
      this.state = initialState;
      this.listeners = [];
    }
  
    getState(): T {
      return this.state;
    }
  
    setState(recipe: (draft: T) => void): void {
      const newState = produce(this.state, recipe);
      if (newState !== this.state) {
        this.state = newState;
        this.notify();
      }
    }
  
    subscribe(listener: (state: T) => void): () => void {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  
    private notify(): void {
      this.listeners.forEach(listener => listener(this.state));
    }
  }