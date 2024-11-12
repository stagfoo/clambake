import html from 'nanohtml';
// TODO - rename UI to something more descriptive
import * as UI from './components';

export function ui(state: State): HTMLElement {
  return html`
    <div id="app" style="width:  375px; margin: 0 auto">
      <div class="flex justify-center flex-col">${routing(state)}</div>
    </div>
  `;
}

export function routing(state: State): HTMLElement {

  switch (state.view) {
    case 'HOME':
      return html`
      <div class="bg-gray-100 min-h-screen p-8">
        <div class="max-w-2xl mx-auto space-y-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Image Sorter</h1>
            ${UI.imageContainer(state)}
            ${UI.folderButtons({
              sortedImages: state.sortedImages,
              currentImageIndex: state.currentImageIndex,
              images: state.images,
          })}
          </div>
          <div class="mt-4">
          ${UI.progressIndicator(state)}
        </div>
      </div>
  `;
    case 'EXAMPLE_PAGE':
      return html`<h1>Example page</h1>`;
    default:
      return html`<h1>404 CHUM</h1>`;
  }
}
