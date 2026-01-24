import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from './Toolbar'

describe('Toolbar 컴포넌트', () => {
  const mockOnCommand = vi.fn()

  it('Bold 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/굵게/i)).toBeInTheDocument()
  })

  it('Italic 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/기울임/i)).toBeInTheDocument()
  })

  it('Strikethrough 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/취소선/i)).toBeInTheDocument()
  })

  it('헤딩 버튼들을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/제목 1/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/제목 2/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/제목 3/i)).toBeInTheDocument()
  })

  it('링크 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/링크 삽입/i)).toBeInTheDocument()
  })

  it('이미지 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/이미지 삽입/i)).toBeInTheDocument()
  })

  it('코드 버튼들을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/인라인 코드/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/코드 블록/i)).toBeInTheDocument()
  })

  it('리스트 버튼들을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/글머리 기호 목록/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/번호 매기기 목록/i)).toBeInTheDocument()
  })

  it('체크박스 버튼을 렌더링해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    expect(screen.getByLabelText(/작업 목록/i)).toBeInTheDocument()
  })

  it('Bold 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/굵게/i))
    expect(mockOnCommand).toHaveBeenCalledWith('bold')
  })

  it('Italic 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/기울임/i))
    expect(mockOnCommand).toHaveBeenCalledWith('italic')
  })

  it('Heading 1 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/제목 1/i))
    expect(mockOnCommand).toHaveBeenCalledWith('heading1')
  })

  it('Link 버튼 클릭 시 onCommand 콜백을 호출해야 함', () => {
    render(<Toolbar onCommand={mockOnCommand} />)
    fireEvent.click(screen.getByLabelText(/링크 삽입/i))
    expect(mockOnCommand).toHaveBeenCalledWith('link')
  })
})
