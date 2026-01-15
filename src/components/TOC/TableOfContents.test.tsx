import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TableOfContents } from './TableOfContents'

describe('TableOfContents', () => {
  const mockHeadings = [
    { id: 'heading-1', level: 1, text: 'Title' },
    { id: 'heading-2', level: 2, text: 'Section 1' },
    { id: 'heading-3', level: 3, text: 'Subsection 1.1' },
    { id: 'heading-4', level: 2, text: 'Section 2' },
  ]

  describe('렌더링', () => {
    it('헤딩 목록을 렌더링해야 함', () => {
      render(<TableOfContents headings={mockHeadings} />)

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Subsection 1.1')).toBeInTheDocument()
      expect(screen.getByText('Section 2')).toBeInTheDocument()
    })

    it('빈 헤딩 배열에 대해 메시지를 표시해야 함', () => {
      render(<TableOfContents headings={[]} />)

      expect(screen.getByText(/목차가 없습니다/i)).toBeInTheDocument()
    })

    it('헤딩 레벨에 따라 적절한 들여쓰기를 적용해야 함', () => {
      render(<TableOfContents headings={mockHeadings} />)

      const heading1 = screen.getByText('Title').parentElement
      const heading2 = screen.getByText('Section 1').parentElement
      const heading3 = screen.getByText('Subsection 1.1').parentElement

      // 인라인 스타일로 들여쓰기 확인
      expect(heading1).toHaveStyle({ paddingLeft: '0px' })
      expect(heading2).toHaveStyle({ paddingLeft: '16px' })
      expect(heading3).toHaveStyle({ paddingLeft: '32px' })
    })
  })

  describe('스크롤 이동', () => {
    it('헤딩 클릭 시 해당 위치로 스크롤해야 함', () => {
      const mockElement = document.createElement('div')
      mockElement.id = 'heading-2'
      mockElement.scrollIntoView = vi.fn()
      document.body.appendChild(mockElement)

      render(<TableOfContents headings={mockHeadings} />)

      const heading = screen.getByText('Section 1')
      fireEvent.click(heading)

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })

      document.body.removeChild(mockElement)
    })

    it('존재하지 않는 헤딩 클릭 시 에러가 발생하지 않아야 함', () => {
      render(<TableOfContents headings={mockHeadings} />)

      const heading = screen.getByText('Title')
      expect(() => fireEvent.click(heading)).not.toThrow()
    })
  })

  describe('현재 위치 하이라이트', () => {
    it('활성 헤딩에 active 클래스를 추가해야 함', () => {
      render(
        <TableOfContents headings={mockHeadings} activeId="heading-2" />
      )

      const activeHeading = screen.getByText('Section 1').parentElement
      expect(activeHeading?.className).toContain('active')
    })

    it('활성 헤딩이 없으면 active 클래스가 없어야 함', () => {
      render(<TableOfContents headings={mockHeadings} />)

      const heading = screen.getByText('Section 1').parentElement
      expect(heading?.className).not.toContain('active')
    })
  })

  describe('접근성', () => {
    it('nav 요소로 렌더링되어야 함', () => {
      const { container } = render(<TableOfContents headings={mockHeadings} />)

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', '목차')
    })

    it('각 헤딩 링크는 클릭 가능해야 함', () => {
      render(<TableOfContents headings={mockHeadings} />)

      mockHeadings.forEach((heading) => {
        const link = screen.getByText(heading.text)
        expect(link).toHaveAttribute('role', 'button')
        expect(link).toHaveAttribute('tabIndex', '0')
      })
    })

    it('키보드로 헤딩 선택이 가능해야 함', () => {
      const mockElement = document.createElement('div')
      mockElement.id = 'heading-2'
      mockElement.scrollIntoView = vi.fn()
      document.body.appendChild(mockElement)

      render(<TableOfContents headings={mockHeadings} />)

      const heading = screen.getByText('Section 1')
      fireEvent.keyDown(heading, { key: 'Enter' })

      expect(mockElement.scrollIntoView).toHaveBeenCalled()

      document.body.removeChild(mockElement)
    })
  })
})
