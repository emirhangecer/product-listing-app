import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Using a free gold price API (you can replace with your preferred source)
    const response = await fetch("https://api.metals.live/v1/spot/gold", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      // Fallback to mock price if API fails
      return NextResponse.json({
        price: 65.5, // Mock gold price per gram in USD
        currency: "USD",
        timestamp: Date.now(),
      })
    }

    const raw = await response.json()

    // Handle several possible shapes returned by public APIs
    let pricePerOunce: number | undefined

    if (Array.isArray(raw)) {
      // metals.live returns: [[timestamp, pricePerOunce], …]
      const first = raw[0]
      pricePerOunce = Array.isArray(first) ? Number(first[1]) : Number(first?.price ?? first?.value)
    } else if (typeof raw === "object" && raw !== null) {
      // some APIs return { price: … } or { ounce: … }
      pricePerOunce = Number(raw.price ?? raw.ounce ?? raw.value)
    }

    if (!pricePerOunce || Number.isNaN(pricePerOunce)) {
      throw new Error("Invalid gold-price payload")
    }

    // 1 troy oz = 31.1035 g
    const pricePerGram = pricePerOunce / 31.1035

    return NextResponse.json({
      price: pricePerGram,
      currency: "USD",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error fetching gold price:", error)

    // Return fallback price
    return NextResponse.json({
      price: 65.5, // Mock gold price per gram in USD
      currency: "USD",
      timestamp: Date.now(),
    })
  }
}
