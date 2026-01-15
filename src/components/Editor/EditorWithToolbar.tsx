import { useCallback, useRef } from 'react'
import { Editor, EditorProps } from './Editor'
import { Toolbar, MarkdownCommand } from './Toolbar'
import { applyMarkdownCommand } from '../../utils/markdownCommands'
import { useEditorStore } from '../../stores'

export interface EditorWithToolbarProps extends Omit<EditorProps, 'onChange'> {
  onChange?: (value: string) => void
}

export function EditorWithToolbar({ className = '', ...editorProps }: EditorWithToolbarProps) {
  const { content, setContent } = useEditorStore()
  const editorRef = useRef<HTMLDivElement>(null)

  const handleCommand = useCallback(
    (command: MarkdownCommand) => {
      // 현재 선택 영역 가져오기 (기본값: 끝)
      const selection = {
        start: content.length,
        end: content.length,
        selectedText: '',
      }

      // 마크다운 명령 적용
      const { newContent } = applyMarkdownCommand(
        content,
        selection,
        command
      )

      setContent(newContent)
    },
    [content, setContent]
  )

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Toolbar onCommand={handleCommand} />
      <div className="flex-1 min-h-0" ref={editorRef}>
        <Editor {...editorProps} className="h-full" />
      </div>
    </div>
  )
}
