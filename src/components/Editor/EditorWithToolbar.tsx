import { useCallback, useRef } from 'react'
import { Editor, EditorProps, EditorRef } from './Editor'
import { Toolbar, MarkdownCommand } from './Toolbar'
import { applyMarkdownCommand } from '../../utils/markdownCommands'
import { useEditorStore } from '../../stores'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useFileHandler } from '../../hooks/useFileHandler'

export interface EditorWithToolbarProps extends Omit<EditorProps, 'onChange'> {
  onChange?: (value: string) => void
}

export function EditorWithToolbar({ className = '', ...editorProps }: EditorWithToolbarProps) {
  const { content, setContent } = useEditorStore()
  const editorRef = useRef<EditorRef>(null)
  const { handleFileDownload } = useFileHandler()

  const handleCommand = useCallback(
    (command: MarkdownCommand) => {
      // 실제 커서 위치 가져오기
      const selection = editorRef.current?.getSelection() ?? {
        start: content.length,
        end: content.length,
        selectedText: '',
      }

      // 마크다운 명령 적용
      const { newContent, newSelectionStart, newSelectionEnd } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      setContent(newContent)

      // 커서 위치 복원 (CodeMirror가 업데이트된 후)
      setTimeout(() => {
        editorRef.current?.setSelection(newSelectionStart, newSelectionEnd)
      }, 0)
    },
    [content, setContent]
  )

  // 키보드 단축키 연결
  useKeyboardShortcuts({
    onBold: () => handleCommand('bold'),
    onItalic: () => handleCommand('italic'),
    onLink: () => handleCommand('link'),
    onSave: handleFileDownload,
  })

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Toolbar onCommand={handleCommand} />
      <div className="flex-1 min-h-0">
        <Editor ref={editorRef} {...editorProps} className="h-full" />
      </div>
    </div>
  )
}
