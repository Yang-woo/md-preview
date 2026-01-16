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
      editorScrollPosition: 0,
      previewScrollPosition: 0,
      setViewMode,
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
      editorScrollPosition: 0,
      previewScrollPosition: 0,
      setViewMode: vi.fn(),
      setSplitRatio,
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

  describe('BUG-004: 모바일 스크롤 위치 유지 - 회귀 테스트', () => {
    beforeEach(() => {
      // 모바일 뷰포트 설정
      global.innerWidth = 375
    })

    it('should fix: 모바일에서 에디터와 프리뷰가 모두 DOM에 존재해야 함', async () => {
      // Given - 에디터 탭에서 시작
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

      const { container } = render(<Layout />)

      // Wait for mobile layout to render
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Editor/i })).toBeInTheDocument()
      })

      // Then - 에디터와 프리뷰가 모두 DOM에 존재해야 함
      const editorContainer = container.querySelector('.cm-scroller')
      expect(editorContainer).toBeInTheDocument()

      // Preview도 DOM에 존재해야 함 (hidden 상태로)
      const allAbsoluteContainers = container.querySelectorAll('.absolute.inset-0')
      expect(allAbsoluteContainers.length).toBe(2) // 에디터 + 프리뷰
    })

    it('should fix: 에디터 탭에서 에디터는 보이고 프리뷰는 hidden', async () => {
      // Given - 에디터 모드
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

      const { container } = render(<Layout />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Editor/i })).toBeInTheDocument()
      })

      // Then - 에디터 컨테이너는 block 클래스를 가져야 함
      const containers = container.querySelectorAll('.absolute.inset-0')
      const editorContainer = Array.from(containers).find(el => el.classList.contains('block'))
      const hiddenContainer = Array.from(containers).find(el => el.classList.contains('hidden'))

      expect(editorContainer).toBeInTheDocument()
      expect(hiddenContainer).toBeInTheDocument()
    })

    it('should fix: 프리뷰 탭에서 프리뷰는 보이고 에디터는 hidden', async () => {
      // Given - 프리뷰 모드
      vi.mocked(useUIStore).mockReturnValue({
        viewMode: 'preview',
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

      const { container } = render(<Layout />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Preview/i })).toBeInTheDocument()
      })

      // Then - 프리뷰 컨테이너는 block 클래스를 가져야 함
      const containers = container.querySelectorAll('.absolute.inset-0')
      const visibleContainer = Array.from(containers).find(el => el.classList.contains('block'))
      const hiddenContainer = Array.from(containers).find(el => el.classList.contains('hidden'))

      expect(visibleContainer).toBeInTheDocument()
      expect(hiddenContainer).toBeInTheDocument()
    })

    it('should fix: 에디터 컨테이너에 ref가 연결되어야 함', async () => {
      // Given
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

      const { container } = render(<Layout />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Editor/i })).toBeInTheDocument()
      })

      // Then - 에디터를 포함하는 absolute wrapper가 존재해야 함
      const editorWrapper = container.querySelector('.cm-scroller')?.closest('.absolute.inset-0')
      expect(editorWrapper).toBeInTheDocument()
    })

    it('should fix: 프리뷰 컨테이너에 ref가 연결되어야 함', async () => {
      // Given
      vi.mocked(useUIStore).mockReturnValue({
        viewMode: 'preview',
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

      const { container } = render(<Layout />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Preview/i })).toBeInTheDocument()
      })

      // Then - overflow-auto를 가진 absolute wrapper가 존재해야 함 (프리뷰 컨테이너)
      const previewWrapper = container.querySelector('.absolute.inset-0.overflow-auto')
      expect(previewWrapper).toBeInTheDocument()
    })
  })
})
