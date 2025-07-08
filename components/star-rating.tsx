import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
}

export default function StarRating({ rating, maxRating = 5, size = 16 }: StarRatingProps) {
  const stars = []

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= rating
    const partialFill = i > rating && i - 1 < rating ? rating - (i - 1) : 0

    stars.push(
      <div key={i} className="relative">
        <Star size={size} className="text-gray-300" fill="currentColor" />
        {(filled || partialFill > 0) && (
          <Star
            size={size}
            className="absolute top-0 left-0 text-orange-400"
            fill="currentColor"
            style={{
              clipPath: filled ? "none" : `inset(0 ${100 - partialFill * 100}% 0 0)`,
            }}
          />
        )}
      </div>,
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="font-avenir-book ml-1" style={{ fontSize: "14px" }}>
        {rating.toFixed(1)}/5
      </span>
    </div>
  )
}
