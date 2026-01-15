import { useEffect } from 'react'

export interface KeyboardShortcutCallbacks {
  onBold?: () => void
  onItalic?: () => void
  onLink?: () => void
  onSave?: () => void
  onPreviewToggle?: () => void
}

export interface ShortcutInfo {
  key: string
  ctrl: boolean
  shift?: boolean
  description: string
}

export interface Shortcuts {
  bold: string
  italic: string
  link: string
  save: string
  previewToggle: string
}

/**
 * 키보드 단축키를 처리하는 훅
 * @param callbacks 단축키에 대응하는 콜백 함수들
 * @returns 단축키 정보
 */
export function useKeyboardShortcuts(callbacks: KeyboardShortcutCallbacks) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey } = event

      // Ctrl 또는 Cmd (metaKey) 둘 다 지원
      const modifierKey = ctrlKey || metaKey

      // 대소문자 구분 없이 처리
      const normalizedKey = key.toLowerCase()

      // Ctrl/Cmd + B: Bold
      if (modifierKey && !shiftKey && normalizedKey === 'b') {
        event.preventDefault()
        callbacks.onBold?.()
        return
      }

      // Ctrl/Cmd + I: Italic
      if (modifierKey && !shiftKey && normalizedKey === 'i') {
        event.preventDefault()
        callbacks.onItalic?.()
        return
      }

      // Ctrl/Cmd + K: Link
      if (modifierKey && !shiftKey && normalizedKey === 'k') {
        event.preventDefault()
        callbacks.onLink?.()
        return
      }

      // Ctrl/Cmd + S: Save
      if (modifierKey && !shiftKey && normalizedKey === 's') {
        event.preventDefault()
        callbacks.onSave?.()
        return
      }

      // Ctrl/Cmd + Shift + P: Preview Toggle
      if (modifierKey && shiftKey && normalizedKey === 'p') {
        event.preventDefault()
        callbacks.onPreviewToggle?.()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [callbacks])

  // 단축키 정보 반환 (도움말 표시용)
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? 'Cmd' : 'Ctrl'

  const shortcuts: Shortcuts = {
    bold: `${modKey}+B`,
    italic: `${modKey}+I`,
    link: `${modKey}+K`,
    save: `${modKey}+S`,
    previewToggle: `${modKey}+Shift+P`,
  }

  return { shortcuts }
}
