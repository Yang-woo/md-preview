import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useWelcome } from '../../hooks/useWelcome'
import { useEditorStore } from '../../stores/editorStore'

export function WelcomeModal() {
  const { showWelcome, welcomeContent, dismissWelcome, startTutorial } =
    useWelcome({
      onStart: () => {
        // 시작하기 버튼 클릭 시 샘플 콘텐츠 로드
        useEditorStore.getState().setContent(welcomeContent)
        useEditorStore.getState().setFileName('welcome.md')
      },
    })

  const handleClose = () => {
    dismissWelcome()
  }

  const handleStart = () => {
    startTutorial()
  }

  const handleLater = () => {
    dismissWelcome()
  }

  // Escape 키로 모달 닫기
  useEffect(() => {
    if (!showWelcome) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showWelcome])

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [showWelcome])

  if (!showWelcome) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-description"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div>
            <h2
              id="welcome-modal-title"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              환영합니다! 👋
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Markdown Preview에 오신 것을 환영합니다
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div id="welcome-modal-description" className="p-6 space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              icon="📝"
              title="실시간 미리보기"
              description="마크다운을 작성하면 즉시 결과를 확인할 수 있습니다"
            />
            <FeatureCard
              icon="🎨"
              title="다양한 스타일"
              description="GitHub, Notion, VS Code 등 4가지 스타일 프리셋을 제공합니다"
            />
            <FeatureCard
              icon="💾"
              title="자동 저장"
              description="30초마다 자동으로 작업 내용을 저장합니다"
            />
            <FeatureCard
              icon="⌨️"
              title="단축키 지원"
              description="Ctrl/Cmd + B, I, K 등 다양한 단축키를 지원합니다"
            />
          </div>

          {/* Additional Features */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              더 많은 기능
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• 파일 드래그 앤 드롭</li>
              <li>• 목차(TOC) 자동 생성</li>
              <li>• 라이트/다크 테마</li>
              <li>• 코드 블록 syntax highlighting</li>
              <li>• GFM(GitHub Flavored Markdown) 지원</li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              🚀 지금 시작하기
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              샘플 마크다운으로 시작하거나, 바로 작성을 시작할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleStart}
                className="flex-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                시작하기 (샘플 로드)
              </button>
              <button
                onClick={handleLater}
                className="flex-1 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 font-medium border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                나중에
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>💡 <strong>팁:</strong> <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700">?</code> 버튼을 클릭하면 모든 단축키를 확인할 수 있습니다</p>
            <p>⚙️ <strong>설정:</strong> 우측 상단의 설정 버튼에서 테마와 스타일을 변경할 수 있습니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-750 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <span className="text-2xl" role="img" aria-label={title}>
          {icon}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
