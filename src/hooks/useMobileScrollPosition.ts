import { useCallback, useEffect, RefObject } from 'react'
import { type ViewMode } from '../stores'

interface UseMobileScrollPositionProps {
  isMobile: boolean
  viewMode: ViewMode
  editorContainerRef: RefObject<HTMLDivElement>
  previewContainerRef: RefObject<HTMLDivElement>
  editorScrollPosition: number
  previewScrollPosition: number
  setEditorScrollPosition: (position: number) => void
  setPreviewScrollPosition: (position: number) => void
  setViewMode: (mode: ViewMode) => void
}

/**
 * 모바일 환경에서 탭 전환 시 스크롤 위치를 저장하고 복원하는 훅
 */
export function useMobileScrollPosition({
  isMobile,
  viewMode,
  editorContainerRef,
  previewContainerRef,
  editorScrollPosition,
  previewScrollPosition,
  setEditorScrollPosition,
  setPreviewScrollPosition,
  setViewMode,
}: UseMobileScrollPositionProps) {
  // 탭 전환 시 현재 스크롤 위치 저장
  const handleTabChange = useCallback(
    (newViewMode: ViewMode) => {
      if (!isMobile) return

      // 현재 탭의 스크롤 위치 저장
      if (viewMode === 'editor') {
        const editorScroller = editorContainerRef.current?.querySelector('.cm-scroller')
        if (editorScroller) {
          setEditorScrollPosition(editorScroller.scrollTop)
        }
      } else if (viewMode === 'preview') {
        const previewScroller = previewContainerRef.current
        if (previewScroller) {
          setPreviewScrollPosition(previewScroller.scrollTop)
        }
      }

      setViewMode(newViewMode)
    },
    [
      isMobile,
      viewMode,
      editorContainerRef,
      previewContainerRef,
      setEditorScrollPosition,
      setPreviewScrollPosition,
      setViewMode,
    ]
  )

  // 탭 복귀 시 저장된 스크롤 위치 복원
  useEffect(() => {
    if (!isMobile) return

    if (viewMode === 'editor') {
      const editorScroller = editorContainerRef.current?.querySelector('.cm-scroller')
      if (editorScroller && editorScrollPosition > 0) {
        // 다음 프레임에 스크롤 복원 (DOM이 준비된 후)
        requestAnimationFrame(() => {
          editorScroller.scrollTop = editorScrollPosition
        })
      }
    } else if (viewMode === 'preview') {
      const previewScroller = previewContainerRef.current
      if (previewScroller && previewScrollPosition > 0) {
        requestAnimationFrame(() => {
          previewScroller.scrollTop = previewScrollPosition
        })
      }
    }
  }, [isMobile, viewMode, editorContainerRef, previewContainerRef, editorScrollPosition, previewScrollPosition])

  return { handleTabChange }
}
