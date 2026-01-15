import { useEffect } from 'react'
import { useSettingsStore } from '../stores'

export function useTheme() {
  const { theme } = useSettingsStore()

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (theme === 'system') {
      // 시스템 설정 감지
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches)

      // 시스템 설정 변경 감지
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
      mediaQuery.addEventListener('change', handler)

      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      applyTheme(theme === 'dark')
    }
  }, [theme])

  const getCurrentTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme
  }

  return {
    theme,
    currentTheme: getCurrentTheme(),
  }
}
