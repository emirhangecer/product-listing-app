"use client"

import type { ColorOption } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  selectedColor: ColorOption
  onColorChange: (color: ColorOption) => void
  className?: string
}

const colorMap = {
  yellow: "#EECA97",
  white: "#D9D9D9",
  rose: "#E1A4A9",
}

export default function ColorPicker({ selectedColor, onColorChange, className }: ColorPickerProps) {
  const colors: ColorOption[] = ["yellow", "white", "rose"]

  return (
    <div className={cn("flex gap-2", className)}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={cn(
            "w-6 h-6 rounded-full border-2 transition-all duration-200",
            selectedColor === color ? "border-gray-800 scale-110" : "border-gray-300 hover:border-gray-500",
          )}
          style={{ backgroundColor: colorMap[color] }}
          aria-label={`Select ${color} gold`}
        />
      ))}
    </div>
  )
}
