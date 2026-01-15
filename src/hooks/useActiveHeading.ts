import { useEffect, useState } from 'react'

/**
 * Intersection Observer를 사용해 현재 보이는 헤딩을 추적하는 훅
 * @param headingIds 헤딩 ID 배열
 * @returns 현재 활성화된 헤딩 ID
 */
export function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headingIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 보이는 헤딩들
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          // 가장 위에 있는 헤딩을 활성화
          const topEntry = visibleEntries.reduce((top, entry) =>
            entry.boundingClientRect.top < top.boundingClientRect.top
              ? entry
              : top
          )
          setActiveId(topEntry.target.id)
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px', // 상단 80px, 하단 80% 마진
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    // 모든 헤딩 요소 관찰
    headingIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headingIds])

  return activeId
}
