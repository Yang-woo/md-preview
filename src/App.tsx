import { useTheme } from './hooks/useTheme'
import { Layout } from './components/Layout'
import { SettingsModal } from './components/Settings'

function App() {
  useTheme()

  return (
    <>
      <Layout />
      <SettingsModal />
    </>
  )
}

export default App
