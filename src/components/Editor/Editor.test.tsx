import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Editor } from './Editor'
import { useEditorStore } from '../../stores'

describe('Editor 컴포넌트', () => {
  beforeEach(() => {
    useEditorStore.getState().reset()
  })

  it('에디터가 렌더링되어야 함', () => {
    render(<Editor />)
    const editor = screen.getByRole('textbox')
    expect(editor).toBeInTheDocument()
  })

  it('초기 content가 에디터에 표시되어야 함', () => {
    useEditorStore.getState().setContent('# Hello World')
    render(<Editor />)
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveValue('# Hello World')
  })

  it('에디터에 입력하면 editorStore가 업데이트되어야 함', async () => {
    const user = userEvent.setup()
    render(<Editor />)

    const editor = screen.getByRole('textbox')
    await user.type(editor, '# Test')

    const state = useEditorStore.getState()
    expect(state.content).toContain('Test')
    expect(state.isDirty).toBe(true)
  })

  it('onChange 콜백이 호출되어야 함', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Editor onChange={onChange} />)

    const editor = screen.getByRole('textbox')
    await user.type(editor, 'test')

    expect(onChange).toHaveBeenCalled()
  })

  it('readOnly 속성이 적용되어야 함', () => {
    render(<Editor readOnly />)
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveAttribute('readonly')
  })

  it('placeholder가 표시되어야 함', () => {
    render(<Editor placeholder="마크다운을 입력하세요..." />)
    expect(screen.getByPlaceholderText('마크다운을 입력하세요...')).toBeInTheDocument()
  })

  it('테마가 적용되어야 함', () => {
    const { container } = render(<Editor />)
    const editorWrapper = container.querySelector('.cm-editor')
    expect(editorWrapper).toBeInTheDocument()
  })
})
