import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Korean translations
import koCommon from './locales/ko/common.json'
import koHeader from './locales/ko/header.json'
import koSettings from './locales/ko/settings.json'
import koToolbar from './locales/ko/toolbar.json'
import koWelcome from './locales/ko/welcome.json'
import koHelp from './locales/ko/help.json'
import koRecovery from './locales/ko/recovery.json'
import koPwa from './locales/ko/pwa.json'
import koToc from './locales/ko/toc.json'
import koFile from './locales/ko/file.json'
import koLayout from './locales/ko/layout.json'

// English translations
import enCommon from './locales/en/common.json'
import enHeader from './locales/en/header.json'
import enSettings from './locales/en/settings.json'
import enToolbar from './locales/en/toolbar.json'
import enWelcome from './locales/en/welcome.json'
import enHelp from './locales/en/help.json'
import enRecovery from './locales/en/recovery.json'
import enPwa from './locales/en/pwa.json'
import enToc from './locales/en/toc.json'
import enFile from './locales/en/file.json'
import enLayout from './locales/en/layout.json'

const resources = {
  ko: {
    common: koCommon,
    header: koHeader,
    settings: koSettings,
    toolbar: koToolbar,
    welcome: koWelcome,
    help: koHelp,
    recovery: koRecovery,
    pwa: koPwa,
    toc: koToc,
    file: koFile,
    layout: koLayout,
  },
  en: {
    common: enCommon,
    header: enHeader,
    settings: enSettings,
    toolbar: enToolbar,
    welcome: enWelcome,
    help: enHelp,
    recovery: enRecovery,
    pwa: enPwa,
    toc: enToc,
    file: enFile,
    layout: enLayout,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    defaultNS: 'common',
    ns: ['common', 'header', 'settings', 'toolbar', 'welcome', 'help', 'recovery', 'pwa', 'toc', 'file', 'layout'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'md-preview-language',
      caches: ['localStorage'],
    },
  })

export default i18n
