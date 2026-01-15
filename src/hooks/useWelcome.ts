import { useState, useEffect, useCallback } from 'react'
import { WELCOME_CONTENT } from '../constants/welcomeContent'

const VISITED_KEY = 'md-preview-visited'
const VISIT_COUNT_KEY = 'md-preview-visit-count'

export interface UseWelcomeOptions {
  onStart?: () => void
  onLoadSample?: (content: string) => void
}

export interface UseWelcomeReturn {
  isFirstVisit: boolean
  showWelcome: boolean
  welcomeContent: string
  visitCount: number
  dismissWelcome: () => void
  startTutorial: () => void
  showWelcomeModal: () => void
  loadSampleContent: () => void
  resetWelcome: () => void
}

export function useWelcome(options: UseWelcomeOptions = {}): UseWelcomeReturn {
  const { onStart, onLoadSample } = options

  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem(VISITED_KEY)
  })

  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem(VISITED_KEY)
  })

  const [visitCount, setVisitCount] = useState(() => {
    const count = localStorage.getItem(VISIT_COUNT_KEY)
    return count ? parseInt(count, 10) : 1
  })

  // 방문 횟수 업데이트
  useEffect(() => {
    if (!localStorage.getItem(VISITED_KEY)) {
      // 첫 방문
      return
    }

    // 이전 방문 기록이 있으면 방문 횟수 증가
    const currentCount = parseInt(
      localStorage.getItem(VISIT_COUNT_KEY) || '1',
      10
    )
    const newCount = currentCount + 1
    localStorage.setItem(VISIT_COUNT_KEY, newCount.toString())
    setVisitCount(newCount)
  }, [])

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false)
    localStorage.setItem(VISITED_KEY, 'true')

    // 첫 방문 시 방문 횟수 초기화
    if (!localStorage.getItem(VISIT_COUNT_KEY)) {
      localStorage.setItem(VISIT_COUNT_KEY, '1')
    }
  }, [])

  const startTutorial = useCallback(() => {
    dismissWelcome()
    onStart?.()
  }, [dismissWelcome, onStart])

  const showWelcomeModal = useCallback(() => {
    setShowWelcome(true)
  }, [])

  const loadSampleContent = useCallback(() => {
    onLoadSample?.(WELCOME_CONTENT)
  }, [onLoadSample])

  const resetWelcome = useCallback(() => {
    localStorage.removeItem(VISITED_KEY)
    localStorage.removeItem(VISIT_COUNT_KEY)
    setIsFirstVisit(true)
    setShowWelcome(true)
    setVisitCount(1)
  }, [])

  return {
    isFirstVisit,
    showWelcome,
    welcomeContent: WELCOME_CONTENT,
    visitCount,
    dismissWelcome,
    startTutorial,
    showWelcomeModal,
    loadSampleContent,
    resetWelcome,
  }
}
