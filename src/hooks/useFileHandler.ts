import { useState, useCallback } from 'react'
import { useEditorStore } from '../stores'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSION = '.md'

export function useFileHandler() {
  const { content, fileName, setContent, setFileName } = useEditorStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileRead = useCallback(
    async (file: File) => {
      setError(null)
      setIsLoading(true)

      try {
        // 파일 확장자 확인
        if (!file.name.endsWith(ALLOWED_EXTENSION)) {
          throw new Error(`Only ${ALLOWED_EXTENSION} files are allowed`)
        }

        // 파일 크기 확인
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File size must be less than 5MB`)
        }

        // 파일 읽기
        const text = await file.text()

        setContent(text)
        setFileName(file.name)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to read file'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [setContent, setFileName]
  )

  const handleFileDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || 'untitled.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [content, fileName])

  return {
    isLoading,
    error,
    handleFileRead,
    handleFileDownload,
  }
}
