# PRD 분석 결과 - 에디터 툴바 기능 개선

## 1. 제품 개요

- **제품명**: Markdown Preview - 에디터 툴바 기능 개선
- **버전**: v1.0 → v1.1 (점진적 개선)
- **목표**: 툴바 버튼이 커서 위치 및 선택 영역 기준으로 동작하도록 개선하여 사용자 경험 향상
- **타겟 사용자**:
  - 마크다운 초보자 (직관적인 서식 적용)
  - 개발자 (빠른 코드 블록/링크 삽입)
  - PM/기획자 (텍스트 선택 후 헤딩 적용)
  - 블로거 (볼드/이탤릭 빠른 적용)
- **차별점**: 일반 텍스트 에디터(Notion, Google Docs)와 동일한 직관적 동작 제공
- **핵심 가치**: "예상대로 동작하는" 툴바 → 사용자 학습 비용 제로

---

## 2. 핵심 기능 (우선순위순)

### P0 (Must Have) - MVP 범위

| ID | 기능 | 설명 | 복잡도 | 예상 공수 |
|----|------|------|--------|-----------|
| **FR-001** | 커서 위치 감지 | CodeMirror EditorView에서 현재 커서 offset 추출 | 하 | 2h |
| **FR-002** | 선택 영역 감지 | CodeMirror에서 선택 영역 (start, end, text) 추출 | 하 | 2h |
| **FR-006** | EditorView 참조 전달 | Editor 컴포넌트에서 EditorView 인스턴스 노출 (useImperativeHandle) | 중 | 2h |
| **FR-003** | 커서 위치 삽입 | 툴바 버튼 클릭 시 현재 커서 위치에 서식 삽입 (13종 버튼) | 중 | 3h |
| **FR-004** | 선택 영역 서식 적용 | 드래그한 텍스트에 서식 래핑 (Bold, Italic, Code, Link 등) | 중 | 3h |
| **FR-005** | 커서 위치 복원 | 서식 적용 후 커서를 적절한 위치로 이동 (EditorView.dispatch) | 중 | 2h |

**P0 총 공수**: 14시간 (약 2일)

### P1 (Should Have) - 사용성 개선

| ID | 기능 | 설명 | 복잡도 | 예상 공수 |
|----|------|------|--------|-----------|
| **FR-007** | 멀티라인 리스트 변환 | 여러 줄 선택 시 각 줄에 리스트 형식 적용 | 중 | 3h |
| **FR-008** | 기존 서식 토글 | 이미 서식 적용된 텍스트 재클릭 시 서식 제거 | 중 | 3h |
| **FR-009** | 단축키 연동 | 키보드 단축키도 커서/선택 영역 기준 동작 | 하 | 2h |

**P1 총 공수**: 8시간 (약 1일)

### P2 (Nice to Have) - 미래 확장

| ID | 기능 | 설명 | 복잡도 |
|----|------|------|--------|
| **FR-010** | 스마트 선택 확장 | 단어 일부 선택 시 자동으로 단어 전체 확장 | 중 |
| **FR-011** | 서식 미리보기 | 툴바 버튼 호버 시 적용 예시 툴팁 표시 | 하 |

---

## 3. 기술 요구사항

### 기존 기술 스택 (유지)
- **프레임워크**: React 18 + TypeScript
- **빌드**: Vite 5
- **에디터**: CodeMirror 6
- **상태 관리**: Zustand
- **스타일링**: Tailwind CSS
- **테스트**: Vitest + React Testing Library

### 추가 필요 라이브러리
- 없음 (기존 스택만으로 구현 가능)

### 필수 CodeMirror 6 API
| API | 용도 | 문서 링크 |
|-----|------|-----------|
| `EditorView.state.selection.main` | 커서 위치 및 선택 영역 추출 | [Selection](https://codemirror.net/docs/ref/#state.EditorSelection) |
| `EditorView.state.doc.toString()` | 현재 문서 내용 추출 | [Text](https://codemirror.net/docs/ref/#state.Text) |
| `EditorView.state.sliceDoc(from, to)` | 특정 범위 텍스트 추출 | [State](https://codemirror.net/docs/ref/#state.EditorState) |
| `EditorView.dispatch({ changes, selection })` | 문서 내용 변경 및 커서 이동 | [Dispatch](https://codemirror.net/docs/ref/#view.EditorView.dispatch) |

### 비기능 요구사항
| 항목 | 기준 |
|------|------|
| **성능** | 버튼 클릭 후 50ms 이내 서식 적용 |
| **응답성** | 60fps 유지 (16.67ms/frame) |
| **대용량 지원** | 1MB 파일에서도 지연 없음 |
| **테스트 커버리지** | 90% 이상 |
| **브라우저 호환** | Chrome, Firefox, Safari, Edge 최신 2개 버전 |
| **접근성** | WCAG 2.1 AA 준수 (키보드 내비게이션, 스크린리더 지원) |

---

## 4. 컴포넌트 구조 제안

### 변경 파일 (4개)

```
src/
├── components/
│   └── Editor/
│       ├── Editor.tsx                   # [수정] EditorView 참조 노출
│       ├── EditorWithToolbar.tsx         # [수정] handleCommand 로직 개선
│       └── Toolbar.tsx                   # [유지] 변경 없음
├── hooks/
│   ├── useKeyboardShortcuts.ts          # [수정] 단축키도 커서 위치 기준
│   └── useEditorCommands.ts             # [신규] 커맨드 로직 분리 (선택)
└── utils/
    └── markdownCommands.ts              # [유지 또는 확장] 멀티라인 리스트 로직 추가
```

### Editor.tsx 변경 사항

**Before:**
```typescript
export function Editor({ ... }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  // EditorView는 private
  return <div ref={editorRef} />
}
```

**After:**
```typescript
export interface EditorRef {
  getSelection: () => TextSelection
  setSelection: (from: number, to: number) => void
  focus: () => void
}

export const Editor = forwardRef<EditorRef, EditorProps>(
  ({ ... }, ref) => {
    const viewRef = useRef<EditorView | null>(null)

    useImperativeHandle(ref, () => ({
      getSelection: () => {
        const view = viewRef.current
        if (!view) return { start: 0, end: 0, selectedText: '' }

        const { from, to } = view.state.selection.main
        const selectedText = view.state.sliceDoc(from, to)
        return { start: from, end: to, selectedText }
      },
      setSelection: (from: number, to: number) => {
        const view = viewRef.current
        if (!view) return

        view.dispatch({
          selection: { anchor: from, head: to },
        })
        view.focus()
      },
      focus: () => viewRef.current?.focus(),
    }))

    // ... 기존 로직
  }
)
```

### EditorWithToolbar.tsx 변경 사항

**Before:**
```typescript
const handleCommand = useCallback((command: MarkdownCommand) => {
  const selection = {
    start: content.length,  // ❌ 항상 문서 끝
    end: content.length,
    selectedText: '',
  }

  const { newContent } = applyMarkdownCommand(content, selection, command)
  setContent(newContent)
}, [content, setContent])
```

**After:**
```typescript
const editorRef = useRef<EditorRef>(null)

const handleCommand = useCallback((command: MarkdownCommand) => {
  // ✅ 실제 커서 위치 및 선택 영역 가져오기
  const selection = editorRef.current?.getSelection() ?? {
    start: content.length,
    end: content.length,
    selectedText: '',
  }

  const { newContent, newSelectionStart, newSelectionEnd } =
    applyMarkdownCommand(content, selection, command)

  setContent(newContent)

  // ✅ 커서 위치 복원
  setTimeout(() => {
    editorRef.current?.setSelection(newSelectionStart, newSelectionEnd)
  }, 0)
}, [content, setContent])

return (
  <div className="flex flex-col h-full">
    <Toolbar onCommand={handleCommand} />
    <Editor ref={editorRef} {...editorProps} />
  </div>
)
```

### markdownCommands.ts 확장 (P1)

**멀티라인 리스트 처리 추가:**
```typescript
function insertList(
  before: string,
  after: string,
  selectedText: string,
  numbered: boolean
): string {
  // 선택된 텍스트가 여러 줄인 경우
  if (selectedText.includes('\n')) {
    const lines = selectedText.split('\n')
    const formattedLines = lines.map((line, index) => {
      if (line.trim() === '') return line  // 빈 줄은 건너뛰기
      const prefix = numbered ? `${index + 1}. ` : '- '
      return prefix + line
    })
    return before + formattedLines.join('\n') + after
  }

  // 기존 로직 (단일 줄)
  const listText = selectedText || 'List item'
  const prefix = numbered ? '1. ' : '- '
  // ...
}
```

---

## 5. MVP 범위

### MVP 포함 (Phase 1-2, P0)

✅ **핵심 기능**
- FR-001: 커서 위치 감지
- FR-002: 선택 영역 감지
- FR-003: 커서 위치 삽입 (13종 툴바 버튼)
- FR-004: 선택 영역 서식 적용
- FR-005: 커서 위치 복원
- FR-006: EditorView 참조 전달

✅ **품질 보증**
- 단위 테스트 (90% 커버리지)
- 통합 테스트 (주요 시나리오)
- 성능 테스트 (50ms 이내 응답)
- 브라우저 호환성 테스트

### MVP 제외 (Phase 3 이후)

⏳ **P1 기능 (v1.2)**
- FR-007: 멀티라인 리스트 변환
- FR-008: 기존 서식 토글
- FR-009: 단축키 연동

🔮 **P2 기능 (v1.3 이후)**
- FR-010: 스마트 선택 확장
- FR-011: 서식 미리보기

---

## 6. 개발 리스크 & 주의사항

### 높은 리스크 ⚠️

#### 1. CodeMirror ↔ React 상태 동기화
**문제:**
- CodeMirror는 자체 상태 관리 (EditorState)
- Zustand는 별도 상태 관리 (content)
- 양방향 동기화 시 무한 루프 위험

**해결:**
- updateListener에서 Zustand 업데이트
- Zustand 변경 시 useEffect로 CodeMirror 업데이트
- 이미 구현되어 있으므로 기존 로직 유지

#### 2. setTimeout을 사용한 커서 복원 타이밍 이슈
**문제:**
- setContent → Zustand 업데이트 → React 리렌더 → CodeMirror 업데이트 (비동기)
- 커서 복원 시점이 CodeMirror 업데이트보다 빠르면 실패

**해결 1 (권장):**
```typescript
// setContent 후 즉시 CodeMirror dispatch 사용
const { newContent, newSelectionStart, newSelectionEnd } =
  applyMarkdownCommand(content, selection, command)

// Zustand 업데이트
setContent(newContent)

// CodeMirror 직접 업데이트 (동기적)
const view = viewRef.current
if (view) {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: newContent },
    selection: { anchor: newSelectionStart, head: newSelectionEnd },
  })
}
```

**해결 2 (폴백):**
```typescript
// 현재 PRD 제안대로 setTimeout 사용
setTimeout(() => {
  editorRef.current?.setSelection(newSelectionStart, newSelectionEnd)
}, 0)
```

**권장**: 해결 1 (동기적 방식)이 더 안정적

### 중간 리스크 ⚠️

#### 3. useImperativeHandle 사용 시 타입 안전성
**문제:**
- ref 타입이 null일 수 있음
- optional chaining 필수 (`editorRef.current?.getSelection()`)

**해결:**
- TypeScript 타입 가드 사용
- 폴백 값 항상 제공

#### 4. 대용량 문서에서 성능 저하
**문제:**
- 1MB 이상 문서에서 dispatch 시 렌더링 지연 가능

**해결:**
- 성능 테스트로 검증
- 필요 시 debounce 적용
- 현재 PRD 요구사항: 1MB 파일도 지연 없음 (충분히 달성 가능)

### 낮은 리스크 ✅

#### 5. 브라우저 호환성
**문제:**
- CodeMirror 6는 모던 브라우저만 지원
- Selection API는 모든 브라우저 지원

**해결:**
- 이미 CodeMirror 6 사용 중이므로 문제없음
- Chrome, Firefox, Safari, Edge 최신 2개 버전 완전 지원

---

## 7. 개발 단계별 계획

### Phase 1: 커서 위치 삽입 (P0) - 2일

**작업 순서:**
1. Editor.tsx에 useImperativeHandle 추가 (FR-006)
2. EditorWithToolbar.tsx에 editorRef 연결
3. handleCommand에서 getSelection() 호출 (FR-001, FR-002)
4. 커서 위치 기준 삽입 로직 구현 (FR-003)
5. 단위 테스트 작성 (getSelection, setSelection)
6. 통합 테스트 작성 (13종 툴바 버튼)

**완료 기준:**
- [ ] 모든 툴바 버튼이 커서 위치에 삽입
- [ ] 테스트 커버리지 90% 이상
- [ ] 성능: 응답 50ms 이내

### Phase 2: 선택 영역 서식 적용 (P0) - 1일

**작업 순서:**
1. handleCommand에서 선택 영역 처리 로직 추가 (FR-004)
2. setSelection으로 커서 복원 (FR-005)
3. 단위 테스트 작성 (선택 영역 시나리오)
4. 통합 테스트 작성 (Bold, Italic, Code, Link 등)

**완료 기준:**
- [ ] 선택된 텍스트에 서식 적용
- [ ] 서식 적용 후 커서 올바른 위치
- [ ] 테스트 커버리지 90% 이상

### Phase 3: 고급 기능 (P1) - 1일

**작업 순서:**
1. markdownCommands.ts에 멀티라인 로직 추가 (FR-007)
2. 서식 토글 기능 구현 (FR-008)
3. useKeyboardShortcuts.ts 업데이트 (FR-009)
4. 테스트 작성

**완료 기준:**
- [ ] 여러 줄 리스트 변환
- [ ] 서식 토글 작동
- [ ] 단축키와 툴바 동작 일치

### Phase 4: QA 및 최적화 - 1일

**작업 순서:**
1. 성능 테스트 (대용량 문서)
2. 브라우저 호환성 테스트
3. 접근성 테스트 (WCAG 2.1 AA)
4. 모바일 테스트
5. 버그 수정

**완료 기준:**
- [ ] 모든 지원 브라우저 정상 작동
- [ ] WCAG 2.1 AA 준수
- [ ] 치명적 버그 0개

**총 예상 공수**: 5일 (실제 개발 3일 + QA 1일 + 버퍼 1일)

---

## 8. 테스트 전략

### 단위 테스트 (Vitest)

**대상 함수:**
- `getSelection()` - 커서 위치 및 선택 영역 추출
- `setSelection(from, to)` - 커서 위치 복원
- `applyMarkdownCommand()` - 서식 적용 로직

**테스트 케이스:**
```typescript
describe('Editor Commands', () => {
  it('should insert at cursor position', () => {
    // 커서 위치에 Bold 삽입
  })

  it('should apply format to selected text', () => {
    // "hello" 선택 후 Bold → "**hello**"
  })

  it('should restore cursor position after insert', () => {
    // 삽입 후 커서가 올바른 위치
  })

  it('should handle multiline list conversion', () => {
    // 3줄 선택 후 Bullet List → 각 줄에 "-" 추가
  })
})
```

### 통합 테스트 (React Testing Library)

**시나리오:**
```typescript
describe('Toolbar Integration', () => {
  it('should insert bold at cursor position on button click', async () => {
    render(<EditorWithToolbar />)

    // 1. 텍스트 입력
    const editor = screen.getByRole('textbox')
    await userEvent.type(editor, 'Hello world')

    // 2. 커서를 "Hello" 뒤로 이동
    editor.setSelectionRange(5, 5)

    // 3. Bold 버튼 클릭
    const boldButton = screen.getByLabelText('Bold')
    await userEvent.click(boldButton)

    // 4. 결과 확인
    expect(editor).toHaveValue('Hello**bold text** world')
  })

  it('should apply bold to selected text', async () => {
    // "hello" 선택 → Bold 클릭 → "**hello**"
  })
})
```

### 성능 테스트

**측정 항목:**
```typescript
it('should apply format within 50ms', () => {
  const start = performance.now()

  // 서식 적용
  handleCommand('bold')

  const duration = performance.now() - start
  expect(duration).toBeLessThan(50)
})
```

### E2E 테스트 (선택 사항)

**Playwright로 사용자 플로우 검증:**
- 텍스트 입력 → 선택 → 툴바 버튼 클릭 → 결과 확인
- 단축키 (Ctrl+B, Ctrl+I) 동작 확인
- 모바일 터치 이벤트 테스트

---

## 9. 미결 사항 & 결정 필요

### 1. EditorView 노출 방식 ✅ 결정됨
- **선택**: useImperativeHandle
- **이유**: 캡슐화 유지 + 타입 안전

### 2. 커서 복원 방식 ⚠️ 결정 필요
- **옵션 A**: setTimeout (PRD 제안)
- **옵션 B**: 동기적 dispatch (권장)
- **권장**: 옵션 B (더 안정적)

### 3. 멀티라인 헤딩 처리 ⚠️ 결정 필요
- **옵션 1**: 첫 줄만 헤딩 (권장)
- **옵션 2**: 각 줄에 헤딩
- **옵션 3**: 오류 메시지
- **권장**: 옵션 1 (일반적인 마크다운 에디터 동작)

### 4. 서식 적용 애니메이션 ⚠️ 결정 필요
- **옵션 A**: 변환된 텍스트 0.5초간 하이라이트 (PRD 제안)
- **옵션 B**: 애니메이션 없음 (심플)
- **권장**: 옵션 B 기본값, 설정에서 ON/OFF 가능 (P2)

---

## 10. 성공 지표 확인

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| **기능 정확도** | 100% | 테스트 커버리지 90% 이상 + 수동 QA |
| **응답 속도** | 50ms 이내 | Performance.now() 측정 |
| **커서 복원 성공률** | 100% | 통합 테스트로 검증 |
| **테스트 커버리지** | 90% 이상 | Vitest coverage report |
| **브라우저 호환** | 4개 브라우저 정상 | 수동 테스트 |
| **접근성** | WCAG 2.1 AA | axe DevTools 검증 |

---

## 11. 참고 자료

### 코드베이스 분석
- **현재 구현**: `src/components/Editor/EditorWithToolbar.tsx` (라인 15-34)
- **서식 로직**: `src/utils/markdownCommands.ts` (이미 잘 구현됨)
- **에디터 상태**: `src/stores/editorStore.ts`

### CodeMirror 6 문서
- [Selection API](https://codemirror.net/docs/ref/#state.EditorSelection)
- [State Management](https://codemirror.net/docs/guide/#state-and-updates)
- [Dispatch](https://codemirror.net/docs/ref/#view.EditorView.dispatch)

### 경쟁 제품 벤치마크
- Notion: 선택 영역 기준, 서식 토글 지원
- Typora: WYSIWYG, 실시간 변환
- GitHub Editor: 마크다운 학습 용이

---

_분석 완료: 2026-01-16_
_분석자: prd-analyzer_
_상태: 개발 준비 완료_
