export default function ImageCard({ emoji }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-3xl p-16 shadow-lg border-4 border-teal-600 flex items-center justify-center">
        <div className="text-9xl select-none">{emoji}</div>
      </div>
    </div>
  )
}
