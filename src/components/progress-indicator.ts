import html from 'nanohtml';

type ProgressIndicatorProps = {
    currentImageIndex: number;
    images: string[];
}

export function progressIndicator(props: ProgressIndicatorProps): HTMLElement {
    return html`
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center text-sm text-gray-600">
          <span>Progress:</span>
          <span id="progress">${props.currentImageIndex}/${props.images.length} images sorted</span>
        </div>
      </div>
    `;
  }