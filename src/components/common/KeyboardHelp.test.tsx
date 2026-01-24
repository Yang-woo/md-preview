import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KeyboardHelp } from './KeyboardHelp'

describe('KeyboardHelp', () => {
  it('키보드 단축키 목록을 렌더링해야 함', () => {
    render(<KeyboardHelp />)

    expect(screen.getByText('키보드 단축키')).toBeInTheDocument()
    expect(screen.getByText('Bold')).toBeInTheDocument()
    expect(screen.getByText('Italic')).toBeInTheDocument()
    expect(screen.getByText('링크 삽입')).toBeInTheDocument()
    expect(screen.getByText('저장/다운로드')).toBeInTheDocument()
    expect(screen.getByText('미리보기 전환')).toBeInTheDocument()
  })

  it('단축키를 kbd 요소로 표시해야 함', () => {
    const { container } = render(<KeyboardHelp />)

    const kbds = container.querySelectorAll('kbd')
    expect(kbds.length).toBe(5) // 5개의 단축키
  })

  it('접근성 속성을 가져야 함', () => {
    const { container } = render(<KeyboardHelp />)

    const help = container.querySelector('[role="complementary"]')
    expect(help).toBeInTheDocument()
    expect(help).toHaveAttribute('aria-label', '키보드 단축키')
  })

  it('Ctrl 또는 Cmd 키를 표시해야 함', () => {
    const { container } = render(<KeyboardHelp />)

    const kbds = container.querySelectorAll('kbd')
    const hasCtrlOrCmd = Array.from(kbds).some((kbd) => {
      const text = kbd.textContent || ''
      return text.includes('Ctrl') || text.includes('Cmd')
    })

    expect(hasCtrlOrCmd).toBe(true)
  })

  it('className prop을 전달할 수 있어야 함', () => {
    const { container } = render(<KeyboardHelp className="custom-class" />)

    const help = container.querySelector('.keyboard-help')
    expect(help).toHaveClass('custom-class')
  })
})
