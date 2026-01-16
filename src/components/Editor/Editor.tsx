import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { useEditorStore } from '../../stores'
import { useTheme } from '../../hooks/useTheme'
import type { TextSelection } from '../../utils/markdownCommands'

export interface EditorProps {
  onChange?: (value: string) => void
  readOnly?: boolean
  placeholder?: string
  className?: string
}

export interface EditorRef {
  getSelection: () => TextSelection
  setSelection: (from: number, to: number) => void
  focus: () => void
}

export const Editor = forwardRef<EditorRef, EditorProps>(function Editor(
  {
    onChange,
    readOnly = false,
    placeholder = '마크다운을 입력하세요...',
    className = '',
  },
  ref
) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const { content, setContent } = useEditorStore()
  const { currentTheme } = useTheme()

  // Expose imperative methods via ref
  useImperativeHandle(ref, () => ({
    getSelection: (): TextSelection => {
      const view = viewRef.current
      if (!view) {
        return { start: 0, end: 0, selectedText: '' }
      }

      const { from, to } = view.state.selection.main
      const selectedText = view.state.sliceDoc(from, to)
      return { start: from, end: to, selectedText }
    },
    setSelection: (from: number, to: number) => {
      const view = viewRef.current
      if (!view) return

      const docLength = view.state.doc.length
      const safeTo = Math.min(to, docLength)
      const safeFrom = Math.min(from, docLength)

      view.dispatch({
        selection: { anchor: safeFrom, head: safeTo },
      })
      view.focus()
    },
    focus: () => {
      viewRef.current?.focus()
    },
  }))

  useEffect(() => {
    if (!editorRef.current) return

    const extensions = [
      basicSetup,
      markdown(),
      EditorView.lineWrapping,
      EditorState.readOnly.of(readOnly),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newContent = update.state.doc.toString()
          setContent(newContent)
          onChange?.(newContent)
        }
      }),
    ]

    // 다크 테마 적용
    if (currentTheme === 'dark') {
      extensions.push(oneDark)
    }

    // placeholder 확장
    if (placeholder) {
      extensions.push(
        EditorView.theme({
          '.cm-content': {
            fontFamily: 'Fira Code, monospace',
          },
        })
      )
    }

    const startState = EditorState.create({
      doc: content,
      extensions,
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [currentTheme, readOnly, placeholder])

  // content가 외부에서 변경되면 에디터 업데이트
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString()
      if (currentContent !== content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: content,
          },
        })
      }
    }
  }, [content])

  return (
    <div className={`editor-wrapper ${className}`}>
      <div ref={editorRef} role="textbox" aria-label="Markdown Editor" />
    </div>
  )
})
