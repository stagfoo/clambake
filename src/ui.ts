import html from 'nanohtml';
import { ACTIONS } from './domain';
import { State } from './store';

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
        <button onclick=${() => ACTIONS.emit('loadTodos')}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Open DB
        </button>
        <button onclick=${() => ACTIONS.emit('saveTodos')} 
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Save DB
        </button>
      </div>

      <form onsubmit=${(e: Event) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).querySelector('input');
        if (input?.value) {
          ACTIONS.emit('addTodo', input.value);
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
                   onclick=${() => ACTIONS.emit('toggleTodo', todo.id)}>
            <span class="${todo.completed ? 'line-through text-gray-500' : ''}">
              ${todo.title}
            </span>
          </li>
        `)}
      </ul>
    </div>
  `;
}
