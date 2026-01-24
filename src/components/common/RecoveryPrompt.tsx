import { useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface RecoveryPromptProps {
  isOpen: boolean
  onRestore: () => void
  onDiscard: () => void
}

export function RecoveryPrompt({ isOpen, onRestore, onDiscard }: RecoveryPromptProps) {
  const { t } = useTranslation(['recovery', 'common'])

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
              {t('recovery:title')}
            </h2>
            <p
              id="recovery-prompt-description"
              className="mt-1 text-sm text-gray-600 dark:text-gray-400"
            >
              {t('recovery:description')}
            </p>
          </div>
          <button
            onClick={onDiscard}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
            aria-label={t('common:close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>{t('common:confirm')}:</strong> {t('recovery:notice')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onRestore}
              className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('recovery:restore')}
            </button>
            <button
              onClick={onDiscard}
              className="flex-1 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 font-medium border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t('recovery:discard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
