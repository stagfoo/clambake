import html from 'nanohtml';

export function spriteIcon(spriteUrl: any, iconIndex: number, spriteWidth: number, _spriteHeight: any, iconWidth: number, iconHeight: number, _rows = 1) {
    // Calculate position in sprite sheet
    const iconsPerRow = Math.floor(spriteWidth / iconWidth)
    const row = Math.floor(iconIndex / iconsPerRow)
    const col = iconIndex % iconsPerRow
    
    // Calculate offset positions
    const xOffset = -1 * col * iconWidth
    const yOffset = -1 * row * iconHeight
  
    return html`
      <div style="
        width: ${iconWidth}px;
        height: ${iconHeight}px;
        background-image: url(${spriteUrl});
        background-position: ${xOffset}px ${yOffset}px;
        background-repeat: no-repeat;
        display: inline-block;
      "></div>
    `
}