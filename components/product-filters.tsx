"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    minPrice?: number
    maxPrice?: number
    minPopularity?: number
    maxPopularity?: number
  }) => void
  onReset: () => void
}

export default function ProductFilters({ onFiltersChange, onReset }: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minPopularity, setMinPopularity] = useState("")
  const [maxPopularity, setMaxPopularity] = useState("")

  const handleApplyFilters = () => {
    onFiltersChange({
      minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
      minPopularity: minPopularity ? Number.parseFloat(minPopularity) : undefined,
      maxPopularity: maxPopularity ? Number.parseFloat(maxPopularity) : undefined,
    })
  }

  const handleReset = () => {
    setMinPrice("")
    setMaxPrice("")
    setMinPopularity("")
    setMaxPopularity("")
    onReset()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Filter Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Price Range (USD)</Label>
          <div className="flex gap-2">
            <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Popularity Score (%)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              min="0"
              max="100"
              value={minPopularity}
              onChange={(e) => setMinPopularity(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              min="0"
              max="100"
              value={maxPopularity}
              onChange={(e) => setMaxPopularity(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
