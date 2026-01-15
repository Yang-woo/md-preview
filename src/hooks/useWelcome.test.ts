import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWelcome } from './useWelcome'

describe('useWelcome', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('첫 방문 감지', () => {
    it('첫 방문 시 isFirstVisit가 true여야 함', () => {
      const { result } = renderHook(() => useWelcome())

      expect(result.current.isFirstVisit).toBe(true)
      expect(result.current.showWelcome).toBe(true)
    })

    it('이전 방문 기록이 있으면 isFirstVisit가 false여야 함', () => {
      localStorage.setItem('md-preview-visited', 'true')

      const { result } = renderHook(() => useWelcome())

      expect(result.current.isFirstVisit).toBe(false)
      expect(result.current.showWelcome).toBe(false)
    })

    it('방문 기록이 localStorage에 저장되어야 함', () => {
      renderHook(() => useWelcome())

      // 첫 방문 시 자동으로 기록되지 않아야 함 (사용자 액션 후 기록)
      expect(localStorage.getItem('md-preview-visited')).toBeNull()
    })
  })

  describe('환영 메시지 표시', () => {
    it('첫 방문 시 환영 메시지가 표시되어야 함', () => {
      const { result } = renderHook(() => useWelcome())

      expect(result.current.showWelcome).toBe(true)
    })

    it('환영 메시지를 닫을 수 있어야 함', () => {
      const { result } = renderHook(() => useWelcome())

      act(() => {
        result.current.dismissWelcome()
      })

      expect(result.current.showWelcome).toBe(false)
      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })

    it('시작하기 버튼을 클릭하면 환영 메시지가 닫히고 방문 기록이 저장되어야 함', () => {
      const onStart = vi.fn()
      const { result } = renderHook(() => useWelcome({ onStart }))

      act(() => {
        result.current.startTutorial()
      })

      expect(result.current.showWelcome).toBe(false)
      expect(localStorage.getItem('md-preview-visited')).toBe('true')
      expect(onStart).toHaveBeenCalledTimes(1)
    })

    it('환영 메시지를 수동으로 다시 표시할 수 있어야 함', () => {
      localStorage.setItem('md-preview-visited', 'true')

      const { result } = renderHook(() => useWelcome())

      expect(result.current.showWelcome).toBe(false)

      act(() => {
        result.current.showWelcomeModal()
      })

      expect(result.current.showWelcome).toBe(true)
    })
  })

  describe('샘플 콘텐츠 로드', () => {
    it('환영 샘플 마크다운을 가져올 수 있어야 함', () => {
      const { result } = renderHook(() => useWelcome())

      expect(result.current.welcomeContent).toBeDefined()
      expect(result.current.welcomeContent).toContain('# 환영합니다')
    })

    it('샘플 콘텐츠를 에디터에 로드할 수 있어야 함', () => {
      const onLoadSample = vi.fn()
      const { result } = renderHook(() => useWelcome({ onLoadSample }))

      act(() => {
        result.current.loadSampleContent()
      })

      expect(onLoadSample).toHaveBeenCalledWith(result.current.welcomeContent)
    })
  })

  describe('방문 횟수 추적', () => {
    it('방문 횟수를 추적해야 함', () => {
      const { result, unmount } = renderHook(() => useWelcome())

      expect(result.current.visitCount).toBe(1)

      act(() => {
        result.current.dismissWelcome()
      })

      // 언마운트 후 두 번째 방문 시뮬레이션
      unmount()

      // 두 번째 방문
      const { result: result2 } = renderHook(() => useWelcome())

      expect(result2.current.visitCount).toBe(2)
    })

    it('3번째 방문 이후에는 환영 메시지를 자동으로 표시하지 않아야 함', () => {
      localStorage.setItem('md-preview-visited', 'true')
      localStorage.setItem('md-preview-visit-count', '3')

      const { result } = renderHook(() => useWelcome())

      expect(result.current.showWelcome).toBe(false)
    })
  })

  describe('재설정', () => {
    it('방문 기록을 재설정할 수 있어야 함', () => {
      localStorage.setItem('md-preview-visited', 'true')
      localStorage.setItem('md-preview-visit-count', '5')

      const { result } = renderHook(() => useWelcome())

      act(() => {
        result.current.resetWelcome()
      })

      expect(localStorage.getItem('md-preview-visited')).toBeNull()
      expect(localStorage.getItem('md-preview-visit-count')).toBeNull()
      expect(result.current.showWelcome).toBe(true)
      expect(result.current.isFirstVisit).toBe(true)
    })
  })
})
