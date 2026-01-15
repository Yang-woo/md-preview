import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Preview } from './Preview'

describe('Preview 컴포넌트', () => {
  it('마크다운이 렌더링되어야 함', () => {
    render(<Preview content="# Hello World" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Hello World')
  })

  it('빈 content일 때 아무것도 렌더링하지 않아야 함', () => {
    const { container } = render(<Preview content="" />)
    expect(container.querySelector('.preview-content')?.textContent).toBe('')
  })

  it('GFM 테이블이 렌더링되어야 함', () => {
    const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`
    render(<Preview content={markdown} />)
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
  })

  it('GFM 체크박스가 렌더링되어야 함', () => {
    const markdown = `
- [x] Completed task
- [ ] Incomplete task
`
    render(<Preview content={markdown} />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
  })

  it('취소선이 렌더링되어야 함', () => {
    render(<Preview content="~~strikethrough~~" />)
    const del = screen.getByText('strikethrough')
    expect(del.tagName).toBe('DEL')
  })

  it('코드 블록이 렌더링되어야 함', () => {
    const markdown = `
\`\`\`javascript
const hello = 'world';
\`\`\`
`
    const { container } = render(<Preview content={markdown} />)
    const code = container.querySelector('pre code')
    expect(code).toBeInTheDocument()
    expect(code?.textContent).toContain('const')
  })

  it('링크가 렌더링되어야 함', () => {
    render(<Preview content="[Link](https://example.com)" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('이미지가 렌더링되어야 함', () => {
    render(<Preview content="![Alt text](https://example.com/image.png)" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/image.png')
    expect(img).toHaveAttribute('alt', 'Alt text')
  })

  it('커스텀 className이 적용되어야 함', () => {
    const { container } = render(<Preview content="# Test" className="custom-class" />)
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
