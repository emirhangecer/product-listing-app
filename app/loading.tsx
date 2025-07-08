import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Premium Collection</h2>
        <p className="text-gray-600">Fetching the latest gold prices and products...</p>
      </div>
    </div>
  )
}
