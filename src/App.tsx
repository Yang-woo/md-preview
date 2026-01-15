import { useTheme } from './hooks/useTheme'
import { useSettingsStore, useEditorStore } from './stores'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'

function App() {
  useTheme()
  const { theme, setTheme } = useSettingsStore()
  const { content } = useEditorStore()

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Markdown Preview
          </h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg border hover:opacity-80 transition-opacity"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
            }}
          >
            테마: {theme}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-120px)]">
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <div className="p-2 border-b" style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg-secondary)',
            }}>
              <h2 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                에디터
              </h2>
            </div>
            <div className="h-full overflow-auto">
              <Editor placeholder="# Hello World

마크다운을 입력하세요..." />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <div className="p-2 border-b" style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg-secondary)',
            }}>
              <h2 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                프리뷰
              </h2>
            </div>
            <div className="h-full overflow-auto p-4">
              {content ? (
                <Preview content={content} />
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  에디터에 마크다운을 입력하면 여기에 표시됩니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
