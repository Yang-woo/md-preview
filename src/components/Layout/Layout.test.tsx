import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
})
