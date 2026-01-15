import { useState, useEffect } from 'react'
import { Header } from './Header'
import { SplitPane } from './SplitPane'
import { EditorWithToolbar } from '../Editor/EditorWithToolbar'
import { Preview } from '../Preview/Preview'
import { useEditorStore, useUIStore } from '../../stores'

export function Layout() {
  const { content, fileName, isDirty } = useEditorStore()
  const {
    viewMode,
    splitRatio,
    setViewMode,
    setSplitRatio,
    openSettingsModal,
    openHelpModal,
  } = useUIStore()

  const [isMobile, setIsMobile] = useState(false)

  // Responsive breakpoints
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || 'untitled.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        fileName={fileName}
        isDirty={isDirty}
        onSettingsClick={openSettingsModal}
        onHelpClick={openHelpModal}
        onDownloadClick={handleDownload}
      />

      <main className="flex-1 overflow-hidden">
        {isMobile ? (
          // Mobile: Tab view
          <div className="h-full flex flex-col">
            {/* Tab buttons */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                onClick={() => setViewMode('editor')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'editor'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {viewMode === 'editor' && (
                <EditorWithToolbar className="h-full" />
              )}
              {viewMode === 'preview' && (
                <div className="h-full overflow-auto p-4">
                  <Preview content={content} />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Desktop: Split view
          <SplitPane
            left={<EditorWithToolbar className="h-full" />}
            right={
              <div className="h-full overflow-auto p-4">
                <Preview content={content} />
              </div>
            }
            initialRatio={splitRatio}
            onRatioChange={setSplitRatio}
          />
        )}
      </main>
    </div>
  )
}
