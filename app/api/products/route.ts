import { type NextRequest, NextResponse } from "next/server"
import productsData from "@/data/products.json"
import type { Product } from "@/lib/types"
import { calculatePrice, convertPopularityToRating, filterProducts } from "@/lib/utils"

async function getGoldPrice(req: NextRequest): Promise<number> {
  const goldUrl = new URL("/api/gold-price", req.url)
  const res = await fetch(goldUrl.toString())
  if (!res.ok) throw new Error("gold-price fetch failed")
  const json = await res.json()
  return json?.price ?? 65.5
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get filter parameters
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const minPopularity = searchParams.get("minPopularity")
      ? Number.parseFloat(searchParams.get("minPopularity")!)
      : undefined
    const maxPopularity = searchParams.get("maxPopularity")
      ? Number.parseFloat(searchParams.get("maxPopularity")!)
      : undefined

    // Get current gold price
    const goldPrice = await getGoldPrice(request)

    // Process products with calculated prices and ratings
    const processedProducts: Product[] = productsData.map((product, index) => ({
      ...product,
      id: `product-${index + 1}`,
      price: calculatePrice(product.popularityScore, product.weight, goldPrice),
      rating: convertPopularityToRating(product.popularityScore),
    }))

    // Apply filters if provided
    const filteredProducts = filterProducts(processedProducts, {
      minPrice,
      maxPrice,
      minPopularity,
      maxPopularity,
    })

    return NextResponse.json({
      products: filteredProducts,
      goldPrice,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
