import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import { Header } from './Header'
import { SplitPane } from './SplitPane'
import { EditorWithToolbar } from '../Editor/EditorWithToolbar'
import { Preview } from '../Preview/Preview'
import { TOCContainer } from '../TOC'
import { useEditorStore, useUIStore } from '../../stores'
import { useFileHandler } from '../../hooks/useFileHandler'
import { useScrollSync } from '../../hooks/useScrollSync'
import { useMobileScrollPosition } from '../../hooks/useMobileScrollPosition'

export interface LayoutProps {
  isSaving?: boolean
  lastSaved?: Date | null
}

export const Layout = memo(function Layout({ isSaving = false, lastSaved = null }: LayoutProps) {
  const { content, fileName, isDirty } = useEditorStore()
  const { handleFileRead, handleFileDownload } = useFileHandler()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const {
    viewMode,
    splitRatio,
    sidebarOpen,
    editorScrollPosition,
    previewScrollPosition,
    setViewMode,
    setSplitRatio,
    toggleSidebar,
    openSettingsModal,
    openHelpModal,
    setEditorScrollPosition,
    setPreviewScrollPosition,
  } = useUIStore()

  const [isMobile, setIsMobile] = useState(false)

  // 스크롤 동기화
  useScrollSync({
    editorRef: editorContainerRef,
    previewRef: previewContainerRef,
  })

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

  const handleOpenFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }, [handleFileRead])

  // 모바일 탭 전환 시 스크롤 위치 저장 및 복원
  const { handleTabChange } = useMobileScrollPosition({
    isMobile,
    viewMode,
    editorContainerRef,
    previewContainerRef,
    editorScrollPosition,
    previewScrollPosition,
    setEditorScrollPosition,
    setPreviewScrollPosition,
    setViewMode,
  })

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
        isSaving={isSaving}
        lastSaved={lastSaved}
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
                onClick={() => handleTabChange('editor')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'editor'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => handleTabChange('preview')}
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
            <div className="flex-1 overflow-hidden relative">
              <div
                ref={editorContainerRef}
                className={`absolute inset-0 ${viewMode === 'editor' ? 'block' : 'hidden'}`}
              >
                <EditorWithToolbar className="h-full" />
              </div>
              <div
                ref={previewContainerRef}
                className={`absolute inset-0 overflow-auto p-4 ${viewMode === 'preview' ? 'block' : 'hidden'}`}
              >
                <Preview content={content} />
              </div>
            </div>
          </div>
        ) : (
          // Desktop: Split view with sidebar
          <div className="flex h-full">
            {/* Sidebar Toggle + TOC */}
            <div
              className={`flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ${
                sidebarOpen ? 'w-64' : 'w-10'
              }`}
            >
              {/* Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
              >
                {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
              </button>

              {/* TOC */}
              {sidebarOpen && (
                <div className="flex-1 overflow-auto">
                  <TOCContainer content={content} />
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <SplitPane
                left={
                  <div ref={editorContainerRef} className="h-full">
                    <EditorWithToolbar className="h-full" />
                  </div>
                }
                right={
                  <div
                    ref={previewContainerRef}
                    className="h-full overflow-auto p-4"
                  >
                    <Preview content={content} />
                  </div>
                }
                initialRatio={splitRatio}
                onRatioChange={setSplitRatio}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
})
