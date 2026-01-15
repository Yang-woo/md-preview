import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useScrollSync } from '../useScrollSync'

// Mock settingsStore
vi.mock('../../stores/settingsStore', () => ({
  useSettingsStore: vi.fn(() => ({ enableScrollSync: true })),
}))

describe('BUG-003: useScrollSync 타이밍 이슈', () => {
  let editorDiv: HTMLDivElement
  let previewDiv: HTMLDivElement
  let editorRef: React.RefObject<HTMLDivElement>
  let previewRef: React.RefObject<HTMLDivElement>

  beforeEach(() => {
    // DOM 요소 생성
    editorDiv = document.createElement('div')
    previewDiv = document.createElement('div')
    document.body.appendChild(editorDiv)
    document.body.appendChild(previewDiv)

    // Ref 객체 생성
    editorRef = { current: editorDiv }
    previewRef = { current: previewDiv }
  })

  afterEach(() => {
    document.body.removeChild(editorDiv)
    document.body.removeChild(previewDiv)
    vi.clearAllMocks()
  })

  describe('타이밍 이슈 재현', () => {
    it('should handle delayed .cm-scroller creation (core bug)', async () => {
      // Given - .cm-scroller가 아직 없는 상태에서 훅 초기화
      const { result } = renderHook(() =>
        useScrollSync({ editorRef, previewRef })
      )

      expect(result.current.enableScrollSync).toBe(true)

      // When - 나중에 .cm-scroller가 추가됨 (CodeMirror 마운트 시뮬레이션)
      const cmScroller = document.createElement('div')
      cmScroller.className = 'cm-scroller'

      // 스크롤 속성 설정
      Object.defineProperty(cmScroller, 'scrollHeight', { value: 1000, configurable: true })
      Object.defineProperty(cmScroller, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(cmScroller, 'scrollTop', { value: 400, writable: true, configurable: true })

      // Preview 설정
      Object.defineProperty(previewDiv, 'scrollHeight', { value: 2000, configurable: true })
      Object.defineProperty(previewDiv, 'clientHeight', { value: 400, configurable: true })
      Object.defineProperty(previewDiv, 'scrollTop', { value: 0, writable: true, configurable: true })

      // .cm-scroller를 DOM에 추가 (CodeMirror 마운트 시뮬레이션)
      editorDiv.appendChild(cmScroller)

      // MutationObserver가 감지할 시간 대기
      await new Promise(resolve => setTimeout(resolve, 100))

      // Then - 스크롤 이벤트 발생 시 프리뷰도 동기화되어야 함
      await act(async () => {
        const scrollEvent = new Event('scroll')
        cmScroller.dispatchEvent(scrollEvent)
      })

      // 에디터: 400 / (1000 - 200) = 0.5 (50%)
      // 프리뷰: 0.5 * (2000 - 400) = 800
      expect(previewDiv.scrollTop).toBe(800)
    })

    it('should sync editor scroll to preview', async () => {
      // Given - .cm-scroller가 이미 존재
      const cmScroller = document.createElement('div')
      cmScroller.className = 'cm-scroller'
      Object.defineProperty(cmScroller, 'scrollHeight', { value: 1000, configurable: true })
      Object.defineProperty(cmScroller, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(cmScroller, 'scrollTop', { value: 400, writable: true, configurable: true })
      editorDiv.appendChild(cmScroller)

      // Preview 설정
      Object.defineProperty(previewDiv, 'scrollHeight', { value: 2000, configurable: true })
      Object.defineProperty(previewDiv, 'clientHeight', { value: 400, configurable: true })
      Object.defineProperty(previewDiv, 'scrollTop', { value: 0, writable: true, configurable: true })

      renderHook(() => useScrollSync({ editorRef, previewRef }))

      // MutationObserver가 감지할 시간 대기
      await waitFor(() => {
        // When - 에디터 스크롤
        const scrollEvent = new Event('scroll')
        cmScroller.dispatchEvent(scrollEvent)
      }, { timeout: 500 })

      // Then - 프리뷰도 같은 비율로 스크롤되어야 함
      // 에디터: 400 / (1000 - 200) = 0.5 (50%)
      // 프리뷰: 0.5 * (2000 - 400) = 800
      await waitFor(() => {
        expect(previewDiv.scrollTop).toBe(800)
      }, { timeout: 500 })
    })

    it('should sync preview scroll to editor', async () => {
      // Given - .cm-scroller가 이미 존재
      const cmScroller = document.createElement('div')
      cmScroller.className = 'cm-scroller'
      Object.defineProperty(cmScroller, 'scrollHeight', { value: 1000, configurable: true })
      Object.defineProperty(cmScroller, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(cmScroller, 'scrollTop', { value: 0, writable: true, configurable: true })
      editorDiv.appendChild(cmScroller)

      // Preview 설정
      Object.defineProperty(previewDiv, 'scrollHeight', { value: 2000, configurable: true })
      Object.defineProperty(previewDiv, 'clientHeight', { value: 400, configurable: true })
      Object.defineProperty(previewDiv, 'scrollTop', { value: 800, writable: true, configurable: true })

      renderHook(() => useScrollSync({ editorRef, previewRef }))

      // MutationObserver가 감지할 시간 대기
      await waitFor(() => {
        // When - 프리뷰 스크롤
        const scrollEvent = new Event('scroll')
        previewDiv.dispatchEvent(scrollEvent)
      }, { timeout: 500 })

      // Then - 에디터도 같은 비율로 스크롤되어야 함
      // 프리뷰: 800 / (2000 - 400) = 0.5 (50%)
      // 에디터: 0.5 * (1000 - 200) = 400
      await waitFor(() => {
        expect(cmScroller.scrollTop).toBe(400)
      }, { timeout: 500 })
    })
  })

  describe('enableScrollSync=false', () => {
    it('should not sync when enableScrollSync is false', async () => {
      // Given - enableScrollSync = false
      const { useSettingsStore } = await import('../../stores/settingsStore')
      vi.mocked(useSettingsStore).mockReturnValue({ enableScrollSync: false } as any)

      const cmScroller = document.createElement('div')
      cmScroller.className = 'cm-scroller'
      Object.defineProperty(cmScroller, 'scrollHeight', { value: 1000, configurable: true })
      Object.defineProperty(cmScroller, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(cmScroller, 'scrollTop', { value: 400, writable: true, configurable: true })
      editorDiv.appendChild(cmScroller)

      Object.defineProperty(previewDiv, 'scrollHeight', { value: 2000, configurable: true })
      Object.defineProperty(previewDiv, 'clientHeight', { value: 400, configurable: true })
      Object.defineProperty(previewDiv, 'scrollTop', { value: 0, writable: true, configurable: true })

      renderHook(() => useScrollSync({ editorRef, previewRef }))

      // When - 에디터 스크롤
      await act(async () => {
        const scrollEvent = new Event('scroll')
        cmScroller.dispatchEvent(scrollEvent)
      })

      // Then - 프리뷰는 스크롤되지 않아야 함
      expect(previewDiv.scrollTop).toBe(0)
    })
  })

  describe('무한 루프 방지', () => {
    it('should prevent scroll infinite loop', async () => {
      // Given
      const cmScroller = document.createElement('div')
      cmScroller.className = 'cm-scroller'
      Object.defineProperty(cmScroller, 'scrollHeight', { value: 1000, configurable: true })
      Object.defineProperty(cmScroller, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(cmScroller, 'scrollTop', { value: 0, writable: true, configurable: true })
      editorDiv.appendChild(cmScroller)

      Object.defineProperty(previewDiv, 'scrollHeight', { value: 2000, configurable: true })
      Object.defineProperty(previewDiv, 'clientHeight', { value: 400, configurable: true })
      Object.defineProperty(previewDiv, 'scrollTop', { value: 0, writable: true, configurable: true })

      let editorScrollCount = 0
      let previewScrollCount = 0

      const originalEditorScrollTop = Object.getOwnPropertyDescriptor(cmScroller, 'scrollTop')
      const originalPreviewScrollTop = Object.getOwnPropertyDescriptor(previewDiv, 'scrollTop')

      Object.defineProperty(cmScroller, 'scrollTop', {
        get: () => originalEditorScrollTop?.value || 0,
        set: (val) => {
          editorScrollCount++
          if (originalEditorScrollTop?.set) originalEditorScrollTop.set(val)
        },
        configurable: true,
      })

      Object.defineProperty(previewDiv, 'scrollTop', {
        get: () => originalPreviewScrollTop?.value || 0,
        set: (val) => {
          previewScrollCount++
          if (originalPreviewScrollTop?.set) originalPreviewScrollTop.set(val)
        },
        configurable: true,
      })

      renderHook(() => useScrollSync({ editorRef, previewRef }))

      // When - 빠르게 연속 스크롤
      await act(async () => {
        for (let i = 0; i < 5; i++) {
          cmScroller.dispatchEvent(new Event('scroll'))
          previewDiv.dispatchEvent(new Event('scroll'))
        }
      })

      // Then - 무한 루프 없이 적정 횟수만 실행
      // 정확한 횟수보다는 무한 루프가 아닌 것이 중요
      expect(editorScrollCount + previewScrollCount).toBeLessThan(20)
    })
  })
})
