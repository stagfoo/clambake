declare module 'obake.js'
declare module 'nanomorph'

//TODO namespace?
type View = 'HOME' | 'SORTER';

// Default events for all apps include io and updateView
type DefaultEvents = {
	updateView: View
};

interface MorphOptions {
	onBeforeElUpdated: (fromEl: HTMLElement, toEl: HTMLElement) => boolean;
}