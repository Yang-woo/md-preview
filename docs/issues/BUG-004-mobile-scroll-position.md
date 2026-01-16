# BUG-004: 모바일 스크롤 위치 유지 기능 작동 안함

## 메타 정보
| 항목 | 값 |
|------|-----|
| ID | BUG-004 |
| 타입 | BUG |
| 상태 | **RESOLVED** ✅ |
| 생성일 | 2026-01-16 |
| 복잡도 | 3/10 |
| 관련 이슈 | DEV-018 (불완전 구현) |

## 문제 설명

### 현상
DEV-018에서 모바일 스크롤 위치 유지 기능을 구현했으나 실제로 동작하지 않음.
1. 에디터에서 스크롤 내리고 프리뷰 탭으로 이동 후 다시 에디터로 돌아오면 스크롤이 최상단
2. 프리뷰에서 스크롤 내리고 에디터 탭으로 이동 후 다시 프리뷰로 돌아오면 스크롤이 최상단

### 근본 원인

#### 원인 1: 모바일에서 ref 미연결
`Layout.tsx`에서 모바일 탭뷰에 `editorContainerRef`와 `previewContainerRef`가 연결되지 않음.

```tsx
// 데스크톱: ref 연결됨 (SplitPane 내)
<div ref={editorContainerRef}>...</div>
<div ref={previewContainerRef}>...</div>

// 모바일: ref 없음! ❌
{viewMode === 'editor' && <EditorWithToolbar />}  // editorContainerRef 없음
{viewMode === 'preview' && <Preview />}           // previewContainerRef 없음
```

#### 원인 2: 조건부 렌더링으로 컴포넌트 언마운트
```tsx
{viewMode === 'editor' && ...}  // 탭 전환 시 컴포넌트 언마운트
```
- 탭 전환 시 `viewMode` 변경 → 컴포넌트 언마운트 → ref.current = null
- 스크롤 위치 저장 시점에 ref가 null이어서 저장 불가

### BUG-003과의 유사성

| 항목 | BUG-003 | BUG-004 |
|------|---------|---------|
| 기능 | 스크롤 동기화 | 모바일 스크롤 위치 |
| 원인 | 타이밍 이슈 (.cm-scroller 미생성) | ref 미연결 + 조건부 렌더링 |
| 테스트 | 훅 단위 테스트만 존재 | 훅 단위 테스트만 존재 |
| 통합 테스트 | ❌ 없음 | ❌ 없음 |
| 패턴 | 테스트 통과, 실제 동작 안함 | 테스트 통과, 실제 동작 안함 |

## 수정 내역

### 수정된 파일
| 파일 | 변경 |
|------|------|
| `src/components/Layout/Layout.tsx` | 모바일 탭뷰 DOM 구조 변경 |
| `src/hooks/useMobileScrollPosition.ts` | scrollTop > 0 조건 추가 |
| `src/components/Layout/Layout.test.tsx` | 회귀 테스트 5개 추가 |
| `src/hooks/__tests__/useMobileScrollPosition.test.ts` | 테스트 수정 |

### 핵심 수정 (Layout.tsx)

**Before** (조건부 렌더링 - 언마운트):
```tsx
{viewMode === 'editor' && <EditorWithToolbar />}
{viewMode === 'preview' && <Preview />}
```

**After** (CSS 숨김 - DOM 유지 + ref 연결):
```tsx
<div
  ref={editorContainerRef}
  className={`absolute inset-0 ${viewMode === 'editor' ? 'block' : 'hidden'}`}
>
  <EditorWithToolbar className="h-full" />
</div>
<div
  ref={previewContainerRef}
  className={`absolute inset-0 overflow-auto p-4 ${viewMode === 'preview' ? 'block' : 'hidden'}`}
>
  <Preview content={content} />
</div>
```

### 추가된 회귀 테스트
| 테스트 케이스 | 설명 |
|---------------|------|
| 모바일에서 에디터와 프리뷰가 모두 DOM에 존재 | 언마운트 방지 검증 |
| 에디터 탭: 에디터 visible, 프리뷰 hidden | CSS 숨김 검증 |
| 프리뷰 탭: 프리뷰 visible, 에디터 hidden | CSS 숨김 검증 |
| 에디터 컨테이너 ref 연결 | ref 연결 검증 |
| 프리뷰 컨테이너 ref 연결 | ref 연결 검증 |

## 재발 방지 조치

### 에이전트 개선
1. `tdd-writer` 에이전트에 **통합 테스트 필수** 요구사항 추가
2. `test-generator` 에이전트에 **통합 테스트 필수** 요구사항 추가

### 통합 테스트 체크리스트 (신규)
| 항목 | 설명 |
|------|------|
| 컴포넌트 연동 | 훅이 실제 컴포넌트에서 사용될 때 동작하는지 |
| DOM 구조 | ref가 실제 DOM에 연결되는지 |
| 타이밍 | 비동기 렌더링, 마운트 순서 이슈 |
| 실제 사용 시나리오 | 사용자 흐름 전체 테스트 |
| 조건부 렌더링 | 언마운트/리마운트 시 상태 유지 |

## 테스트 결과
- 전체 테스트: 261/261 통과
- 신규 회귀 테스트: 5개 추가

## 처리 이력
| 일시 | 액션 | 담당 |
|------|------|------|
| 2026-01-16 | 이슈 보고 | user |
| 2026-01-16 | 원인 분석 | claude |
| 2026-01-16 | 코드 수정 | bug-fixer |
| 2026-01-16 | 회귀 테스트 추가 | bug-fixer |
| 2026-01-16 | 에이전트 개선 | claude |
| 2026-01-16 | **이슈 해결** | claude |
