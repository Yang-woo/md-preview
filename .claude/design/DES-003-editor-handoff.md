# 디자인 핸드오프: 에디터 영역

> TODO: DES-003
> 작성일: 2026-01-15

## 감지된 스택
- 프레임워크: React 18 + TypeScript
- 스타일링: Tailwind CSS
- 에디터: CodeMirror 6

## 1. 컴포넌트 스펙

### EditorPane
**파일**: `src/components/Editor/Editor.tsx`

```tsx
<div className="flex flex-col h-full bg-background">
  <EditorToolbar />
  <div className="flex-1 overflow-auto">
    {content === '' ? <EmptyState /> : <CodeMirrorEditor />}
  </div>
</div>
```

### EditorToolbar
**파일**: `src/components/Editor/EditorToolbar.tsx`

```tsx
<div className="h-12 px-4 flex items-center gap-2 border-b border-border bg-background">
  {/* 서식 그룹 */}
  <div className="flex gap-1">
    <HeadingDropdown />
    <ToolbarButton icon={<Bold />} onClick={onBold} aria-label="볼드 (Ctrl+B)" />
    <ToolbarButton icon={<Italic />} onClick={onItalic} aria-label="이탤릭 (Ctrl+I)" />
  </div>

  <div className="w-px h-6 bg-border" /> {/* Divider */}

  {/* 삽입 그룹 */}
  <div className="flex gap-1">
    <ToolbarButton icon={<Link />} onClick={onLink} aria-label="링크" />
    <ToolbarButton icon={<Image />} onClick={onImage} aria-label="이미지" />
    <ToolbarButton icon={<Code />} onClick={onCode} aria-label="코드" />
  </div>

  {/* 상태 표시 */}
  <div className="ml-auto">
    <EditorStatus status={saveStatus} />
  </div>
</div>
```

### ToolbarButton
```tsx
<button
  className="
    w-9 h-9 rounded-md
    flex items-center justify-center
    text-text-secondary hover:text-text-primary
    hover:bg-bg-secondary
    transition-colors duration-150
    focus-visible:ring-2 ring-primary ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  "
  {...props}
>
  {icon}
</button>
```

## 2. CodeMirror 설정

```typescript
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';

const extensions = [
  lineNumbers(),
  highlightActiveLine(),
  markdown(),
  EditorView.lineWrapping,
  keymap.of(defaultKeymap),
  EditorView.theme({
    '&': {
      fontSize: '16px',
      fontFamily: 'var(--font-mono)',
    },
    '.cm-content': {
      padding: '16px',
    },
    '.cm-activeLine': {
      backgroundColor: 'var(--color-bg-secondary)',
    },
    '.cm-selectionBackground': {
      backgroundColor: 'rgba(var(--color-primary-rgb), 0.2)',
    },
  }),
];
```

## 3. 툴바 액션

```typescript
const handleBold = () => {
  const { from, to } = view.state.selection.main;
  const selectedText = view.state.doc.sliceString(from, to);

  const insert = selectedText ? `**${selectedText}**` : '**텍스트**';
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + 2 },
  });
  view.focus();
};

const handleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const { from } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);
  const lineStart = line.from;

  const prefix = '#'.repeat(level) + ' ';
  view.dispatch({
    changes: { from: lineStart, to: lineStart, insert: prefix },
  });
  view.focus();
};
```

## 4. 필요 라이브러리

```json
{
  "dependencies": {
    "@codemirror/state": "^6.0.0",
    "@codemirror/view": "^6.0.0",
    "@codemirror/lang-markdown": "^6.0.0",
    "@codemirror/commands": "^6.0.0",
    "lucide-react": "^0.300.0"
  }
}
```

## 5. 접근성 체크리스트

- [ ] 모든 툴바 버튼에 aria-label
- [ ] 키보드로 전체 기능 접근 가능
- [ ] 포커스 인디케이터 명확
- [ ] 저장 상태 스크린리더 읽기 가능
