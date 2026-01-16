import { useTheme } from './hooks/useTheme'
import { useAutoSave } from './hooks/useAutoSave'
import { useEditorStore } from './stores/editorStore'
import { Layout } from './components/Layout'
import { SettingsModal } from './components/Settings'
import { HelpModal, PWAInstallPrompt, WelcomeModal, RecoveryPrompt } from './components/common'

function App() {
  useTheme()

  const { content, setContent, markAsSaved } = useEditorStore()

  // 자동 저장 훅 사용
  const {
    isSaving,
    lastSaved,
    hasUnsavedData,
    restore,
    discard,
  } = useAutoSave({
    content,
    onSave: () => {
      // 저장 시 isDirty 상태를 false로 변경
      markAsSaved()
    },
    interval: 30000, // 30초
    key: 'md-preview-autosave',
  })

  // 복구 핸들러
  const handleRestore = () => {
    const restoredContent = restore()
    setContent(restoredContent)
  }

  // 삭제 핸들러
  const handleDiscard = () => {
    discard()
  }

  return (
    <>
      <Layout isSaving={isSaving} lastSaved={lastSaved} />
      <SettingsModal />
      <HelpModal />
      <PWAInstallPrompt />
      <WelcomeModal />
      <RecoveryPrompt
        isOpen={hasUnsavedData}
        onRestore={handleRestore}
        onDiscard={handleDiscard}
      />
    </>
  )
}

export default App
