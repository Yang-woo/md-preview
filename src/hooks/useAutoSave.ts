import { useEffect, useState, useRef } from 'react'

export interface UseAutoSaveOptions {
  content: string
  onSave?: (content: string) => void | Promise<void>
  interval?: number // 밀리초 (기본: 30초)
  key?: string // localStorage 키 (기본: 'md-preview-autosave')
}

export interface SavedData {
  content: string
  timestamp: number
}

/**
 * 자동 저장 훅
 * @param options 자동 저장 옵션
 * @returns 자동 저장 상태 및 복구/삭제 함수
 */
export function useAutoSave(options: UseAutoSaveOptions) {
  const {
    content,
    onSave,
    interval = 30000, // 30초
    key = 'md-preview-autosave',
  } = options

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedData, setHasUnsavedData] = useState(false)
  const [savedContent, setSavedContent] = useState<string>('')

  const lastContentRef = useRef<string>('')
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // localStorage에서 이전 세션 데이터 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (!saved) return

      const data: SavedData = JSON.parse(saved)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      // 24시간 이내 데이터만 복구
      if (now - data.timestamp < twentyFourHours) {
        setHasUnsavedData(true)
        setSavedContent(data.content)
      } else {
        // 오래된 데이터 삭제
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error('Failed to load saved data:', error)
    }
  }, [key])

  // 자동 저장 로직
  const save = async (contentToSave: string) => {
    if (!contentToSave || contentToSave === lastContentRef.current) {
      return
    }

    try {
      setIsSaving(true)

      // onSave 콜백 호출
      if (onSave) {
        await onSave(contentToSave)
      }

      // localStorage에 저장
      const data: SavedData = {
        content: contentToSave,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(data))

      lastContentRef.current = contentToSave
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // 자동 저장 타이머 설정
  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      save(content)
    }, interval)

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [content, interval])

  // beforeunload 이벤트 처리
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (content && content !== lastContentRef.current) {
        const data: SavedData = {
          content,
          timestamp: Date.now(),
        }
        localStorage.setItem(key, JSON.stringify(data))

        if (onSave) {
          onSave(content)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [content, key, onSave])

  // 저장된 콘텐츠 복구
  const restore = (): string => {
    localStorage.removeItem(key)
    setHasUnsavedData(false)
    const content = savedContent
    setSavedContent('')
    return content
  }

  // 저장된 데이터 삭제
  const discard = () => {
    localStorage.removeItem(key)
    setHasUnsavedData(false)
    setSavedContent('')
  }

  return {
    isSaving,
    lastSaved,
    hasUnsavedData,
    savedContent,
    restore,
    discard,
  }
}
