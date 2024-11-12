import mitt from 'mitt';
import { reducer } from 'obake.js';
import { FolderButtonEvents } from './components';
import morph from 'nanomorph';
import { createStore } from 'obake.js';
import { ui } from './ui';

type AppEvents = Events & FolderButtonEvents;

export const ACTIONS = mitt<AppEvents>();

// Renderer
const ROOT_NODE = document.body.querySelector('#root');
export function renderer(newState: State) {
	morph(ROOT_NODE, ui(newState), {
		onBeforeElUpdated: (fromEl: HTMLElement, toEl: HTMLElement) => !fromEl.isEqualNode(toEl),
	});
}

export const defaultState: Omit<State, '_update'> = {
	currentImageIndex: 0,
	images: [
		"https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
		"https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
	],
	sortedImages: {
		'Keep': [],
		'Delete': []
	},
	view: 'HOME',
};

// Store Setup
export const state: State = createStore(
	defaultState,
	{ renderer,  log: (a: State) => console.log('📜', a) },
	{
		currentPage: reducer((state: State, value: View) => {
			state.view = value;
		}),
		sortImage: reducer((state: State, folderName: string) => {
			state.sortedImages[folderName].push(state.images[state.currentImageIndex]);
			state.currentImageIndex++;
		}),
		addFolder: reducer((state: State, folderName: string) => {
			state.sortedImages[folderName] = [];
		}),
	}
);

// Event Router
ACTIONS.on('*', (type, e) => {
	switch (type) {
		case 'updateView':
			state._update('currentPage', e);
			return;
		case 'sortImage':
			if (state.currentImageIndex < state.images.length) {
				state._update('sortImage', e);
			}
			return;
		case 'addFolder':
			const folderName = prompt('Enter new folder name:');
			if (folderName && folderName.trim()) {
				state._update('addFolder', folderName);
			}
			return;
		default:
			console.log('No action found', type, e);
	}
});


