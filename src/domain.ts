import mitt from 'mitt';
import { createTodos } from './entities/todo';
import { Store } from './lib/store';
import type { Todo } from './entities/todo';

export interface State {
	todos: Todo[];
	view: string;
  }
  
  const defaultState: State = {
	todos: [],
	view: 'HOME'
  };
  
  
export const store = new Store<State>(defaultState);
export const actions = mitt();

export const todo = createTodos(store);

todo.reducer.wireActions(actions);
todo.module.wireActions(actions);

//Custom App Actions
actions.on('*', async (type, payload: any) => {
	switch (type) {
		case 'load_todos_success':
			todo.reducer.reducers.setAll(payload);
		break;
		case 'load_todos_error':
			alert("Error loading todos");
		break;
	}
});