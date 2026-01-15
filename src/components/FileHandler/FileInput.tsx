import { useRef } from 'react'
import { FileText } from 'lucide-react'

export interface FileInputProps {
  onFileSelect: (file: File) => void
  className?: string
}

export function FileInput({ onFileSelect, className = '' }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        onChange={handleChange}
        className="hidden"
        aria-label="File input"
      />
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors ${className}`}
      >
        <FileText size={20} />
        <span>Select File</span>
      </button>
    </>
  )
}
