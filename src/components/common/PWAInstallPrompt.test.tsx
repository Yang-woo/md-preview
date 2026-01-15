import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PWAInstallPrompt } from './PWAInstallPrompt'

describe('PWAInstallPrompt', () => {
  let mockPromptEvent: any

  beforeEach(() => {
    // Mock beforeinstallprompt event
    mockPromptEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    }

    // Clear localStorage
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('beforeinstallprompt 이벤트가 발생하면 프롬프트가 표시됨', async () => {
    render(<PWAInstallPrompt />)

    // 이벤트가 발생하지 않았을 때는 렌더링 안 됨
    expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()

    // beforeinstallprompt 이벤트 발생
    window.dispatchEvent(new Event('beforeinstallprompt'))

    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })
  })

  it('이전에 dismiss한 경우 프롬프트가 표시되지 않음', async () => {
    localStorage.setItem('pwa-install-dismissed', 'true')
    render(<PWAInstallPrompt />)

    window.dispatchEvent(new Event('beforeinstallprompt'))

    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
    })
  })

  it('설치 버튼을 클릭하면 설치 프롬프트가 실행됨', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    // Mock event with prompt method
    Object.defineProperty(mockPromptEvent, 'prompt', {
      value: vi.fn().mockResolvedValue(undefined),
      writable: true,
    })
    Object.defineProperty(mockPromptEvent, 'userChoice', {
      value: Promise.resolve({ outcome: 'accepted' }),
      writable: true,
    })

    window.dispatchEvent(
      Object.assign(new Event('beforeinstallprompt'), mockPromptEvent)
    )

    await waitFor(() => {
      expect(screen.getByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })

    const installButton = screen.getByRole('button', { name: /설치/i })
    await user.click(installButton)

    // Prompt should be hidden after installation
    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
    })
  })

  it('나중에 버튼을 클릭하면 프롬프트가 닫히고 localStorage에 저장됨', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    window.dispatchEvent(
      Object.assign(new Event('beforeinstallprompt'), mockPromptEvent)
    )

    await waitFor(() => {
      expect(screen.getByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })

    const laterButton = screen.getByRole('button', { name: /나중에/i })
    await user.click(laterButton)

    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
      expect(localStorage.getItem('pwa-install-dismissed')).toBe('true')
    })
  })

  it('닫기 버튼을 클릭하면 프롬프트가 닫히고 localStorage에 저장됨', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    window.dispatchEvent(
      Object.assign(new Event('beforeinstallprompt'), mockPromptEvent)
    )

    await waitFor(() => {
      expect(screen.getByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })

    const closeButton = screen.getByRole('button', { name: /Close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
      expect(localStorage.getItem('pwa-install-dismissed')).toBe('true')
    })
  })

  it('접근성: role과 aria 속성이 올바르게 설정됨', async () => {
    render(<PWAInstallPrompt />)

    window.dispatchEvent(
      Object.assign(new Event('beforeinstallprompt'), mockPromptEvent)
    )

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'pwa-install-title')
      expect(dialog).toHaveAttribute('aria-describedby', 'pwa-install-description')
    })
  })

  it('프롬프트 이벤트가 없으면 아무것도 렌더링하지 않음', () => {
    const { container } = render(<PWAInstallPrompt />)
    expect(container.firstChild).toBeNull()
  })
})
