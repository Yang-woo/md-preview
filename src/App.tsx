import { useTheme } from './hooks/useTheme'
import { Layout } from './components/Layout'
import { SettingsModal } from './components/Settings'
import { PWAInstallPrompt } from './components/common'

function App() {
  useTheme()

  return (
    <>
      <Layout />
      <SettingsModal />
      <PWAInstallPrompt />
    </>
  )
}

export default App
