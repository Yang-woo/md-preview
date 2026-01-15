import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PWAInstallPrompt } from './PWAInstallPrompt'

describe('PWAInstallPrompt - Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('전체 설치 플로우가 정상적으로 작동함', async () => {
    const user = userEvent.setup()
    const mockPrompt = vi.fn().mockResolvedValue(undefined)
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const })

    render(<PWAInstallPrompt />)

    // 초기 상태: 프롬프트 없음
    expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()

    // beforeinstallprompt 이벤트 발생
    const event = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault: vi.fn(),
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    })
    window.dispatchEvent(event)

    // 프롬프트 표시됨
    await waitFor(() => {
      expect(screen.getByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })

    // 설명 텍스트 확인
    expect(
      screen.getByText(/Markdown Preview를 앱으로 설치하여 오프라인에서도 사용하세요./i)
    ).toBeInTheDocument()

    // 설치 버튼 클릭
    const installButton = screen.getByRole('button', { name: /설치/i })
    await user.click(installButton)

    // 프롬프트 닫힘
    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
    })
  })

  it('사용자가 dismiss한 후 다시 방문해도 프롬프트가 표시되지 않음', async () => {
    const user = userEvent.setup()

    // 첫 번째 방문
    const { unmount } = render(<PWAInstallPrompt />)

    const event = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    })
    window.dispatchEvent(event)

    await waitFor(() => {
      expect(screen.getByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })

    // 나중에 클릭
    await user.click(screen.getByRole('button', { name: /나중에/i }))

    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
      expect(localStorage.getItem('pwa-install-dismissed')).toBe('true')
    })

    unmount()

    // 두 번째 방문
    render(<PWAInstallPrompt />)
    window.dispatchEvent(event)

    // 프롬프트가 표시되지 않음
    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
    })
  })

  it('여러 번 이벤트가 발생해도 마지막 것만 유효함', async () => {
    render(<PWAInstallPrompt />)

    const event1 = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    })

    const event2 = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    })

    window.dispatchEvent(event1)
    window.dispatchEvent(event2)

    await waitFor(() => {
      // 프롬프트가 한 번만 표시됨
      const prompts = screen.queryAllByText(/앱으로 설치하기/i)
      expect(prompts).toHaveLength(1)
    })
  })

  it('설치 거부 시에도 프롬프트가 정상적으로 닫힘', async () => {
    const user = userEvent.setup()
    const mockPrompt = vi.fn().mockResolvedValue(undefined)
    const mockUserChoice = Promise.resolve({ outcome: 'dismissed' as const })

    render(<PWAInstallPrompt />)

    const event = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault: vi.fn(),
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    })
    window.dispatchEvent(event)

    await waitFor(() => {
      expect(screen.getByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /설치/i }))

    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
    })
  })

  it('모든 버튼이 접근 가능하고 작동함', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    const event = Object.assign(new Event('beforeinstallprompt'), {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    })
    window.dispatchEvent(event)

    await waitFor(() => {
      expect(screen.getByText(/앱으로 설치하기/i)).toBeInTheDocument()
    })

    // 모든 버튼 확인
    expect(screen.getByRole('button', { name: /설치/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /나중에/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument()

    // 모든 버튼이 클릭 가능
    const closeButton = screen.getByRole('button', { name: /Close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText(/앱으로 설치하기/i)).not.toBeInTheDocument()
    })
  })
})
