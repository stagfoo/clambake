import html from 'nanohtml';
import { actions } from './domain';
import { State } from './domain';
import { v4 as uuidv4 } from 'uuid';


export function ui(state: State): HTMLElement {
  return html`
    <div id="app" class="container mx-auto p-4">
      ${todoList(state)}
    </div>
  `;
}

function todoList(state: State): HTMLElement {
  return html`
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-4">Todo List</h1>
      
      <div class="flex gap-2 mb-4">
        <button onclick=${() => actions.emit('load_todos')}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Open DB
        </button>
        <button onclick=${() => actions.emit('save_todos', state.todos)} 
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Save DB
        </button>
      </div>

      <form onsubmit=${(e: Event) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).querySelector('input');
        if (input?.value) {
          actions.emit('create_todos', {
            title: input.value,
            id: uuidv4(),
            completed: false,
            createdAt: new Date().toISOString()
          });
          input.value = '';
        }
      }} class="mb-4">
        <input type="text" 
               placeholder="Add new todo" 
               class="border p-2 rounded w-full"
               required>
      </form>

      <ul class="space-y-2">
        ${state.todos.map(todo => html`
          <li class="flex items-center gap-2 p-2 border rounded">
            <input type="checkbox" 
                   ${todo.completed ? 'checked' : ''}
                   onclick=${() => actions.emit('update_todos', {
                    id: todo.id,
                    updates: {
                      completed: !todo.completed,
                    }
                   })}>
            <span class="${todo.completed ? 'line-through text-gray-500' : ''}">
              ${todo.title}
            </span>
          </li>
        `)}
      </ul>
    </div>
  `;
}
