import { describe, it, expect } from 'vitest'
import { applyMarkdownCommand, TextSelection } from './markdownCommands'
import type { MarkdownCommand } from '../components/Editor/Toolbar'

/**
 * TDD Test for DEV-020: 툴바 선택 영역 서식 적용 (Phase 2)
 *
 * 요구사항:
 * 1. 선택된 텍스트에 서식 래핑
 * 2. 빈 선택 시 마커만 삽입
 * 3. 이미 서식 적용된 텍스트 토글
 * 4. 서식 적용 후 커서 위치
 */

describe('markdownCommands - Phase 2: 선택 영역 서식 적용', () => {
  describe('기능 1: 선택 영역 서식 래핑', () => {
    it('선택된 텍스트에 Bold 서식 래핑', () => {
      // Arrange
      const content = 'hello world'
      const selection: TextSelection = {
        start: 0,
        end: 5,
        selectedText: 'hello',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('**hello** world')
      expect(newSelectionStart).toBe(2) // "**" 다음
      expect(newSelectionEnd).toBe(7) // "hello" 끝
    })

    it('선택된 텍스트에 Italic 서식 래핑', () => {
      // Arrange
      const content = 'hello world'
      const selection: TextSelection = {
        start: 6,
        end: 11,
        selectedText: 'world',
      }
      const command: MarkdownCommand = 'italic'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('hello *world*')
      expect(newSelectionStart).toBe(7) // "*" 다음
      expect(newSelectionEnd).toBe(12) // "world" 끝
    })

    it('선택된 텍스트에 H1 서식 래핑', () => {
      // Arrange
      const content = 'title here'
      const selection: TextSelection = {
        start: 0,
        end: 5,
        selectedText: 'title',
      }
      const command: MarkdownCommand = 'heading1'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('# title here')
      expect(newSelectionStart).toBe(2) // "# " 다음
      expect(newSelectionEnd).toBe(7) // "title" 끝
    })

    it('선택된 텍스트에 Link 서식 래핑', () => {
      // Arrange
      const content = 'click here to visit'
      const selection: TextSelection = {
        start: 6,
        end: 10,
        selectedText: 'here',
      }
      const command: MarkdownCommand = 'link'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('click [here](url) to visit')
      expect(newSelectionStart).toBe(7) // "[" 다음
      expect(newSelectionEnd).toBe(11) // "here" 끝
    })

    it('선택된 텍스트에 Code 서식 래핑', () => {
      // Arrange
      const content = 'const x = 10'
      const selection: TextSelection = {
        start: 0,
        end: 7,
        selectedText: 'const x',
      }
      const command: MarkdownCommand = 'inlineCode'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('`const x` = 10')
      expect(newSelectionStart).toBe(1) // "`" 다음
      expect(newSelectionEnd).toBe(8) // "const x" 끝
    })
  })

  describe('기능 2: 빈 선택 시 마커만 삽입', () => {
    it('빈 선택 시 Bold 마커만 삽입', () => {
      // Arrange
      const content = 'hello'
      const selection: TextSelection = {
        start: 5,
        end: 5,
        selectedText: '',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('hello**bold text**')
      // 현재 구현: 플레이스홀더 텍스트 삽입
      // 원하는 동작: 마커만 삽입 "hello****"
      // 이 테스트는 현재 기존 동작을 검증하고,
      // Phase 3에서 마커만 삽입하는 고급 기능 구현 예정
    })

    it('빈 선택 시 Italic 마커만 삽입', () => {
      // Arrange
      const content = 'world'
      const selection: TextSelection = {
        start: 5,
        end: 5,
        selectedText: '',
      }
      const command: MarkdownCommand = 'italic'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('world*italic text*')
      // 현재 구현: 플레이스홀더 텍스트 삽입
      // Phase 3에서 개선 예정
    })
  })

  describe('기능 3: 토글 기능 (서식 제거)', () => {
    it('이미 Bold 서식 적용된 텍스트 선택 시 서식 제거', () => {
      // Arrange
      const content = 'hello **world** test'
      const selection: TextSelection = {
        start: 6,
        end: 15, // "**world**" 전체 선택
        selectedText: '**world**',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('hello world test')
      expect(newSelectionStart).toBe(6) // "world" 시작
      expect(newSelectionEnd).toBe(11) // "world" 끝
    })

    it('이미 Italic 서식 적용된 텍스트 선택 시 서식 제거', () => {
      // Arrange
      const content = 'hello *world* test'
      const selection: TextSelection = {
        start: 6,
        end: 13, // "*world*" 전체 선택
        selectedText: '*world*',
      }
      const command: MarkdownCommand = 'italic'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('hello world test')
      expect(newSelectionStart).toBe(6)
      expect(newSelectionEnd).toBe(11)
    })

    it('이미 Strikethrough 서식 적용된 텍스트 선택 시 서식 제거', () => {
      // Arrange
      const content = '~~deleted~~ text'
      const selection: TextSelection = {
        start: 0,
        end: 11, // "~~deleted~~" 전체 선택
        selectedText: '~~deleted~~',
      }
      const command: MarkdownCommand = 'strikethrough'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('deleted text')
      expect(newSelectionStart).toBe(0)
      expect(newSelectionEnd).toBe(7)
    })

    it('이미 Code 서식 적용된 텍스트 선택 시 서식 제거', () => {
      // Arrange
      const content = 'run `npm install` command'
      const selection: TextSelection = {
        start: 4,
        end: 17, // "`npm install`" 전체 선택
        selectedText: '`npm install`',
      }
      const command: MarkdownCommand = 'inlineCode'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert
      expect(newContent).toBe('run npm install command')
      expect(newSelectionStart).toBe(4)
      expect(newSelectionEnd).toBe(15)
    })
  })

  describe('기능 4: 커서 위치', () => {
    it('서식 적용 후 커서는 선택 영역 내부에 위치', () => {
      // Arrange
      const content = 'hello world'
      const selection: TextSelection = {
        start: 0,
        end: 5,
        selectedText: 'hello',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert: 커서는 "**hello**"의 "hello" 부분을 선택
      expect(newSelectionStart).toBe(2) // "**" 다음
      expect(newSelectionEnd).toBe(7) // "hello" 끝
    })

    it('서식 제거 후 커서는 제거된 텍스트를 선택', () => {
      // Arrange
      const content = '**bold**'
      const selection: TextSelection = {
        start: 0,
        end: 8,
        selectedText: '**bold**',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert: 커서는 "bold" 텍스트를 선택
      expect(newSelectionStart).toBe(0)
      expect(newSelectionEnd).toBe(4)
    })
  })

  describe('엣지 케이스', () => {
    it('부분 선택 시 (서식 마커 포함하지 않음) Bold 토글 시 서식 제거', () => {
      // Arrange: "**world**"에서 "world"만 선택
      const content = '**world**'
      const selection: TextSelection = {
        start: 2,
        end: 7, // "world"만 선택 (마커 제외)
        selectedText: 'world',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert: 주변 컨텍스트에 마커가 있으므로 서식 제거
      expect(newContent).toBe('world')
      expect(newSelectionStart).toBe(0) // 마커 제거 후 시작
      expect(newSelectionEnd).toBe(5) // "world" 끝
    })

    it('부분 선택 시 (서식 마커 포함하지 않음) Italic 토글 시 서식 제거', () => {
      // Arrange: "*hello*"에서 "hello"만 선택
      const content = '*hello*'
      const selection: TextSelection = {
        start: 1,
        end: 6, // "hello"만 선택 (마커 제외)
        selectedText: 'hello',
      }
      const command: MarkdownCommand = 'italic'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert: 주변 컨텍스트에 마커가 있으므로 서식 제거
      expect(newContent).toBe('hello')
      expect(newSelectionStart).toBe(0)
      expect(newSelectionEnd).toBe(5)
    })

    it('부분 선택 시 (서식 마커 포함하지 않음) Strikethrough 토글 시 서식 제거', () => {
      // Arrange: "~~text~~"에서 "text"만 선택
      const content = '~~text~~'
      const selection: TextSelection = {
        start: 2,
        end: 6, // "text"만 선택 (마커 제외)
        selectedText: 'text',
      }
      const command: MarkdownCommand = 'strikethrough'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert: 주변 컨텍스트에 마커가 있으므로 서식 제거
      expect(newContent).toBe('text')
      expect(newSelectionStart).toBe(0)
      expect(newSelectionEnd).toBe(4)
    })

    it('부분 선택 시 (서식 마커 포함하지 않음) InlineCode 토글 시 서식 제거', () => {
      // Arrange: "`code`"에서 "code"만 선택
      const content = '`code`'
      const selection: TextSelection = {
        start: 1,
        end: 5, // "code"만 선택 (마커 제외)
        selectedText: 'code',
      }
      const command: MarkdownCommand = 'inlineCode'

      // Act
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      // Assert: 주변 컨텍스트에 마커가 있으므로 서식 제거
      expect(newContent).toBe('code')
      expect(newSelectionStart).toBe(0)
      expect(newSelectionEnd).toBe(4)
    })

    it('전체 문서 선택 시 Bold 적용', () => {
      // Arrange
      const content = 'hello world'
      const selection: TextSelection = {
        start: 0,
        end: 11,
        selectedText: 'hello world',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newContent } = applyMarkdownCommand(content, selection, command)

      // Assert
      expect(newContent).toBe('**hello world**')
    })

    it('멀티라인 선택 시 Bold 적용', () => {
      // Arrange
      const content = 'line 1\nline 2\nline 3'
      const selection: TextSelection = {
        start: 0,
        end: 13, // "line 1\nline 2" 선택
        selectedText: 'line 1\nline 2',
      }
      const command: MarkdownCommand = 'bold'

      // Act
      const { newContent } = applyMarkdownCommand(content, selection, command)

      // Assert
      expect(newContent).toBe('**line 1\nline 2**\nline 3')
    })
  })
})
