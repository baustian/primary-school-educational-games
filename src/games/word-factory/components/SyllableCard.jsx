export default function SyllableCard({ syllable, onDragStart, onClick, isSelected }) {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('syllable', syllable)
    onDragStart(syllable)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(syllable)}
      className={`
        cursor-pointer select-none
        bg-yellow-400 border-4 border-yellow-600
        rounded-2xl
        px-6 py-4
        text-center font-bold text-2xl
        font-nunito
        min-w-24 min-h-24
        flex items-center justify-center
        shadow-md hover:shadow-lg
        transition-all duration-150
        ${isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'}
      `}
    >
      {syllable}
    </div>
  )
}
