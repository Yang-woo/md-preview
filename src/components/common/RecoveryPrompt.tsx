import { useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

export interface RecoveryPromptProps {
  isOpen: boolean
  onRestore: () => void
  onDiscard: () => void
}

export function RecoveryPrompt({ isOpen, onRestore, onDiscard }: RecoveryPromptProps) {
  // Escape 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDiscard()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onDiscard])

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recovery-prompt-title"
      aria-describedby="recovery-prompt-description"
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white dark:bg-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h2
              id="recovery-prompt-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              저장되지 않은 내용 발견
            </h2>
            <p
              id="recovery-prompt-description"
              className="mt-1 text-sm text-gray-600 dark:text-gray-400"
            >
              이전 세션의 저장되지 않은 내용이 있습니다. 복구하시겠습니까?
            </p>
          </div>
          <button
            onClick={onDiscard}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>알림:</strong> 브라우저가 갑자기 종료되었거나 페이지를 새로고침한 경우,
              저장되지 않은 작업 내용이 복구될 수 있습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onRestore}
              className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              복구하기
            </button>
            <button
              onClick={onDiscard}
              className="flex-1 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 font-medium border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
