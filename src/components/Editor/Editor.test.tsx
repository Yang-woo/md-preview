import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { Editor } from './Editor'
import { useEditorStore } from '../../stores'

// Note: CodeMirror 6 requires real DOM environment
// Complex interactions should be tested with E2E (Playwright)

describe('Editor 컴포넌트', () => {
  beforeEach(() => {
    useEditorStore.getState().reset()
  })

  it('에디터가 렌더링되어야 함', () => {
    const { container } = render(<Editor />)
    const editorWrapper = container.querySelector('.editor-wrapper')
    expect(editorWrapper).toBeInTheDocument()
  })

  it('CodeMirror 에디터가 마운트되어야 함', () => {
    const { container } = render(<Editor />)
    const cmEditor = container.querySelector('.cm-editor')
    expect(cmEditor).toBeInTheDocument()
  })

  it('초기 content가 스토어에서 로드되어야 함', () => {
    useEditorStore.getState().setContent('# Hello World')
    const { container } = render(<Editor />)
    const cmContent = container.querySelector('.cm-content')
    expect(cmContent).toBeInTheDocument()
  })

  it('className이 적용되어야 함', () => {
    const { container } = render(<Editor className="custom-class" />)
    const wrapper = container.querySelector('.editor-wrapper')
    expect(wrapper).toHaveClass('custom-class')
  })
})
