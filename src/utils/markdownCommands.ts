import type { MarkdownCommand } from '../components/Editor/Toolbar'

export interface TextSelection {
  start: number
  end: number
  selectedText: string
}

/**
 * Toggle wrapper: 이미 래핑된 텍스트는 언래핑, 아니면 래핑
 *
 * 주변 컨텍스트도 확인하여 마커가 before/after에 있는 경우도 토글 지원
 */
function toggleWrapper(
  before: string,
  after: string,
  selectedText: string,
  marker: string,
  placeholder: string,
  start: number
): { newContent: string; newSelectionStart: number; newSelectionEnd: number } {
  // Check if already wrapped in selection text
  const isWrappedInSelection = selectedText.startsWith(marker) && selectedText.endsWith(marker)

  // Check if wrapped by surrounding context
  const isWrappedByContext = before.endsWith(marker) && after.startsWith(marker)

  // Italic 특수 케이스: bold(**) 마커와 구별
  const isBoldMarker = marker === '*' && selectedText.startsWith('**')

  // 주변 컨텍스트에 마커가 있는 경우 우선 처리
  if (isWrappedByContext && !isBoldMarker) {
    // 주변 마커 제거
    const newBefore = before.slice(0, -marker.length)
    const newAfter = after.slice(marker.length)
    return {
      newContent: `${newBefore}${selectedText}${newAfter}`,
      newSelectionStart: start - marker.length,
      newSelectionEnd: start - marker.length + selectedText.length,
    }
  } else if (isWrappedInSelection && !isBoldMarker) {
    // 선택 텍스트 내 마커 제거
    const unwrapped = selectedText.slice(marker.length, -marker.length)
    return {
      newContent: `${before}${unwrapped}${after}`,
      newSelectionStart: start,
      newSelectionEnd: start + unwrapped.length,
    }
  } else {
    // Wrap: 서식 적용
    const text = selectedText || placeholder
    return {
      newContent: `${before}${marker}${text}${marker}${after}`,
      newSelectionStart: start + marker.length,
      newSelectionEnd: start + marker.length + text.length,
    }
  }
}

export function applyMarkdownCommand(
  content: string,
  selection: TextSelection,
  command: MarkdownCommand
): { newContent: string; newSelectionStart: number; newSelectionEnd: number } {
  const { start, end, selectedText } = selection
  const before = content.substring(0, start)
  const after = content.substring(end)

  let newContent: string
  let newSelectionStart: number
  let newSelectionEnd: number

  switch (command) {
    case 'bold': {
      const result = toggleWrapper(before, after, selectedText, '**', 'bold text', start)
      newContent = result.newContent
      newSelectionStart = result.newSelectionStart
      newSelectionEnd = result.newSelectionEnd
      break
    }

    case 'italic': {
      const result = toggleWrapper(before, after, selectedText, '*', 'italic text', start)
      newContent = result.newContent
      newSelectionStart = result.newSelectionStart
      newSelectionEnd = result.newSelectionEnd
      break
    }

    case 'strikethrough': {
      const result = toggleWrapper(before, after, selectedText, '~~', 'strikethrough text', start)
      newContent = result.newContent
      newSelectionStart = result.newSelectionStart
      newSelectionEnd = result.newSelectionEnd
      break
    }

    case 'heading1':
      newContent = insertHeading(before, after, selectedText, 1)
      newSelectionStart = start + 2
      newSelectionEnd = newSelectionStart + (selectedText || 'Heading 1').length
      break

    case 'heading2':
      newContent = insertHeading(before, after, selectedText, 2)
      newSelectionStart = start + 3
      newSelectionEnd = newSelectionStart + (selectedText || 'Heading 2').length
      break

    case 'heading3':
      newContent = insertHeading(before, after, selectedText, 3)
      newSelectionStart = start + 4
      newSelectionEnd = newSelectionStart + (selectedText || 'Heading 3').length
      break

    case 'link':
      newContent = `${before}[${selectedText || 'link text'}](url)${after}`
      newSelectionStart = start + 1
      newSelectionEnd = newSelectionStart + (selectedText || 'link text').length
      break

    case 'image':
      newContent = `${before}![${selectedText || 'alt text'}](image-url)${after}`
      newSelectionStart = start + 2
      newSelectionEnd = newSelectionStart + (selectedText || 'alt text').length
      break

    case 'inlineCode': {
      const result = toggleWrapper(before, after, selectedText, '`', 'code', start)
      newContent = result.newContent
      newSelectionStart = result.newSelectionStart
      newSelectionEnd = result.newSelectionEnd
      break
    }

    case 'codeBlock':
      newContent = insertCodeBlock(before, after, selectedText)
      newSelectionStart = start + 4
      newSelectionEnd = newSelectionStart + (selectedText || 'code').length
      break

    case 'bulletList':
      newContent = insertList(before, after, selectedText, false)
      newSelectionStart = start + 2
      newSelectionEnd = newSelectionStart + (selectedText || 'List item').length
      break

    case 'numberedList':
      newContent = insertList(before, after, selectedText, true)
      newSelectionStart = start + 3
      newSelectionEnd = newSelectionStart + (selectedText || 'List item').length
      break

    case 'taskList':
      newContent = insertTaskList(before, after, selectedText)
      newSelectionStart = start + 6
      newSelectionEnd = newSelectionStart + (selectedText || 'Task item').length
      break

    default:
      newContent = content
      newSelectionStart = start
      newSelectionEnd = end
  }

  return { newContent, newSelectionStart, newSelectionEnd }
}

function insertHeading(before: string, after: string, text: string, level: number): string {
  const prefix = '#'.repeat(level) + ' '
  const headingText = text || `Heading ${level}`

  // 줄 시작 위치로 이동
  const lastNewLine = before.lastIndexOf('\n')
  const beforeLine = before.substring(0, lastNewLine + 1)
  const currentLine = before.substring(lastNewLine + 1)

  return `${beforeLine}${currentLine}${prefix}${headingText}${after}`
}

function insertCodeBlock(before: string, after: string, text: string): string {
  const codeText = text || 'code'
  const lastNewLine = before.lastIndexOf('\n')
  const beforeLine = before.substring(0, lastNewLine + 1)
  const currentLine = before.substring(lastNewLine + 1)

  return `${beforeLine}${currentLine}\`\`\`\n${codeText}\n\`\`\`\n${after}`
}

function insertList(before: string, after: string, text: string, numbered: boolean): string {
  const listText = text || 'List item'
  const prefix = numbered ? '1. ' : '- '
  const lastNewLine = before.lastIndexOf('\n')
  const beforeLine = before.substring(0, lastNewLine + 1)
  const currentLine = before.substring(lastNewLine + 1)

  return `${beforeLine}${currentLine}${prefix}${listText}${after}`
}

function insertTaskList(before: string, after: string, text: string): string {
  const taskText = text || 'Task item'
  const lastNewLine = before.lastIndexOf('\n')
  const beforeLine = before.substring(0, lastNewLine + 1)
  const currentLine = before.substring(lastNewLine + 1)

  return `${beforeLine}${currentLine}- [ ] ${taskText}${after}`
}
