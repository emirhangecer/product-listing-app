"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product, ColorOption } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import StarRating from "./star-rating"
import ColorPicker from "./color-picker"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>("yellow")

  return (
    <div className="bg-white rounded-lg overflow-hidden w-full">
      <div className="relative aspect-square bg-gray-50 mb-4">
        <Image
          src={product.images[selectedColor] || "/placeholder.svg"}
          alt={`${product.name} in ${selectedColor} gold`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="space-y-3 px-3">
        <div>
          {/* Product Title - Montserrat Medium 15 */}
          <h3 className="font-montserrat-medium text-gray-900 mb-1" style={{ fontSize: "15px" }}>
            {product.name}
          </h3>
          {/* Product Price - Montserrat Regular 15 */}
          <p className="font-montserrat-regular text-gray-900" style={{ fontSize: "15px" }}>
            {product.price ? formatPrice(product.price) : "$101.00 USD"}
          </p>
        </div>

        <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />

        {/* Color Text - Avenir Book 12 */}
        <div className="font-avenir-book text-gray-500" style={{ fontSize: "12px" }}>
          {selectedColor === "yellow" && "Yellow Gold"}
          {selectedColor === "white" && "White Gold"}
          {selectedColor === "rose" && "Rose Gold"}
        </div>

        <StarRating rating={product.rating || 0} />
      </div>
    </div>
  )
}
