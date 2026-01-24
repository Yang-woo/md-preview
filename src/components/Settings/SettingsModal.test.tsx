import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsModal } from './SettingsModal'
import { useSettingsStore } from '../../stores/settingsStore'
import { useUIStore } from '../../stores/uiStore'

describe('SettingsModal', () => {
  beforeEach(() => {
    // Reset stores before each test
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

  it('모달이 열리지 않았을 때는 렌더링되지 않음', () => {
    useUIStore.setState({ settingsModalOpen: false })
    render(<SettingsModal />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('모달이 열렸을 때 렌더링됨', () => {
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('설정')).toBeInTheDocument()
  })

  it('테마 선택 옵션이 표시됨', () => {
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    expect(screen.getByLabelText(/라이트/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/다크/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/시스템/i)).toBeInTheDocument()
  })

  it('스타일 프리셋 선택 옵션이 표시됨', () => {
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    expect(screen.getByLabelText(/스타일 프리셋/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('폰트 크기 옵션이 표시됨', () => {
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    expect(screen.getByLabelText('Small')).toBeInTheDocument()
    expect(screen.getByLabelText('Medium')).toBeInTheDocument()
    expect(screen.getByLabelText('Large')).toBeInTheDocument()
    expect(screen.getByLabelText('XL')).toBeInTheDocument()
  })

  it('에디터 옵션 체크박스가 표시됨', () => {
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    expect(screen.getByLabelText(/스크롤 동기화/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/자동 저장/i)).toBeInTheDocument()
  })

  it('테마를 변경하면 settingsStore가 업데이트됨', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const darkRadio = screen.getByLabelText(/다크/i)
    await user.click(darkRadio)

    await waitFor(() => {
      expect(useSettingsStore.getState().theme).toBe('dark')
    })
  })

  it('스타일 프리셋을 변경하면 settingsStore가 업데이트됨', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'notion')

    await waitFor(() => {
      expect(useSettingsStore.getState().stylePreset).toBe('notion')
    })
  })

  it('폰트 크기를 변경하면 settingsStore가 업데이트됨', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const fontSizeRadio = screen.getByLabelText(/Large/i)
    await user.click(fontSizeRadio)

    await waitFor(() => {
      expect(useSettingsStore.getState().fontSize).toBe('large')
    })
  })

  it('체크박스를 토글하면 settingsStore가 업데이트됨', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const scrollSyncCheckbox = screen.getByLabelText(/스크롤 동기화/i)
    const initialState = useSettingsStore.getState().enableScrollSync

    await user.click(scrollSyncCheckbox)

    await waitFor(() => {
      expect(useSettingsStore.getState().enableScrollSync).toBe(!initialState)
    })
  })

  it('초기화 버튼을 클릭하면 모든 설정이 초기값으로 돌아감', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()

    // 먼저 설정 변경
    useSettingsStore.setState({
      theme: 'dark',
      stylePreset: 'vscode',
      fontSize: 'large',
    })

    render(<SettingsModal />)

    const resetButton = screen.getByRole('button', { name: /초기화/i })
    await user.click(resetButton)

    await waitFor(() => {
      const state = useSettingsStore.getState()
      expect(state.theme).toBe('system')
      expect(state.stylePreset).toBe('github')
      expect(state.fontSize).toBe('medium')
    })
  })

  it('닫기 버튼을 클릭하면 모달이 닫힘', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    const closeButtons = screen.getAllByRole('button', { name: /닫기/i })
    // 푸터의 닫기 버튼 (두 번째 버튼) 클릭
    await user.click(closeButtons[1])

    await waitFor(() => {
      expect(useUIStore.getState().settingsModalOpen).toBe(false)
    })
  })

  it('ESC 키를 누르면 모달이 닫힘', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    render(<SettingsModal />)

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(useUIStore.getState().settingsModalOpen).toBe(false)
    })
  })

  it('오버레이를 클릭하면 모달이 닫힘', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    const user = userEvent.setup()
    const { container } = render(<SettingsModal />)

    // Find overlay (backdrop) - Radix UI uses data-radix-dialog-overlay
    const overlay = container.querySelector('[data-radix-dialog-overlay]')
    if (overlay) {
      await user.click(overlay)

      await waitFor(() => {
        expect(useUIStore.getState().settingsModalOpen).toBe(false)
      })
    }
  })

  it('현재 설정값이 UI에 올바르게 반영됨', () => {
    useSettingsStore.setState({
      theme: 'dark',
      stylePreset: 'notion',
      fontSize: 'large',
      enableScrollSync: false,
      enableAutoSave: true,
    })
    useUIStore.setState({ settingsModalOpen: true })

    render(<SettingsModal />)

    expect(screen.getByLabelText(/다크/i)).toBeChecked()
    expect(screen.getByRole('combobox')).toHaveValue('notion')
    expect(screen.getByLabelText(/Large/i)).toBeChecked()
    expect(screen.getByLabelText(/스크롤 동기화/i)).not.toBeChecked()
    expect(screen.getByLabelText(/자동 저장/i)).toBeChecked()
  })

  it('접근성: 모달이 열릴 때 포커스가 모달 내부로 이동', async () => {
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(document.activeElement).toBeInTheDocument()
      expect(dialog).toContainElement(document.activeElement)
    })
  })

  it('접근성: aria-label이 올바르게 설정됨', () => {
    useUIStore.setState({ settingsModalOpen: true })
    render(<SettingsModal />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })
})
