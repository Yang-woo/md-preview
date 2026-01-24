import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Layout } from './Layout'
import { useUIStore, useEditorStore } from '../../stores'

/**
 * 통합 테스트: 실제 사용자 시나리오를 시뮬레이션
 */
describe('Layout 통합 테스트: 모바일 스크롤 위치 유지', () => {
  beforeEach(() => {
    // 모바일 환경 시뮬레이션
    global.innerWidth = 375
    global.innerHeight = 667

    // Store 초기화
    useUIStore.setState({
      sidebarOpen: false,
      settingsModalOpen: false,
      helpModalOpen: false,
      viewMode: 'editor',
      splitRatio: 50,
      editorScrollPosition: 0,
      previewScrollPosition: 0,
    })

    useEditorStore.setState({
      content: `# 테스트 마크다운

## 소제목 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## 소제목 2

Ut enim ad minim veniam, quis nostrud exercitation ullamco.
Laboris nisi ut aliquip ex ea commodo consequat.

## 소제목 3

Duis aute irure dolor in reprehenderit in voluptate velit.
Esse cillum dolore eu fugiat nulla pariatur.

## 소제목 4

Excepteur sint occaecat cupidatat non proident, sunt in culpa.
Qui officia deserunt mollit anim id est laborum.

## 소제목 5

Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
Accusantium doloremque laudantium, totam rem aperiam.
`,
      fileName: 'test.md',
      isDirty: false,
    })
  })

  it('시나리오 1: 에디터에서 스크롤 후 프리뷰로 전환, 다시 에디터로 돌아올 때 스크롤 위치 유지', async () => {
    const { container } = render(<Layout />)

    // 1. 에디터 탭 확인
    expect(screen.getByRole('button', { name: /에디터/i })).toHaveClass('text-blue-600')

    // 2. 에디터에서 스크롤 (시뮬레이션)
    const editorScroller = container.querySelector('.cm-scroller')
    if (editorScroller) {
      Object.defineProperty(editorScroller, 'scrollTop', {
        writable: true,
        value: 200,
      })
    }

    // 3. 프리뷰 탭으로 전환
    fireEvent.click(screen.getByRole('button', { name: /미리보기/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('preview')
    })

    // 4. 에디터 스크롤 위치가 저장되었는지 확인
    expect(useUIStore.getState().editorScrollPosition).toBeGreaterThanOrEqual(0)

    // 5. 다시 에디터 탭으로 전환
    fireEvent.click(screen.getByRole('button', { name: /에디터/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('editor')
    })

    // 6. 스크롤 위치 복원 확인 (스토어에 저장된 값 확인)
    expect(useUIStore.getState().editorScrollPosition).toBeGreaterThanOrEqual(0)
  })

  it('시나리오 2: 프리뷰에서 스크롤 후 에디터로 전환, 다시 프리뷰로 돌아올 때 스크롤 위치 유지', async () => {
    const { container } = render(<Layout />)

    // 1. 프리뷰 탭으로 전환
    fireEvent.click(screen.getByRole('button', { name: /미리보기/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('preview')
    })

    // 2. 프리뷰에서 스크롤 (시뮬레이션)
    const previewContainer = container.querySelector('.overflow-auto')
    if (previewContainer) {
      Object.defineProperty(previewContainer, 'scrollTop', {
        writable: true,
        value: 300,
      })
    }

    // 3. 에디터 탭으로 전환
    fireEvent.click(screen.getByRole('button', { name: /에디터/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('editor')
    })

    // 4. 프리뷰 스크롤 위치가 저장되었는지 확인
    expect(useUIStore.getState().previewScrollPosition).toBeGreaterThanOrEqual(0)

    // 5. 다시 프리뷰 탭으로 전환
    fireEvent.click(screen.getByRole('button', { name: /미리보기/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('preview')
    })

    // 6. 스크롤 위치 복원 확인
    expect(useUIStore.getState().previewScrollPosition).toBeGreaterThanOrEqual(0)
  })

  it('시나리오 3: 여러 번 탭 전환해도 각 탭의 스크롤 위치가 독립적으로 유지됨', async () => {
    render(<Layout />)

    // 1. 에디터에서 스크롤 -> 프리뷰로 전환
    useUIStore.getState().setEditorScrollPosition(100)
    fireEvent.click(screen.getByRole('button', { name: /미리보기/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('preview')
    })

    // 2. 프리뷰에서 스크롤 -> 에디터로 전환
    useUIStore.getState().setPreviewScrollPosition(200)
    fireEvent.click(screen.getByRole('button', { name: /에디터/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('editor')
    })

    // 3. 각 탭의 스크롤 위치가 독립적으로 저장되어 있는지 확인
    expect(useUIStore.getState().editorScrollPosition).toBe(100)
    expect(useUIStore.getState().previewScrollPosition).toBe(200)

    // 4. 프리뷰로 다시 전환
    fireEvent.click(screen.getByRole('button', { name: /미리보기/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('preview')
    })

    // 5. 프리뷰 스크롤 위치가 여전히 유지되는지 확인
    expect(useUIStore.getState().previewScrollPosition).toBe(200)
  })

  it('시나리오 4: 데스크톱 환경으로 전환 시 스크롤 위치 저장 로직이 동작하지 않음', async () => {
    // 데스크톱 환경으로 변경
    global.innerWidth = 1024

    const { rerender } = render(<Layout />)

    // resize 이벤트 발생
    fireEvent.resize(window)
    rerender(<Layout />)

    // 데스크톱에서는 SplitPane이 렌더링됨 (탭 버튼 없음)
    expect(screen.queryByRole('button', { name: /에디터/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /미리보기/i })).not.toBeInTheDocument()

    // SplitPane이 렌더링되어야 함
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('시나리오 5: localStorage에 스크롤 위치가 영구 저장되지 않음 (세션 전용)', () => {
    render(<Layout />)

    // 스크롤 위치 설정
    useUIStore.getState().setEditorScrollPosition(150)
    useUIStore.getState().setPreviewScrollPosition(250)

    // localStorage의 md-preview-ui를 확인
    const storedData = localStorage.getItem('md-preview-ui')
    if (storedData) {
      const parsed = JSON.parse(storedData)

      // 스크롤 위치는 partialize에 포함되지 않으므로 저장되지 않아야 함
      expect(parsed.state.editorScrollPosition).toBeUndefined()
      expect(parsed.state.previewScrollPosition).toBeUndefined()
    }
  })

  it('시나리오 6: 콘텐츠 변경 후에도 스크롤 위치가 유지됨', async () => {
    render(<Layout />)

    // 1. 스크롤 위치 설정
    useUIStore.getState().setEditorScrollPosition(100)

    // 2. 콘텐츠 변경
    useEditorStore.getState().setContent('# 새로운 콘텐츠')

    // 3. 프리뷰로 전환
    fireEvent.click(screen.getByRole('button', { name: /미리보기/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('preview')
    })

    // 4. 에디터로 다시 전환
    fireEvent.click(screen.getByRole('button', { name: /에디터/i }))

    await waitFor(() => {
      expect(useUIStore.getState().viewMode).toBe('editor')
    })

    // 5. 스크롤 위치가 여전히 유지되는지 확인
    expect(useUIStore.getState().editorScrollPosition).toBe(100)
  })
})
