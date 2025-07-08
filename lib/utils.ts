import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePrice(popularityScore: number, weight: number, goldPrice: number): number {
  return (popularityScore + 1) * weight * goldPrice
}

export function convertPopularityToRating(popularityScore: number): number {
  // Convert 0-1 popularity score to 0-5 rating with 1 decimal place
  return Math.round(popularityScore * 5 * 10) / 10
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function filterProducts(
  products: Product[],
  filters: {
    minPrice?: number
    maxPrice?: number
    minPopularity?: number
    maxPopularity?: number
  },
): Product[] {
  return products.filter((product) => {
    if (filters.minPrice && product.price && product.price < filters.minPrice) return false
    if (filters.maxPrice && product.price && product.price > filters.maxPrice) return false
    if (filters.minPopularity && product.popularityScore < filters.minPopularity) return false
    if (filters.maxPopularity && product.popularityScore > filters.maxPopularity) return false
    return true
  })
}
