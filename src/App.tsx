import { useTheme } from './hooks/useTheme'
import { Layout } from './components/Layout'
import { SettingsModal } from './components/Settings'
import { HelpModal, PWAInstallPrompt, WelcomeModal } from './components/common'

function App() {
  useTheme()

  return (
    <>
      <Layout />
      <SettingsModal />
      <HelpModal />
      <PWAInstallPrompt />
      <WelcomeModal />
    </>
  )
}

export default App
