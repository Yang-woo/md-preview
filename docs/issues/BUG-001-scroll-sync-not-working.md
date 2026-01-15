# BUG-001: 스크롤 동기화 안됨

## 메타 정보
| 항목 | 값 |
|------|-----|
| ID | BUG-001 |
| 타입 | BUG |
| 상태 | **RESOLVED** ✅ |
| 생성일 | 2026-01-16 |
| 복잡도 | 5/10 |

## 문제 설명

### 현상
에디터와 프리뷰 간 스크롤 동기화가 양방향 모두 동작하지 않음.

### 재현 방법
1. 에디터에 긴 마크다운 콘텐츠 입력
2. 에디터를 스크롤 → 프리뷰가 따라오지 않음
3. 프리뷰를 스크롤 → 에디터가 따라오지 않음

### 예상 동작
- 에디터 스크롤 시 프리뷰가 동기화
- 프리뷰 스크롤 시 에디터가 동기화

### 실제 동작
- 양쪽 모두 독립적으로 스크롤됨

## 원인 분석

### 근본 원인
`enableScrollSync` 설정값이 존재하지만 **실제 스크롤 동기화 로직이 구현되지 않음**.

### 발생 위치
- **설정만 존재**: `src/stores/settingsStore.ts:13` - `enableScrollSync: boolean`
- **미구현**: Editor, Preview 컴포넌트에 스크롤 이벤트 핸들러 없음

### 영향 파일
| 파일 | 영향도 | 수정 필요 |
|------|--------|-----------|
| `src/stores/settingsStore.ts` | 낮음 | ❌ (설정 존재) |
| `src/components/Editor/Editor.tsx` | 높음 | ✅ |
| `src/components/Preview/Preview.tsx` | 높음 | ✅ |
| `src/components/Layout/Layout.tsx` | 중간 | ✅ |

## 수정 계획

### 구현 필요 사항
1. Editor에 `onScroll` 이벤트 핸들러 추가
2. Preview에 `onScroll` 이벤트 핸들러 추가
3. 스크롤 비율 계산 유틸리티 함수
4. `enableScrollSync` 설정값 연동
5. 스크롤 동기화 중 무한 루프 방지 (debounce/flag)

### 수정 방향
```typescript
// useScrollSync 커스텀 훅 생성
const useScrollSync = (editorRef, previewRef, enabled) => {
  // 스크롤 비율 기반 동기화
  // 무한 루프 방지 플래그
}
```

## 처리 이력
| 일시 | 액션 | 담당 |
|------|------|------|
| 2026-01-16 | 이슈 생성 | bug-receiver |
| 2026-01-16 | 코드 수정 | dev-orchestrator |
| 2026-01-16 | 테스트 통과 | dev-orchestrator |
| 2026-01-16 | **이슈 해결** | issue-committer |

## 수정 내역
- `src/hooks/useScrollSync.ts` 신규 생성
- `src/components/Layout/Layout.tsx` 스크롤 동기화 훅 적용
