import mitt from 'mitt';
import * as imageModule from './modules/image-handler';
import { store, DEFAULT_FOLDERS } from './store';
// Action Creators
const reducers = {
	setView: (view: View) => {
		store.setState(draft => {
			draft.view = view;
		});
	},

	setBasePath: (path: string) => {
		store.setState(draft => {
			draft.basePath = path;
		});
	},

	sortImage: (folderName: string) => {
		store.setState(draft => {
			if (draft.currentImageIndex >= draft.images.length) return;

			draft.sortFolders[folderName] ??= [];
			draft.sortFolders[folderName].push(draft.images[draft.currentImageIndex]);
			draft.currentImageIndex++;
		});
	},

	addFolder: (folderName: string) => {
		store.setState(draft => {
			if (!folderName || folderName in draft.sortFolders) return;
			draft.sortFolders[folderName] = [];
		});
	},

	addMultipleFolders: (folderNames: string[]) => {
		store.setState(draft => {
			draft.sortFolders = Object.fromEntries(folderNames.map(folder => [folder, []]));
		});
	},

	resetImageIndex: () => {
		store.setState(draft => {
			draft.currentImageIndex = 0;
		});
	}
};

// Event handlers
export async function updateView(view: View) {
	reducers.setView(view);
}

export function sortImage(folderName: string) {
	const { currentImageIndex, images } = store.getState();
	if (currentImageIndex < images.length) {
		reducers.sortImage(folderName);
	}
}

export function addFolder() {
	const folderName = prompt('Enter new folder name:');
	if (folderName?.trim()) {
		reducers.addFolder(folderName);
	}
}

export async function openFolderRequestDialog() {
	reducers.resetImageIndex();
	console.log('clicked')
	try {
		const { result: newFolder } = await imageModule.pickFolder();
		console.log('newFolder', newFolder)
		if (newFolder) {
			reducers.setBasePath(newFolder);
		} else {
			throw new Error('No folder selected');
		}

		const { result: folderList } = await imageModule.listFolders(store.getState().basePath);
		if (folderList?.folders) {
			reducers.addMultipleFolders([...DEFAULT_FOLDERS, ...folderList.folders]);
		}
	} catch (error) {
		console.error('Error updating folders:', error);
	}
	reducers.setView('SORTER');
}

export const ACTIONS = mitt();

ACTIONS.on('*', (type, payload: any) => {
	switch (type) {
		case 'openFolderRequestDialog':
			openFolderRequestDialog();
			break;
		case 'sortImage':
			if (typeof payload === 'string') {
				sortImage(payload);
			}
			break;
		case 'addFolder':
			addFolder();
			break;
		case 'updateView':
			updateView(payload);
			break;
		default:
			console.log('No action found:', type, payload);
	}
});