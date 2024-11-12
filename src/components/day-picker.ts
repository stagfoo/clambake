import html from 'nanohtml';

export function DayPicker(selectedDate = new Date()) {
  // Get current week dates
  function getWeekDates(date: Date) {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay()) // Start from Sunday
    
    const dates = []
    for (let i = 0; i < 7; i++) {
      const current = new Date(start)
      current.setDate(start.getDate() + i)
      dates.push(current)
    }
    return dates
  }

  const weekDates = getWeekDates(selectedDate)
  const today = new Date()

  return html`
    <div class="flex gap-1 p-4 bg-gray-50 rounded-lg">
      ${weekDates.map(date => {
        const isSelected = date.getDate() === selectedDate.getDate()
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
        
        return html`
          <button 
            class="flex flex-col items-center justify-center p-2 rounded-full w-12 h-16
            ${isSelected 
              ? 'bg-black text-white' 
              : 'bg-white hover:bg-gray-100'} 
            transition-colors duration-200"
            onclick=${() => {
              // Handle date selection
              console.log('Selected date:', date.toDateString())
            }}
          >
            <span class="text-xs mb-1">${dayName}</span>
            <span class="text-sm font-semibold">${date.getDate()}</span>
          </button>
        `
      })}
    </div>
  `
}
