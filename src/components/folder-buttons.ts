import html from 'nanohtml';
import { actions } from '../domain';

type FolderButtonsProps = {
  sortFolders: Record<string, string[]>;
  currentImageIndex: number;
  images: string[];
}

export type FolderButtonEvents = {
  sortImage: string;
  addFolder: string;
  openFolderRequestDialog: boolean;
}

function folderAction({
  folderName,
  isDisabled,
  buttonClass
}: { folderName: string, isDisabled: boolean, buttonClass: string }) {
  return html`
    <button onclick=${() => eventbus.emit('sortImage', folderName)}
            class="${`px-4 py-2 ${buttonClass} text-white rounded-md transition-colors duration-200 
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}"
            ${isDisabled ? 'disabled' : ''}>
      ${folderName}
    </button>
  `;
}

export function keepButton(isDisabled: boolean): HTMLElement {
  return folderAction({
    folderName: 'Keep',
    isDisabled,
    buttonClass: 'bg-green-500 hover:bg-green-600'
  });
}

export function deleteButton(isDisabled: boolean): HTMLElement {
  return folderAction({
    folderName: 'Delete',
    isDisabled,
    buttonClass: 'bg-red-500 hover:bg-red-600'
  });
}

export function folderButtons(state: FolderButtonsProps): HTMLElement {
  const isDisabled = state.currentImageIndex >= state.images.length;
  const mainButtons = ['Keep', 'Delete'];
  const folders = Object.keys(state.sortFolders).filter((f) => !mainButtons.includes(f)).map(folderName => {
    const colorClass = 'bg-purple-500 hover:bg-purple-600';

    const buttonClass = `px-4 py-2 ${colorClass} text-white rounded-md transition-colors duration-200 
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    return folderAction({ folderName, isDisabled, buttonClass });
  });

  const addButton = html`
      <button onclick=${() => eventbus.emit('addFolder', '')}
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2
                     ${state.currentImageIndex >= state.images.length ? 'opacity-50 cursor-not-allowed' : ''}"
              ${state.currentImageIndex >= state.images.length ? 'disabled' : ''}>
        <span class="text-lg">+</span> Add Folder
      </button>
    `;

  return html`
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">Sort into folders:</h2>
        <div class="flex gap-3 overflow-x-scroll" id="folders">
          ${folders}
        </div>
        <hr>
        ${addButton}
      </div>
    `;
}