import mitt from 'mitt';
import { reducer } from 'obake.js';
import { FolderButtonEvents } from './components';
import morph from 'nanomorph';
import { createStore } from 'obake.js';
import { ui } from './ui';
import * as imageModule from './modules/image-handler';

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
	sortFolders: {
		'Keep': [],
		'Delete': [],
	},
	basePath: 'DCIM',
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
		setBasePath: reducer((state: State, value: string) => {
			state.basePath = value;
		}),
		sortImage: reducer((state: State, folderName: string) => {
			state.sortFolders[folderName].push(state.images[state.currentImageIndex]);
			state.currentImageIndex++;
		}),
		addFolder: reducer((state: State, folderName: string) => {
			state.sortFolders[folderName] = [];
		}),
		addMultipleFolder: reducer((state: State, folderNames: string[]) => {
			state.sortFolders = {}
			folderNames.forEach((folderName) => {
				state.sortFolders[folderName] = [];
			})
		}),
	}
);

// Event Router
ACTIONS.on('*', async (type, e) => {
	switch (type) {
		case 'updateView':
			state._update('currentPage', e);
			if(e === 'SORTER') {
				state.currentImageIndex = 0;
				const { result } = await imageModule.pickFolder();
				if (result) {
					state._update('addFolder', result);
				}
				const folderResult = await imageModule.listFolders(state.basePath)
				if(folderResult.result) {
					state._update('addMultipleFolder', ['Keep', 'Delete', ...folderResult.result.folders]);
				}
			}
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
		case 'openFolderRequestDialog':
			state._update('addMultipleFolder', 
				['Keep', 'Delete', 'Lia', 'Inspo', 'Trees', 'Grass', 'Eyes']
			);
			state._update('currentPage', 'SORTER');
			return;
		default:
			console.log('No action found', type, e);
	}
});


