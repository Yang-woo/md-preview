# 디자인 핸드오프: 메인 레이아웃

> TODO: DES-002
> 작성일: 2026-01-15
> 담당: design-handoff

## 감지된 스택

- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite 5
- **스타일링**: Tailwind CSS
- **토큰 형식**: tailwind.config.js + CSS Variables

## 1. 디자인 토큰

### Colors (Tailwind 확장)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 기본 색상은 DES-001 디자인 토큰 참조
        'border-resize': 'rgba(0, 0, 0, 0.1)',
        'border-resize-hover': 'var(--color-primary)',
        'overlay-bg': 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
};
```

### Layout Tokens

```css
:root {
  /* Header */
  --header-height-desktop: 64px;
  --header-height-tablet: 56px;
  --header-height-mobile: 48px;

  /* TOC Sidebar */
  --toc-width: 200px;
  --toc-width-collapsed: 0px;

  /* SplitPane */
  --split-min-width: 300px;
  --resize-handle-width: 4px;
  --resize-handle-hover-width: 8px;

  /* Z-index */
  --z-header: 50;
  --z-toc-overlay: 100;
  --z-settings-modal: 200;
  --z-file-dropzone: 300;
}

[data-theme="dark"] {
  --border-resize: rgba(255, 255, 255, 0.1);
}
```

### Spacing

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| space-header-x | 16px / 1rem | Header 좌우 패딩 |
| space-header-y | 12px / 0.75rem | Header 상하 패딩 |
| space-toc-x | 16px / 1rem | TOC 좌우 패딩 |
| space-toc-item | 8px / 0.5rem | TOC 항목 간격 |

### Typography

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| font-size-filename | 14px / 0.875rem | 파일명 표시 |
| font-size-toc-item | 14px / 0.875rem | TOC 항목 |
| font-weight-filename | 500 | 파일명 굵기 |
| font-weight-toc-item | 400 | TOC 항목 굵기 |

## 2. 컴포넌트 스펙

### 2.1 Header

**파일**: `src/components/Layout/Header.tsx`

**Props**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| fileName | string | 'untitled.md' | 현재 파일명 |
| isDirty | boolean | false | 미저장 변경사항 여부 |
| theme | 'light' \| 'dark' | 'light' | 현재 테마 |
| onThemeToggle | () => void | - | 테마 토글 핸들러 |
| onOpenSettings | () => void | - | 설정 열기 핸들러 |
| onDownload | () => void | - | 다운로드 핸들러 |
| onTOCToggle | () => void | - | TOC 토글 핸들러 (Tablet/Mobile) |
| screenSize | 'desktop' \| 'tablet' \| 'mobile' | - | 현재 화면 크기 |

**Tailwind Classes**
```tsx
// Header Container
<header className="
  h-16 lg:h-16 md:h-14 sm:h-12
  px-4 md:px-6
  flex items-center justify-between
  border-b border-border
  bg-background
  sticky top-0
  z-50
">
  {/* Logo - Desktop만 */}
  {screenSize === 'desktop' && (
    <div className="flex items-center gap-3">
      <h1 className="text-lg font-bold text-primary">MD Preview</h1>
    </div>
  )}

  {/* 파일명 */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-text-primary">
      {fileName}
    </span>
    {isDirty && (
      <span className="w-2 h-2 rounded-full bg-warning"
            aria-label="미저장 변경사항" />
    )}
  </div>

  {/* 버튼 그룹 */}
  <div className="flex items-center gap-2">
    {/* TOC Toggle (Tablet/Mobile) */}
    {(screenSize === 'tablet' || screenSize === 'mobile') && (
      <button
        onClick={onTOCToggle}
        className="
          p-2 rounded-md
          hover:bg-bg-secondary
          transition-colors duration-150
          focus-visible:ring-2 ring-primary ring-offset-2
        "
        aria-label="목차 열기"
      >
        <ListIcon className="w-5 h-5" />
      </button>
    )}

    {/* 테마 토글 */}
    <button
      onClick={onThemeToggle}
      className="
        p-2 rounded-md
        hover:bg-bg-secondary
        transition-colors duration-150
        focus-visible:ring-2 ring-primary ring-offset-2
      "
      aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>

    {/* 설정 */}
    <button
      onClick={onOpenSettings}
      className="
        p-2 rounded-md
        hover:bg-bg-secondary
        transition-colors duration-150
        focus-visible:ring-2 ring-primary ring-offset-2
      "
      aria-label="설정 열기"
    >
      <SettingsIcon className="w-5 h-5" />
    </button>

    {/* 다운로드 */}
    <button
      onClick={onDownload}
      className="
        px-3 py-1.5 rounded-md
        bg-primary text-white
        hover:bg-primary-hover
        transition-colors duration-150
        focus-visible:ring-2 ring-primary ring-offset-2
      "
      aria-label="파일 다운로드"
    >
      <DownloadIcon className="w-5 h-5" />
    </button>
  </div>
</header>
```

### 2.2 TOCSidebar

**파일**: `src/components/Layout/TOCSidebar.tsx`

**Props**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| headings | Heading[] | [] | 헤딩 목록 |
| activeId | string \| null | null | 현재 활성 헤딩 ID |
| isCollapsed | boolean | false | 접힘 상태 |
| onCollapse | (collapsed: boolean) => void | - | 접기 핸들러 |
| onClickItem | (id: string) => void | - | 항목 클릭 핸들러 |

**Types**
```typescript
interface Heading {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}
```

**Tailwind Classes**
```tsx
<aside
  className={cn(
    "h-[calc(100vh-var(--header-height-desktop))]",
    "border-r border-border",
    "bg-background",
    "overflow-y-auto",
    "transition-all duration-300 ease-out",
    isCollapsed ? "w-0" : "w-[200px]"
  )}
  aria-label="목차"
  role="navigation"
>
  {!isCollapsed && (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-secondary uppercase">
          목차
        </h2>
        <button
          onClick={() => onCollapse(true)}
          className="p-1 rounded hover:bg-bg-secondary"
          aria-label="목차 접기"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
      </div>

      {/* TOC List */}
      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              <button
                onClick={() => onClickItem(heading.id)}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-sm",
                  "hover:bg-bg-secondary",
                  "transition-colors duration-150",
                  "focus-visible:ring-2 ring-primary ring-offset-2",
                  activeId === heading.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Empty State */}
      {headings.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-8">
          헤딩이 없습니다
        </p>
      )}
    </div>
  )}
</aside>

{/* Collapsed 상태 버튼 */}
{isCollapsed && (
  <button
    onClick={() => onCollapse(false)}
    className="
      absolute left-0 top-1/2 -translate-y-1/2
      p-2 rounded-r-md
      bg-background border border-l-0 border-border
      hover:bg-bg-secondary
      transition-colors duration-150
      focus-visible:ring-2 ring-primary
    "
    aria-label="목차 펼치기"
  >
    <ChevronRightIcon className="w-4 h-4" />
  </button>
)}
```

### 2.3 SplitPane

**파일**: `src/components/Layout/SplitPane.tsx`

**Props**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| leftContent | ReactNode | - | 좌측 콘텐츠 (Editor) |
| rightContent | ReactNode | - | 우측 콘텐츠 (Preview) |
| initialRatio | number | 0.5 | 초기 분할 비율 (0-1) |
| minWidth | number | 300 | 각 패널 최소 너비 (px) |
| onResize | (ratio: number) => void | - | 리사이즈 콜백 |

**State**
```typescript
interface SplitPaneState {
  ratio: number;        // 0-1 사이 값
  isDragging: boolean;
}
```

**Tailwind Classes**
```tsx
<div className="flex h-full relative">
  {/* Left Pane (Editor) */}
  <div
    style={{ width: `${ratio * 100}%` }}
    className="overflow-hidden"
  >
    {leftContent}
  </div>

  {/* Resize Handle */}
  <div
    onMouseDown={handleMouseDown}
    className={cn(
      "w-1 cursor-col-resize",
      "bg-border hover:bg-primary",
      "transition-colors duration-150",
      "relative z-10",
      isDragging && "bg-primary"
    )}
    role="separator"
    aria-label="패널 크기 조절"
    aria-valuemin={minWidth}
    aria-valuemax={containerWidth - minWidth}
    aria-valuenow={ratio * containerWidth}
  >
    {/* Hover/Active 표시 */}
    <div className="absolute inset-y-0 -left-1 -right-1 hover:bg-primary/20" />
  </div>

  {/* Right Pane (Preview) */}
  <div
    style={{ width: `${(1 - ratio) * 100}%` }}
    className="overflow-hidden"
  >
    {rightContent}
  </div>

  {/* Dragging Overlay */}
  {isDragging && (
    <div className="absolute inset-0 z-20 cursor-col-resize" />
  )}
</div>
```

**Resize Logic**
```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  setIsDragging(true);

  const handleMouseMove = (e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const { left, width } = container.getBoundingClientRect();
    const x = e.clientX - left;
    let newRatio = x / width;

    // 최소/최대 제약
    const minRatio = minWidth / width;
    const maxRatio = 1 - minWidth / width;
    newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio));

    setRatio(newRatio);
    onResize?.(newRatio);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // localStorage에 저장
    localStorage.setItem('md-preview-split-ratio', newRatio.toString());
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
```

### 2.4 TabView (Mobile)

**파일**: `src/components/Layout/TabView.tsx`

**Props**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| editorContent | ReactNode | - | 에디터 콘텐츠 |
| previewContent | ReactNode | - | 프리뷰 콘텐츠 |
| initialTab | 'editor' \| 'preview' | 'editor' | 초기 활성 탭 |
| onTabChange | (tab: 'editor' \| 'preview') => void | - | 탭 변경 콜백 |

**Tailwind Classes**
```tsx
<div className="flex flex-col h-full">
  {/* Tab Bar */}
  <div
    className="flex border-b border-border bg-background"
    role="tablist"
    aria-label="에디터와 프리뷰 전환"
  >
    <button
      onClick={() => setActiveTab('editor')}
      className={cn(
        "flex-1 py-3 text-sm font-medium",
        "border-b-2 transition-colors duration-150",
        "focus-visible:ring-2 ring-primary ring-inset",
        activeTab === 'editor'
          ? "border-primary text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary"
      )}
      role="tab"
      aria-selected={activeTab === 'editor'}
      aria-controls="editor-panel"
    >
      에디터
    </button>
    <button
      onClick={() => setActiveTab('preview')}
      className={cn(
        "flex-1 py-3 text-sm font-medium",
        "border-b-2 transition-colors duration-150",
        "focus-visible:ring-2 ring-primary ring-inset",
        activeTab === 'preview'
          ? "border-primary text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary"
      )}
      role="tab"
      aria-selected={activeTab === 'preview'}
      aria-controls="preview-panel"
    >
      프리뷰
    </button>
  </div>

  {/* Tab Content */}
  <div className="flex-1 overflow-hidden">
    <div
      id="editor-panel"
      className={cn(
        "h-full transition-transform duration-200",
        activeTab === 'editor' ? "block" : "hidden"
      )}
      role="tabpanel"
      aria-labelledby="editor-tab"
    >
      {editorContent}
    </div>
    <div
      id="preview-panel"
      className={cn(
        "h-full transition-transform duration-200",
        activeTab === 'preview' ? "block" : "hidden"
      )}
      role="tabpanel"
      aria-labelledby="preview-tab"
    >
      {previewContent}
    </div>
  </div>
</div>
```

### 2.5 TOCOverlay (Tablet/Mobile)

**파일**: `src/components/Layout/TOCOverlay.tsx`

**Props**
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| isOpen | boolean | false | 오버레이 열림 상태 |
| headings | Heading[] | [] | 헤딩 목록 |
| activeId | string \| null | null | 현재 활성 헤딩 ID |
| onClose | () => void | - | 닫기 핸들러 |
| onClickItem | (id: string) => void | - | 항목 클릭 핸들러 |

**Tailwind Classes**
```tsx
{/* Backdrop */}
<div
  className={cn(
    "fixed inset-0 z-100",
    "bg-black/50 backdrop-blur-sm",
    "transition-opacity duration-200",
    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  )}
  onClick={onClose}
  aria-hidden={!isOpen}
/>

{/* Overlay Panel */}
<div
  className={cn(
    "fixed top-0 left-0 bottom-0 z-101",
    "w-72 bg-background",
    "shadow-xl",
    "transition-transform duration-200",
    isOpen ? "translate-x-0" : "-translate-x-full"
  )}
  role="dialog"
  aria-modal="true"
  aria-label="목차"
>
  {/* Header */}
  <div className="flex items-center justify-between p-4 border-b border-border">
    <h2 className="text-lg font-semibold">목차</h2>
    <button
      onClick={onClose}
      className="p-2 rounded hover:bg-bg-secondary"
      aria-label="목차 닫기"
    >
      <XIcon className="w-5 h-5" />
    </button>
  </div>

  {/* TOC List */}
  <div className="p-4 overflow-y-auto h-[calc(100vh-var(--header-height-tablet)-56px)]">
    <nav>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <button
              onClick={() => {
                onClickItem(heading.id);
                onClose();
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded text-sm",
                "hover:bg-bg-secondary",
                "transition-colors duration-150",
                activeId === heading.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary"
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</div>
```

## 3. 인터랙션

### 3.1 Transitions

| 요소 | Duration | Easing | CSS |
|------|----------|--------|-----|
| TOC Sidebar 접기/펼치기 | 300ms | ease-out | `transition: width 300ms ease-out` |
| TOC Overlay 열기/닫기 | 200ms | ease-out | `transition: transform 200ms ease-out` |
| ResizeHandle hover | 150ms | ease-out | `transition: background-color 150ms ease-out` |
| Tab 전환 | 200ms | ease-out | `transition: transform 200ms ease-out` |
| 버튼 hover | 150ms | ease-out | `transition: background-color 150ms ease-out` |

### 3.2 Animations

**TOC Sidebar Collapse**
```css
.toc-sidebar {
  transition: width 300ms ease-out;
}
```

**TOC Overlay Slide-in**
```css
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
```

**Tab Content Fade**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

## 4. 반응형

### Breakpoints (Tailwind)

| Breakpoint | 클래스 | 너비 | 적용 레이아웃 |
|------------|--------|------|--------------|
| Mobile (기본) | (없음) | < 640px | TabView |
| Mobile 가로 | `sm:` | ≥ 640px | TabView |
| Tablet | `md:` | ≥ 768px | SplitPane (TOC 숨김) |
| Desktop | `lg:` | ≥ 1024px | SplitPane + TOCSidebar |
| Desktop 큰 화면 | `xl:` | ≥ 1280px | SplitPane + TOCSidebar |

### 반응형 클래스 패턴

```tsx
// Header 높이
className="h-12 sm:h-12 md:h-14 lg:h-16"

// TOC 표시/숨김
className="hidden lg:block"

// TOC Toggle 버튼 (Tablet/Mobile만)
className="lg:hidden"

// Split Pane (Tablet/Desktop)
className="hidden md:flex"

// Tab View (Mobile만)
className="md:hidden"
```

## 5. 필요 에셋

### 아이콘 (lucide-react)

- [ ] `Menu` - TOC 토글 버튼
- [ ] `Sun` / `Moon` - 테마 토글
- [ ] `Settings` - 설정 버튼
- [ ] `Download` - 다운로드 버튼
- [ ] `ChevronLeft` / `ChevronRight` - TOC 접기/펼치기
- [ ] `X` - 오버레이 닫기
- [ ] `List` - TOC 리스트 아이콘

### 폰트

- [ ] **Inter** (기본 UI 폰트)
  - Weights: 400, 500, 600, 700
  - Google Fonts 또는 로컬
- [ ] **Fira Code** (에디터 폰트)
  - Weights: 400, 500
  - Ligatures 지원

## 6. 접근성 요구사항

### ARIA 속성

| 요소 | ARIA 속성 |
|------|----------|
| Header | `role="banner"` |
| TOCSidebar | `role="navigation"`, `aria-label="목차"` |
| ResizeHandle | `role="separator"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` |
| TabBar | `role="tablist"`, `aria-label="에디터와 프리뷰 전환"` |
| Tab | `role="tab"`, `aria-selected`, `aria-controls` |
| TabPanel | `role="tabpanel"`, `aria-labelledby` |
| TOCOverlay | `role="dialog"`, `aria-modal="true"`, `aria-label="목차"` |

### 포커스 관리

- **포커스 링**: Tailwind의 `focus-visible:ring-2 ring-primary ring-offset-2`
- **포커스 순서**: Header 버튼 → Editor → Preview → TOC
- **모달 포커스 트랩**: TOC Overlay 열릴 때 첫 번째 항목으로 포커스 이동

### 키보드 단축키

| 키 | 동작 | 구현 |
|----|------|------|
| `Cmd/Ctrl + \` | TOC 토글 | `useKeyboardShortcuts` 훅 |
| `Cmd/Ctrl + Shift + P` | 탭 전환 (Mobile) | `useKeyboardShortcuts` 훅 |
| `Tab` | 포커스 이동 | 브라우저 기본 동작 |
| `Esc` | 오버레이 닫기 | `onKeyDown` 이벤트 |

### 색상 대비

- **텍스트**: 최소 4.5:1 (WCAG AA)
- **버튼**: 최소 3:1 (WCAG AA)
- **포커스 링**: 고대비 색상 (#0969DA)

## 7. 구현 체크리스트

### 컴포넌트 파일 구조

```
src/
├── components/
│   └── Layout/
│       ├── Header.tsx
│       ├── TOCSidebar.tsx
│       ├── SplitPane.tsx
│       ├── TabView.tsx
│       ├── TOCOverlay.tsx
│       └── index.ts
├── hooks/
│   ├── useMediaQuery.ts        # 화면 크기 감지
│   ├── useLocalStorage.ts      # localStorage 관리
│   ├── useKeyboardShortcuts.ts # 단축키 핸들러
│   └── useTOC.ts               # TOC 추출 및 동기화
└── utils/
    └── cn.ts                   # clsx + tailwind-merge
```

### Phase 1: 기본 레이아웃 (P0)

- [ ] `Header.tsx` 구현
- [ ] `TOCSidebar.tsx` 구현
- [ ] `SplitPane.tsx` 구현 (리사이즈 포함)
- [ ] `useMediaQuery` 훅 구현
- [ ] Desktop 3단 레이아웃 완성

### Phase 2: 반응형 (P0)

- [ ] `TabView.tsx` 구현 (Mobile)
- [ ] `TOCOverlay.tsx` 구현 (Tablet/Mobile)
- [ ] 브레이크포인트별 레이아웃 전환
- [ ] 상태 저장 (`useLocalStorage`)

### Phase 3: 인터랙션 (P1)

- [ ] TOC 스크롤 동기화 (Intersection Observer)
- [ ] TOC 접기/펼치기 애니메이션
- [ ] ResizeHandle 드래그 오버레이
- [ ] 키보드 단축키 (`useKeyboardShortcuts`)

### Phase 4: 접근성 (P1)

- [ ] ARIA 속성 추가
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린리더 테스트
- [ ] 색상 대비 확인 (WCAG AA)

## 8. 테스트 시나리오

### 단위 테스트

- [ ] `SplitPane`: 리사이즈 로직 (최소/최대 제약)
- [ ] `useMediaQuery`: 브레이크포인트 감지
- [ ] `useLocalStorage`: 상태 저장/복원
- [ ] `useTOC`: 헤딩 추출

### 통합 테스트

- [ ] Desktop → Tablet 전환 시 TOC 상태 유지
- [ ] Tablet → Mobile 전환 시 탭 상태 유지
- [ ] SplitPane 리사이즈 후 새로고침 시 비율 유지
- [ ] TOC 항목 클릭 시 스크롤 동작

### E2E 테스트

- [ ] 전체 화면 크기 변경 시 레이아웃 전환
- [ ] TOC 네비게이션 플로우
- [ ] 키보드만으로 전체 기능 사용
- [ ] 다크/라이트 모드 전환

## 9. 성능 최적화

### 리렌더링 최적화

```typescript
// React.memo로 불필요한 리렌더링 방지
export const Header = React.memo<HeaderProps>(({ ... }) => {
  // ...
});

// useMemo로 계산 비용 큰 값 캐싱
const sortedHeadings = useMemo(() => {
  return headings.sort((a, b) => a.order - b.order);
}, [headings]);

// useCallback으로 함수 참조 안정화
const handleResize = useCallback((ratio: number) => {
  setRatio(ratio);
  onResize?.(ratio);
}, [onResize]);
```

### 이벤트 최적화

```typescript
// Resize 이벤트 throttle
const handleResize = useThrottle(() => {
  // resize logic
}, 16); // 60fps

// Scroll 이벤트 throttle (TOC 동기화)
const handleScroll = useThrottle(() => {
  // scroll sync logic
}, 100);
```

### 레이지 로딩

```typescript
// TOCOverlay는 필요할 때만 로딩
const TOCOverlay = React.lazy(() => import('./TOCOverlay'));
```

## 10. 구현 우선순위

### Week 1: 핵심 레이아웃

1. Header + Desktop 3단 레이아웃
2. SplitPane 리사이즈
3. TOCSidebar 기본 기능

### Week 2: 반응형

1. Tablet 레이아웃 (TOC 오버레이)
2. Mobile TabView
3. 브레이크포인트 전환

### Week 3: 인터랙션 & 접근성

1. TOC 스크롤 동기화
2. 키보드 단축키
3. ARIA 속성 & 접근성 테스트
