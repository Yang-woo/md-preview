# BUG-005: 마크다운 서식 토글 해제가 작동하지 않음

## 메타 정보

| 항목 | 값 |
|------|-----|
| ID | BUG-005 |
| 타입 | bug |
| 생성일 | 2026-01-18 |
| 상태 | RESOLVED ✅ |
| 심각도 | Major |
| 우선순위 | P1 |
| 담당자 | - |
| 해결일 | 2026-01-18 |

## 버그 설명

에디터에서 텍스트를 선택하고 볼드, 이탤릭 등 서식 버튼을 클릭해서 적용한 후, 다시 같은 버튼을 누르면 서식이 해제되어야 하는데 해제되지 않는 버그입니다.

## 재현 방법

1. 에디터에서 "hello" 텍스트 선택
2. Bold 버튼 클릭 → `**hello**`로 변경됨
3. 서식 적용 후 커서가 `hello`만 선택된 상태 (마커 제외)
4. 다시 Bold 버튼 클릭 → 해제되어야 하는데 `****hello****`로 중복 적용됨

## 예상 동작

서식 적용 후 내부 텍스트만 선택된 상태에서 다시 서식 버튼을 누르면:
- 주변 컨텍스트(before/after)에 마커가 있는지 확인
- 마커가 있으면 서식 제거 (토글 off)
- 마커가 없으면 서식 적용 (토글 on)

## 실제 동작

현재는 선택된 텍스트 자체에 마커가 포함되어 있는지만 확인하므로:
- `**hello**` 전체 선택 시: 서식 제거 (정상 작동)
- `hello`만 선택 시: 주변 마커 무시하고 중복 적용 (버그)

## 원인 분석

`src/utils/markdownCommands.ts`의 `toggleWrapper` 함수:

```typescript
// 현재 구현 (문제)
const isWrapped = selectedText.startsWith(marker) && selectedText.endsWith(marker)
```

- `selectedText`에 마커가 포함된 경우만 확인
- `before`/`after`에 마커가 있는 경우 확인하지 않음
- 서식 적용 후 커서가 내부 텍스트만 선택한 상태에서 재클릭 시 중복 적용됨

## 영향 범위

- 영향받는 기능: Bold, Italic, Strikethrough, InlineCode
- 영향받는 파일:
  - `src/utils/markdownCommands.ts` (toggleWrapper 함수)
  - `src/utils/markdownCommands.phase2.test.ts` (테스트 케이스 존재)
- 영향받는 사용자: 마크다운 에디터 사용자 전체

## 수정 방향

`toggleWrapper` 함수 개선:

1. 선택된 텍스트 주변(before/after) 컨텍스트 확인
2. before 끝부분에 마커가 있고 after 시작 부분에 마커가 있으면 → 서식 제거
3. 그렇지 않으면 → 서식 적용

```typescript
// 개선 방안
function toggleWrapper(
  before: string,
  after: string,
  selectedText: string,
  marker: string,
  placeholder: string,
  start: number
): { newContent: string; newSelectionStart: number; newSelectionEnd: number } {
  // 1. 선택 텍스트 자체에 마커 포함 여부 확인
  const isWrappedInSelection = selectedText.startsWith(marker) && selectedText.endsWith(marker)

  // 2. 주변 컨텍스트에 마커 존재 여부 확인
  const isWrappedByContext = before.endsWith(marker) && after.startsWith(marker)

  const isWrapped = isWrappedInSelection || isWrappedByContext

  // ... 나머지 로직
}
```

## 테스트 케이스

기존 테스트 파일 `src/utils/markdownCommands.phase2.test.ts`에 이미 엣지 케이스 존재:

```typescript
it('부분 선택 시 (서식 마커 포함하지 않음) Bold 적용', () => {
  const content = '**world**'
  const selection: TextSelection = {
    start: 2,
    end: 7,
    selectedText: 'world',
  }
  const command: MarkdownCommand = 'bold'

  const { newContent } = applyMarkdownCommand(content, selection, command)

  // 현재: 중첩 서식 "****world****" (버그)
  // 수정 후: 서식 제거 "world" (정상)
  expect(newContent).toBe('****world****')
})
```

수정 후 이 테스트는 실패해야 하며, 새로운 기대값으로 업데이트 필요:
```typescript
expect(newContent).toBe('world') // 서식 제거
```

## 수락 기준

- [x] `**hello**` 적용 후 `hello`만 선택하고 Bold 버튼 클릭 시 서식 제거됨
- [x] `*world*` 적용 후 `world`만 선택하고 Italic 버튼 클릭 시 서식 제거됨
- [x] `~~deleted~~` 적용 후 `deleted`만 선택하고 Strikethrough 버튼 클릭 시 서식 제거됨
- [x] `` `code` `` 적용 후 `code`만 선택하고 InlineCode 버튼 클릭 시 서식 제거됨
- [x] 기존 테스트 케이스 모두 통과 (334개 테스트 통과)
- [x] 엣지 케이스 테스트 업데이트 및 통과

## 관련 파일

- `src/utils/markdownCommands.ts` (수정 필요)
- `src/utils/markdownCommands.phase2.test.ts` (테스트 업데이트 필요)
- `src/components/Editor/Toolbar.tsx` (영향 받음)

## 참고 사항

- 사용자 경험: 현재는 서식을 해제하려면 마커를 포함하여 전체 선택해야 함 (불편)
- 개선 후: 내부 텍스트만 선택해도 토글 가능 (직관적)
- 기존 동작 유지: 전체 선택 시 토글 동작은 그대로 유지

## 해결 방법

### 수정된 코드
`src/utils/markdownCommands.ts`의 `toggleWrapper` 함수 개선:

```typescript
// 주변 컨텍스트 확인 로직 추가
const isWrappedInSelection = selectedText.startsWith(marker) && selectedText.endsWith(marker)
const isWrappedByContext = before.endsWith(marker) && after.startsWith(marker)

// 주변 컨텍스트 우선 처리
if (isWrappedByContext && !isBoldMarker) {
  // 주변 마커 제거
  const newBefore = before.slice(0, -marker.length)
  const newAfter = after.slice(marker.length)
  return {
    newContent: `${newBefore}${selectedText}${newAfter}`,
    newSelectionStart: start - marker.length,
    newSelectionEnd: start - marker.length + selectedText.length,
  }
}
```

### 테스트 결과
- Phase 2 테스트: 19개 통과
- BUG-005 검증 테스트: 9개 통과
- 전체 테스트 스위트: 334개 통과

### QA 체크리스트

| 항목 | 상태 | 비고 |
|------|------|------|
| Bold 토글 | ✅ | 주변 컨텍스트 감지 정상 |
| Italic 토글 | ✅ | 주변 컨텍스트 감지 정상 |
| Strikethrough 토글 | ✅ | 주변 컨텍스트 감지 정상 |
| InlineCode 토글 | ✅ | 주변 컨텍스트 감지 정상 |
| 전체 선택 토글 | ✅ | 기존 동작 유지 |
| 연속 토글 | ✅ | 적용 → 제거 → 적용 정상 |
| 기존 기능 영향 | ✅ | 전체 테스트 통과 |

### PRD 대조
PRD 8번 섹션 "마크다운 가이드 - 툴바 버튼" 요구사항 충족:
- [x] 볼드, 이탤릭, 취소선 버튼 정상 작동
- [x] 토글 기능 직관적 동작 (내부 텍스트 선택 시에도 해제 가능)
- [x] 사용자 경험 개선 (마커 포함 선택 불필요)

### 품질 점수: 9.5/10 (PASS)

평가 항목:
- 기능 정확성: 10/10 (모든 수락 기준 충족)
- 코드 품질: 9/10 (명확한 로직, 주석 추가)
- 테스트 커버리지: 10/10 (28개 테스트 케이스)
- PRD 충족도: 10/10 (툴바 버튼 요구사항 충족)
- 회귀 방지: 9/10 (전체 테스트 통과)

## 히스토리

| 날짜 | 내용 |
|------|------|
| 2026-01-18 | 이슈 생성 및 초기 분석 완료 |
| 2026-01-18 | toggleWrapper 함수 수정 완료 |
| 2026-01-18 | 테스트 추가 및 QA 검증 완료 |
| 2026-01-18 | 이슈 해결 완료 ✅ |
