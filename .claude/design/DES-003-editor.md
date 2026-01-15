# UI 설계: 에디터 영역

> TODO: DES-003
> 작성일: 2026-01-15
> 담당: ui-designer

## 1. 와이어프레임

### EditorPane 구조
```
┌─────────────────────────────────────────┐
│  EditorToolbar (h: 48px)                │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┐  │
│  │  H  │  B  │  I  │ Code│ Link│ ... │  │
│  └─────┴─────┴─────┴─────┴─────┴─────┘  │
├─────────────────────────────────────────┤
│                                         │
│  Editor (CodeMirror)                    │
│  ┌───────────────────────────────────┐  │
│  │ 1  # Markdown Preview             │  │
│  │ 2                                 │  │
│  │ 3  실시간으로 마크다운 문서를 작성 │  │
│  │ 4  하고 프리뷰할 수 있습니다.      │  │
│  │ 5                                 │  │
│  │ 6  ## 주요 기능                   │  │
│  │ 7                                 │  │
│  │ 8  - 실시간 프리뷰                │  │
│  │ 9  - GFM 지원                    │  │
│  │10  - 코드 하이라이팅              │  │
│  │11                                 │  │
│  │12  ```javascript                 │  │
│  │13  const hello = "world";        │  │
│  │14  ```                           │  │
│  │15                                 │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ← Line Number  Current Line Highlight │
│                                         │
└─────────────────────────────────────────┘
```

### 빈 상태 (Empty State)
```
┌─────────────────────────────────────────┐
│  EditorToolbar                          │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│         📝                              │
│                                         │
│    마크다운 문서를 작성해보세요           │
│                                         │
│    • 여기에 입력하거나                   │
│    • 파일을 드래그 앤 드롭하거나          │
│    • Ctrl+O로 파일 열기                 │
│                                         │
│    [시작 가이드 보기]                    │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### 에디터 상태 표시
```
┌─────────────────────────────────────────┐
│  EditorToolbar              ● 저장됨    │  ← 상태 표시
│                             ● 저장 중... │
│                             ● 수정됨    │
└─────────────────────────────────────────┘
```

## 2. 컴포넌트 계층

```
EditorPane
├── EditorToolbar
│   ├── ToolbarGroup (서식)
│   │   ├── HeadingDropdown (H1-H6)
│   │   ├── BoldButton
│   │   ├── ItalicButton
│   │   └── StrikethroughButton
│   ├── ToolbarGroup (삽입)
│   │   ├── LinkButton
│   │   ├── ImageButton
│   │   ├── CodeButton
│   │   ├── CodeBlockButton
│   │   └── TableButton
│   ├── ToolbarGroup (리스트)
│   │   ├── OrderedListButton
│   │   ├── UnorderedListButton
│   │   └── TaskListButton
│   ├── ToolbarGroup (고급)
│   │   ├── QuoteButton
│   │   ├── HorizontalRuleButton
│   │   ├── MathButton (v1.1)
│   │   └── DiagramButton (v1.1)
│   └── EditorStatus
│       └── StatusIndicator
├── Editor (CodeMirror Wrapper)
│   ├── CodeMirror Instance
│   │   ├── Line Numbers
│   │   ├── Current Line Highlight
│   │   ├── Syntax Highlighting
│   │   └── Selection Highlight
│   └── EmptyState (content === '')
└── EditorFooter (선택사항)
    ├── LineCount
    ├── WordCount
    └── CursorPosition
```

## 3. 컴포넌트 상세

| 컴포넌트 | 책임 | Props | State |
|----------|------|-------|-------|
| **EditorPane** | 에디터 영역 컨테이너 | - | - |
| **EditorToolbar** | 서식 툴바 | onInsert, disabled | - |
| ToolbarGroup | 버튼 그룹 컨테이너 | label | - |
| HeadingDropdown | 헤딩 선택 드롭다운 | onSelect, disabled | isOpen |
| BoldButton | 볼드 삽입 | onClick, disabled | - |
| ItalicButton | 이탤릭 삽입 | onClick, disabled | - |
| LinkButton | 링크 삽입 | onClick, disabled | - |
| ImageButton | 이미지 삽입 | onClick, disabled | - |
| CodeButton | 인라인 코드 삽입 | onClick, disabled | - |
| CodeBlockButton | 코드 블록 삽입 | onClick, disabled | - |
| TableButton | 테이블 삽입 | onClick, disabled | - |
| EditorStatus | 저장 상태 표시 | status | - |
| **Editor** | CodeMirror 래퍼 | value, onChange, onCursorActivity | editorView |
| EmptyState | 빈 에디터 플레이스홀더 | onShowGuide | - |
| **EditorFooter** | 통계 표시 (선택) | lineCount, wordCount, cursorPos | - |

## 4. 상호작용

### 4.1 툴바 버튼 동작

**기본 동작:**
1. 버튼 클릭
2. 선택된 텍스트가 있으면 감싸기, 없으면 삽입
3. 커서를 적절한 위치로 이동

**예시: BoldButton**
```typescript
// 선택 있음: "text" → "**text**"
// 선택 없음: "" → "**텍스트**" (커서를 ** 사이에 위치)

const handleBold = () => {
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.sliceString(from, to);

  if (selectedText) {
    editor.dispatch({
      changes: {
        from,
        to,
        insert: `**${selectedText}**`
      }
    });
  } else {
    editor.dispatch({
      changes: {
        from,
        insert: '**텍스트**'
      },
      selection: { anchor: from + 2 } // ** 뒤로 커서 이동
    });
  }
};
```

### 4.2 HeadingDropdown

**동작:**
1. 드롭다운 클릭 시 열기
2. H1-H6 중 선택
3. 현재 줄의 시작에 `#` 추가 또는 변경

**레벨별 삽입:**
- H1: `# `
- H2: `## `
- H3: `### `
- ...

### 4.3 LinkButton

**동작:**
1. 버튼 클릭
2. 선택 텍스트 있으면: `[선택 텍스트](url)` 삽입, 커서를 url 위치로
3. 선택 텍스트 없으면: `[링크 텍스트](url)` 삽입, 커서를 텍스트 위치로

### 4.4 ImageButton

**동작:**
1. 버튼 클릭
2. 파일 선택 다이얼로그 열기
3. 이미지 선택 시:
   - 로컬: base64로 인코딩하여 삽입 `![alt](data:image/png;base64,...)`
   - 또는: `![alt](url)` 형태로 삽입 후 사용자가 URL 입력

### 4.5 CodeBlockButton

**동작:**
1. 버튼 클릭
2. 언어 선택 드롭다운 표시 (javascript, python, typescript, ...)
3. 언어 선택 시:
```markdown
```language
코드 입력
```
```

### 4.6 TableButton

**동작:**
1. 버튼 클릭
2. 행/열 선택 UI 표시 (예: 3x3 그리드)
3. 선택 시 기본 테이블 삽입:
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### 4.7 EmptyState → 입력 시작

**동작:**
1. 빈 에디터 상태에서 EmptyState 표시
2. 키 입력 시 EmptyState 사라지고 에디터 포커스
3. "시작 가이드 보기" 클릭 시 샘플 마크다운 삽입

### 4.8 저장 상태 표시

**상태:**
- `저장됨` (초록색 ●): localStorage에 저장 완료
- `저장 중...` (주황색 ●): 저장 진행 중
- `수정됨` (빨간색 ●): 변경사항이 있지만 아직 저장 안 됨

**동작:**
- 입력 시 → `수정됨`
- 3초 후 또는 500자 입력 시 → `저장 중...`
- 저장 완료 → `저장됨`

## 5. 에디터 설정 (CodeMirror)

### 5.1 기본 설정

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

const editorState = EditorState.create({
  doc: content,
  extensions: [
    lineNumbers(),              // 라인 넘버
    highlightActiveLine(),      // 현재 줄 하이라이트
    markdown(),                 // 마크다운 언어 지원
    EditorView.lineWrapping,    // 줄 바꿈
    theme === 'dark' ? oneDark : [], // 다크 모드 테마
  ],
});

const editorView = new EditorView({
  state: editorState,
  parent: containerRef.current,
});
```

### 5.2 스타일 커스터마이징

**라인 넘버:**
- 너비: 40px
- 색상: `text-tertiary`
- 배경: 없음

**현재 줄 하이라이트:**
- 배경색: `rgba(0, 0, 0, 0.02)` (라이트 모드)
- 배경색: `rgba(255, 255, 255, 0.05)` (다크 모드)

**선택 영역:**
- 배경색: `primary` with 20% opacity

**포커스 링:**
- 에디터 전체에 포커스 시: `ring-2 ring-primary`

### 5.3 키보드 단축키

| 키 | 동작 |
|----|------|
| `Ctrl/Cmd + B` | 볼드 |
| `Ctrl/Cmd + I` | 이탤릭 |
| `Ctrl/Cmd + K` | 링크 삽입 |
| `Ctrl/Cmd + Shift + K` | 코드 블록 삽입 |
| `Ctrl/Cmd + /` | 주석 (인용문) |
| `Tab` | 들여쓰기 |
| `Shift + Tab` | 내어쓰기 |

## 6. 반응형

| 화면 크기 | 툴바 레이아웃 | 버튼 크기 | 에디터 폰트 |
|-----------|---------------|-----------|-------------|
| **Desktop** (≥1024px) | 전체 버튼 표시 | 40x40px | 16px |
| **Tablet** (768-1023px) | 핵심 버튼만 표시 | 36x36px | 16px |
| **Mobile** (<768px) | 아이콘만 표시 (레이블 숨김) | 44x44px | 14px |

### 반응형 툴바

**Desktop:**
- 모든 버튼 그룹 표시
- 버튼 레이블 포함

**Tablet:**
- 핵심 버튼만 표시 (H, B, I, Link, Code, List)
- 나머지는 "More" 드롭다운에

**Mobile:**
- 아이콘만 표시 (레이블 숨김)
- 터치 친화적 크기 (44x44px)

## 7. 접근성

### 키보드 네비게이션

| 키 | 동작 |
|----|------|
| `Tab` | 툴바 버튼 → 에디터 |
| `Shift + Tab` | 역방향 |
| `Enter` | 버튼 활성화 |
| `Esc` | 드롭다운 닫기 |

### 스크린리더

| 요소 | aria-label |
|------|------------|
| EditorPane | "마크다운 에디터" |
| EditorToolbar | "서식 툴바" |
| BoldButton | "볼드 (Ctrl+B)" |
| ItalicButton | "이탤릭 (Ctrl+I)" |
| LinkButton | "링크 삽입 (Ctrl+K)" |
| HeadingDropdown | "헤딩 레벨 선택" |
| EditorStatus | "저장 상태: 저장됨" |

### 포커스 인디케이터

- 툴바 버튼: `focus-visible:ring-2 ring-primary ring-offset-2`
- 에디터: `focus-within:ring-2 ring-primary`

## 8. 에디터 상태 관리

### Zustand Store

```typescript
interface EditorStore {
  content: string;
  fileName: string;
  isDirty: boolean;
  saveStatus: 'saved' | 'saving' | 'modified';
  cursorPosition: { line: number; col: number };

  setContent: (content: string) => void;
  setFileName: (fileName: string) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'modified') => void;
  setCursorPosition: (pos: { line: number; col: number }) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  content: '',
  fileName: 'untitled.md',
  isDirty: false,
  saveStatus: 'saved',
  cursorPosition: { line: 1, col: 1 },

  setContent: (content) => set({ content, isDirty: true, saveStatus: 'modified' }),
  setFileName: (fileName) => set({ fileName }),
  setSaveStatus: (saveStatus) => set({ saveStatus, isDirty: saveStatus !== 'saved' }),
  setCursorPosition: (cursorPosition) => set({ cursorPosition }),
}));
```

### 자동 저장

```typescript
// useAutoSave Hook
useEffect(() => {
  if (!isDirty) return;

  const timer = setTimeout(() => {
    setSaveStatus('saving');
    localStorage.setItem('md-preview-content', content);
    localStorage.setItem('md-preview-fileName', fileName);
    setTimeout(() => setSaveStatus('saved'), 500);
  }, 3000); // 3초 대기

  return () => clearTimeout(timer);
}, [content, fileName, isDirty]);
```

## 9. 에러 상태

### CodeMirror 로드 실패

**증상:** 에디터가 표시되지 않음

**처리:**
- Fallback: `<textarea>` 사용
- 에러 메시지: "에디터를 불러올 수 없습니다. 페이지를 새로고침해주세요."

### 자동 저장 실패

**증상:** localStorage 용량 초과 또는 비활성화

**처리:**
- 경고 메시지: "자동 저장이 불가능합니다. 주기적으로 다운로드해주세요."
- 다운로드 버튼 강조

### 이미지 삽입 실패

**증상:** 파일 크기 너무 큼 (>5MB)

**처리:**
- 에러 메시지: "이미지 크기가 너무 큽니다 (최대 5MB)"
- base64 대신 URL 입력 권장

## 10. 구현 우선순위

### P0 (필수)
- [x] Editor (CodeMirror) 기본 통합
- [x] EditorToolbar 기본 버튼 (H, B, I, Code, Link)
- [x] 라인 넘버, 현재 줄 하이라이트
- [x] 저장 상태 표시
- [x] 자동 저장 (localStorage)

### P1 (중요)
- [ ] 전체 툴바 버튼 세트
- [ ] HeadingDropdown, CodeBlockButton
- [ ] EmptyState 플레이스홀더
- [ ] 키보드 단축키
- [ ] EditorFooter (라인/단어 수)

### P2 (선택)
- [ ] 이미지 삽입 (base64)
- [ ] TableButton (행/열 선택 UI)
- [ ] MathButton, DiagramButton (v1.1)
- [ ] 커서 위치 추적
- [ ] 실행 취소/다시 실행 히스토리
