import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'

describe('Header 컴포넌트', () => {
  it('로고를 렌더링해야 함', () => {
    render(<Header />)
    expect(screen.getByText(/Markdown Preview/i)).toBeInTheDocument()
  })

  it('파일명을 표시해야 함', () => {
    render(<Header fileName="test.md" />)
    expect(screen.getByText('test.md')).toBeInTheDocument()
  })

  it('파일명이 없으면 "Untitled"을 표시해야 함', () => {
    render(<Header />)
    expect(screen.getByText('Untitled')).toBeInTheDocument()
  })

  it('액션 버튼들을 렌더링해야 함', () => {
    render(<Header />)
    expect(screen.getByLabelText(/Settings/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Help/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Download/i)).toBeInTheDocument()
  })

  it('설정 버튼 클릭 시 onSettingsClick 콜백을 호출해야 함', () => {
    const onSettingsClick = vi.fn()
    render(<Header onSettingsClick={onSettingsClick} />)

    fireEvent.click(screen.getByLabelText(/Settings/i))
    expect(onSettingsClick).toHaveBeenCalledTimes(1)
  })

  it('도움말 버튼 클릭 시 onHelpClick 콜백을 호출해야 함', () => {
    const onHelpClick = vi.fn()
    render(<Header onHelpClick={onHelpClick} />)

    fireEvent.click(screen.getByLabelText(/Help/i))
    expect(onHelpClick).toHaveBeenCalledTimes(1)
  })

  it('다운로드 버튼 클릭 시 onDownloadClick 콜백을 호출해야 함', () => {
    const onDownloadClick = vi.fn()
    render(<Header onDownloadClick={onDownloadClick} />)

    fireEvent.click(screen.getByLabelText(/Download/i))
    expect(onDownloadClick).toHaveBeenCalledTimes(1)
  })

  it('isDirty가 true일 때 저장 안됨 표시를 해야 함', () => {
    render(<Header isDirty={true} />)
    expect(screen.getByText(/unsaved/i)).toBeInTheDocument()
  })
})
