import { describe, it, expect } from 'vitest'
import { applyMarkdownCommand, TextSelection } from './markdownCommands'
import type { MarkdownCommand } from '../components/Editor/Toolbar'

/**
 * BUG-005 검증 테스트
 *
 * 이슈: 마크다운 서식 토글 해제가 작동하지 않음
 *
 * 재현 방법:
 * 1. "hello" 선택
 * 2. Bold 버튼 클릭 → "**hello**"
 * 3. 커서가 "hello"만 선택된 상태
 * 4. 다시 Bold 버튼 클릭
 *
 * 예상: 서식 제거 → "hello"
 * 버그: 중복 적용 → "****hello****"
 */
describe('BUG-005: 마크다운 서식 토글 해제', () => {
  describe('시나리오: Bold 서식 토글', () => {
    it('Step 1: 텍스트에 Bold 적용', () => {
      // Arrange
      const content = 'hello world'
      const selection: TextSelection = {
        start: 0,
        end: 5,
        selectedText: 'hello',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const result = applyMarkdownCommand(content, selection, command)

      // Assert
      expect(result.newContent).toBe('**hello** world')
      // 서식 적용 후 커서는 내부 텍스트를 선택 (마커 제외)
      expect(result.newSelectionStart).toBe(2) // "**" 다음
      expect(result.newSelectionEnd).toBe(7) // "hello" 끝
    })

    it('Step 2: 내부 텍스트만 선택한 상태에서 Bold 재클릭 → 서식 제거', () => {
      // Arrange: Step 1의 결과 상태
      const content = '**hello** world'
      const selection: TextSelection = {
        start: 2, // Step 1의 newSelectionStart
        end: 7, // Step 1의 newSelectionEnd
        selectedText: 'hello', // 마커 제외
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const result = applyMarkdownCommand(content, selection, command)

      // Assert: 서식 제거 (버그 수정 전: "****hello****")
      expect(result.newContent).toBe('hello world')
      expect(result.newSelectionStart).toBe(0)
      expect(result.newSelectionEnd).toBe(5)
    })
  })

  describe('시나리오: Italic 서식 토글', () => {
    it('Step 1: 텍스트에 Italic 적용', () => {
      const content = 'hello world'
      const selection: TextSelection = {
        start: 6,
        end: 11,
        selectedText: 'world',
      }
      const command: MarkdownCommand = 'italic'

      const result = applyMarkdownCommand(content, selection, command)

      expect(result.newContent).toBe('hello *world*')
      expect(result.newSelectionStart).toBe(7)
      expect(result.newSelectionEnd).toBe(12)
    })

    it('Step 2: 내부 텍스트만 선택한 상태에서 Italic 재클릭 → 서식 제거', () => {
      const content = 'hello *world*'
      const selection: TextSelection = {
        start: 7,
        end: 12,
        selectedText: 'world',
      }
      const command: MarkdownCommand = 'italic'

      const result = applyMarkdownCommand(content, selection, command)

      expect(result.newContent).toBe('hello world')
      expect(result.newSelectionStart).toBe(6)
      expect(result.newSelectionEnd).toBe(11)
    })
  })

  describe('시나리오: Strikethrough 서식 토글', () => {
    it('Step 1: 텍스트에 Strikethrough 적용', () => {
      const content = 'delete this'
      const selection: TextSelection = {
        start: 0,
        end: 6,
        selectedText: 'delete',
      }
      const command: MarkdownCommand = 'strikethrough'

      const result = applyMarkdownCommand(content, selection, command)

      expect(result.newContent).toBe('~~delete~~ this')
      expect(result.newSelectionStart).toBe(2)
      expect(result.newSelectionEnd).toBe(8)
    })

    it('Step 2: 내부 텍스트만 선택한 상태에서 Strikethrough 재클릭 → 서식 제거', () => {
      const content = '~~delete~~ this'
      const selection: TextSelection = {
        start: 2,
        end: 8,
        selectedText: 'delete',
      }
      const command: MarkdownCommand = 'strikethrough'

      const result = applyMarkdownCommand(content, selection, command)

      expect(result.newContent).toBe('delete this')
      expect(result.newSelectionStart).toBe(0)
      expect(result.newSelectionEnd).toBe(6)
    })
  })

  describe('시나리오: InlineCode 서식 토글', () => {
    it('Step 1: 텍스트에 InlineCode 적용', () => {
      const content = 'run npm install'
      const selection: TextSelection = {
        start: 4,
        end: 15,
        selectedText: 'npm install',
      }
      const command: MarkdownCommand = 'inlineCode'

      const result = applyMarkdownCommand(content, selection, command)

      expect(result.newContent).toBe('run `npm install`')
      expect(result.newSelectionStart).toBe(5)
      expect(result.newSelectionEnd).toBe(16)
    })

    it('Step 2: 내부 텍스트만 선택한 상태에서 InlineCode 재클릭 → 서식 제거', () => {
      const content = 'run `npm install`'
      const selection: TextSelection = {
        start: 5,
        end: 16,
        selectedText: 'npm install',
      }
      const command: MarkdownCommand = 'inlineCode'

      const result = applyMarkdownCommand(content, selection, command)

      expect(result.newContent).toBe('run npm install')
      expect(result.newSelectionStart).toBe(4)
      expect(result.newSelectionEnd).toBe(15)
    })
  })

  describe('엣지 케이스: 연속 토글', () => {
    it('Bold 적용 → 제거 → 다시 적용', () => {
      let content = 'test'
      let selection: TextSelection = {
        start: 0,
        end: 4,
        selectedText: 'test',
      }

      // Step 1: Bold 적용
      let result = applyMarkdownCommand(content, selection, 'bold')
      expect(result.newContent).toBe('**test**')

      // Step 2: 서식 제거 (내부 선택)
      content = result.newContent
      selection = {
        start: result.newSelectionStart,
        end: result.newSelectionEnd,
        selectedText: 'test',
      }
      result = applyMarkdownCommand(content, selection, 'bold')
      expect(result.newContent).toBe('test')

      // Step 3: 다시 적용
      content = result.newContent
      selection = {
        start: result.newSelectionStart,
        end: result.newSelectionEnd,
        selectedText: 'test',
      }
      result = applyMarkdownCommand(content, selection, 'bold')
      expect(result.newContent).toBe('**test**')
    })
  })
})
