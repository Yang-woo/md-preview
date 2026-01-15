import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from './Toolbar'

describe('Toolbar 컴포넌트', () => {
  const mockOnCommand = vi.fn()

  it('Bold 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Bold/i)).toBeInTheDocument()
  })

  it('Italic 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Italic/i)).toBeInTheDocument()
  })

  it('Strikethrough 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Strikethrough/i)).toBeInTheDocument()
  })

  it('헤딩 버튼들을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Heading 1/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Heading 2/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Heading 3/i)).toBeInTheDocument()
  })

  it('링크 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Insert Link/i)).toBeInTheDocument()
  })

  it('이미지 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Insert Image/i)).toBeInTheDocument()
  })

  it('코드 버튼들을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Inline Code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Code Block/i)).toBeInTheDocument()
  })

  it('리스트 버튼들을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Bullet List/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Numbered List/i)).toBeInTheDocument()
  })

  it('체크박스 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/Task List/i)).toBeInTheDocument()
  })

  it('Bold 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/Bold/i))
    expect(mockOnCommand).toHaveBeenCalledWith('bold')
  })

  it('Italic 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/Italic/i))
    expect(mockOnCommand).toHaveBeenCalledWith('italic')
  })

  it('Heading 1 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/Heading 1/i))
    expect(mockOnCommand).toHaveBeenCalledWith('heading1')
  })

  it('Link 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/Insert Link/i))
    expect(mockOnCommand).toHaveBeenCalledWith('link')
  })
})
