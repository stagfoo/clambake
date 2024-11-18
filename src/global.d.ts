declare module 'obake.js'
declare module 'nanomorph'

interface MorphOptions {
	onBeforeElUpdated: (fromEl: HTMLElement, toEl: HTMLElement) => boolean;
}