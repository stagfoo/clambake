import html from 'nanohtml';
// TODO - rename UI to something more descriptive
import * as UI from './components';
import { ACTIONS } from './domain';

export function ui(state: State): HTMLElement {
  return html`
    <div id="app" style="width:  375px; margin: 0 auto">
      <div class="flex justify-center flex-col">${routing(state)}</div>
    </div>
  `;
}

export function routing(state: State): HTMLElement {
  switch (state.view) {
    case 'SORTER':
      return html`
      <div class="bg-gray-100 min-h-screen p-8">
        <div class="max-w-2xl mx-auto space-y-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Image Sorter</h1>
            <div class="flex flex-wrap gap-3" id="folders">
              ${UI.keepButton(false)}
              ${UI.deleteButton(false)}
            </div>
            ${UI.imageContainer(state)}
            ${UI.folderButtons({
              sortFolders: state.sortFolders,
              currentImageIndex: state.currentImageIndex,
              images: state.images,
          })}
          </div>
          <div class="mt-4">
          ${UI.progressIndicator(state)}
        </div>
      </div>
  `;
    case 'HOME':
      return html`
      <div class="flex justify-center flex-col gap-3">
        <img src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp" alt="logo" class="mx-auto mt-8" />
      <button class="btn btn-primary" onclick=${() => ACTIONS.emit('openFolderRequestDialog', true)}>
        Open Folder
      </button/>
      </div>
        </div>
      `;
    default:
      return html`<h1>404 CHUM</h1>`;
  }
}
