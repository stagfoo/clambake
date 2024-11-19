import mitt, { Emitter } from 'mitt';
import { todoReducer, todoModule } from './entities/todo';
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

todoReducer.wireActions(actions);
todoModule.wireActions(actions);

//Custom App Actions
actions.on('*', async (type, payload: any) => {
	switch (type) {
		case 'load_todos_success':
			todoReducer.reducers.setAll(payload);
			break;
		default:
			console.log('No action found:', type, payload);
	}
});