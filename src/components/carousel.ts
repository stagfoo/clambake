import html from 'nanohtml';
import { ACTIONS } from '../domain';

type CarouselProps = {
    items: {
        img: string;
        event: string;
    }[];
}

export function carousel(props: CarouselProps): HTMLElement {
    return html`
    <div class="flex max-w-4xl flex-wrap">
      <div class="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
        ${props.items.map(item => html`
          <div class="carousel-item">
            <img
              onclick="${() => ACTIONS.emit(item.event as keyof Events, item as any)}"
              src="${item.img}"
              class="rounded-box" />
          </div>
        `)}
      </div>
    </div>
  `;
}

type CarouselWithButtonProps = {
  items: any[];
}

export function carouselButtons(props: CarouselWithButtonProps): HTMLElement {
  return html`
  <div class="flex max-w-4xl flex-wrap">
    <div class="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
      ${props.items.map(item => html`
        <div class="carousel-item">
          ${item}
        </div>
      `)}
    </div>
  </div>
`;
}
