import { memo } from 'react'
import { Settings, HelpCircle, Download, FolderOpen } from 'lucide-react'

export interface HeaderProps {
  fileName?: string
  isDirty?: boolean
  onOpenClick?: () => void
  onSettingsClick?: () => void
  onHelpClick?: () => void
  onDownloadClick?: () => void
}

export const Header = memo(function Header({
  fileName = 'Untitled',
  isDirty = false,
  onOpenClick,
  onSettingsClick,
  onHelpClick,
  onDownloadClick,
}: HeaderProps) {
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

      {/* File Name */}
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
