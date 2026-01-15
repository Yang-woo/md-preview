import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTOC } from './useTOC'

describe('useTOC', () => {
  describe('헤딩 추출', () => {
    it('빈 콘텐츠에서 빈 배열을 반환해야 함', () => {
      const { result } = renderHook(() => useTOC(''))
      expect(result.current.headings).toEqual([])
    })

    it('마크다운 콘텐츠에서 헤딩을 추출해야 함', () => {
      const content = `
# Title
## Section 1
### Subsection 1.1
## Section 2
      `.trim()

      const { result } = renderHook(() => useTOC(content))
      expect(result.current.headings).toHaveLength(4)
      expect(result.current.headings[0]).toEqual({
        id: 'title',
        level: 1,
        text: 'Title',
      })
      expect(result.current.headings[1]).toEqual({
        id: 'section-1',
        level: 2,
        text: 'Section 1',
      })
    })

    it('헤딩 레벨 1-6을 모두 지원해야 함', () => {
      const content = `
# H1
## H2
### H3
#### H4
##### H5
###### H6
      `.trim()

      const { result } = renderHook(() => useTOC(content))
      expect(result.current.headings).toHaveLength(6)
      expect(result.current.headings[0].level).toBe(1)
      expect(result.current.headings[5].level).toBe(6)
    })

    it('코드 블록 내부의 헤딩은 무시해야 함', () => {
      const content = `
# Real Heading
\`\`\`
# Fake Heading in Code
\`\`\`
## Another Real Heading
      `.trim()

      const { result } = renderHook(() => useTOC(content))
      expect(result.current.headings).toHaveLength(2)
      expect(result.current.headings[0].text).toBe('Real Heading')
      expect(result.current.headings[1].text).toBe('Another Real Heading')
    })

    it('인라인 코드가 포함된 헤딩을 처리해야 함', () => {
      const content = `
# \`Code\` in Heading
## Normal Text and \`inline code\`
      `.trim()

      const { result } = renderHook(() => useTOC(content))
      expect(result.current.headings).toHaveLength(2)
      expect(result.current.headings[0].text).toBe('Code in Heading')
      expect(result.current.headings[1].text).toBe('Normal Text and inline code')
    })

    it('특수 문자가 포함된 헤딩에서 유효한 ID를 생성해야 함', () => {
      const content = `
# Hello World!
## This & That
### 한글 제목
#### Mix-123_test
      `.trim()

      const { result } = renderHook(() => useTOC(content))
      expect(result.current.headings[0].id).toBe('hello-world')
      expect(result.current.headings[1].id).toBe('this-that')
      expect(result.current.headings[2].id).toBe('한글-제목')
      expect(result.current.headings[3].id).toBe('mix-123_test')
    })

    it('중복된 헤딩 텍스트에 고유한 ID를 생성해야 함', () => {
      const content = `
# Introduction
## Introduction
### Introduction
      `.trim()

      const { result } = renderHook(() => useTOC(content))
      expect(result.current.headings[0].id).toBe('introduction')
      expect(result.current.headings[1].id).toBe('introduction-1')
      expect(result.current.headings[2].id).toBe('introduction-2')
    })
  })

  describe('헤딩 계층 구조', () => {
    it('중첩된 헤딩의 계층 구조를 계산해야 함', () => {
      const content = `
# H1
## H2-1
### H3-1
### H3-2
## H2-2
#### H4-1
      `.trim()

      const { result } = renderHook(() => useTOC(content))
      const headings = result.current.headings

      expect(headings[0].level).toBe(1) // H1
      expect(headings[1].level).toBe(2) // H2-1
      expect(headings[2].level).toBe(3) // H3-1
      expect(headings[3].level).toBe(3) // H3-2
      expect(headings[4].level).toBe(2) // H2-2
      expect(headings[5].level).toBe(4) // H4-1
    })
  })

  describe('콘텐츠 변경 시 업데이트', () => {
    it('콘텐츠가 변경되면 헤딩을 다시 추출해야 함', () => {
      const { result, rerender } = renderHook(
        ({ content }) => useTOC(content),
        {
          initialProps: { content: '# First' },
        }
      )

      expect(result.current.headings).toHaveLength(1)
      expect(result.current.headings[0].text).toBe('First')

      rerender({ content: '# Second\n## Third' })
      expect(result.current.headings).toHaveLength(2)
      expect(result.current.headings[0].text).toBe('Second')
      expect(result.current.headings[1].text).toBe('Third')
    })
  })
})
