import html from 'nanohtml';
import { ACTIONS } from '../domain';

type listItemProps = {
    event: string;
    img: string;
    text: string;
}

export function listItem(props: listItemProps): HTMLElement {
    return html `
    <div class="flex flex-row items-center grow border-2 rounded p-2" onclick="${() => {
        ACTIONS.emit(props.event, props)
    }}">
    <div class="flex flex-col items-center">
    <div class="avatar">
      <div class="w-12 rounded-full">
        <img src="${props.img}" />
      </div>
      </div>
    </div>
    <div class="ml-4"><span class="text-nowrap">${props.text}</span></div>
    </div>
  `;
}