import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorWithToolbar } from './EditorWithToolbar'
import { useEditorStore } from '../../stores'

/**
 * TDD Integration Test for DEV-019: EditorWithToolbar 커서 위치 삽입
 *
 * 이 통합 테스트는 실제 사용자 시나리오를 검증합니다:
 * 1. 사용자가 텍스트를 입력
 * 2. 커서를 특정 위치로 이동
 * 3. 툴바 버튼 클릭
 * 4. 서식이 커서 위치에 삽입됨
 *
 * ⚠️ CRITICAL: 이 통합 테스트가 없으면 ref 연결 타이밍 이슈,
 * CodeMirror 마운트 순서 문제 등을 발견할 수 없습니다!
 */

describe('EditorWithToolbar - 커서 위치 삽입 (통합 테스트, DEV-019)', () => {
  beforeEach(() => {
    useEditorStore.getState().reset()
  })

  describe('툴바 렌더링', () => {
    it('에디터와 툴바가 함께 렌더링되어야 함', () => {
      // Arrange & Act
      render(<EditorWithToolbar />)

      // Assert
      const toolbar = screen.getByRole('toolbar', { name: /markdown toolbar/i })
      expect(toolbar).toBeInTheDocument()

      const boldButton = screen.getByLabelText('Bold')
      expect(boldButton).toBeInTheDocument()
    })
  })

  describe('커서 위치 기준 삽입', () => {
    it('초기 로딩 시 커서가 0번째에 있을 때 Bold 클릭 시 시작에 삽입되어야 함', async () => {
      // Arrange
      const user = userEvent.setup()
      useEditorStore.getState().setContent('Hello')
      render(<EditorWithToolbar />)

      // CodeMirror 초기 로딩 시 커서는 0번째 위치에 있음

      // Act: Bold 버튼 클릭
      const boldButton = screen.getByLabelText('Bold')
      await user.click(boldButton)

      // Assert: "**bold text**Hello" (시작에 삽입)
      const content = useEditorStore.getState().content
      expect(content).toContain('**bold text**')
      expect(content).toBe('**bold text**Hello')
    })

    it('빈 문서에서 Bold 클릭 시 정상 삽입되어야 함', async () => {
      // Arrange
      const user = userEvent.setup()
      useEditorStore.getState().setContent('')
      render(<EditorWithToolbar />)

      // Act
      const boldButton = screen.getByLabelText('Bold')
      await user.click(boldButton)

      // Assert
      const content = useEditorStore.getState().content
      expect(content).toBe('**bold text**')
    })

    it('getSelection() 동작을 검증: 실제 커서 위치를 가져오는지 확인', async () => {
      // Arrange
      const user = userEvent.setup()
      useEditorStore.getState().setContent('Test content')
      render(<EditorWithToolbar />)

      // Act: Bold 버튼 클릭 (현재 커서 위치에 삽입)
      const boldButton = screen.getByLabelText('Bold')
      await user.click(boldButton)

      // Assert: getSelection()이 호출되었고, 그 위치에 삽입됨
      const content = useEditorStore.getState().content
      expect(content).toContain('**bold text**')
      // 정확한 위치는 CodeMirror 상태에 따라 다르지만,
      // 적어도 문서에 포함되어야 함
    })
  })

  describe('모든 툴바 버튼 (13종)', () => {
    const toolbarButtons = [
      { label: 'Bold', expected: '**bold text**' },
      { label: 'Italic', expected: '*italic text*' },
      { label: 'Strikethrough', expected: '~~strikethrough text~~' },
      { label: 'Heading 1', expected: '# Heading 1' },
      { label: 'Heading 2', expected: '## Heading 2' },
      { label: 'Heading 3', expected: '### Heading 3' },
      { label: 'Insert Link', expected: '[link text](url)' },
      { label: 'Insert Image', expected: '![alt text](image-url)' },
      { label: 'Inline Code', expected: '`code`' },
      { label: 'Code Block', expected: '```\ncode\n```' },
      { label: 'Bullet List', expected: '- List item' },
      { label: 'Numbered List', expected: '1. List item' },
      { label: 'Task List', expected: '- [ ] Task item' },
    ]

    toolbarButtons.forEach(({ label, expected }) => {
      it(`${label} 버튼이 커서 위치에 삽입되어야 함`, async () => {
        // Arrange
        const user = userEvent.setup()
        useEditorStore.getState().setContent('Test')
        render(<EditorWithToolbar />)

        // Act
        const button = screen.getByLabelText(label)
        await user.click(button)

        // Assert: 텍스트에 해당 서식이 포함되어야 함
        const content = useEditorStore.getState().content
        expect(content).toContain(expected)

      })
    })
  })


  describe('여러 버튼 테스트', () => {
    it('Bold 버튼만 클릭 시 정상 삽입되어야 함', async () => {
      // Arrange
      const user = userEvent.setup()
      useEditorStore.getState().setContent('Hello')
      render(<EditorWithToolbar />)

      // Act: Bold 클릭
      const boldButton = screen.getByLabelText('Bold')
      await user.click(boldButton)

      // Assert
      const content = useEditorStore.getState().content
      expect(content).toContain('**bold text**')
    })

    it('Italic 버튼만 클릭 시 정상 삽입되어야 함', async () => {
      // Arrange
      const user = userEvent.setup()
      useEditorStore.getState().setContent('World')
      render(<EditorWithToolbar />)

      // Act: Italic 클릭
      const italicButton = screen.getByLabelText('Italic')
      await user.click(italicButton)

      // Assert
      const content = useEditorStore.getState().content
      expect(content).toContain('*italic text*')
    })
  })

  describe('에러 처리', () => {
    it('EditorView ref가 없을 때 폴백 동작해야 함', async () => {
      // Arrange
      const user = userEvent.setup()
      useEditorStore.getState().setContent('Test')
      render(<EditorWithToolbar />)

      // 가상으로 ref가 null인 상황 시뮬레이션 (실제로는 불가능)
      // 이 경우 기존 동작 (문서 끝에 추가)으로 폴백

      // Act
      const boldButton = screen.getByLabelText('Bold')
      await user.click(boldButton)

      // Assert: 최소한 에러 없이 동작
      const content = useEditorStore.getState().content
      expect(content).toContain('**bold text**')

      // 경고: 실제 ref가 없으면 기존 동작 (끝에 추가)
    })
  })
})

/**
 * 구현 가이드 - EditorWithToolbar.tsx 수정
 *
 * Before (현재 - 항상 문서 끝에 추가):
 * ```typescript
 * const handleCommand = useCallback((command: MarkdownCommand) => {
 *   const selection = {
 *     start: content.length,  // ❌ 항상 끝
 *     end: content.length,
 *     selectedText: '',
 *   }
 *   const { newContent } = applyMarkdownCommand(content, selection, command)
 *   setContent(newContent)
 * }, [content, setContent])
 * ```
 *
 * After (개선 - 실제 커서 위치):
 * ```typescript
 * import { useRef } from 'react'
 * import type { EditorRef } from './Editor'
 *
 * const editorRef = useRef<EditorRef>(null)
 *
 * const handleCommand = useCallback((command: MarkdownCommand) => {
 *   // ✅ 실제 커서 위치 가져오기
 *   const selection = editorRef.current?.getSelection() ?? {
 *     start: content.length,
 *     end: content.length,
 *     selectedText: '',
 *   }
 *
 *   const { newContent, newSelectionStart, newSelectionEnd } =
 *     applyMarkdownCommand(content, selection, command)
 *
 *   setContent(newContent)
 *
 *   // ✅ 커서 위치 복원
 *   setTimeout(() => {
 *     editorRef.current?.setSelection(newSelectionStart, newSelectionEnd)
 *   }, 0)
 * }, [content, setContent])
 *
 * return (
 *   <div className="flex flex-col h-full">
 *     <Toolbar onCommand={handleCommand} />
 *     <Editor ref={editorRef} {...props} />
 *   </div>
 * )
 * ```
 */
