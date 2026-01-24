import { useTranslation } from 'react-i18next'
import { Heading } from '../../hooks/useTOC'

export interface TableOfContentsProps {
  headings: Heading[]
  activeId?: string
  className?: string
}

/**
 * 목차(Table of Contents) 컴포넌트
 * @param headings 헤딩 배열
 * @param activeId 현재 활성화된 헤딩 ID
 * @param className 추가 CSS 클래스
 */
export function TableOfContents({
  headings,
  activeId,
  className = '',
}: TableOfContentsProps) {
  const { t } = useTranslation('toc')

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(id)
    }
  }

  if (headings.length === 0) {
    return (
      <nav
        className={`toc-container ${className}`}
        aria-label={t('ariaLabel')}
      >
        <div className="text-sm text-gray-500 dark:text-gray-400 p-4">
          {t('empty')}
        </div>
      </nav>
    )
  }

  return (
    <nav
      className={`toc-container ${className}`}
      aria-label={t('ariaLabel')}
    >
      <div className="toc-header px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('title')}
        </h2>
      </div>
      <ul className="toc-list py-2">
        {headings.map((heading) => {
          const isActive = activeId === heading.id

          // Tailwind CSS 동적 클래스를 위한 인라인 스타일
          const paddingLeftStyle = {
            paddingLeft: `${(heading.level - 1) * 16}px`,
          }

          return (
            <li
              key={heading.id}
              className={`toc-item ${isActive ? 'active' : ''}`}
              style={paddingLeftStyle}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleClick(heading.id)}
                onKeyDown={(e) => handleKeyDown(e, heading.id)}
                className={`
                  toc-link block px-4 py-2 text-sm cursor-pointer
                  transition-colors duration-150
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {heading.text}
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
