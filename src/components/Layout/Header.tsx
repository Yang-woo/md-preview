import { memo } from 'react'
import { Settings, HelpCircle, Download, FolderOpen, Clock, Check } from 'lucide-react'

export interface HeaderProps {
  fileName?: string
  isDirty?: boolean
  isSaving?: boolean
  lastSaved?: Date | null
  onOpenClick?: () => void
  onSettingsClick?: () => void
  onHelpClick?: () => void
  onDownloadClick?: () => void
}

export const Header = memo(function Header({
  fileName = 'Untitled',
  isDirty = false,
  isSaving = false,
  lastSaved = null,
  onOpenClick,
  onSettingsClick,
  onHelpClick,
  onDownloadClick,
}: HeaderProps) {
  // 저장 상태 텍스트 생성
  const getSaveStatusText = () => {
    if (isSaving) return '저장 중...'
    if (lastSaved) {
      const now = Date.now()
      const diff = now - lastSaved.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)

      if (seconds < 10) return '방금 저장됨'
      if (seconds < 60) return `${seconds}초 전 저장됨`
      if (minutes < 60) return `${minutes}분 전 저장됨`
      return '저장됨'
    }
    return null
  }

  const saveStatusText = getSaveStatusText()
  return (
    <header
      role="banner"
      className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Markdown Preview
        </div>
      </div>

      {/* File Name & Save Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {fileName}
          </span>
          {isDirty && (
            <span className="text-xs text-amber-600 dark:text-amber-400">
              (unsaved)
            </span>
          )}
        </div>

        {/* Save Status Indicator */}
        {saveStatusText && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            {isSaving ? (
              <Clock size={14} className="animate-pulse" />
            ) : (
              <Check size={14} className="text-green-600 dark:text-green-400" />
            )}
            <span>{saveStatusText}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenClick}
          aria-label="Open File"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <FolderOpen size={20} />
        </button>

        <button
          onClick={onDownloadClick}
          aria-label="Download"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <Download size={20} />
        </button>

        <button
          onClick={onHelpClick}
          aria-label="Help"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <HelpCircle size={20} />
        </button>

        <button
          onClick={onSettingsClick}
          aria-label="Settings"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  )
})
