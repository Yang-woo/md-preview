import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Code,
  FileCode,
  List,
  ListOrdered,
  CheckSquare,
} from 'lucide-react'

export type MarkdownCommand =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'link'
  | 'image'
  | 'inlineCode'
  | 'codeBlock'
  | 'bulletList'
  | 'numberedList'
  | 'taskList'

export interface ToolbarProps {
  onCommand: (command: MarkdownCommand) => void
  className?: string
}

interface ToolbarButton {
  command: MarkdownCommand
  icon: React.ReactNode
  labelKey: string
  tooltipKey: string
  hasShortcut?: boolean
}

const toolbarButtonConfigs: ToolbarButton[] = [
  { command: 'bold', icon: <Bold size={18} />, labelKey: 'bold.label', tooltipKey: 'bold.tooltip', hasShortcut: true },
  { command: 'italic', icon: <Italic size={18} />, labelKey: 'italic.label', tooltipKey: 'italic.tooltip', hasShortcut: true },
  { command: 'strikethrough', icon: <Strikethrough size={18} />, labelKey: 'strikethrough.label', tooltipKey: 'strikethrough.tooltip' },
  { command: 'heading1', icon: <Heading1 size={18} />, labelKey: 'heading1.label', tooltipKey: 'heading1.tooltip' },
  { command: 'heading2', icon: <Heading2 size={18} />, labelKey: 'heading2.label', tooltipKey: 'heading2.tooltip' },
  { command: 'heading3', icon: <Heading3 size={18} />, labelKey: 'heading3.label', tooltipKey: 'heading3.tooltip' },
  { command: 'link', icon: <Link size={18} />, labelKey: 'link.label', tooltipKey: 'link.tooltip', hasShortcut: true },
  { command: 'image', icon: <Image size={18} />, labelKey: 'image.label', tooltipKey: 'image.tooltip' },
  { command: 'inlineCode', icon: <Code size={18} />, labelKey: 'inlineCode.label', tooltipKey: 'inlineCode.tooltip' },
  { command: 'codeBlock', icon: <FileCode size={18} />, labelKey: 'codeBlock.label', tooltipKey: 'codeBlock.tooltip' },
  { command: 'bulletList', icon: <List size={18} />, labelKey: 'bulletList.label', tooltipKey: 'bulletList.tooltip' },
  { command: 'numberedList', icon: <ListOrdered size={18} />, labelKey: 'numberedList.label', tooltipKey: 'numberedList.tooltip' },
  { command: 'taskList', icon: <CheckSquare size={18} />, labelKey: 'taskList.label', tooltipKey: 'taskList.tooltip' },
]

export function Toolbar({ onCommand, className = '' }: ToolbarProps) {
  const { t } = useTranslation('toolbar')

  const isMac = useMemo(() =>
    typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent),
    []
  )
  const modKey = isMac ? 'Cmd' : 'Ctrl'

  const getShortcut = (command: MarkdownCommand): string | undefined => {
    switch (command) {
      case 'bold': return `${modKey}+B`
      case 'italic': return `${modKey}+I`
      case 'link': return `${modKey}+K`
      default: return undefined
    }
  }

  return (
    <div
      className={`flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      role="toolbar"
      aria-label={t('ariaLabel')}
    >
      {toolbarButtonConfigs.map((button) => {
        const shortcut = getShortcut(button.command)
        const tooltip = button.hasShortcut && shortcut
          ? t(button.tooltipKey, { shortcut })
          : t(button.tooltipKey)

        return (
          <button
            key={button.command}
            onClick={() => onCommand(button.command)}
            aria-label={t(button.labelKey)}
            title={tooltip}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            {button.icon}
          </button>
        )
      })}
    </div>
  )
}
