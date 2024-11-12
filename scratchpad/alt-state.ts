import mitt, { Emitter } from 'mitt';
import { produce, Draft } from 'immer';

// Types and Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export interface AppState {
  users: User[];
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export type Reducer<T = any> = (draft: Draft<AppState>, payload: T) => void;

export interface Action<T = any> {
  type: string;
  payload: T;
  reducer?: Reducer<T>;
}

export interface Store {
  getState: () => AppState;
  addReducer: <T>(actionType: string, reducer: Reducer<T>) => void;
  removeReducer: (actionType: string) => void;
  subscribe: (callback: (state: AppState) => void) => () => void;
  subscribeToAction: <T>(actionType: string, callback: (payload: T) => void) => void;
  dispatch: <T>(action: Action<T>) => void;
}

// Event Types
const EventTypes = {
  STATE_CHANGE: 'state_change',
  ACTION_DISPATCHED: 'action_dispatched'
} as const;

type Events = {
  [EventTypes.STATE_CHANGE]: AppState;
  [EventTypes.ACTION_DISPATCHED]: Action;
};

// Initial state
const initialState: AppState = {
  users: [],
  posts: [],
  loading: false,
  error: null
};

// Store factory
function createStore(initialReducers: Record<string, Reducer> = {}): Store {
  // Current state
  let state: AppState = initialState;
  
  // Event emitter with typed events
  const emitter: Emitter<Events> = mitt<Events>();
  
  // Reducers map
  const reducers = new Map<string, Reducer>();

  // Register initial reducers
  Object.entries(initialReducers).forEach(([actionType, reducer]) => {
    reducers.set(actionType, reducer);
  });

  const store: Store = {
    getState() {
      return state;
    },

    addReducer<T>(actionType: string, reducer: Reducer<T>) {
      reducers.set(actionType, reducer as Reducer);
    },

    removeReducer(actionType: string) {
      reducers.delete(actionType);
    },

    subscribe(callback: (state: AppState) => void) {
      emitter.on(EventTypes.STATE_CHANGE, callback);
      return () => emitter.off(EventTypes.STATE_CHANGE, callback);
    },

    subscribeToAction<T>(actionType: string, callback: (payload: T) => void) {
      emitter.on(EventTypes.ACTION_DISPATCHED, (action: Action) => {
        if (action.type === actionType) {
          callback(action.payload as T);
        }
      });
    },

    dispatch<T>(action: Action<T>) {
      // Notify about action
      emitter.emit(EventTypes.ACTION_DISPATCHED, action);
      
      // Update state immutably using Immer
      state = produce(state, draft => {
        // Check if we have a registered reducer for this action
        const reducer = reducers.get(action.type);
        if (reducer) {
          reducer(draft, action.payload);
        } else if (action.reducer) {
          // Support one-off reducer functions
          action.reducer(draft, action.payload);
        }
      });

      // Notify subscribers about state change
      emitter.emit(EventTypes.STATE_CHANGE, state);
    }
  };

  return store;
}

// Default reducers with typed payloads
const defaultReducers: Record<string, Reducer> = {
  SET_USERS: (draft: Draft<AppState>, payload: User[]) => {
    draft.users = payload;
  },
  ADD_USER: (draft: Draft<AppState>, payload: User) => {
    draft.users.push(payload);
  },
  UPDATE_USER: (draft: Draft<AppState>, payload: User) => {
    const userIndex = draft.users.findIndex(u => u.id === payload.id);
    if (userIndex !== -1) {
      draft.users[userIndex] = payload;
    }
  },
  SET_LOADING: (draft: Draft<AppState>, payload: boolean) => {
    draft.loading = payload;
  },
  SET_ERROR: (draft: Draft<AppState>, payload: string | null) => {
    draft.error = payload;
  }
};

// Helper function to create typed action creators
export function createAction<T>(type: string, payload: T): Action<T> {
  return { type, payload };
}

// Store initialization
export function initializeStore(customReducers: Record<string, Reducer> = {}): Store {
  const store = createStore({
    ...defaultReducers,
    ...customReducers
  });

  // Subscribe to all state changes
  store.subscribe((newState) => {
    console.log('State updated:', newState);
  });

  return store;
}

export default createStore;