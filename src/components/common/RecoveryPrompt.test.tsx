import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RecoveryPrompt } from './RecoveryPrompt'

describe('RecoveryPrompt', () => {
  it('isOpen이 false면 렌더링되지 않아야 함', () => {
    const onRestore = vi.fn()
    const onDiscard = vi.fn()

    render(
      <RecoveryPrompt
        isOpen={false}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('isOpen이 true면 모달이 렌더링되어야 함', () => {
    const onRestore = vi.fn()
    const onDiscard = vi.fn()

    render(
      <RecoveryPrompt
        isOpen={true}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('저장되지 않은 내용 발견')).toBeInTheDocument()
    expect(screen.getByText(/이전 세션의 저장되지 않은 내용이 있습니다/)).toBeInTheDocument()
  })

  it('복구하기 버튼을 클릭하면 onRestore가 호출되어야 함', () => {
    const onRestore = vi.fn()
    const onDiscard = vi.fn()

    render(
      <RecoveryPrompt
        isOpen={true}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    const restoreButton = screen.getByRole('button', { name: '복구하기' })
    fireEvent.click(restoreButton)

    expect(onRestore).toHaveBeenCalledTimes(1)
  })

  it('삭제하기 버튼을 클릭하면 onDiscard가 호출되어야 함', () => {
    const onRestore = vi.fn()
    const onDiscard = vi.fn()

    render(
      <RecoveryPrompt
        isOpen={true}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    const discardButton = screen.getByRole('button', { name: '삭제하기' })
    fireEvent.click(discardButton)

    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('닫기(X) 버튼을 클릭하면 onDiscard가 호출되어야 함', () => {
    const onRestore = vi.fn()
    const onDiscard = vi.fn()

    render(
      <RecoveryPrompt
        isOpen={true}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    const closeButton = screen.getByRole('button', { name: '닫기' })
    fireEvent.click(closeButton)

    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('Escape 키를 누르면 onDiscard가 호출되어야 함', () => {
    const onRestore = vi.fn()
    const onDiscard = vi.fn()

    render(
      <RecoveryPrompt
        isOpen={true}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onDiscard).toHaveBeenCalledTimes(1)
  })

  it('모달이 열릴 때 body overflow가 hidden으로 설정되어야 함', () => {
    const onRestore = vi.fn()
    const onDiscard = vi.fn()

    const { rerender } = render(
      <RecoveryPrompt
        isOpen={true}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    expect(document.body.style.overflow).toBe('hidden')

    rerender(
      <RecoveryPrompt
        isOpen={false}
        onRestore={onRestore}
        onDiscard={onDiscard}
      />
    )

    expect(document.body.style.overflow).toBe('')
  })
})
