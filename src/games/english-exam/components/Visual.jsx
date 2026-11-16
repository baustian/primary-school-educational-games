// Renders the "picture" for a vocabulary item or exam question.
//   { emoji }                    a big emoji
//   { emoji, scale }             emoji drawn bigger / smaller (big vs small)
//   { color }                    a paint blob of that colour
//   { count, emoji }             a group of N emojis to count
//   { car: '#hex' }              a car painted in that colour
//   { pencil: '#hex' }           a coloured pencil
//   { house: { room, person } }  a house with someone in one of the rooms

import { ROOMS } from '../data/exam.js'

const EMOJI_SIZE = { lg: 'text-8xl sm:text-9xl', md: 'text-6xl', sm: 'text-5xl' }
const BOX_SIZE = { lg: 'w-44 h-44 sm:w-52 sm:h-52', md: 'w-28 h-28', sm: 'w-20 h-20' }

export function Car({ color = '#ffffff', className = '' }) {
  return (
    <svg viewBox="0 0 160 90" className={className} role="img" aria-label="car">
      <path
        d="M14 58 L20 40 Q24 32 34 32 L52 32 L66 14 Q70 10 78 10 L112 10 Q120 10 124 16 L136 32 L146 34 Q154 36 154 46 L154 58 Q154 64 148 64 L20 64 Q14 64 14 58 Z"
        fill={color}
        stroke="#334155"
        strokeWidth="3"
        strokeLinejoin="round"
        style={{ transition: 'fill 0.3s' }}
      />
      <path d="M58 32 L70 17 Q72 15 76 15 L94 15 L94 32 Z" fill="#bae6fd" stroke="#334155" strokeWidth="2" />
      <path d="M100 15 L112 15 Q117 15 120 19 L130 32 L100 32 Z" fill="#bae6fd" stroke="#334155" strokeWidth="2" />
      <circle cx="44" cy="66" r="13" fill="#1f2937" />
      <circle cx="44" cy="66" r="5" fill="#9ca3af" />
      <circle cx="124" cy="66" r="13" fill="#1f2937" />
      <circle cx="124" cy="66" r="5" fill="#9ca3af" />
      <rect x="146" y="42" width="8" height="6" rx="2" fill="#fde68a" />
    </svg>
  )
}

export function Pencil({ color = '#f59e0b', className = '' }) {
  return (
    <svg viewBox="0 0 30 140" className={className} role="img" aria-label="pencil">
      <rect x="5" y="4" width="20" height="14" rx="4" fill="#f9a8d4" stroke="#334155" strokeWidth="2" />
      <rect x="5" y="16" width="20" height="8" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
      <rect x="5" y="24" width="20" height="86" fill={color} stroke="#334155" strokeWidth="2" />
      <path d="M5 110 L25 110 L15 134 Z" fill="#fcd9a5" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 124 L19 124 L15 134 Z" fill={color} stroke="#334155" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function House({ room, person, size }) {
  const big = size === 'lg'
  return (
    <div className={`flex flex-col items-center ${big ? 'w-64 sm:w-72' : 'w-40'}`}>
      <svg viewBox="0 0 100 32" className="w-full" aria-hidden="true">
        <polygon points="0,32 50,2 100,32" fill="#ef4444" stroke="#991b1b" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div className="grid grid-cols-2 gap-1 bg-amber-800 p-1 w-[92%] rounded-b-lg">
        {ROOMS.map((r, i) => (
          <div key={r.en} className={`bg-amber-50 rounded flex items-center justify-center gap-1 ${big ? 'h-24' : 'h-14'}`}>
            <span className={big ? 'text-4xl' : 'text-2xl'}>{r.emoji}</span>
            {i === room && <span className={`${big ? 'text-5xl' : 'text-3xl'} animate-bounce`}>{person}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Visual({ v, size = 'lg' }) {
  if (!v) return null

  if (v.house) return <House room={v.house.room} person={v.house.person} size={size} />

  if (v.car) return <Car color={v.car} className={size === 'lg' ? 'w-64 sm:w-72' : 'w-28'} />

  if (v.pencil) return <Pencil color={v.pencil} className={size === 'lg' ? 'h-48' : 'h-28'} />

  if (v.color) {
    return (
      <div
        className={`${BOX_SIZE[size]} rounded-[42%_58%_55%_45%/50%_45%_55%_50%] border-4 border-slate-300 shadow-inner`}
        style={{ backgroundColor: v.color }}
      />
    )
  }

  if (v.count) {
    const cols = v.count <= 3 ? v.count : v.count <= 4 ? 2 : v.count <= 6 ? 3 : 5
    const text = size === 'lg' ? 'text-5xl sm:text-6xl' : 'text-xl'
    return (
      <div className="grid gap-1 justify-items-center" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: v.count }, (_, i) => (
          <span key={i} className={text}>
            {v.emoji}
          </span>
        ))}
      </div>
    )
  }

  if (v.emoji) {
    const scale = v.scale || 1
    return (
      <div className={`${BOX_SIZE[size]} flex items-center justify-center`}>
        <span className={`${EMOJI_SIZE[size]} leading-none inline-block`} style={{ transform: `scale(${scale})` }}>
          {v.emoji}
        </span>
      </div>
    )
  }

  return null
}
