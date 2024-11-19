import './styles.css'
import morph from 'nanomorph';
import { ui } from './view';
import { store, State } from './domain';

// Renderer with type safety
const ROOT_NODE = document.body.querySelector<HTMLElement>('#root');
if (!ROOT_NODE) throw new Error('Root element not found');

export function renderer(newState: State) {
	const morphOptions: MorphOptions = {
		onBeforeElUpdated: (fromEl, toEl) => !fromEl.isEqualNode(toEl),
	};
	morph(ROOT_NODE, ui(newState), morphOptions);
}

// Subscribe renderer to store updates
store.subscribe(renderer);
store.subscribe((state: State) => console.log('📜', state));
//First Render
renderer(store.getState());
