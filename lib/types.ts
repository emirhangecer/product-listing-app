export interface Product {
  id?: string
  name: string
  popularityScore: number // 0-1 decimal
  weight: number // in grams
  images: {
    yellow: string
    rose: string
    white: string
  }
  price?: number // calculated dynamically
  rating?: number // converted from popularity score
}

export interface GoldPriceResponse {
  price: number
  currency: string
  timestamp: number
}

export interface ProductFilters {
  minPrice?: number
  maxPrice?: number
  minPopularity?: number
  maxPopularity?: number
}

export type ColorOption = "yellow" | "rose" | "white"
