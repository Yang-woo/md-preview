import { useState, useEffect, useRef } from 'react'
import { Header } from './Header'
import { SplitPane } from './SplitPane'
import { EditorWithToolbar } from '../Editor/EditorWithToolbar'
import { Preview } from '../Preview/Preview'
import { useEditorStore, useUIStore } from '../../stores'
import { useFileHandler } from '../../hooks/useFileHandler'

export function Layout() {
  const { content, fileName, isDirty } = useEditorStore()
  const { handleFileRead, handleFileDownload } = useFileHandler()
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleOpenFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Header
        fileName={fileName}
        isDirty={isDirty}
        onOpenClick={handleOpenFile}
        onSettingsClick={openSettingsModal}
        onHelpClick={openHelpModal}
        onDownloadClick={handleFileDownload}
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
