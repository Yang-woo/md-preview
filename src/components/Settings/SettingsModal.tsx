import { X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../stores/settingsStore'
import { useUIStore } from '../../stores/uiStore'

export function SettingsModal() {
  const { t } = useTranslation(['settings', 'common'])
  const isOpen = useUIStore((state) => state.settingsModalOpen)
  const closeModal = useUIStore((state) => state.closeSettingsModal)

  const {
    theme,
    stylePreset,
    fontSize,
    enableScrollSync,
    enableAutoSave,
    language,
    setTheme,
    setStylePreset,
    setFontSize,
    toggleScrollSync,
    toggleAutoSave,
    setLanguage,
    reset,
  } = useSettingsStore()

  const handleReset = () => {
    reset()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          data-radix-dialog-overlay
        />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-w-[90vw] max-h-[85vh] overflow-y-auto z-50 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Dialog.Title
                  id="settings-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  {t('settings:title')}
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  {t('settings:description')}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label={t('common:close')}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings:theme')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === 'light'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                      className="mr-2"
                      aria-label={t('settings:themeLight')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings:themeLight')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                      className="mr-2"
                      aria-label={t('settings:themeDark')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings:themeDark')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={theme === 'system'}
                      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                      className="mr-2"
                      aria-label={t('settings:themeSystem')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings:themeSystem')}</span>
                  </label>
                </div>
              </div>

              {/* Style Preset Selection */}
              <div>
                <label
                  htmlFor="style-preset"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('settings:stylePreset')}
                </label>
                <select
                  id="style-preset"
                  value={stylePreset}
                  onChange={(e) => setStylePreset(e.target.value as 'github' | 'notion' | 'vscode' | 'minimal')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t('settings:stylePresetLabel')}
                >
                  <option value="github">GitHub</option>
                  <option value="notion">Notion</option>
                  <option value="vscode">VS Code</option>
                  <option value="minimal">{t('settings:styleMinimal')}</option>
                </select>
              </div>

              {/* Font Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings:fontSize')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fontSize"
                      value="small"
                      checked={fontSize === 'small'}
                      onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large' | 'xl')}
                      className="mr-2"
                      aria-label="Small"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Small</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fontSize"
                      value="medium"
                      checked={fontSize === 'medium'}
                      onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large' | 'xl')}
                      className="mr-2"
                      aria-label="Medium"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Medium</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fontSize"
                      value="large"
                      checked={fontSize === 'large'}
                      onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large' | 'xl')}
                      className="mr-2"
                      aria-label="Large"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Large</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fontSize"
                      value="xl"
                      checked={fontSize === 'xl'}
                      onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large' | 'xl')}
                      className="mr-2"
                      aria-label="XL"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">XL</span>
                  </label>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings:language')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="ko"
                      checked={language === 'ko'}
                      onChange={(e) => setLanguage(e.target.value as 'ko' | 'en')}
                      className="mr-2"
                      aria-label={t('settings:languageKo')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings:languageKo')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={language === 'en'}
                      onChange={(e) => setLanguage(e.target.value as 'ko' | 'en')}
                      className="mr-2"
                      aria-label={t('settings:languageEn')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings:languageEn')}</span>
                  </label>
                </div>
              </div>

              {/* Editor Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('settings:editorSettings')}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableScrollSync}
                      onChange={toggleScrollSync}
                      className="mr-2"
                      aria-label={t('settings:scrollSync')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('settings:scrollSync')}
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableAutoSave}
                      onChange={toggleAutoSave}
                      className="mr-2"
                      aria-label={t('settings:autoSave')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings:autoSave')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t('common:reset')}
              >
                {t('common:reset')}
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t('common:close')}
                >
                  {t('common:close')}
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
