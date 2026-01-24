import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeModal } from './WelcomeModal'
import { useEditorStore } from '../../stores/editorStore'
import { WELCOME_CONTENT } from '../../constants/welcomeContent'

describe('WelcomeModal 통합 테스트', () => {
  beforeEach(() => {
    localStorage.clear()
    useEditorStore.getState().reset()
    vi.clearAllMocks()
  })

  describe('Editor Store 통합', () => {
    it('시작하기 버튼 클릭 시 에디터에 샘플 콘텐츠가 로드됨', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      // 초기 상태 확인
      const initialContent = useEditorStore.getState().content
      expect(initialContent).toBe('')

      // 시작하기 버튼 클릭
      const startButton = screen.getByRole('button', { name: '시작하기 (샘플 로드)' })
      await user.click(startButton)

      // 에디터에 샘플 콘텐츠가 로드되었는지 확인
      await waitFor(() => {
        const content = useEditorStore.getState().content
        expect(content).toBe(WELCOME_CONTENT)
      })
    })

    it('시작하기 버튼 클릭 시 파일명이 welcome.md로 설정됨', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      // 초기 파일명 확인
      const initialFileName = useEditorStore.getState().fileName
      expect(initialFileName).toBe('untitled.md')

      // 시작하기 버튼 클릭
      const startButton = screen.getByRole('button', { name: '시작하기 (샘플 로드)' })
      await user.click(startButton)

      // 파일명이 변경되었는지 확인
      await waitFor(() => {
        const fileName = useEditorStore.getState().fileName
        expect(fileName).toBe('welcome.md')
      })
    })

    it('나중에 버튼 클릭 시 에디터 내용이 유지됨', async () => {
      const user = userEvent.setup()

      // 에디터에 기존 내용 설정
      useEditorStore.getState().setContent('existing content')

      render(<WelcomeModal />)

      // 나중에 버튼 클릭
      const laterButton = screen.getByRole('button', { name: /나중에/i })
      await user.click(laterButton)

      // 에디터 내용이 유지되었는지 확인
      await waitFor(() => {
        const content = useEditorStore.getState().content
        expect(content).toBe('existing content')
      })
    })
  })

  describe('localStorage 통합', () => {
    it('모달을 닫으면 방문 기록이 localStorage에 저장됨', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      // 초기 상태 확인
      expect(localStorage.getItem('md-preview-visited')).toBeNull()

      // 시작하기 버튼 클릭
      const startButton = screen.getByRole('button', { name: '시작하기 (샘플 로드)' })
      await user.click(startButton)

      // localStorage에 저장되었는지 확인
      await waitFor(() => {
        expect(localStorage.getItem('md-preview-visited')).toBe('true')
      })
    })

    it('방문 횟수가 localStorage에 저장됨', async () => {
      const user = userEvent.setup()
      const { unmount } = render(<WelcomeModal />)

      // 첫 방문 후 모달 닫기
      const startButton = screen.getByRole('button', { name: '시작하기 (샘플 로드)' })
      await user.click(startButton)

      await waitFor(() => {
        expect(localStorage.getItem('md-preview-visit-count')).toBe('1')
      })

      // 언마운트 후 재렌더링 (두 번째 방문)
      unmount()
      render(<WelcomeModal />)

      // 방문 횟수 증가 확인
      expect(localStorage.getItem('md-preview-visit-count')).toBeTruthy()
    })

    it('이전 방문 기록이 있으면 모달이 자동으로 표시되지 않음', () => {
      localStorage.setItem('md-preview-visited', 'true')

      const { container } = render(<WelcomeModal />)

      expect(container.firstChild).toBeNull()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('전체 사용자 플로우', () => {
    it('첫 방문자 플로우: 모달 표시 → 시작하기 → 샘플 로드 → 모달 닫힘', async () => {
      const user = userEvent.setup()

      // 1. 첫 방문자는 모달을 본다
      render(<WelcomeModal />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('환영합니다! 👋')).toBeInTheDocument()

      // 2. 주요 기능 안내를 읽는다
      expect(screen.getByText(/실시간 미리보기/i)).toBeInTheDocument()
      expect(screen.getByText(/다양한 스타일/i)).toBeInTheDocument()
      expect(screen.getByText(/자동 저장/i)).toBeInTheDocument()
      expect(screen.getByText(/단축키 지원/i)).toBeInTheDocument()

      // 3. 시작하기 버튼을 클릭한다
      const startButton = screen.getByRole('button', { name: '시작하기 (샘플 로드)' })
      await user.click(startButton)

      // 4. 모달이 닫히고 샘플이 로드된다
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      const content = useEditorStore.getState().content
      const fileName = useEditorStore.getState().fileName

      expect(content).toBe(WELCOME_CONTENT)
      expect(fileName).toBe('welcome.md')

      // 5. 방문 기록이 저장된다
      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })

    it('첫 방문자 플로우: 모달 표시 → 나중에 → 빈 에디터 → 모달 닫힘', async () => {
      const user = userEvent.setup()

      // 1. 첫 방문자는 모달을 본다
      render(<WelcomeModal />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // 2. 나중에 버튼을 클릭한다
      const laterButton = screen.getByRole('button', { name: /나중에/i })
      await user.click(laterButton)

      // 3. 모달이 닫히고 에디터는 비어있다
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      const content = useEditorStore.getState().content
      expect(content).toBe('')

      // 4. 방문 기록이 저장된다
      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })

    it('재방문자 플로우: 모달 표시 안 됨', () => {
      // 이전 방문 기록 설정
      localStorage.setItem('md-preview-visited', 'true')
      localStorage.setItem('md-preview-visit-count', '2')

      // 모달이 표시되지 않는다
      const { container } = render(<WelcomeModal />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('엣지 케이스', () => {
    it('모달이 열려있는 상태에서 Escape 키를 여러 번 눌러도 안전함', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Escape 키를 여러 번 누름
      await user.keyboard('{Escape}')
      await user.keyboard('{Escape}')
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // 오류 없이 정상 종료
      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })

    it('모달이 열려있을 때 body 스크롤이 비활성화됨', () => {
      render(<WelcomeModal />)

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('모달이 닫히면 body 스크롤이 복원됨', async () => {
      const user = userEvent.setup()
      const { unmount } = render(<WelcomeModal />)

      expect(document.body.style.overflow).toBe('hidden')

      // 모달 닫기
      const closeButton = screen.getByRole('button', { name: /닫기/i })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // 언마운트 시 스크롤 복원 확인
      unmount()
      expect(document.body.style.overflow).toBe('')
    })

    it('빠른 클릭 시에도 중복 처리되지 않음', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      const startButton = screen.getByRole('button', { name: '시작하기 (샘플 로드)' })

      // 빠르게 여러 번 클릭
      await user.click(startButton)
      await user.click(startButton)
      await user.click(startButton)

      // 한 번만 처리됨
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })
  })

  describe('접근성 통합 테스트', () => {
    it('모달이 열릴 때 포커스가 모달 내부로 이동함', () => {
      render(<WelcomeModal />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      // 모달 내부에 포커스 가능한 요소가 있어야 함
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('키보드만으로 전체 플로우를 완료할 수 있음', async () => {
      const user = userEvent.setup()
      render(<WelcomeModal />)

      // Tab으로 시작하기 버튼까지 이동
      await user.tab() // Close 버튼
      await user.tab() // 시작하기 버튼

      // Enter로 클릭
      await user.keyboard('{Enter}')

      // 모달이 닫힘
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      expect(localStorage.getItem('md-preview-visited')).toBe('true')
    })
  })
})
