import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from './editorStore'

describe('editorStore', () => {
  beforeEach(() => {
    useEditorStore.getState().reset()
  })

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const state = useEditorStore.getState()

    expect(state.content).toBe('')
    expect(state.fileName).toBe('untitled.md')
    expect(state.isDirty).toBe(false)
    expect(state.lastSaved).toBe(null)
  })

  it('setContent로 내용을 변경하면 isDirty가 true가 되어야 함', () => {
    const { setContent } = useEditorStore.getState()

    setContent('# Hello World')

    const state = useEditorStore.getState()
    expect(state.content).toBe('# Hello World')
    expect(state.isDirty).toBe(true)
  })

  it('setFileName으로 파일명을 변경하면 isDirty가 true가 되어야 함', () => {
    const { setFileName } = useEditorStore.getState()

    setFileName('test.md')

    const state = useEditorStore.getState()
    expect(state.fileName).toBe('test.md')
    expect(state.isDirty).toBe(true)
  })

  it('markAsSaved를 호출하면 isDirty가 false가 되고 lastSaved가 설정되어야 함', () => {
    const { setContent, markAsSaved } = useEditorStore.getState()

    setContent('# Test')
    expect(useEditorStore.getState().isDirty).toBe(true)

    markAsSaved()

    const state = useEditorStore.getState()
    expect(state.isDirty).toBe(false)
    expect(state.lastSaved).toBeGreaterThan(0)
  })

  it('loadFile로 파일을 로드하면 isDirty가 false여야 함', () => {
    const { loadFile } = useEditorStore.getState()

    loadFile('readme.md', '# README')

    const state = useEditorStore.getState()
    expect(state.fileName).toBe('readme.md')
    expect(state.content).toBe('# README')
    expect(state.isDirty).toBe(false)
    expect(state.lastSaved).toBe(null)
  })

  it('reset을 호출하면 초기 상태로 돌아가야 함', () => {
    const { setContent, setFileName, reset } = useEditorStore.getState()

    setContent('# Test')
    setFileName('test.md')

    reset()

    const state = useEditorStore.getState()
    expect(state.content).toBe('')
    expect(state.fileName).toBe('untitled.md')
    expect(state.isDirty).toBe(false)
    expect(state.lastSaved).toBe(null)
  })
})
