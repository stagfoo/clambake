import { produce } from 'immer';

type View = 'HOME' | 'SORTER';

export interface State {
  currentImageIndex: number;
  images: string[];
  sortFolders: Record<string, string[]>;
  basePath: string;
  view: View;
}

// Constants
export const DEFAULT_FOLDERS = ['Keep', 'Delete'] as const;

// Initial State
const defaultState: State = {
  currentImageIndex: 0,
  images: [
    "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
    "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
  ],
  sortFolders: Object.fromEntries(DEFAULT_FOLDERS.map(folder => [folder, []])),
  basePath: 'DCIM',
  view: 'HOME',
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