import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useActiveHeading } from './useActiveHeading'

describe('useActiveHeading', () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>
  let observerCallback: IntersectionObserverCallback

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()

    // IntersectionObserver 모킹
    global.IntersectionObserver = vi.fn((callback) => {
      observerCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      }
    }) as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('빈 헤딩 배열에서 빈 문자열을 반환해야 함', () => {
    const { result } = renderHook(() => useActiveHeading([]))
    expect(result.current).toBe('')
  })

  it('헤딩 ID가 제공되면 Intersection Observer를 생성해야 함', () => {
    const headingIds = ['heading-1', 'heading-2', 'heading-3']

    // 가짜 요소 생성
    headingIds.forEach((id) => {
      const element = document.createElement('div')
      element.id = id
      document.body.appendChild(element)
    })

    renderHook(() => useActiveHeading(headingIds))

    expect(global.IntersectionObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalledTimes(3)

    // 정리
    headingIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) document.body.removeChild(element)
    })
  })

  it('보이는 헤딩이 있으면 활성 ID를 업데이트해야 함', async () => {
    const headingIds = ['heading-1', 'heading-2']

    // 가짜 요소 생성
    const element1 = document.createElement('div')
    element1.id = 'heading-1'
    document.body.appendChild(element1)

    const element2 = document.createElement('div')
    element2.id = 'heading-2'
    document.body.appendChild(element2)

    const { result } = renderHook(() => useActiveHeading(headingIds))

    // 초기 상태
    expect(result.current).toBe('')

    // 헤딩이 보이는 상황 시뮬레이션
    const entries: IntersectionObserverEntry[] = [
      {
        target: element1,
        isIntersecting: true,
        boundingClientRect: { top: 100 } as DOMRectReadOnly,
      } as IntersectionObserverEntry,
      {
        target: element2,
        isIntersecting: true,
        boundingClientRect: { top: 200 } as DOMRectReadOnly,
      } as IntersectionObserverEntry,
    ]

    observerCallback(entries, {} as IntersectionObserver)

    await waitFor(() => {
      expect(result.current).toBe('heading-1')
    })

    // 정리
    document.body.removeChild(element1)
    document.body.removeChild(element2)
  })

  it('언마운트 시 observer를 정리해야 함', () => {
    const headingIds = ['heading-1']

    const element = document.createElement('div')
    element.id = 'heading-1'
    document.body.appendChild(element)

    const { unmount } = renderHook(() => useActiveHeading(headingIds))

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()

    document.body.removeChild(element)
  })
})
