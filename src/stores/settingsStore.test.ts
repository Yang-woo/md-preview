import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from './settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().reset()
  })

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const state = useSettingsStore.getState()

    expect(state.theme).toBe('system')
    expect(state.stylePreset).toBe('github')
    expect(state.fontSize).toBe('medium')
    expect(state.lineHeight).toBe(1.6)
    expect(state.enableScrollSync).toBe(true)
    expect(state.enableAutoSave).toBe(true)
    expect(state.autoSaveInterval).toBe(30)
  })

  it('setTheme으로 테마를 변경할 수 있어야 함', () => {
    const { setTheme } = useSettingsStore.getState()

    setTheme('dark')

    expect(useSettingsStore.getState().theme).toBe('dark')
  })

  it('setStylePreset으로 스타일 프리셋을 변경할 수 있어야 함', () => {
    const { setStylePreset } = useSettingsStore.getState()

    setStylePreset('notion')

    expect(useSettingsStore.getState().stylePreset).toBe('notion')
  })

  it('setFontSize로 폰트 크기를 변경할 수 있어야 함', () => {
    const { setFontSize } = useSettingsStore.getState()

    setFontSize('large')

    expect(useSettingsStore.getState().fontSize).toBe('large')
  })

  it('setLineHeight로 줄 높이를 변경할 수 있어야 함', () => {
    const { setLineHeight } = useSettingsStore.getState()

    setLineHeight(1.8)

    expect(useSettingsStore.getState().lineHeight).toBe(1.8)
  })

  it('toggleScrollSync으로 스크롤 동기화를 토글할 수 있어야 함', () => {
    const { toggleScrollSync } = useSettingsStore.getState()

    expect(useSettingsStore.getState().enableScrollSync).toBe(true)

    toggleScrollSync()
    expect(useSettingsStore.getState().enableScrollSync).toBe(false)

    toggleScrollSync()
    expect(useSettingsStore.getState().enableScrollSync).toBe(true)
  })

  it('toggleAutoSave로 자동 저장을 토글할 수 있어야 함', () => {
    const { toggleAutoSave } = useSettingsStore.getState()

    expect(useSettingsStore.getState().enableAutoSave).toBe(true)

    toggleAutoSave()
    expect(useSettingsStore.getState().enableAutoSave).toBe(false)

    toggleAutoSave()
    expect(useSettingsStore.getState().enableAutoSave).toBe(true)
  })

  it('setAutoSaveInterval로 자동 저장 간격을 변경할 수 있어야 함', () => {
    const { setAutoSaveInterval } = useSettingsStore.getState()

    setAutoSaveInterval(60)

    expect(useSettingsStore.getState().autoSaveInterval).toBe(60)
  })

  it('reset을 호출하면 초기 상태로 돌아가야 함', () => {
    const { setTheme, setStylePreset, reset } = useSettingsStore.getState()

    setTheme('dark')
    setStylePreset('minimal')

    reset()

    const state = useSettingsStore.getState()
    expect(state.theme).toBe('system')
    expect(state.stylePreset).toBe('github')
  })
})
