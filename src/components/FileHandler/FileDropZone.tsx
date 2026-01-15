import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'

export interface FileDropZoneProps {
  onFileDrop: (file: File) => void
  className?: string
}

export function FileDropZone({ onFileDrop, className = '' }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const mdFile = files.find((file) => file.name.endsWith('.md'))

      if (mdFile) {
        onFileDrop(mdFile)
      }
    },
    [onFileDrop]
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      } ${className}`}
    >
      <Upload
        size={48}
        className={`mx-auto mb-4 ${
          isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
        }`}
      />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Drag and drop a <span className="font-mono font-semibold">.md</span> file here
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
        or click below to select a file
      </p>
    </div>
  )
}
