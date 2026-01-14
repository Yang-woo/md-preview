# PRD 분석 문서

> 생성일: 2026-01-15
> PRD 검증 점수: 9/10 PASS

## 1. 제품 개요

| 항목 | 내용 |
|------|------|
| 제품명 | Markdown Preview |
| 목표 | 설치 없이 브라우저에서 마크다운 실시간 편집/프리뷰 |
| 타겟 | 개발자, PM/기획자, 블로거/작가, 학생/입문자 |
| 차별점 | 즉시 사용, 4가지 스타일 프리셋, 확장 문법(KaTeX/Mermaid), PWA 오프라인 |

### 성공 지표
- 초기 로딩: **<3초**
- Lighthouse 점수: **>90점**
- 접근성: **WCAG 2.1 AA 준수**
- 온보딩 성공률: **80% 이상**
- 재방문율: **40% 이상**

---

## 2. MVP(v1.0) 핵심 기능

| 기능 | 우선순위 | 복잡도 | 예상 공수 |
|------|----------|--------|-----------|
| 프로젝트 설정 (Vite + React + TS) | P0 | 낮음 | 0.5일 |
| 파일 드래그 앤 드롭 / 선택 | P0 | 중간 | 1일 |
| 마크다운 에디터 (좌우 분할) | P0 | 높음 | 2일 |
| 기본 마크다운 프리뷰 | P0 | 중간 | 1일 |
| GFM 지원 (테이블, 체크박스) | P0 | 낮음 | 0.5일 |
| 코드 syntax highlighting | P0 | 중간 | 1일 |
| 파일 다운로드 (.md) | P0 | 낮음 | 0.5일 |
| 단축키 지원 | P0 | 중간 | 1일 |
| 목차(TOC) 사이드바 | P0 | 중간 | 1일 |
| 다크/라이트 모드 | P0 | 중간 | 1일 |
| 4가지 스타일 프리셋 | P0 | 중간 | 2일 |
| 환영 플레이스홀더 | P0 | 낮음 | 0.5일 |
| 툴바 버튼 | P0 | 중간 | 1일|
| 브라우저 자동 저장 | P0 | 중간 | 1일 |

**총 예상 공수**: 약 14일 (3주)

---

## 3. 기술 스택

### 확정 스택

```json
{
  "프레임워크": "React 18 + TypeScript",
  "빌드": "Vite 5",
  "에디터": "CodeMirror 6",
  "마크다운": "react-markdown + remark-gfm",
  "코드 하이라이팅": "rehype-highlight",
  "스타일링": "Tailwind CSS",
  "상태관리": "Zustand",
  "PWA": "vite-plugin-pwa",
  "다국어": "i18next"
}
```

### 의존성 분석

| 라이브러리 | 크기 (gzipped) | 용도 |
|------------|----------------|------|
| react-markdown | ~12KB | 마크다운 렌더링 |
| remark-gfm | ~4KB | GFM 지원 |
| rehype-highlight | ~8KB | 코드 하이라이팅 |
| @codemirror/view | ~80KB | 에디터 코어 |
| @codemirror/lang-markdown | ~15KB | 마크다운 언어 지원 |
| zustand | ~3KB | 상태관리 |
| tailwindcss | 런타임 0 | 스타일링 |

**예상 초기 번들**: ~120KB (gzipped)

### v1.1+ 확장 (Lazy Load)

| 라이브러리 | 크기 | 용도 |
|------------|------|------|
| KaTeX | ~500KB | 수식 렌더링 |
| Mermaid | ~2MB | 다이어그램 |

---

## 4. 컴포넌트 구조

```
src/
├── components/
│   ├── Editor/
│   │   ├── Editor.tsx           # CodeMirror 래퍼
│   │   ├── EditorToolbar.tsx    # 서식 툴바
│   │   └── index.ts
│   ├── Preview/
│   │   ├── Preview.tsx          # react-markdown 렌더러
│   │   ├── PreviewStyles.tsx    # 스타일 프리셋 적용
│   │   └── index.ts
│   ├── Layout/
│   │   ├── Header.tsx           # 앱 헤더
│   │   ├── SplitPane.tsx        # 좌우 분할 패널
│   │   ├── Sidebar.tsx          # TOC 사이드바
│   │   └── index.ts
│   ├── FileHandler/
│   │   ├── FileDropZone.tsx     # 드래그 앤 드롭
│   │   ├── FileInput.tsx        # 파일 선택
│   │   └── index.ts
│   ├── Settings/
│   │   ├── SettingsModal.tsx    # 설정 모달
│   │   ├── ThemeSelector.tsx    # 테마 선택
│   │   ├── StylePresetSelector.tsx
│   │   └── index.ts
│   ├── TOC/
│   │   ├── TableOfContents.tsx  # 목차 컴포넌트
│   │   └── index.ts
│   └── common/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Tooltip.tsx
│       └── index.ts
├── hooks/
│   ├── useMarkdown.ts           # 마크다운 파싱
│   ├── useTheme.ts              # 테마 관리
│   ├── useTOC.ts                # 목차 추출
│   ├── useFileHandler.ts        # 파일 처리
│   ├── useKeyboardShortcuts.ts  # 단축키
│   ├── useAutoSave.ts           # 자동 저장
│   └── useScrollSync.ts         # 스크롤 동기화
├── stores/
│   ├── editorStore.ts           # 에디터 상태
│   ├── settingsStore.ts         # 설정 상태
│   └── uiStore.ts               # UI 상태
├── utils/
│   ├── markdown.ts              # 마크다운 유틸
│   ├── file.ts                  # 파일 유틸
│   ├── storage.ts               # localStorage 유틸
│   └── constants.ts             # 상수
├── styles/
│   ├── themes/
│   │   ├── github.css           # GitHub 스타일
│   │   ├── notion.css           # Notion 스타일
│   │   ├── vscode.css           # VS Code 스타일
│   │   └── minimal.css          # 미니멀 스타일
│   └── globals.css
├── i18n/
│   ├── ko.json                  # 한국어
│   └── en.json                  # 영어
├── App.tsx
└── main.tsx
```

---

## 5. 핵심 구현 가이드

### 5.1 에디터 + 프리뷰 연동

```typescript
// stores/editorStore.ts
import { create } from 'zustand';

interface EditorStore {
  content: string;
  fileName: string;
  isDirty: boolean;
  setContent: (content: string) => void;
  setFileName: (name: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  content: '',
  fileName: 'untitled.md',
  isDirty: false,
  setContent: (content) => set({ content, isDirty: true }),
  setFileName: (fileName) => set({ fileName }),
}));
```

### 5.2 마크다운 렌더링

```typescript
// components/Preview/Preview.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function Preview({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {content}
    </ReactMarkdown>
  );
}
```

### 5.3 파일 드래그 앤 드롭

```typescript
// hooks/useFileHandler.ts
export function useFileHandler() {
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file?.name.endsWith('.md')) {
      const content = await file.text();
      // 에디터에 로드
    }
  };

  const handleDownload = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  return { handleDrop, handleDownload };
}
```

### 5.4 자동 저장

```typescript
// hooks/useAutoSave.ts
import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';

export function useAutoSave() {
  const { content, fileName } = useEditorStore();

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('md-preview-autosave', JSON.stringify({
        content,
        fileName,
        savedAt: Date.now(),
      }));
    }, 30000); // 30초마다

    return () => clearInterval(timer);
  }, [content, fileName]);
}
```

---

## 6. 개발 일정 (3주)

### Phase 1: Week 1 - 핵심 기능

| Day | 작업 |
|-----|------|
| 1-2 | 프로젝트 설정, 폴더 구조, 기본 레이아웃 |
| 3-4 | CodeMirror 에디터 + react-markdown 프리뷰 연동 |
| 5-6 | 파일 드래그/다운로드 + 다크/라이트 테마 |
| 7 | 첫 배포 (Vercel), 기본 동작 확인 |

### Phase 2: Week 2 - 차별화 기능

| Day | 작업 |
|-----|------|
| 8-9 | 4가지 스타일 프리셋 (GitHub/Notion/VS Code/미니멀) |
| 10-11 | TOC 사이드바 + 툴바 버튼 |
| 12-13 | 환영 플레이스홀더 + 설정 패널 |
| 14 | Phase 2 배포, QA |

### Phase 3: Week 3 - 완성

| Day | 작업 |
|-----|------|
| 15-16 | 단축키 + 브라우저 자동 저장 |
| 17-18 | 반응형 레이아웃 + 접근성 |
| 19-20 | 성능 최적화 + PWA 설정 |
| 21 | **v1.0 릴리즈** |

---

## 7. 리스크 & 완화 전략

| 리스크 | 영향 | 완화 전략 |
|--------|------|-----------|
| CodeMirror 학습 곡선 | 중간 | 공식 문서 + 예제 참고, 3-4시간 학습 |
| 대용량 파일 성능 | 높음 | 5MB 경고, 10MB 차단, 가상화 적용 |
| 모바일 입력 UX | 중간 | 프리뷰 전용 모드 기본 |
| Mermaid 번들 크기 | 낮음 (v1.1) | Dynamic import, lazy load |
| 브라우저 호환성 | 낮음 | 최신 2개 버전만 지원 |

---

## 8. 테스트 전략

### 단위 테스트 (Vitest)
- 마크다운 파싱 유틸
- 파일 처리 유틸
- 스토어 로직

### 컴포넌트 테스트 (Testing Library)
- 에디터 입력/출력
- 프리뷰 렌더링
- 파일 드래그 앤 드롭

### E2E 테스트 (Playwright)
- 전체 사용자 플로우
- 키보드 네비게이션
- 파일 업로드/다운로드

---

## 9. 배포 전략

### 호스팅
- **Vercel** (추천): 자동 배포, 프리뷰 URL, 무료
- 대안: Netlify, GitHub Pages

### CI/CD
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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm test
```

---

## 10. 다음 단계

### 즉시 시작

```bash
# 1. 프로젝트 생성
npm create vite@latest md-preview -- --template react-ts
cd md-preview

# 2. 의존성 설치
npm install react-markdown remark-gfm rehype-highlight
npm install @codemirror/state @codemirror/view @codemirror/lang-markdown
npm install zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. 폴더 구조 생성
mkdir -p src/{components/{Editor,Preview,Layout,FileHandler,Settings,TOC,common},hooks,stores,utils,styles/themes,i18n}

# 4. 개발 서버 실행
npm run dev
```

### 마일스톤 체크포인트

- [ ] Week 1 완료: 기본 에디터 + 프리뷰 동작
- [ ] Week 2 완료: 스타일 프리셋 + TOC 동작
- [ ] Week 3 완료: v1.0 릴리즈 준비 완료

---

## 부록: 스타일 프리셋 예시

### GitHub 스타일
```css
.preview-github {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial;
  line-height: 1.6;
  color: #24292f;
}
.preview-github h1 { border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
.preview-github code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 6px; }
```

### Notion 스타일
```css
.preview-notion {
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont;
  line-height: 1.5;
  color: rgb(55, 53, 47);
}
.preview-notion h1 { font-weight: 700; font-size: 1.875em; margin-top: 2em; }
.preview-notion code { background: rgba(135, 131, 120, 0.15); padding: 0.2em 0.4em; }
```
