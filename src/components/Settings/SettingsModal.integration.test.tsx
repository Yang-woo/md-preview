import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsModal } from './SettingsModal'
import { useSettingsStore } from '../../stores/settingsStore'
import { useUIStore } from '../../stores/uiStore'

describe('SettingsModal - Integration Tests', () => {
  beforeEach(() => {
    // Reset stores
    useSettingsStore.setState({
      theme: 'system',
      stylePreset: 'github',
      fontSize: 'medium',
      lineHeight: 1.6,
      enableScrollSync: true,
      enableAutoSave: true,
      autoSaveInterval: 30,
    })
    useUIStore.setState({
      settingsModalOpen: false,
    })
  })

  it('여러 설정을 동시에 변경하면 모두 올바르게 저장됨', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    // 테마 변경
    await user.click(screen.getByLabelText(/다크/i))

    // 프리셋 변경
    await user.selectOptions(screen.getByRole('combobox'), 'vscode')

    // 폰트 크기 변경
    await user.click(screen.getByLabelText(/Large/i))

    // 체크박스 토글
    await user.click(screen.getByLabelText(/스크롤 동기화/i))

    await waitFor(() => {
      const state = useSettingsStore.getState()
      expect(state.theme).toBe('dark')
      expect(state.stylePreset).toBe('vscode')
      expect(state.fontSize).toBe('large')
      expect(state.enableScrollSync).toBe(false)
    })
  })

  it('설정 변경 후 초기화하면 변경사항이 모두 되돌아감', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    // 여러 설정 변경
    await user.click(screen.getByLabelText(/다크/i))
    await user.selectOptions(screen.getByRole('combobox'), 'notion')
    await user.click(screen.getByLabelText(/XL/i))
    await user.click(screen.getByLabelText(/자동 저장/i))

    // 변경 확인
    await waitFor(() => {
      const state = useSettingsStore.getState()
      expect(state.theme).toBe('dark')
      expect(state.stylePreset).toBe('notion')
      expect(state.fontSize).toBe('xl')
      expect(state.enableAutoSave).toBe(false)
    })

    // 초기화
    await user.click(screen.getByRole('button', { name: /초기화/i }))

    await waitFor(() => {
      const state = useSettingsStore.getState()
      expect(state.theme).toBe('system')
      expect(state.stylePreset).toBe('github')
      expect(state.fontSize).toBe('medium')
      expect(state.enableAutoSave).toBe(true)
    })
  })

  it('모달을 닫았다가 다시 열어도 마지막 설정값이 유지됨', async () => {
    const user = userEvent.setup()

    // 첫 번째 세션
    useUIStore.setState({ settingsModalOpen: true })
    const { unmount } = render(<SettingsModal />)

    await user.click(screen.getByLabelText(/다크/i))
    await user.selectOptions(screen.getByRole('combobox'), 'minimal')

    await waitFor(() => {
      expect(useSettingsStore.getState().theme).toBe('dark')
      expect(useSettingsStore.getState().stylePreset).toBe('minimal')
    })

    // 모달 닫기
    const closeButtons = screen.getAllByRole('button', { name: /닫기/i })
    await user.click(closeButtons[1])

    await waitFor(() => {
      expect(useUIStore.getState().settingsModalOpen).toBe(false)
    })

    unmount()

    // 두 번째 세션
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    // 설정값 유지 확인
    expect(screen.getByLabelText(/다크/i)).toBeChecked()
    expect(screen.getByRole('combobox')).toHaveValue('minimal')
  })

  it('모든 라디오 버튼이 상호 배타적으로 동작함', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    // 테마 라디오 버튼 테스트
    await user.click(screen.getByLabelText(/라이트/i))
    expect(screen.getByLabelText(/라이트/i)).toBeChecked()
    expect(screen.getByLabelText(/다크/i)).not.toBeChecked()
    expect(screen.getByLabelText(/시스템/i)).not.toBeChecked()

    await user.click(screen.getByLabelText(/다크/i))
    expect(screen.getByLabelText(/다크/i)).toBeChecked()
    expect(screen.getByLabelText(/라이트/i)).not.toBeChecked()
    expect(screen.getByLabelText(/시스템/i)).not.toBeChecked()

    // 폰트 크기 라디오 버튼 테스트
    await user.click(screen.getByLabelText(/Small/i))
    expect(screen.getByLabelText(/Small/i)).toBeChecked()
    expect(screen.getByLabelText(/Medium/i)).not.toBeChecked()

    await user.click(screen.getByLabelText(/XL/i))
    expect(screen.getByLabelText(/XL/i)).toBeChecked()
    expect(screen.getByLabelText(/Small/i)).not.toBeChecked()
  })

  it('체크박스는 독립적으로 동작함', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const scrollSyncCheckbox = screen.getByLabelText(/스크롤 동기화/i)
    const autoSaveCheckbox = screen.getByLabelText(/자동 저장/i)

    // 초기 상태
    expect(scrollSyncCheckbox).toBeChecked()
    expect(autoSaveCheckbox).toBeChecked()

    // 하나만 토글
    await user.click(scrollSyncCheckbox)
    expect(scrollSyncCheckbox).not.toBeChecked()
    expect(autoSaveCheckbox).toBeChecked() // 영향 없음

    // 다른 것도 토글
    await user.click(autoSaveCheckbox)
    expect(scrollSyncCheckbox).not.toBeChecked()
    expect(autoSaveCheckbox).not.toBeChecked()

    // 다시 토글
    await user.click(scrollSyncCheckbox)
    expect(scrollSyncCheckbox).toBeChecked()
    expect(autoSaveCheckbox).not.toBeChecked()
  })

  it('select 요소의 모든 옵션이 선택 가능함', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const select = screen.getByRole('combobox')

    // GitHub
    await user.selectOptions(select, 'github')
    expect(select).toHaveValue('github')
    expect(useSettingsStore.getState().stylePreset).toBe('github')

    // Notion
    await user.selectOptions(select, 'notion')
    expect(select).toHaveValue('notion')
    expect(useSettingsStore.getState().stylePreset).toBe('notion')

    // VS Code
    await user.selectOptions(select, 'vscode')
    expect(select).toHaveValue('vscode')
    expect(useSettingsStore.getState().stylePreset).toBe('vscode')

    // Minimal
    await user.selectOptions(select, 'minimal')
    expect(select).toHaveValue('minimal')
    expect(useSettingsStore.getState().stylePreset).toBe('minimal')
  })

  it('모달이 닫힌 상태에서 설정을 변경해도 UI가 업데이트되지 않음', () => {
    useUIStore.setState({ settingsModalOpen: false })
    render(<SettingsModal />)

    // 모달이 렌더링되지 않음
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // 외부에서 설정 변경
    useSettingsStore.setState({ theme: 'dark' })

    // 여전히 렌더링되지 않음
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('연속으로 빠르게 설정을 변경해도 마지막 값으로 설정됨', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const select = screen.getByRole('combobox')

    // 빠르게 여러 번 변경
    await user.selectOptions(select, 'notion')
    await user.selectOptions(select, 'vscode')
    await user.selectOptions(select, 'minimal')
    await user.selectOptions(select, 'github')

    await waitFor(() => {
      expect(useSettingsStore.getState().stylePreset).toBe('github')
    })
  })
})
