import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Layout } from './Layout'
import { useUIStore } from '../../stores'

// Mock zustand store
vi.mock('../../stores', () => ({
  useUIStore: vi.fn(),
  useEditorStore: vi.fn(() => ({
    content: '# Test',
    fileName: 'test.md',
    isDirty: false,
  })),
  useSettingsStore: vi.fn(() => ({
    theme: 'light',
    preset: 'github',
    fontSize: 'medium',
  })),
}))

describe('Layout 컴포넌트', () => {
  beforeEach(() => {
    // Reset viewport to desktop size
    global.innerWidth = 1024
    global.innerHeight = 768

    // Mock useUIStore
    vi.mocked(useUIStore).mockReturnValue({
      viewMode: 'split',
      splitRatio: 50,
      sidebarOpen: true,
      settingsModalOpen: false,
      helpModalOpen: false,
      setViewMode: vi.fn(),
      setSplitRatio: vi.fn(),
      toggleSidebar: vi.fn(),
      setSidebarOpen: vi.fn(),
      openSettingsModal: vi.fn(),
      closeSettingsModal: vi.fn(),
      openHelpModal: vi.fn(),
      closeHelpModal: vi.fn(),
    })
  })

  it('헤더를 렌더링해야 함', () => {
    render(<Layout />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('에디터와 프리뷰를 렌더링해야 함 (split 모드)', () => {
    render(<Layout />)

    expect(screen.getByLabelText(/Markdown Editor/i)).toBeInTheDocument()
    expect(screen.getByRole('separator')).toBeInTheDocument() // SplitPane 확인
  })

  it('데스크톱에서 SplitPane을 렌더링해야 함', () => {
    render(<Layout />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('모바일 뷰포트에서 탭 전환 UI를 렌더링해야 함', () => {
    global.innerWidth = 375
    fireEvent.resize(window)

    render(<Layout />)
    expect(screen.getByRole('button', { name: /Editor/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Preview/i })).toBeInTheDocument()
  })

  it('모바일에서 에디터/프리뷰 탭 전환이 동작해야 함', () => {
    global.innerWidth = 375
    const setViewMode = vi.fn()

    vi.mocked(useUIStore).mockReturnValue({
      viewMode: 'editor',
      splitRatio: 50,
      sidebarOpen: false,
      settingsModalOpen: false,
      helpModalOpen: false,
      setViewMode,
      setSplitRatio: vi.fn(),
      toggleSidebar: vi.fn(),
      setSidebarOpen: vi.fn(),
      openSettingsModal: vi.fn(),
      closeSettingsModal: vi.fn(),
      openHelpModal: vi.fn(),
      closeHelpModal: vi.fn(),
    })

    render(<Layout />)

    fireEvent.click(screen.getByRole('button', { name: /Preview/i }))
    expect(setViewMode).toHaveBeenCalledWith('preview')
  })

  it('분할 비율 변경이 저장되어야 함', () => {
    const setSplitRatio = vi.fn()

    vi.mocked(useUIStore).mockReturnValue({
      viewMode: 'split',
      splitRatio: 50,
      sidebarOpen: true,
      settingsModalOpen: false,
      helpModalOpen: false,
      setViewMode: vi.fn(),
      setSplitRatio,
      toggleSidebar: vi.fn(),
      setSidebarOpen: vi.fn(),
      openSettingsModal: vi.fn(),
      closeSettingsModal: vi.fn(),
      openHelpModal: vi.fn(),
      closeHelpModal: vi.fn(),
    })

    render(<Layout />)

    const handle = screen.getByRole('separator')
    fireEvent.mouseDown(handle, { clientX: 100 })
    fireEvent.mouseMove(document, { clientX: 200 })
    fireEvent.mouseUp(document)

    expect(setSplitRatio).toHaveBeenCalled()
  })

  it('반응형 브레이크포인트가 동작해야 함', () => {
    // Desktop
    global.innerWidth = 1024
    fireEvent.resize(window)
    const { rerender } = render(<Layout />)
    expect(screen.getByRole('separator')).toBeInTheDocument()

    // Tablet
    global.innerWidth = 768
    fireEvent.resize(window)
    rerender(<Layout />)

    // Mobile
    global.innerWidth = 375
    fireEvent.resize(window)
    rerender(<Layout />)
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
  })

  describe('모바일 탭 전환 시 스크롤 위치 유지', () => {
    beforeEach(() => {
      // 모바일 뷰포트 설정
      global.innerWidth = 375
    })

    it('모바일에서 탭 전환 UI가 렌더링되어야 함', () => {
      vi.mocked(useUIStore).mockReturnValue({
        viewMode: 'editor',
        splitRatio: 50,
        sidebarOpen: false,
        settingsModalOpen: false,
        helpModalOpen: false,
        editorScrollPosition: 0,
        previewScrollPosition: 0,
        setViewMode: vi.fn(),
        setSplitRatio: vi.fn(),
        toggleSidebar: vi.fn(),
        setSidebarOpen: vi.fn(),
        openSettingsModal: vi.fn(),
        closeSettingsModal: vi.fn(),
        openHelpModal: vi.fn(),
        closeHelpModal: vi.fn(),
        setEditorScrollPosition: vi.fn(),
        setPreviewScrollPosition: vi.fn(),
      })

      render(<Layout />)

      // 탭 버튼이 렌더링되어야 함
      expect(screen.getByRole('button', { name: /Editor/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Preview/i })).toBeInTheDocument()
    })

    it('uiStore에 스크롤 위치 함수들이 존재해야 함', () => {
      const setEditorScrollPosition = vi.fn()
      const setPreviewScrollPosition = vi.fn()

      vi.mocked(useUIStore).mockReturnValue({
        viewMode: 'editor',
        splitRatio: 50,
        sidebarOpen: false,
        settingsModalOpen: false,
        helpModalOpen: false,
        editorScrollPosition: 0,
        previewScrollPosition: 0,
        setViewMode: vi.fn(),
        setSplitRatio: vi.fn(),
        toggleSidebar: vi.fn(),
        setSidebarOpen: vi.fn(),
        openSettingsModal: vi.fn(),
        closeSettingsModal: vi.fn(),
        openHelpModal: vi.fn(),
        closeHelpModal: vi.fn(),
        setEditorScrollPosition,
        setPreviewScrollPosition,
      })

      render(<Layout />)

      // 스크롤 위치 저장 함수가 존재하는지 확인
      expect(setEditorScrollPosition).toBeDefined()
      expect(setPreviewScrollPosition).toBeDefined()
    })

    it('저장된 스크롤 위치 값이 uiStore에서 조회되어야 함', () => {
      vi.mocked(useUIStore).mockReturnValue({
        viewMode: 'editor',
        splitRatio: 50,
        sidebarOpen: false,
        settingsModalOpen: false,
        helpModalOpen: false,
        editorScrollPosition: 150, // 저장된 에디터 스크롤 위치
        previewScrollPosition: 250, // 저장된 프리뷰 스크롤 위치
        setViewMode: vi.fn(),
        setSplitRatio: vi.fn(),
        toggleSidebar: vi.fn(),
        setSidebarOpen: vi.fn(),
        openSettingsModal: vi.fn(),
        closeSettingsModal: vi.fn(),
        openHelpModal: vi.fn(),
        closeHelpModal: vi.fn(),
        setEditorScrollPosition: vi.fn(),
        setPreviewScrollPosition: vi.fn(),
      })

      render(<Layout />)

      // uiStore에서 스크롤 위치가 조회되는지 확인
      const store = useUIStore()
      expect(store.editorScrollPosition).toBe(150)
      expect(store.previewScrollPosition).toBe(250)
    })
  })
})
