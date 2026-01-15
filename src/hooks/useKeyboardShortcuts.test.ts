import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  const mockCallbacks = {
    onBold: vi.fn(),
    onItalic: vi.fn(),
    onLink: vi.fn(),
    onSave: vi.fn(),
    onPreviewToggle: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // 이벤트 리스너 정리
    document.removeEventListener('keydown', () => {})
  })

  it('Ctrl+B 또는 Cmd+B로 Bold 콜백을 호출해야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    // Ctrl+B
    const event = new KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallbacks.onBold).toHaveBeenCalledTimes(1)
  })

  it('Ctrl+I 또는 Cmd+I로 Italic 콜백을 호출해야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = new KeyboardEvent('keydown', {
      key: 'i',
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallbacks.onItalic).toHaveBeenCalledTimes(1)
  })

  it('Ctrl+K 또는 Cmd+K로 Link 콜백을 호출해야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallbacks.onLink).toHaveBeenCalledTimes(1)
  })

  it('Ctrl+S 또는 Cmd+S로 Save 콜백을 호출하고 기본 동작을 방지해야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(mockCallbacks.onSave).toHaveBeenCalledTimes(1)
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('Ctrl+Shift+P 또는 Cmd+Shift+P로 Preview Toggle 콜백을 호출해야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = new KeyboardEvent('keydown', {
      key: 'p',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallbacks.onPreviewToggle).toHaveBeenCalledTimes(1)
  })

  it('macOS에서 Cmd 키를 감지해야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = new KeyboardEvent('keydown', {
      key: 'b',
      metaKey: true, // Cmd on macOS
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallbacks.onBold).toHaveBeenCalledTimes(1)
  })

  it('대소문자를 구분하지 않아야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    const event = new KeyboardEvent('keydown', {
      key: 'B', // 대문자
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallbacks.onBold).toHaveBeenCalledTimes(1)
  })

  it('콜백이 제공되지 않으면 호출하지 않아야 함', () => {
    const partialCallbacks = {
      onBold: vi.fn(),
      // onItalic 없음
    }

    renderHook(() =>
      useKeyboardShortcuts(partialCallbacks as typeof mockCallbacks)
    )

    const event = new KeyboardEvent('keydown', {
      key: 'i',
      ctrlKey: true,
      bubbles: true,
    })

    expect(() => document.dispatchEvent(event)).not.toThrow()
  })

  it('인풋 요소에서는 일부 단축키를 무시해야 함', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks))

    // textarea에서 Ctrl+B는 허용
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.focus()

    const event = new KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: true,
      bubbles: true,
    })
    Object.defineProperty(event, 'target', {
      value: textarea,
      writable: false,
    })
    document.dispatchEvent(event)

    expect(mockCallbacks.onBold).toHaveBeenCalledTimes(1)

    document.body.removeChild(textarea)
  })

  it('언마운트 시 이벤트 리스너를 제거해야 함', () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts(mockCallbacks)
    )

    unmount()

    const event = new KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    // 언마운트 후에는 호출되지 않아야 함
    expect(mockCallbacks.onBold).not.toHaveBeenCalled()
  })

  it('단축키 조합을 반환해야 함', () => {
    const { result } = renderHook(() =>
      useKeyboardShortcuts(mockCallbacks)
    )

    expect(result.current.shortcuts).toBeDefined()
    expect(result.current.shortcuts.bold).toBeDefined()
    expect(result.current.shortcuts.bold).toContain('B')
  })
})
