import { useState, useRef, useEffect, ReactNode } from 'react'

export interface SplitPaneProps {
  left: ReactNode
  right: ReactNode
  initialRatio?: number
  minRatio?: number
  maxRatio?: number
  onRatioChange?: (ratio: number) => void
}

export function SplitPane({
  left,
  right,
  initialRatio = 50,
  minRatio = 20,
  maxRatio = 80,
  onRatioChange,
}: SplitPaneProps) {
  const [ratio, setRatio] = useState(initialRatio)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const newRatio =
        ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Clamp ratio between min and max
      const clampedRatio = Math.max(minRatio, Math.min(maxRatio, newRatio))

      setRatio(clampedRatio)
      onRatioChange?.(clampedRatio)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, minRatio, maxRatio, onRatioChange])

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left Pane */}
      <div
        style={{ width: `${ratio}%` }}
        className="h-full overflow-auto border-r border-gray-200 dark:border-gray-700"
      >
        {left}
      </div>

      {/* Resize Handle */}
      <div
        role="separator"
        aria-valuenow={ratio}
        aria-valuemin={minRatio}
        aria-valuemax={maxRatio}
        onMouseDown={handleMouseDown}
        className={`w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 cursor-col-resize transition-colors ${
          isDragging ? 'bg-blue-500' : ''
        }`}
      />

      {/* Right Pane */}
      <div
        style={{ width: `${100 - ratio}%` }}
        className="h-full overflow-auto"
      >
        {right}
      </div>
    </div>
  )
}
