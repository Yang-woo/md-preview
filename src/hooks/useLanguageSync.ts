import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore, type Language } from '../stores/settingsStore'

/**
 * settingsStore의 language 변경 시 i18next 언어도 동기화하는 훅
 */
export function useLanguageSync() {
  const { i18n } = useTranslation()
  const language = useSettingsStore((state) => state.language)

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language, i18n])

  // i18n에서 언어가 변경되면 store도 업데이트 (브라우저 언어 감지 등)
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const newLang = (lng === 'ko' || lng === 'en' ? lng : 'ko') as Language
      const currentLang = useSettingsStore.getState().language
      if (currentLang !== newLang) {
        useSettingsStore.getState().setLanguage(newLang)
      }
    }

    i18n.on('languageChanged', handleLanguageChanged)
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])
}
