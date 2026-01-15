import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFileHandler } from './useFileHandler'
import { useEditorStore } from '../stores'

vi.mock('../stores', () => ({
  useEditorStore: vi.fn(),
}))

describe('useFileHandler 훅', () => {
  const mockSetContent = vi.fn()
  const mockSetFileName = vi.fn()
  const mockSetIsDirty = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useEditorStore).mockReturnValue({
      content: '',
      fileName: '',
      isDirty: false,
      setContent: mockSetContent,
      setFileName: mockSetFileName,
      setIsDirty: mockSetIsDirty,
    })
  })

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() => useFileHandler())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('.md 파일을 읽을 수 있어야 함', async () => {
    const { result } = renderHook(() => useFileHandler())

    const fileContent = '# Test'
    const file = new File([fileContent], 'test.md', { type: 'text/markdown' })

    // Mock File.text()
    Object.defineProperty(file, 'text', {
      value: vi.fn().mockResolvedValue(fileContent),
    })

    await act(async () => {
      await result.current.handleFileRead(file)
    })

    expect(mockSetContent).toHaveBeenCalledWith('# Test')
    expect(mockSetFileName).toHaveBeenCalledWith('test.md')
  })

  it('.md가 아닌 파일은 거부해야 함', async () => {
    const { result } = renderHook(() => useFileHandler())

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    await act(async () => {
      await result.current.handleFileRead(file)
    })

    expect(result.current.error).toContain('.md')
  })

  it('5MB 이상 파일은 경고를 표시해야 함', async () => {
    const { result } = renderHook(() => useFileHandler())

    const largeContent = 'a'.repeat(6 * 1024 * 1024) // 6MB
    const file = new File([largeContent], 'large.md', { type: 'text/markdown' })

    await act(async () => {
      await result.current.handleFileRead(file)
    })

    expect(result.current.error).toContain('5MB')
  })

  it('파일 다운로드를 생성할 수 있어야 함', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      content: '# Test Content',
      fileName: 'test.md',
      isDirty: false,
      setContent: mockSetContent,
      setFileName: mockSetFileName,
      setIsDirty: mockSetIsDirty,
    })

    const { result } = renderHook(() => useFileHandler())

    const createObjectURL = vi.fn()
    const revokeObjectURL = vi.fn()
    global.URL.createObjectURL = createObjectURL
    global.URL.revokeObjectURL = revokeObjectURL

    const mockAnchor = {
      click: vi.fn(),
      href: '',
      download: '',
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any)

    act(() => {
      result.current.handleFileDownload()
    })

    expect(createObjectURL).toHaveBeenCalled()
    expect(mockAnchor.download).toBe('test.md')
    expect(mockAnchor.click).toHaveBeenCalled()
  })
})
