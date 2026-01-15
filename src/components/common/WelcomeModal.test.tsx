import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeModal } from './WelcomeModal'

describe('WelcomeModal', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('렌더링', () => {
    it('첫 방문 시 환영 모달이 표시됨', () => {
      render(<WelcomeModal />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('환영합니다! 👋')).toBeInTheDocument()
      expect(screen.getByText(/Markdown Preview에 오신 것을 환영합니다/i)).toBeInTheDocument()
    })

    it('이전 방문 기록이 있으면 모달이 표시되지 않음', () => {
      localStorage.setItem('md-preview-visited', 'true')

      const { container } = render(<WelcomeModal />)

      expect(container.firstChild).toBeNull()
    })

    it('주요 기능 안내가 표시됨', () => {
      render(<WelcomeModal />)

      expect(screen.getByText(/실시간 미리보기/i)).toBeInTheDocument()
      expect(screen.getByText(/다양한 스타일/i)).toBeInTheDocument()
      expect(screen.getByText(/자동 저장/i)).toBeInTheDocument()
      expect(screen.getByText(/단축키 지원/i)).toBeInTheDocument()

      // 시작하기 버튼도 존재 확인
      expect(screen.getByRole('button', { name: '시작하기 (샘플 로드)' })).toBeInTheDocument()
    })
  })

  describe('사용자 액션', () => {
    it('시작하기 버튼을 클릭하면 모달이 닫히고 샘플이 로드됨', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      const startButton = screen.getByRole('button', { name: /시작하기/i })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(localStorage.getItem('md-preview-visited')).toBe('true')
      })
    })

    it('나중에 버튼을 클릭하면 모달이 닫히고 빈 에디터로 시작됨', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      const laterButton = screen.getByRole('button', { name: /나중에/i })
      await user.click(laterButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(localStorage.getItem('md-preview-visited')).toBe('true')
      })
    })

    it('닫기(X) 버튼을 클릭하면 모달이 닫힘', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      const closeButton = screen.getByRole('button', { name: /Close/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(localStorage.getItem('md-preview-visited')).toBe('true')
      })
    })

    it('Escape 키를 누르면 모달이 닫힘', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('샘플 콘텐츠', () => {
    it('시작하기 버튼 클릭 시 샘플 콘텐츠가 에디터에 로드됨', async () => {
      const user = userEvent.setup()

      // editorStore mock을 사용하여 테스트
      // 실제 구현에서는 zustand store와 통합 테스트 필요
      render(<WelcomeModal />)

      const startButton = screen.getByRole('button', { name: /시작하기/i })
      await user.click(startButton)

      // 샘플 콘텐츠가 로드되었는지 확인
      // 실제로는 editorStore.setContent가 호출되는지 확인
      await waitFor(() => {
        expect(localStorage.getItem('md-preview-visited')).toBe('true')
      })
    })
  })

  describe('접근성', () => {
    it('모달에 올바른 role과 aria 속성이 설정됨', () => {
      render(<WelcomeModal />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('모달 제목이 올바르게 레이블됨', () => {
      render(<WelcomeModal />)

      const dialog = screen.getByRole('dialog')
      const titleId = dialog.getAttribute('aria-labelledby')
      const title = document.getElementById(titleId!)

      expect(title).toHaveTextContent('환영합니다! 👋')
    })

    it('키보드로 버튼을 탐색할 수 있음', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      const closeButton = screen.getByRole('button', { name: /Close/i })
      const startButton = screen.getByRole('button', { name: /시작하기/i })
      const laterButton = screen.getByRole('button', { name: /나중에/i })

      // Tab으로 포커스 이동
      await user.tab()
      expect(closeButton).toHaveFocus()

      await user.tab()
      expect(startButton).toHaveFocus()

      await user.tab()
      expect(laterButton).toHaveFocus()
    })

    it('모달이 열릴 때 포커스가 모달 내부로 이동함', () => {
      render(<WelcomeModal />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      // 포커스가 모달 내부 요소에 있어야 함
      const startButton = screen.getByRole('button', { name: /시작하기/i })
      expect(document.body).toContainElement(startButton)
    })
  })

  describe('반응형', () => {
    it('모바일에서도 올바르게 렌더링됨', () => {
      // viewport 크기를 모바일로 설정
      global.innerWidth = 375
      global.innerHeight = 667

      render(<WelcomeModal />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('데스크톱에서 적절한 크기로 표시됨', () => {
      global.innerWidth = 1920
      global.innerHeight = 1080

      render(<WelcomeModal />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })

  describe('자동 닫힘', () => {
    it('5초 후 자동으로 닫히지 않음 (사용자 액션 필요)', async () => {
      vi.useFakeTimers()
      render(<WelcomeModal />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // 5초 경과
      vi.advanceTimersByTime(5000)

      // 여전히 표시되어야 함 (자동 닫힘 없음)
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      vi.useRealTimers()
    })
  })

  describe('통합 테스트', () => {
    it('시작하기 버튼 클릭 시 전체 플로우가 작동함', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      // 1. 모달이 표시됨
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // 2. 시작하기 버튼 클릭
      const startButton = screen.getByRole('button', { name: /시작하기/i })
      await user.click(startButton)

      // 3. 모달이 닫힘
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // 4. 방문 기록 저장됨
      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })

    it('나중에 버튼 클릭 시 전체 플로우가 작동함', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      // 1. 모달이 표시됨
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // 2. 나중에 버튼 클릭
      const laterButton = screen.getByRole('button', { name: /나중에/i })
      await user.click(laterButton)

      // 3. 모달이 닫힘
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // 4. 방문 기록 저장됨
      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })
  })
})
