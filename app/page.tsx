"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"
import ProductCard from "@/components/product-card"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isScrollbarDragging, setIsScrollbarDragging] = useState(false)
  const [scrollbarStartX, setScrollbarStartX] = useState(0)

  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const scrollThumbRef = useRef<HTMLDivElement>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.products)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Check scroll position to enable/disable arrows
  const checkScrollPosition = useCallback(() => {
    if (!carouselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  // Get current scroll progress (0-1)
  const getScrollProgress = useCallback(() => {
    if (!carouselRef.current) return 0
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    const maxScroll = scrollWidth - clientWidth
    return maxScroll > 0 ? scrollLeft / maxScroll : 0
  }, [])

  // Get scrollbar thumb size based on content ratio
  const getThumbSize = useCallback(() => {
    if (!carouselRef.current || !scrollbarRef.current) return 40
    const { scrollWidth, clientWidth } = carouselRef.current
    const trackWidth = scrollbarRef.current.clientWidth
    const ratio = clientWidth / scrollWidth
    // Make thumb smaller: minimum 40px, maximum 80px
    return Math.max(40, Math.min(80, trackWidth * ratio * 0.6)) // 0.6 factor makes it smaller
  }, [])

  // Scroll handlers
  const scrollToDirection = useCallback((direction: "left" | "right") => {
    if (!carouselRef.current) return

    const scrollAmount = carouselRef.current.clientWidth * 0.8
    const targetScroll =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount

    carouselRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    })
  }, [])

  const goToPrevious = useCallback(() => {
    scrollToDirection("left")
  }, [scrollToDirection])

  const goToNext = useCallback(() => {
    scrollToDirection("right")
  }, [scrollToDirection])

  // Mouse drag handlers for carousel
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!carouselRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)

    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !carouselRef.current) return

      e.preventDefault()
      const x = e.pageX - carouselRef.current.offsetLeft
      const walk = (x - startX) * 1.5
      carouselRef.current.scrollLeft = scrollLeft - walk
    },
    [isDragging, startX, scrollLeft],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    checkScrollPosition()
  }, [checkScrollPosition])

  // Touch drag handlers for carousel
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselRef.current) return

    setIsDragging(true)
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !carouselRef.current) return

      const x = e.touches[0].pageX - carouselRef.current.offsetLeft
      const walk = (x - startX) * 1.5
      carouselRef.current.scrollLeft = scrollLeft - walk
    },
    [isDragging, startX, scrollLeft],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    checkScrollPosition()
  }, [checkScrollPosition])

  // Scrollbar thumb drag handlers
  const handleScrollThumbMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollThumbRef.current || !carouselRef.current) return

    setIsScrollbarDragging(true)
    setScrollbarStartX(e.clientX)
    setScrollLeft(carouselRef.current.scrollLeft)

    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleScrollThumbMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isScrollbarDragging || !scrollbarRef.current || !carouselRef.current) return

      const deltaX = e.clientX - scrollbarStartX
      const trackWidth = scrollbarRef.current.clientWidth
      const thumbWidth = getThumbSize()
      const availableTrackSpace = trackWidth - thumbWidth

      const { scrollWidth, clientWidth } = carouselRef.current
      const maxScroll = scrollWidth - clientWidth

      // Calculate scroll ratio based on thumb movement within available space
      const thumbMovementRatio = deltaX / availableTrackSpace
      const newScrollLeft = scrollLeft + thumbMovementRatio * maxScroll

      // Use smooth scrolling for continuous movement
      const clampedScrollLeft = Math.max(0, Math.min(maxScroll, newScrollLeft))

      // Apply smooth transition during drag
      if (carouselRef.current.style.scrollBehavior !== "auto") {
        carouselRef.current.style.scrollBehavior = "auto"
      }

      carouselRef.current.scrollLeft = clampedScrollLeft
    },
    [isScrollbarDragging, scrollbarStartX, scrollLeft, getThumbSize],
  )

  const handleScrollThumbMouseUp = useCallback(() => {
    setIsScrollbarDragging(false)
  }, [])

  // Touch handlers for scrollbar thumb
  const handleScrollThumbTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollThumbRef.current || !carouselRef.current) return

    setIsScrollbarDragging(true)
    setScrollbarStartX(e.touches[0].clientX)
    setScrollLeft(carouselRef.current.scrollLeft)

    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleScrollThumbTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isScrollbarDragging || !scrollbarRef.current || !carouselRef.current) return

      const deltaX = e.touches[0].clientX - scrollbarStartX
      const trackWidth = scrollbarRef.current.clientWidth
      const thumbWidth = getThumbSize()
      const availableTrackSpace = trackWidth - thumbWidth

      const { scrollWidth, clientWidth } = carouselRef.current
      const maxScroll = scrollWidth - clientWidth

      const thumbMovementRatio = deltaX / availableTrackSpace
      const newScrollLeft = scrollLeft + thumbMovementRatio * maxScroll

      const clampedScrollLeft = Math.max(0, Math.min(maxScroll, newScrollLeft))

      // Apply smooth transition during drag
      if (carouselRef.current.style.scrollBehavior !== "auto") {
        carouselRef.current.style.scrollBehavior = "auto"
      }

      carouselRef.current.scrollLeft = clampedScrollLeft

      e.preventDefault()
    },
    [isScrollbarDragging, scrollbarStartX, scrollLeft, getThumbSize],
  )

  const handleScrollThumbTouchEnd = useCallback(() => {
    setIsScrollbarDragging(false)
  }, [])

  // Click on track to slide to position smoothly
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (!scrollbarRef.current || !carouselRef.current) return
      if (isScrollbarDragging) return

      const rect = scrollbarRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const progress = Math.max(0, Math.min(1, clickX / rect.width))

      const { scrollWidth, clientWidth } = carouselRef.current
      const maxScroll = scrollWidth - clientWidth
      const targetScroll = progress * maxScroll

      // Use smooth scrolling instead of instant jump
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    },
    [isScrollbarDragging],
  )

  // Global mouse/touch event listeners for scrollbar dragging
  useEffect(() => {
    if (isScrollbarDragging) {
      document.addEventListener("mousemove", handleScrollThumbMouseMove)
      document.addEventListener("mouseup", handleScrollThumbMouseUp)
      document.addEventListener("touchmove", handleScrollThumbTouchMove, { passive: false })
      document.addEventListener("touchend", handleScrollThumbTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleScrollThumbMouseMove)
      document.removeEventListener("mouseup", handleScrollThumbMouseUp)
      document.removeEventListener("touchmove", handleScrollThumbTouchMove)
      document.removeEventListener("touchend", handleScrollThumbTouchEnd)
    }
  }, [
    isScrollbarDragging,
    handleScrollThumbMouseMove,
    handleScrollThumbMouseUp,
    handleScrollThumbTouchMove,
    handleScrollThumbTouchEnd,
  ])

  // Handle scroll events to update arrow states
  const handleScroll = useCallback(() => {
    checkScrollPosition()
  }, [checkScrollPosition])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrevious, goToNext])

  // Check initial scroll position
  useEffect(() => {
    checkScrollPosition()
  }, [products, checkScrollPosition])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={fetchProducts} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const scrollProgress = getScrollProgress()
  const thumbSize = getThumbSize()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900">Product List</h1>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-6 py-12">
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors -ml-6"
            aria-label="Previous products"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors -mr-6"
            aria-label="Next products"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className={`
              flex gap-10 overflow-x-auto scrollbar-hide px-12 
              ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}
            `}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onScroll={handleScroll}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-72">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Scrollbar */}
        <div className="mt-12">
          <div
            ref={scrollbarRef}
            className="relative w-full bg-gray-200 rounded h-4 cursor-pointer"
            onClick={handleTrackClick}
          >
            {/* Scrollbar Thumb */}
            <div
              ref={scrollThumbRef}
              className={`
                absolute top-0 h-4 bg-gray-500 rounded transition-all duration-150 ease-out
                ${isScrollbarDragging ? "cursor-grabbing bg-gray-600" : "cursor-grab hover:bg-gray-600"}
              `}
              style={{
                left: `${scrollProgress * (100 - (thumbSize / (scrollbarRef.current?.clientWidth || 1)) * 100)}%`,
                width: `${thumbSize}px`,
              }}
              onMouseDown={handleScrollThumbMouseDown}
              onTouchStart={handleScrollThumbTouchStart}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
