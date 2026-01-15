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
  label: string
  tooltip: string
}

const toolbarButtons: ToolbarButton[] = [
  { command: 'bold', icon: <Bold size={18} />, label: 'Bold', tooltip: 'Bold (Ctrl+B)' },
  { command: 'italic', icon: <Italic size={18} />, label: 'Italic', tooltip: 'Italic (Ctrl+I)' },
  { command: 'strikethrough', icon: <Strikethrough size={18} />, label: 'Strikethrough', tooltip: 'Strikethrough' },
  { command: 'heading1', icon: <Heading1 size={18} />, label: 'Heading 1', tooltip: 'Heading 1' },
  { command: 'heading2', icon: <Heading2 size={18} />, label: 'Heading 2', tooltip: 'Heading 2' },
  { command: 'heading3', icon: <Heading3 size={18} />, label: 'Heading 3', tooltip: 'Heading 3' },
  { command: 'link', icon: <Link size={18} />, label: 'Insert Link', tooltip: 'Link (Ctrl+K)' },
  { command: 'image', icon: <Image size={18} />, label: 'Insert Image', tooltip: 'Image' },
  { command: 'inlineCode', icon: <Code size={18} />, label: 'Inline Code', tooltip: 'Inline Code' },
  { command: 'codeBlock', icon: <FileCode size={18} />, label: 'Code Block', tooltip: 'Code Block' },
  { command: 'bulletList', icon: <List size={18} />, label: 'Bullet List', tooltip: 'Bullet List' },
  { command: 'numberedList', icon: <ListOrdered size={18} />, label: 'Numbered List', tooltip: 'Numbered List' },
  { command: 'taskList', icon: <CheckSquare size={18} />, label: 'Task List', tooltip: 'Task List' },
]

export function Toolbar({ onCommand, className = '' }: ToolbarProps) {
  return (
    <div
      className={`flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      role="toolbar"
      aria-label="Markdown Toolbar"
    >
      {toolbarButtons.map((button) => (
        <button
          key={button.command}
          onClick={() => onCommand(button.command)}
          aria-label={button.label}
          title={button.tooltip}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          {button.icon}
        </button>
      ))}
    </div>
  )
}
