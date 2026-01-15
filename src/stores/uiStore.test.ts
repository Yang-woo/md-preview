import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      sidebarOpen: true,
      settingsModalOpen: false,
      helpModalOpen: false,
      viewMode: 'split',
      splitRatio: 50,
      editorScrollPosition: 0,
      previewScrollPosition: 0,
    })
  })

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const state = useUIStore.getState()

    expect(state.sidebarOpen).toBe(true)
    expect(state.settingsModalOpen).toBe(false)
    expect(state.helpModalOpen).toBe(false)
    expect(state.viewMode).toBe('split')
    expect(state.splitRatio).toBe(50)
  })

  it('toggleSidebar로 사이드바를 토글할 수 있어야 함', () => {
    const { toggleSidebar } = useUIStore.getState()

    expect(useUIStore.getState().sidebarOpen).toBe(true)

    toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(false)

    toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(true)
  })

  it('setSidebarOpen으로 사이드바 상태를 직접 설정할 수 있어야 함', () => {
    const { setSidebarOpen } = useUIStore.getState()

    setSidebarOpen(false)
    expect(useUIStore.getState().sidebarOpen).toBe(false)

    setSidebarOpen(true)
    expect(useUIStore.getState().sidebarOpen).toBe(true)
  })

  it('openSettingsModal과 closeSettingsModal로 설정 모달을 제어할 수 있어야 함', () => {
    const { openSettingsModal, closeSettingsModal } = useUIStore.getState()

    openSettingsModal()
    expect(useUIStore.getState().settingsModalOpen).toBe(true)

    closeSettingsModal()
    expect(useUIStore.getState().settingsModalOpen).toBe(false)
  })

  it('openHelpModal과 closeHelpModal로 도움말 모달을 제어할 수 있어야 함', () => {
    const { openHelpModal, closeHelpModal } = useUIStore.getState()

    openHelpModal()
    expect(useUIStore.getState().helpModalOpen).toBe(true)

    closeHelpModal()
    expect(useUIStore.getState().helpModalOpen).toBe(false)
  })

  it('setViewMode로 뷰 모드를 변경할 수 있어야 함', () => {
    const { setViewMode } = useUIStore.getState()

    setViewMode('editor')
    expect(useUIStore.getState().viewMode).toBe('editor')

    setViewMode('preview')
    expect(useUIStore.getState().viewMode).toBe('preview')

    setViewMode('split')
    expect(useUIStore.getState().viewMode).toBe('split')
  })

  it('setSplitRatio로 분할 비율을 변경할 수 있어야 함', () => {
    const { setSplitRatio } = useUIStore.getState()

    setSplitRatio(60)
    expect(useUIStore.getState().splitRatio).toBe(60)

    setSplitRatio(30)
    expect(useUIStore.getState().splitRatio).toBe(30)
  })

  it('setSplitRatio는 20-80 범위로 제한되어야 함', () => {
    const { setSplitRatio } = useUIStore.getState()

    setSplitRatio(10)
    expect(useUIStore.getState().splitRatio).toBe(20)

    setSplitRatio(90)
    expect(useUIStore.getState().splitRatio).toBe(80)

    setSplitRatio(50)
    expect(useUIStore.getState().splitRatio).toBe(50)
  })

  describe('스크롤 위치 관리', () => {
    it('초기 스크롤 위치는 0이어야 함', () => {
      const state = useUIStore.getState()

      expect(state.editorScrollPosition).toBe(0)
      expect(state.previewScrollPosition).toBe(0)
    })

    it('setEditorScrollPosition으로 에디터 스크롤 위치를 저장할 수 있어야 함', () => {
      const { setEditorScrollPosition } = useUIStore.getState()

      setEditorScrollPosition(150)
      expect(useUIStore.getState().editorScrollPosition).toBe(150)

      setEditorScrollPosition(300)
      expect(useUIStore.getState().editorScrollPosition).toBe(300)
    })

    it('setPreviewScrollPosition으로 프리뷰 스크롤 위치를 저장할 수 있어야 함', () => {
      const { setPreviewScrollPosition } = useUIStore.getState()

      setPreviewScrollPosition(200)
      expect(useUIStore.getState().previewScrollPosition).toBe(200)

      setPreviewScrollPosition(450)
      expect(useUIStore.getState().previewScrollPosition).toBe(450)
    })

    it('에디터와 프리뷰의 스크롤 위치는 독립적으로 관리되어야 함', () => {
      const { setEditorScrollPosition, setPreviewScrollPosition } = useUIStore.getState()

      setEditorScrollPosition(100)
      setPreviewScrollPosition(250)

      const state = useUIStore.getState()
      expect(state.editorScrollPosition).toBe(100)
      expect(state.previewScrollPosition).toBe(250)
    })

    it('음수 스크롤 위치는 0으로 보정되어야 함', () => {
      const { setEditorScrollPosition, setPreviewScrollPosition } = useUIStore.getState()

      setEditorScrollPosition(-50)
      expect(useUIStore.getState().editorScrollPosition).toBe(0)

      setPreviewScrollPosition(-100)
      expect(useUIStore.getState().previewScrollPosition).toBe(0)
    })
  })
})
