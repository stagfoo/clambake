import mitt from 'mitt';
import * as todoModule from './modules/todo-handler';
import { store } from './store';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './types'

const reducers = {
	setView: (view: string) => {
		store.setState(draft => {
			draft.view = view;
		});
	},

	setTodos: (todos: Todo[]) => {
		store.setState(draft => {
			draft.todos = todos;
		});
	},

	addTodo: (title: string) => {
		store.setState(draft => {
			draft.todos.push({
				id: uuidv4(),
				title,
				completed: false,
				createdAt: new Date().toISOString()
			});
		});
	},

	toggleTodo: (id: string) => {
		store.setState(draft => {
			const todo = draft.todos.find(t => t.id === id);
			if (todo) {
				todo.completed = !todo.completed;
			}
		});
	}
};

export const ACTIONS = mitt();

ACTIONS.on('*', async (type, payload: any) => {
	switch (type) {
		case 'addTodo':
			if (typeof payload === 'string') {
				reducers.addTodo(payload);
				await todoModule.saveTodos(store.getState().todos);
			}
			break;
		case 'toggleTodo':
			if (typeof payload === 'string') {
				reducers.toggleTodo(payload);
				await todoModule.saveTodos(store.getState().todos);
			}
			break;
		case 'loadTodos':
			const { result } = await todoModule.loadTodos();
			if (result) {
				reducers.setTodos(result);
			}
			break;
		case 'saveTodos':
			await todoModule.saveTodos(store.getState().todos);
			break;
		default:
			console.log('No action found:', type, payload);
	}
});