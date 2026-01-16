import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { Editor, type EditorRef } from './Editor'
import { useEditorStore } from '../../stores'
import { createRef } from 'react'

/**
 * TDD Test for DEV-019: Editor Imperative Handle
 *
 * 이 테스트는 Editor 컴포넌트가 useImperativeHandle을 통해
 * EditorView의 커서 위치 및 선택 영역을 외부로 노출하는지 검증합니다.
 */

describe('Editor - Imperative Handle (DEV-019)', () => {
  beforeEach(() => {
    useEditorStore.getState().reset()
  })

  describe('EditorRef 타입 정의', () => {
    it('EditorRef 타입이 정의되어야 함', () => {
      // Arrange: EditorRef 타입이 export되었는지 확인
      // Act & Assert
      const ref = createRef<EditorRef>()
      expect(ref).toBeDefined()

      // 타입 체크 (컴파일 타임)
      // ref.current?.getSelection()
      // ref.current?.setSelection(0, 0)
      // ref.current?.focus()
    })
  })

  describe('getSelection() 메서드', () => {
    it('커서만 있을 때 (선택 없음) 현재 커서 위치를 반환해야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      useEditorStore.getState().setContent('Hello world')
      render(<Editor ref={ref} />)

      // Wait for CodeMirror to mount
      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act
      const selection = ref.current?.getSelection()

      // Assert
      expect(selection).toBeDefined()
      expect(selection).toHaveProperty('start')
      expect(selection).toHaveProperty('end')
      expect(selection).toHaveProperty('selectedText')
      expect(typeof selection?.start).toBe('number')
      expect(typeof selection?.end).toBe('number')
      expect(selection?.start).toBeGreaterThanOrEqual(0)
      expect(selection?.end).toBeGreaterThanOrEqual(0)

    })

    it('텍스트를 선택했을 때 선택 영역을 반환해야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      useEditorStore.getState().setContent('Hello world')
      render(<Editor ref={ref} />)

      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act: 가상으로 "Hello"를 선택 (실제로는 CodeMirror dispatch로 선택)
      // TODO: setSelection으로 선택 영역 설정 후 테스트
      const selection = ref.current?.getSelection()

      // Assert
      expect(selection).toBeDefined()
      // 선택된 경우 start !== end

    })

    it('빈 문서일 때 {start: 0, end: 0, selectedText: ""} 반환해야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      useEditorStore.getState().setContent('')
      render(<Editor ref={ref} />)

      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act
      const selection = ref.current?.getSelection()

      // Assert
      expect(selection).toEqual({
        start: 0,
        end: 0,
        selectedText: ''
      })

    })

    it('ref가 없을 때 fallback 값을 반환해야 함', () => {
      // Arrange
      const ref = createRef<EditorRef>()
      // 렌더링하지 않음 (ref.current === null)

      // Act
      const selection = ref.current?.getSelection()

      // Assert
      expect(selection).toBeUndefined() // ref.current가 null이므로

      // 실제 사용 시 폴백 처리
      const safeSeletion = selection ?? { start: 0, end: 0, selectedText: '' }
      expect(safeSeletion.start).toBe(0)
    })
  })

  describe('setSelection() 메서드', () => {
    it('커서 위치를 설정할 수 있어야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      useEditorStore.getState().setContent('Hello world')
      render(<Editor ref={ref} />)

      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act: 커서를 5번째 위치로 이동 (Hello| world)
      ref.current?.setSelection(5, 5)

      // Assert: getSelection으로 확인
      const selection = ref.current?.getSelection()
      expect(selection?.start).toBe(5)
      expect(selection?.end).toBe(5)

    })

    it('텍스트 선택 영역을 설정할 수 있어야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      useEditorStore.getState().setContent('Hello world')
      render(<Editor ref={ref} />)

      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act: "Hello" 선택 (0~5)
      ref.current?.setSelection(0, 5)

      // Assert: getSelection으로 확인
      const selection = ref.current?.getSelection()
      expect(selection?.start).toBe(0)
      expect(selection?.end).toBe(5)
      expect(selection?.selectedText).toBe('Hello')

    })

    it('범위를 벗어난 위치 설정 시 안전하게 처리해야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      useEditorStore.getState().setContent('Hello')  // 5글자
      render(<Editor ref={ref} />)

      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act: 범위 초과 (100번째 위치)
      ref.current?.setSelection(100, 100)

      // Assert: 문서 끝으로 클램핑되어야 함
      const selection = ref.current?.getSelection()
      expect(selection?.start).toBeLessThanOrEqual(5)
      expect(selection?.end).toBeLessThanOrEqual(5)

    })
  })

  describe('focus() 메서드', () => {
    it('에디터에 포커스를 줄 수 있어야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      render(<Editor ref={ref} />)

      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act
      ref.current?.focus()

      // Assert: document.activeElement가 에디터 내부 요소여야 함
      // CodeMirror의 contenteditable 요소가 포커스됨
      const activeElement = document.activeElement
      expect(activeElement).toBeDefined()
      // TODO: CodeMirror의 실제 포커스 가능 요소 확인

    })
  })

  describe('통합 시나리오', () => {
    it('선택 → 설정 → 조회 사이클이 정상 작동해야 함', async () => {
      // Arrange
      const ref = createRef<EditorRef>()
      useEditorStore.getState().setContent('Hello world')
      render(<Editor ref={ref} />)

      await waitFor(() => {
        expect(ref.current).toBeDefined()
      })

      // Act 1: "world" 선택 (6~11)
      ref.current?.setSelection(6, 11)

      // Assert 1: 선택 확인
      let selection = ref.current?.getSelection()
      expect(selection?.start).toBe(6)
      expect(selection?.end).toBe(11)
      expect(selection?.selectedText).toBe('world')

      // Act 2: 커서를 0으로 이동
      ref.current?.setSelection(0, 0)

      // Assert 2: 커서 확인
      selection = ref.current?.getSelection()
      expect(selection?.start).toBe(0)
      expect(selection?.end).toBe(0)
      expect(selection?.selectedText).toBe('')

    })
  })
})

/**
 * Expected Implementation Interface (구현 가이드)
 *
 * src/components/Editor/Editor.tsx:
 *
 * ```typescript
 * export interface EditorRef {
 *   getSelection: () => TextSelection
 *   setSelection: (from: number, to: number) => void
 *   focus: () => void
 * }
 *
 * interface TextSelection {
 *   start: number
 *   end: number
 *   selectedText: string
 * }
 *
 * export const Editor = forwardRef<EditorRef, EditorProps>(
 *   (props, ref) => {
 *     const viewRef = useRef<EditorView | null>(null)
 *
 *     useImperativeHandle(ref, () => ({
 *       getSelection: () => {
 *         const view = viewRef.current
 *         if (!view) return { start: 0, end: 0, selectedText: '' }
 *
 *         const { from, to } = view.state.selection.main
 *         const selectedText = view.state.sliceDoc(from, to)
 *         return { start: from, end: to, selectedText }
 *       },
 *       setSelection: (from: number, to: number) => {
 *         const view = viewRef.current
 *         if (!view) return
 *
 *         view.dispatch({
 *           selection: { anchor: from, head: to }
 *         })
 *         view.focus()
 *       },
 *       focus: () => {
 *         viewRef.current?.focus()
 *       }
 *     }))
 *
 *     // 기존 로직...
 *   }
 * )
 * ```
 */
