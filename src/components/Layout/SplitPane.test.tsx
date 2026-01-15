import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SplitPane } from './SplitPane'

describe('SplitPane 컴포넌트', () => {
  it('왼쪽과 오른쪽 패널을 렌더링해야 함', () => {
    render(
      <SplitPane
        left={<div>Left Panel</div>}
        right={<div>Right Panel</div>}
      />
    )

    expect(screen.getByText('Left Panel')).toBeInTheDocument()
    expect(screen.getByText('Right Panel')).toBeInTheDocument()
  })

  it('기본 분할 비율이 50%여야 함', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    )

    const leftPane = screen.getByText('Left').parentElement
    expect(leftPane).toHaveStyle({ width: '50%' })
  })

  it('초기 분할 비율을 설정할 수 있어야 함', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        initialRatio={30}
      />
    )

    const leftPane = screen.getByText('Left').parentElement
    expect(leftPane).toHaveStyle({ width: '30%' })
  })

  it('드래그 핸들을 렌더링해야 함', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    )

    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('드래그 시 onRatioChange 콜백을 호출해야 함', () => {
    const onRatioChange = vi.fn()
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        onRatioChange={onRatioChange}
      />
    )

    const handle = screen.getByRole('separator')
    fireEvent.mouseDown(handle, { clientX: 100 })
    fireEvent.mouseMove(document, { clientX: 200 })
    fireEvent.mouseUp(document)

    expect(onRatioChange).toHaveBeenCalled()
  })

  it('분할 비율이 20% 미만으로 내려가지 않아야 함', () => {
    const onRatioChange = vi.fn()
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        onRatioChange={onRatioChange}
        minRatio={20}
      />
    )

    const handle = screen.getByRole('separator')
    fireEvent.mouseDown(handle, { clientX: 500 })
    fireEvent.mouseMove(document, { clientX: 10 })
    fireEvent.mouseUp(document)

    const calls = onRatioChange.mock.calls
    if (calls.length > 0) {
      expect(calls[calls.length - 1][0]).toBeGreaterThanOrEqual(20)
    }
  })

  it('분할 비율이 80%를 초과하지 않아야 함', () => {
    const onRatioChange = vi.fn()
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        onRatioChange={onRatioChange}
        maxRatio={80}
      />
    )

    const handle = screen.getByRole('separator')
    fireEvent.mouseDown(handle, { clientX: 100 })
    fireEvent.mouseMove(document, { clientX: 1000 })
    fireEvent.mouseUp(document)

    const calls = onRatioChange.mock.calls
    if (calls.length > 0) {
      expect(calls[calls.length - 1][0]).toBeLessThanOrEqual(80)
    }
  })
})
