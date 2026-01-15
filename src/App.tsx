import { useTheme } from './hooks/useTheme'
import { Layout } from './components/Layout'

function App() {
  useTheme()

  return <Layout />
}

export default App
