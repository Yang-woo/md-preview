# BUG-003: 스크롤 동기화 타이밍 이슈

## 메타 정보
| 항목 | 값 |
|------|-----|
| ID | BUG-003 |
| 타입 | BUG |
| 상태 | **RESOLVED** ✅ |
| 생성일 | 2026-01-16 |
| 복잡도 | 6/10 |
| 관련 이슈 | BUG-001 (불완전 수정) |

## 문제 설명

### 현상
BUG-001에서 스크롤 동기화를 구현했으나 실제로 동작하지 않음.

### 근본 원인
`useScrollSync` 훅의 useEffect가 실행될 때 CodeMirror(`.cm-scroller`)가 아직 생성되지 않음.

### 실행 순서 문제
```
1. Layout 컴포넌트 마운트
2. useScrollSync useEffect 실행 ← 이 시점에 .cm-scroller 찾음
3. EditorWithToolbar 렌더링
4. Editor 컴포넌트 마운트
5. Editor useEffect에서 CodeMirror 생성 ← .cm-scroller 생성됨
```

**문제**: 2번에서 5번이 아직 실행되지 않아 `.cm-scroller`가 `null`

### 문제 코드
```typescript
// useScrollSync.ts - Line 82-89
useEffect(() => {
  const editor = editorRef.current
  const preview = previewRef.current
  if (!editor || !preview) return

  // 이 시점에 CodeMirror가 아직 생성되지 않음!
  const editorScrollContainer = editor.querySelector('.cm-scroller') as HTMLElement
  if (!editorScrollContainer) return  // ← 여기서 early return
  // ...
}, [editorRef, previewRef, handleEditorScroll, handlePreviewScroll])
```

## 이전 수정 분석 (BUG-001)

### 부족했던 점
1. **테스트 코드 없음**: `useScrollSync.test.ts` 미작성
2. **QA 미흡**: 기존 테스트만 통과, 실제 기능 미검증
3. **타이밍 고려 없음**: 비동기 마운트 순서 미고려

## 수정 계획

### 방법 1: MutationObserver 사용
```typescript
useEffect(() => {
  const editor = editorRef.current
  if (!editor) return

  // .cm-scroller가 나타날 때까지 감시
  const observer = new MutationObserver(() => {
    const scroller = editor.querySelector('.cm-scroller')
    if (scroller) {
      // 이벤트 리스너 등록
      observer.disconnect()
    }
  })

  observer.observe(editor, { childList: true, subtree: true })
  return () => observer.disconnect()
}, [])
```

### 방법 2: 지연 초기화 (setTimeout/requestAnimationFrame)
```typescript
useEffect(() => {
  const timer = requestAnimationFrame(() => {
    const editorScrollContainer = editor.querySelector('.cm-scroller')
    // ...
  })
  return () => cancelAnimationFrame(timer)
}, [])
```

### 방법 3: Editor 컴포넌트에서 콜백 전달
Editor가 마운트 완료 후 부모에게 알림

## 테스트 계획

### 필수 테스트 케이스
1. 에디터 스크롤 → 프리뷰 동기화
2. 프리뷰 스크롤 → 에디터 동기화
3. enableScrollSync=false 시 동기화 안됨
4. 무한 루프 방지 확인
5. 빠른 연속 스크롤 처리

## 수정 내역

### 적용된 방법: MutationObserver 사용

```typescript
// useScrollSync.ts - MutationObserver로 .cm-scroller 감시
useEffect(() => {
  const editor = editorRef.current
  if (!editor) return

  // .cm-scroller가 이미 있는지 확인
  const existingScroller = editor.querySelector('.cm-scroller')
  if (existingScroller) {
    setupScrollListeners(existingScroller)
  } else {
    // .cm-scroller가 나타날 때까지 MutationObserver로 감시
    observer = new MutationObserver((mutations) => {
      const scroller = editor.querySelector('.cm-scroller')
      if (scroller) {
        setupScrollListeners(scroller)
        observer?.disconnect()
      }
    })
    observer.observe(editor, { childList: true, subtree: true })
  }

  return () => observer?.disconnect()
}, [])
```

### 수정된 파일
| 파일 | 변경 |
|------|------|
| `src/hooks/useScrollSync.ts` | MutationObserver로 .cm-scroller 감시 |
| `src/hooks/__tests__/useScrollSync.test.ts` | 테스트 코드 추가 (5개 케이스) |
| `tsconfig.app.json` | 테스트 파일 exclude 추가 |

### 추가된 테스트
| 테스트 케이스 | 설명 |
|---------------|------|
| delayed .cm-scroller creation | 지연된 .cm-scroller 생성 시 동기화 |
| sync editor scroll to preview | 에디터→프리뷰 동기화 |
| sync preview scroll to editor | 프리뷰→에디터 동기화 |
| enableScrollSync=false | 동기화 비활성화 |
| prevent scroll infinite loop | 무한 루프 방지 |

## 처리 이력
| 일시 | 액션 | 담당 |
|------|------|------|
| 2026-01-16 | 이슈 생성 | bug-receiver |
| 2026-01-16 | TDD 테스트 작성 | bug-fixer |
| 2026-01-16 | MutationObserver 적용 | bug-fixer |
| 2026-01-16 | **이슈 해결** | issue-orchestrator |
