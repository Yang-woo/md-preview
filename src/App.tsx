import { useTheme } from './hooks/useTheme'
import { useSettingsStore } from './stores'

function App() {
  useTheme()
  const { theme, setTheme } = useSettingsStore()

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Markdown Preview
          </h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg border"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
          >
            테마: {theme}
          </button>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          프로젝트 초기화 완료. 테마 시스템이 정상 작동합니다.
        </p>
        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <p style={{ color: 'var(--color-text-primary)' }}>
            테마 전환 버튼을 클릭하여 라이트/다크/시스템 테마를 확인하세요.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
