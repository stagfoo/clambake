import html from 'nanohtml';

// TODo: Define the State type
export function imageContainer(state: State): HTMLElement {
    if (state.currentImageIndex < state.images.length) {
      return html`
        <div class="w-full h-80 border-2 border-gray-200 rounded-lg mb-6 flex items-center justify-center bg-gray-50">
          <img src="${state.images[state.currentImageIndex]}" 
               alt="Current image" 
               class="max-w-full max-h-full object-contain">
        </div>
      `;
    } else {
      return html`
        <div class="w-full h-80 border-2 border-gray-200 rounded-lg mb-6 flex items-center justify-center bg-gray-50">
          <h2 class="text-xl font-bold text-gray-600">All images sorted!</h2>
        </div>
      `;
    }
  }