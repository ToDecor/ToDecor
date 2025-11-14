"use client"

import type React from "react"

import { useState } from "react"
import { ZoomIn } from "lucide-react"

interface ProductImageZoomProps {
  images: string[]
  productName: string
}

export function ProductImageZoom({ images, productName }: ProductImageZoomProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

  const currentImage = images[selectedImage] || "/placeholder.svg"

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed || e.touches.length === 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div
        className="relative bg-muted rounded-xl overflow-hidden cursor-zoom-in group"
        style={{ height: "500px" }}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsZoomed(false)}
      >
        <img
          src={currentImage || "/placeholder.svg"}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-200"
          style={
            isZoomed
              ? {
                  transform: "scale(2)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        />

        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4" />
            <span className="text-sm">Cliquer pour zoomer</span>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative bg-muted rounded-lg overflow-hidden aspect-square transition-all ${
                selectedImage === index ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-75"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
