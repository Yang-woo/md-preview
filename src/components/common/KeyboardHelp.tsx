import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

export interface KeyboardHelpProps {
  className?: string
}

/**
 * 키보드 단축키 도움말 컴포넌트
 */
export function KeyboardHelp({ className = '' }: KeyboardHelpProps) {
  const { shortcuts } = useKeyboardShortcuts({})

  const shortcutList = [
    { label: 'Bold', shortcut: shortcuts.bold },
    { label: 'Italic', shortcut: shortcuts.italic },
    { label: 'Insert Link', shortcut: shortcuts.link },
    { label: 'Save/Download', shortcut: shortcuts.save },
    { label: 'Toggle Preview', shortcut: shortcuts.previewToggle },
  ]

  return (
    <div
      className={`keyboard-help ${className}`}
      role="complementary"
      aria-label="키보드 단축키"
    >
      <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        키보드 단축키
      </h3>
      <ul className="space-y-2">
        {shortcutList.map(({ label, shortcut }) => (
          <li
            key={label}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
              {shortcut}
            </kbd>
          </li>
        ))}
      </ul>
    </div>
  )
}
