declare module 'obake.js'
declare module 'nanomorph'

//TODO namespace?
type View = 'HOME' | 'SORTER';

// Default events for all apps include io and updateView
type Events = {
	// Default Events
	updateView: View
	// Cap Keyboard Events
	keyboardWillHide: boolean
	keyboardDidHide: boolean
	keyboardWillShow: number
	keyboardDidShow: number
	// App Events
	
};

type State = {
	view: View;
	_update: (_reducerName: string, _data: unknown) => Promise<State>;
	currentImageIndex: number;
	images: string[];
	sortFolders: Record<string, string[]>;
	basePath: string;
};