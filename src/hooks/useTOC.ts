import { useMemo } from 'react'
import { generateHeadingId } from '../utils/headingId'

export interface Heading {
  id: string
  level: number
  text: string
}

/**
 * 마크다운 콘텐츠에서 헤딩을 추출하는 훅
 * @param content 마크다운 콘텐츠
 * @returns 헤딩 배열
 */
export function useTOC(content: string) {
  const headings = useMemo(() => {
    if (!content) return []

    const lines = content.split('\n')
    const extractedHeadings: Heading[] = []
    const idCounts = new Map<string, number>()
    let inCodeBlock = false

    for (const line of lines) {
      // 코드 블록 토글
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
        continue
      }

      // 코드 블록 내부는 무시
      if (inCodeBlock) continue

      // 헤딩 매칭 (# ~ ######)
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (!match) continue

      const level = match[1].length
      let text = match[2].trim()

      // 인라인 코드 백틱 제거
      text = text.replace(/`([^`]+)`/g, '$1')

      // ID 생성
      let id = generateHeadingId(text)

      // 중복 ID 처리
      if (idCounts.has(id)) {
        const count = idCounts.get(id)!
        idCounts.set(id, count + 1)
        id = `${id}-${count}`
      } else {
        idCounts.set(id, 1)
      }

      extractedHeadings.push({ id, level, text })
    }

    return extractedHeadings
  }, [content])

  return { headings }
}
