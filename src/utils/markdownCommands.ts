import type { MarkdownCommand } from '../components/Editor/Toolbar'

export interface TextSelection {
  start: number
  end: number
  selectedText: string
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
    case 'bold':
      newContent = `${before}**${selectedText || 'bold text'}**${after}`
      newSelectionStart = start + 2
      newSelectionEnd = newSelectionStart + (selectedText || 'bold text').length
      break

    case 'italic':
      newContent = `${before}*${selectedText || 'italic text'}*${after}`
      newSelectionStart = start + 1
      newSelectionEnd = newSelectionStart + (selectedText || 'italic text').length
      break

    case 'strikethrough':
      newContent = `${before}~~${selectedText || 'strikethrough text'}~~${after}`
      newSelectionStart = start + 2
      newSelectionEnd = newSelectionStart + (selectedText || 'strikethrough text').length
      break

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

    case 'inlineCode':
      newContent = `${before}\`${selectedText || 'code'}\`${after}`
      newSelectionStart = start + 1
      newSelectionEnd = newSelectionStart + (selectedText || 'code').length
      break

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
