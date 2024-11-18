import html from 'nanohtml';

interface ImageContainerProps {
  currentImageIndex: number;
  images: string[];
}

export function imageContainer(props: ImageContainerProps): HTMLElement {
    if (props.currentImageIndex < props.images.length) {
      return html`
        <div class="w-full h-80 border-2 border-gray-200 rounded-lg mb-6 flex items-center justify-center bg-gray-50">
          <img src="${props.images[props.currentImageIndex]}" 
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