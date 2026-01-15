import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutoSave } from './useAutoSave'

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('자동 저장', () => {
    it('30초 간격으로 자동 저장해야 함', () => {
      const onSave = vi.fn()
      renderHook(() =>
        useAutoSave({
          content: 'test content',
          onSave,
          interval: 30000,
        })
      )

      expect(onSave).not.toHaveBeenCalled()

      // 30초 경과
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith('test content')
    })

    it('콘텐츠가 변경되지 않으면 저장하지 않아야 함', () => {
      const onSave = vi.fn()
      renderHook(() =>
        useAutoSave({
          content: '',
          onSave,
          interval: 30000,
        })
      )

      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(onSave).not.toHaveBeenCalled()
    })

    it('여러 번 자동 저장해야 함', () => {
      const onSave = vi.fn()
      const { rerender } = renderHook(
        ({ content }) =>
          useAutoSave({
            content,
            onSave,
            interval: 30000,
          }),
        {
          initialProps: { content: 'initial' },
        }
      )

      // 첫 번째 저장
      act(() => {
        vi.advanceTimersByTime(30000)
      })
      expect(onSave).toHaveBeenCalledTimes(1)

      // 콘텐츠 변경
      rerender({ content: 'updated' })

      // 두 번째 저장
      act(() => {
        vi.advanceTimersByTime(30000)
      })
      expect(onSave).toHaveBeenCalledTimes(2)
      expect(onSave).toHaveBeenCalledWith('updated')
    })
  })

  describe('페이지 종료 전 저장', () => {
    it('beforeunload 이벤트 시 저장해야 함', () => {
      const onSave = vi.fn()
      renderHook(() =>
        useAutoSave({
          content: 'unsaved content',
          onSave,
        })
      )

      const event = new Event('beforeunload')
      window.dispatchEvent(event)

      expect(onSave).toHaveBeenCalledWith('unsaved content')
    })

    it('빈 콘텐츠는 beforeunload에서 저장하지 않아야 함', () => {
      const onSave = vi.fn()
      renderHook(() =>
        useAutoSave({
          content: '',
          onSave,
        })
      )

      const event = new Event('beforeunload')
      window.dispatchEvent(event)

      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('localStorage 연동', () => {
    it('localStorage에 자동 저장해야 함', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      renderHook(() =>
        useAutoSave({
          content: 'test content',
          key: 'auto-save-test',
        })
      )

      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(setItemSpy).toHaveBeenCalledWith(
        'auto-save-test',
        expect.stringContaining('test content')
      )
    })

    it('localStorage에서 이전 세션 데이터를 불러와야 함', () => {
      const savedData = {
        content: 'previous content',
        timestamp: Date.now(),
      }
      localStorage.setItem('auto-save-test', JSON.stringify(savedData))

      const { result } = renderHook(() =>
        useAutoSave({
          content: '',
          key: 'auto-save-test',
        })
      )

      expect(result.current.hasUnsavedData).toBe(true)
      expect(result.current.savedContent).toBe('previous content')
    })

    it('24시간 이상 된 데이터는 무시해야 함', () => {
      const oldData = {
        content: 'old content',
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25시간 전
      }
      localStorage.setItem('auto-save-test', JSON.stringify(oldData))

      const { result } = renderHook(() =>
        useAutoSave({
          content: '',
          key: 'auto-save-test',
        })
      )

      expect(result.current.hasUnsavedData).toBe(false)
    })
  })

  describe('복구 기능', () => {
    it('저장된 콘텐츠를 복구할 수 있어야 함', () => {
      const savedData = {
        content: 'saved content',
        timestamp: Date.now(),
      }
      localStorage.setItem('auto-save-test', JSON.stringify(savedData))

      const { result } = renderHook(() =>
        useAutoSave({
          content: '',
          key: 'auto-save-test',
        })
      )

      let restoredContent = ''
      act(() => {
        restoredContent = result.current.restore()
      })

      expect(restoredContent).toBe('saved content')
      expect(result.current.hasUnsavedData).toBe(false)
    })

    it('복구 후 저장된 데이터를 삭제해야 함', () => {
      const savedData = {
        content: 'saved content',
        timestamp: Date.now(),
      }
      localStorage.setItem('auto-save-test', JSON.stringify(savedData))

      const { result } = renderHook(() =>
        useAutoSave({
          content: '',
          key: 'auto-save-test',
        })
      )

      act(() => {
        result.current.restore()
      })

      expect(localStorage.getItem('auto-save-test')).toBeNull()
    })

    it('저장된 데이터를 무시할 수 있어야 함', () => {
      const savedData = {
        content: 'saved content',
        timestamp: Date.now(),
      }
      localStorage.setItem('auto-save-test', JSON.stringify(savedData))

      const { result } = renderHook(() =>
        useAutoSave({
          content: '',
          key: 'auto-save-test',
        })
      )

      act(() => {
        result.current.discard()
      })

      expect(result.current.hasUnsavedData).toBe(false)
      expect(localStorage.getItem('auto-save-test')).toBeNull()
    })
  })

  describe('저장 상태', () => {
    it('저장 중 상태를 표시해야 함', async () => {
      let resolveSave: () => void
      const savePromise = new Promise<void>((resolve) => {
        resolveSave = resolve
      })

      const { result } = renderHook(() =>
        useAutoSave({
          content: 'test',
          onSave: async () => {
            return savePromise
          },
        })
      )

      expect(result.current.isSaving).toBe(false)

      act(() => {
        vi.advanceTimersByTime(30000)
      })

      // 저장 중
      expect(result.current.isSaving).toBe(true)

      await act(async () => {
        resolveSave!()
        await savePromise
      })

      // 저장 완료 후 false로 변경됨
      expect(result.current.isSaving).toBe(false)
    })

    it('마지막 저장 시각을 추적해야 함', async () => {
      const { result } = renderHook(() =>
        useAutoSave({
          content: 'test',
          onSave: vi.fn(),
        })
      )

      expect(result.current.lastSaved).toBeNull()

      await act(async () => {
        vi.advanceTimersByTime(30000)
        await Promise.resolve()
      })

      expect(result.current.lastSaved).toBeInstanceOf(Date)
    })
  })

  describe('언마운트', () => {
    it('언마운트 시 타이머를 정리해야 함', () => {
      const onSave = vi.fn()
      const { unmount } = renderHook(() =>
        useAutoSave({
          content: 'test',
          onSave,
        })
      )

      unmount()

      act(() => {
        vi.advanceTimersByTime(30000)
      })

      // 언마운트 후에는 저장되지 않아야 함
      expect(onSave).not.toHaveBeenCalled()
    })
  })
})
