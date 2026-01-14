# PRD 개발 분석 보고서

## 개요

이 문서는 PRD.md와 ANALYSIS.md를 기반으로, 실제 개발에 필요한 구체적인 정보를 제공합니다.

---

## 1. 컴포넌트 구조

### 1.1 컴포넌트 트리

```
App
├── Layout
│   ├── Header
│   │   ├── FileNameDisplay
│   │   ├── ThemeToggle
│   │   ├── SettingsButton
│   │   └── FullscreenButton
│   ├── MainContent
│   │   ├── Sidebar (TOC)
│   │   │   ├── TOCToggle
│   │   │   └── TOCList
│   │   └── SplitPane
│   │       ├── EditorPane
│   │       │   ├── Toolbar
│   │       │   └── Editor (CodeMirror)
│   │       └── PreviewPane
│   │           └── Preview (react-markdown)
│   └── Modals
│       ├── SettingsModal
│       ├── CheatSheetModal
│       └── FileUploadModal
└── Providers
    ├── ThemeProvider
    ├── I18nProvider
    └── StoreProvider
```

### 1.2 컴포넌트별 책임

| 컴포넌트 | 책임 | 상태 | Props |
|---------|------|------|-------|
| App | 전역 상태, 라우팅 | - | - |
| Layout | 레이아웃 구조 | - | children |
| Header | 상단 네비게이션 | - | - |
| FileNameDisplay | 파일명, 저장 상태 표시 | fileName, isDirty | - |
| ThemeToggle | 테마 전환 | theme | onToggle |
| SettingsButton | 설정 패널 열기 | - | onClick |
| Sidebar | TOC 사이드바 | isOpen, headings | onToggle |
| SplitPane | 좌우 분할, 드래그 조절 | splitRatio | onResize |
| Toolbar | 서식 버튼 | - | onInsert |
| Editor | 마크다운 편집기 | content | onChange |
| Preview | 마크다운 렌더링 | content, style | - |
| SettingsModal | 설정 UI | settings | onSave |

---

## 2. 데이터 플로우

### 2.1 상태 관리 (Zustand)

```typescript
// stores/editorStore.ts
interface EditorState {
  content: string;
  fileName: string | null;
  isDirty: boolean;

  setContent: (content: string) => void;
  setFileName: (name: string) => void;
  markDirty: () => void;
  markClean: () => void;
}

// stores/settingsStore.ts
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  previewStyle: 'github' | 'notion' | 'vscode' | 'minimal';
  editorFont: string;
  fontSize: number;
  lineHeight: number;
  splitRatio: number;

  setTheme: (theme: string) => void;
  setPreviewStyle: (style: string) => void;
  setFontSize: (size: number) => void;
  // ...
}

// stores/uiStore.ts
interface UIState {
  isTOCOpen: boolean;
  isSettingsOpen: boolean;
  isCheatSheetOpen: boolean;

  toggleTOC: () => void;
  toggleSettings: () => void;
  // ...
}
```

### 2.2 데이터 흐름도

```
사용자 입력 (Editor)
    ↓
editorStore.setContent()
    ↓
debounce (300ms)
    ↓
Preview 리렌더링
    ↓
react-markdown 파싱
    ↓
스타일 적용 (settingsStore.previewStyle)
    ↓
화면 출력
```

### 2.3 파일 처리 플로우

```
파일 선택/드롭
    ↓
File API 읽기
    ↓
텍스트 추출
    ↓
editorStore.setContent()
    ↓
editorStore.setFileName()
    ↓
Editor + Preview 업데이트
```

---

## 3. 주요 기능 구현 상세

### 3.1 파일 처리

```typescript
// utils/file.ts

// 파일 읽기
export async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// 파일 다운로드
export function downloadFile(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

// 드래그 앤 드롭
export function setupDropZone(element: HTMLElement, onDrop: (file: File) => void) {
  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    element.classList.add('drag-over');
  });

  element.addEventListener('dragleave', () => {
    element.classList.remove('drag-over');
  });

  element.addEventListener('drop', async (e) => {
    e.preventDefault();
    element.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file && file.name.endsWith('.md')) {
      onDrop(file);
    }
  });
}
```

### 3.2 마크다운 렌더링

```typescript
// components/Preview/Preview.tsx

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

export function Preview({ content, style }: PreviewProps) {
  return (
    <div className={`preview preview-${style}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          code: CodeBlock,
          img: ImageBlock,
          // ...
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// 커스텀 코드 블록
function CodeBlock({ className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // Mermaid 다이어그램 처리
  if (language === 'mermaid') {
    return <MermaidDiagram code={String(children)} />;
  }

  return (
    <SyntaxHighlighter language={language} {...props}>
      {String(children)}
    </SyntaxHighlighter>
  );
}
```

### 3.3 TOC 생성

```typescript
// hooks/useTOC.ts

interface Heading {
  level: number;
  text: string;
  id: string;
}

export function useTOC(content: string): Heading[] {
  return useMemo(() => {
    const headings: Heading[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = `heading-${index}`;
        headings.push({ level, text, id });
      }
    });

    return headings;
  }, [content]);
}
```

### 3.4 단축키 처리

```typescript
// hooks/useKeyboard.ts

export function useKeyboard() {
  const { insertText } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key === 'b') {
        e.preventDefault();
        insertText('**', '**'); // 볼드
      }

      if (isMod && e.key === 'i') {
        e.preventDefault();
        insertText('*', '*'); // 이탤릭
      }

      if (isMod && e.key === 'k') {
        e.preventDefault();
        insertText('[', '](url)'); // 링크
      }

      // ... 더 많은 단축키
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

### 3.5 로컬 저장소

```typescript
// utils/storage.ts

const STORAGE_KEY = 'md-preview-content';
const SETTINGS_KEY = 'md-preview-settings';

// 자동 저장 (debounce)
export const autoSave = debounce((content: string) => {
  localStorage.setItem(STORAGE_KEY, content);
  localStorage.setItem(`${STORAGE_KEY}-timestamp`, Date.now().toString());
}, 2000);

// 복원
export function restore(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

// 설정 저장
export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// 설정 복원
export function restoreSettings(): Settings | null {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : null;
}
```

---

## 4. 스타일링 전략

### 4.1 Tailwind 설정

```javascript
// tailwind.config.js

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GitHub Light
        'gh-bg': '#FFFFFF',
        'gh-bg-secondary': '#F6F8FA',
        'gh-text': '#24292F',
        'gh-text-secondary': '#57606A',
        'gh-border': '#D0D7DE',
        'gh-accent': '#0969DA',

        // GitHub Dark
        'gh-dark-bg': '#0D1117',
        'gh-dark-bg-secondary': '#161B22',
        'gh-dark-text': '#C9D1D9',
        'gh-dark-text-secondary': '#8B949E',
        'gh-dark-border': '#30363D',
        'gh-dark-accent': '#58A6FF',
      },
      fontFamily: {
        'code': ['Fira Code', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### 4.2 프리뷰 스타일 프리셋

```css
/* styles/themes/github.css */
.preview-github {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: var(--gh-text);
}

.preview-github h1 {
  font-size: 2em;
  font-weight: 600;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--gh-border);
}

/* ... */

/* styles/themes/notion.css */
.preview-notion {
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
  color: rgb(55, 53, 47);
}

.preview-notion h1 {
  font-size: 1.875em;
  font-weight: 700;
  margin-top: 2em;
}

/* ... */
```

### 4.3 테마 전환

```typescript
// hooks/useTheme.ts

export function useTheme() {
  const { theme, setTheme } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return { theme, setTheme };
}
```

---

## 5. 성능 최적화

### 5.1 번들 크기 최적화

```typescript
// vite.config.ts

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown-core': ['react-markdown', 'remark-gfm'],
          'markdown-math': ['remark-math', 'rehype-katex'], // lazy load
          'markdown-diagram': ['mermaid'], // lazy load
        },
      },
    },
  },
});
```

### 5.2 Lazy Loading

```typescript
// components/Preview/MermaidDiagram.tsx

const Mermaid = lazy(() => import('./Mermaid'));

export function MermaidDiagram({ code }: { code: string }) {
  return (
    <Suspense fallback={<div>Loading diagram...</div>}>
      <Mermaid code={code} />
    </Suspense>
  );
}
```

### 5.3 Debounce

```typescript
// hooks/useDebounce.ts

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 사용
const debouncedContent = useDebounce(content, 300);
```

### 5.4 가상화 (대용량 파일)

```typescript
// components/Editor/VirtualizedEditor.tsx

import { FixedSizeList } from 'react-window';

export function VirtualizedEditor({ content }: EditorProps) {
  const lines = content.split('\n');

  return (
    <FixedSizeList
      height={600}
      itemCount={lines.length}
      itemSize={20}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{lines[index]}</div>
      )}
    </FixedSizeList>
  );
}
```

---

## 6. 테스트 전략

### 6.1 단위 테스트

```typescript
// __tests__/utils/markdown.test.ts

import { extractHeadings } from '@/utils/markdown';

describe('extractHeadings', () => {
  it('should extract headings correctly', () => {
    const content = `
# Heading 1
## Heading 2
### Heading 3
    `;

    const headings = extractHeadings(content);

    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({ level: 1, text: 'Heading 1' });
  });
});
```

### 6.2 컴포넌트 테스트

```typescript
// __tests__/components/Editor.test.tsx

import { render, fireEvent, screen } from '@testing-library/react';
import { Editor } from '@/components/Editor';

describe('Editor', () => {
  it('should call onChange when typing', () => {
    const onChange = jest.fn();
    render(<Editor content="" onChange={onChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '# Hello' } });

    expect(onChange).toHaveBeenCalledWith('# Hello');
  });
});
```

### 6.3 E2E 테스트

```typescript
// e2e/file-upload.spec.ts

import { test, expect } from '@playwright/test';

test('should upload and preview markdown file', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 파일 업로드
  const input = page.locator('input[type="file"]');
  await input.setInputFiles('./fixtures/sample.md');

  // 프리뷰 확인
  await expect(page.locator('.preview h1')).toContainText('Sample Heading');
});
```

---

## 7. 개발 순서

### Phase 1: 핵심 기능 (1주)

```
Day 1-2: 프로젝트 설정
- [ ] Vite + React + TypeScript 초기화
- [ ] Tailwind CSS 설정
- [ ] ESLint, Prettier 설정
- [ ] 폴더 구조 생성
- [ ] Zustand 스토어 기본 구조

Day 3-4: 에디터 + 프리뷰
- [ ] CodeMirror 통합
- [ ] react-markdown 설정
- [ ] GFM, 코드 하이라이팅
- [ ] 좌우 분할 레이아웃
- [ ] 실시간 프리뷰 (debounce)

Day 5: 파일 처리 + 테마
- [ ] 파일 드래그/선택
- [ ] 파일 다운로드
- [ ] 다크/라이트 모드 전환
- [ ] 시스템 테마 감지

Day 6-7: 테스트 + 배포
- [ ] 단위 테스트 작성
- [ ] Vercel 배포 설정
- [ ] 첫 배포
```

### Phase 2: 차별화 (1주)

```
Day 1-2: 스타일 프리셋
- [ ] GitHub 스타일 CSS
- [ ] Notion 스타일 CSS
- [ ] VS Code 스타일 CSS
- [ ] 미니멀 스타일 CSS
- [ ] 스타일 전환 UI

Day 3-4: TOC + 툴바
- [ ] TOC 자동 생성
- [ ] TOC 사이드바 UI
- [ ] 스크롤 동기화
- [ ] 툴바 버튼 (헤딩, 볼드, 이탤릭 등)

Day 5: 환영 문서 + 설정
- [ ] 환영 플레이스홀더 작성
- [ ] 설정 패널 UI
- [ ] 폰트, 크기 설정

Day 6-7: 테스트 + 배포
- [ ] E2E 테스트
- [ ] Phase 2 배포
```

### Phase 3: 완성 (1주)

```
Day 1-2: 단축키 + 고급 기능
- [ ] 전체 단축키 구현
- [ ] 검색/바꾸기
- [ ] 이미지 드래그/클립보드

Day 3-4: 반응형 + 접근성
- [ ] 모바일 레이아웃
- [ ] 키보드 네비게이션
- [ ] 스크린리더 호환
- [ ] ARIA 속성

Day 5-6: 성능 + PWA
- [ ] 번들 크기 최적화
- [ ] Lazy loading
- [ ] PWA 설정
- [ ] Lighthouse 점수 확인

Day 7: 최종 테스트 + v1.0 릴리즈
- [ ] 전체 테스트
- [ ] 문서 작성 (README)
- [ ] v1.0 태그 및 릴리즈
```

---

## 8. 기술 부채 방지

### 8.1 코드 품질

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 8.2 Git 워크플로우

```bash
# 브랜치 전략
main          # 프로덕션
├── develop   # 개발
│   ├── feature/editor
│   ├── feature/preview
│   └── feature/toc

# 커밋 메시지 규칙
feat: 새 기능
fix: 버그 수정
docs: 문서
style: 스타일
refactor: 리팩토링
test: 테스트
chore: 기타
```

### 8.3 의존성 관리

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

---

## 9. 배포 전략

### 9.1 Vercel 설정

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 9.2 환경 변수

```env
# .env.production
VITE_APP_TITLE=Markdown Preview
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=xxx
```

### 9.3 CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
```

---

## 10. 모니터링 & 피드백

### 10.1 애널리틱스

```typescript
// utils/analytics.ts

export function trackEvent(event: string, properties?: object) {
  if (import.meta.env.PROD) {
    // Google Analytics 또는 Plausible
    gtag('event', event, properties);
  }
}

// 사용
trackEvent('file_uploaded', { fileSize: file.size });
trackEvent('style_changed', { style: 'notion' });
```

### 10.2 오류 추적

```typescript
// utils/errorTracking.ts

export function reportError(error: Error, context?: object) {
  if (import.meta.env.PROD) {
    // Sentry 또는 Rollbar
    Sentry.captureException(error, { extra: context });
  } else {
    console.error(error, context);
  }
}
```

---

## 11. 다음 단계

### 즉시 시작 가능
1. Phase 1 개발 착수
2. Day 1-2 작업 진행

### 병행 작업
1. GitHub 스타일 CSS 리서치
2. 환영 플레이스홀더 문구 작성
3. 아이콘 선정 (Lucide React 추천)

### 준비 필요
1. 도메인 구매 (선택)
2. Google Analytics 계정
3. GitHub Repository 생성

---

## 결론

이 분석 보고서는 PRD를 실제 코드로 변환하기 위한 **실행 계획서**입니다.

### 핵심 결정 사항
- 아키텍처: 모듈형 컴포넌트 구조
- 상태관리: Zustand
- 스타일링: Tailwind CSS + CSS 프리셋
- 배포: Vercel
- 개발 순서: Phased MVP (3주)

### 바로 시작 가능
- 폴더 구조 제안됨
- 주요 기능 코드 스니펫 제공
- 3주 상세 일정
- 테스트 전략 수립

**다음 액션: 프로젝트 초기 설정 (Day 1-2)**
