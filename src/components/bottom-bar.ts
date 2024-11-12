import html from 'nanohtml';

export function BottomBar() {
  // Feather icons SVG paths
  // TODO remove
  const icons = {
    home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z',
    target: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z M12 14c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'
  }

  // Create SVG icon function
  function createIcon(pathD: string, isActive: boolean) {
    return html`
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="${isActive ? 'white' : 'currentColor'}" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="${pathD}"></path>
      </svg>
    `
  }

  let activeTab = 'home'

  // Create nav item function
  function createNavItem(id: string, pathD: string) {
    const isActive = activeTab === id
    return html`
      <button 
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all
          ${isActive 
            ? 'bg-violet-400 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
        onclick=${() => {
          activeTab = id
          // You'd need to implement your own state management/rendering here
          console.log('Selected tab:', id)
        }}
      >
        ${createIcon(pathD, isActive)}
      </button>
    `
  }

  return html`
    <div class="flex gap-2 p-4 bg-white rounded-full shadow-lg">
      ${createNavItem('home', icons.home)}
      ${createNavItem('zap', icons.zap)}
      ${createNavItem('user', icons.user)}
      ${createNavItem('target', icons.target)}
    </div>
  `
}