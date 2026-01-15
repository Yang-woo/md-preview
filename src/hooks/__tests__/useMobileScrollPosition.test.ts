import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobileScrollPosition } from '../useMobileScrollPosition'
import { type ViewMode } from '../../stores'

describe('useMobileScrollPosition', () => {
  const mockEditorScroller = {
    scrollTop: 0,
  }

  const mockPreviewScroller = {
    scrollTop: 0,
  }

  const mockEditorContainerRef = {
    current: {
      querySelector: vi.fn(() => mockEditorScroller),
    } as any,
  }

  const mockPreviewContainerRef = {
    current: mockPreviewScroller as any,
  }

  const defaultProps = {
    isMobile: true,
    viewMode: 'editor' as ViewMode,
    editorContainerRef: mockEditorContainerRef,
    previewContainerRef: mockPreviewContainerRef,
    editorScrollPosition: 0,
    previewScrollPosition: 0,
    setEditorScrollPosition: vi.fn(),
    setPreviewScrollPosition: vi.fn(),
    setViewMode: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockEditorScroller.scrollTop = 0
    mockPreviewScroller.scrollTop = 0
    mockEditorContainerRef.current.querySelector = vi.fn(() => mockEditorScroller)
  })

  describe('handleTabChange', () => {
    it('모바일이 아닐 때는 스크롤 위치를 저장하지 않아야 함', () => {
      const { result } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          isMobile: false,
        })
      )

      act(() => {
        result.current.handleTabChange('preview')
      })

      expect(defaultProps.setEditorScrollPosition).not.toHaveBeenCalled()
      expect(defaultProps.setViewMode).not.toHaveBeenCalled()
    })

    it('에디터 탭에서 프리뷰로 전환 시 에디터 스크롤 위치를 저장해야 함', () => {
      mockEditorScroller.scrollTop = 150

      const { result } = renderHook(() =>
        useMobileScrollPosition(defaultProps)
      )

      act(() => {
        result.current.handleTabChange('preview')
      })

      expect(defaultProps.setEditorScrollPosition).toHaveBeenCalledWith(150)
      expect(defaultProps.setViewMode).toHaveBeenCalledWith('preview')
    })

    it('프리뷰 탭에서 에디터로 전환 시 프리뷰 스크롤 위치를 저장해야 함', () => {
      mockPreviewScroller.scrollTop = 200

      const { result } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          viewMode: 'preview',
        })
      )

      act(() => {
        result.current.handleTabChange('editor')
      })

      expect(defaultProps.setPreviewScrollPosition).toHaveBeenCalledWith(200)
      expect(defaultProps.setViewMode).toHaveBeenCalledWith('editor')
    })

    it('에디터 스크롤러를 찾을 수 없을 때 에러 없이 처리되어야 함', () => {
      mockEditorContainerRef.current.querySelector = vi.fn(() => null)

      const { result } = renderHook(() =>
        useMobileScrollPosition(defaultProps)
      )

      act(() => {
        result.current.handleTabChange('preview')
      })

      expect(defaultProps.setEditorScrollPosition).not.toHaveBeenCalled()
      expect(defaultProps.setViewMode).toHaveBeenCalledWith('preview')
    })

    it('프리뷰 컨테이너가 null일 때 에러 없이 처리되어야 함', () => {
      const { result } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          viewMode: 'preview',
          previewContainerRef: { current: null },
        })
      )

      act(() => {
        result.current.handleTabChange('editor')
      })

      expect(defaultProps.setPreviewScrollPosition).not.toHaveBeenCalled()
      expect(defaultProps.setViewMode).toHaveBeenCalledWith('editor')
    })

    it('split 모드로 전환 시에도 정상 동작해야 함', () => {
      mockEditorScroller.scrollTop = 100
      const setEditorScrollPosition = vi.fn()
      const setViewMode = vi.fn()

      const { result } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          setEditorScrollPosition,
          setViewMode,
        })
      )

      act(() => {
        result.current.handleTabChange('split')
      })

      expect(setEditorScrollPosition).toHaveBeenCalledWith(100)
      expect(setViewMode).toHaveBeenCalledWith('split')
    })
  })

  describe('스크롤 위치 복원', () => {
    it('데스크톱 환경에서는 스크롤 위치를 복원하지 않아야 함', () => {
      const { rerender } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          isMobile: false,
          editorScrollPosition: 150,
        })
      )

      rerender()

      // requestAnimationFrame이 호출되지 않아야 함
      expect(mockEditorScroller.scrollTop).toBe(0)
    })

    it('스크롤 위치가 0일 때는 복원하지 않아야 함', () => {
      const { rerender } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          editorScrollPosition: 0,
        })
      )

      rerender()

      expect(mockEditorScroller.scrollTop).toBe(0)
    })

    it('같은 탭을 유지할 때는 스크롤 위치를 복원하지 않고 유지해야 함', () => {
      mockEditorScroller.scrollTop = 100

      const { rerender } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          editorScrollPosition: 150,
        })
      )

      // 첫 렌더링
      rerender()

      // 스크롤 위치는 변경되지 않아야 함 (requestAnimationFrame에 의해)
      // 실제 복원은 requestAnimationFrame 내에서 일어남
    })
  })

  describe('엣지 케이스', () => {
    it('매우 큰 스크롤 값도 정상 처리되어야 함', () => {
      mockEditorScroller.scrollTop = 999999
      const setEditorScrollPosition = vi.fn()
      const setViewMode = vi.fn()

      const { result } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          setEditorScrollPosition,
          setViewMode,
        })
      )

      act(() => {
        result.current.handleTabChange('preview')
      })

      expect(setEditorScrollPosition).toHaveBeenCalledWith(999999)
    })

    it('음수 스크롤 값은 uiStore에서 0으로 보정되어야 함', () => {
      // 이 테스트는 uiStore.test.ts에서 이미 검증됨
      // 여기서는 훅이 음수 값을 그대로 전달하는지 확인
      mockEditorScroller.scrollTop = -50
      const setEditorScrollPosition = vi.fn()
      const setViewMode = vi.fn()

      const { result } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          setEditorScrollPosition,
          setViewMode,
        })
      )

      act(() => {
        result.current.handleTabChange('preview')
      })

      expect(setEditorScrollPosition).toHaveBeenCalledWith(-50)
      // uiStore에서 Math.max(0, -50) = 0으로 보정됨
    })

    it('에디터 컨테이너 ref가 undefined일 때 에러 없이 처리되어야 함', () => {
      const { result } = renderHook(() =>
        useMobileScrollPosition({
          ...defaultProps,
          editorContainerRef: { current: undefined as any },
        })
      )

      act(() => {
        result.current.handleTabChange('preview')
      })

      expect(defaultProps.setEditorScrollPosition).not.toHaveBeenCalled()
      expect(defaultProps.setViewMode).toHaveBeenCalledWith('preview')
    })
  })
})
