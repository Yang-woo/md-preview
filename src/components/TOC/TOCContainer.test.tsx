import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TOCContainer } from './TOCContainer'

// Intersection Observer 모킹
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
  takeRecords: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
})) as unknown as typeof IntersectionObserver

describe('TOCContainer', () => {
  it('콘텐츠에서 헤딩을 추출하고 렌더링해야 함', () => {
    const content = `
# Title
## Section 1
### Subsection 1.1
## Section 2
    `.trim()

    render(<TOCContainer content={content} />)

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Subsection 1.1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  it('빈 콘텐츠에 대해 메시지를 표시해야 함', () => {
    render(<TOCContainer content="" />)

    expect(screen.getByText(/목차가 없습니다/i)).toBeInTheDocument()
  })

  it('콘텐츠 변경 시 TOC가 업데이트되어야 함', () => {
    const { rerender } = render(<TOCContainer content="# First" />)

    expect(screen.getByText('First')).toBeInTheDocument()

    const newContent = `
# Second
## Third
    `.trim()

    rerender(<TOCContainer content={newContent} />)

    expect(screen.queryByText('First')).not.toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
  })

  it('코드 블록 내부의 헤딩을 무시해야 함', () => {
    const content = `
# Real Heading
\`\`\`
# Fake Heading
\`\`\`
## Another Real
    `.trim()

    render(<TOCContainer content={content} />)

    expect(screen.getByText('Real Heading')).toBeInTheDocument()
    expect(screen.getByText('Another Real')).toBeInTheDocument()
    expect(screen.queryByText('Fake Heading')).not.toBeInTheDocument()
  })

  it('복잡한 마크다운 콘텐츠를 처리해야 함', () => {
    const content = `
# Introduction

This is a paragraph.

## Features

- Feature 1
- Feature 2

### Code Example

\`\`\`js
console.log('hello')
\`\`\`

## Conclusion
    `.trim()

    render(<TOCContainer content={content} />)

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Code Example')).toBeInTheDocument()
    expect(screen.getByText('Conclusion')).toBeInTheDocument()
  })
})
