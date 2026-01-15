import { useEffect, useRef, useCallback } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

interface ScrollSyncOptions {
  editorRef: React.RefObject<HTMLElement | null>
  previewRef: React.RefObject<HTMLElement | null>
}

/**
 * 에디터와 프리뷰 간 스크롤 동기화 훅
 */
export function useScrollSync({ editorRef, previewRef }: ScrollSyncOptions) {
  const { enableScrollSync } = useSettingsStore()
  const isScrollingRef = useRef<'editor' | 'preview' | null>(null)
  const scrollTimeoutRef = useRef<number | null>(null)

  // 스크롤 비율 계산
  const getScrollPercentage = useCallback((element: HTMLElement): number => {
    const { scrollTop, scrollHeight, clientHeight } = element
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll <= 0) return 0
    return scrollTop / maxScroll
  }, [])

  // 스크롤 비율 적용
  const setScrollPercentage = useCallback((element: HTMLElement, percentage: number) => {
    const { scrollHeight, clientHeight } = element
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll <= 0) return
    element.scrollTop = percentage * maxScroll
  }, [])

  // 스크롤 소스 잠금 해제 (디바운스)
  const unlockScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = null
    }, 150)
  }, [])

  // 에디터 스크롤 핸들러
  const handleEditorScroll = useCallback(() => {
    if (!enableScrollSync) return
    if (isScrollingRef.current === 'preview') return

    const editor = editorRef.current
    const preview = previewRef.current
    if (!editor || !preview) return

    // CodeMirror의 스크롤 컨테이너 찾기
    const editorScrollContainer = editor.querySelector('.cm-scroller') as HTMLElement
    if (!editorScrollContainer) return

    isScrollingRef.current = 'editor'
    const percentage = getScrollPercentage(editorScrollContainer)
    setScrollPercentage(preview, percentage)
    unlockScroll()
  }, [enableScrollSync, editorRef, previewRef, getScrollPercentage, setScrollPercentage, unlockScroll])

  // 프리뷰 스크롤 핸들러
  const handlePreviewScroll = useCallback(() => {
    if (!enableScrollSync) return
    if (isScrollingRef.current === 'editor') return

    const editor = editorRef.current
    const preview = previewRef.current
    if (!editor || !preview) return

    // CodeMirror의 스크롤 컨테이너 찾기
    const editorScrollContainer = editor.querySelector('.cm-scroller') as HTMLElement
    if (!editorScrollContainer) return

    isScrollingRef.current = 'preview'
    const percentage = getScrollPercentage(preview)
    setScrollPercentage(editorScrollContainer, percentage)
    unlockScroll()
  }, [enableScrollSync, editorRef, previewRef, getScrollPercentage, setScrollPercentage, unlockScroll])

  // 이벤트 리스너 등록
  useEffect(() => {
    const editor = editorRef.current
    const preview = previewRef.current
    if (!editor || !preview) return

    // CodeMirror 스크롤 컨테이너
    const editorScrollContainer = editor.querySelector('.cm-scroller') as HTMLElement
    if (!editorScrollContainer) return

    editorScrollContainer.addEventListener('scroll', handleEditorScroll, { passive: true })
    preview.addEventListener('scroll', handlePreviewScroll, { passive: true })

    return () => {
      editorScrollContainer.removeEventListener('scroll', handleEditorScroll)
      preview.removeEventListener('scroll', handlePreviewScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [editorRef, previewRef, handleEditorScroll, handlePreviewScroll])

  return { enableScrollSync }
}
