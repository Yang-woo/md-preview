# 디자인 토큰

> 프로젝트: Markdown Preview v1.0
> 작성일: 2026-01-15

## Figma 참조
| 프레임 | Figma Node ID | 설명 |
|--------|---------------|------|
| Design Tokens - Light Mode | `4:3` | 라이트 모드 토큰 (1400x1200) |
| Design Tokens - Dark Mode | `4:68` | 다크 모드 토큰 (1400x1200) |

## 개요

Markdown Preview의 전역 디자인 토큰 정의.
라이트/다크 테마 색상, 타이포그래피, 스페이싱, 기타 스타일 토큰 포함.

---

## 1. 색상 (Colors)

### 1.1 Primary Colors

#### 라이트 모드
```
Primary Blue
├── primary-50:  #EFF6FF (배경)
├── primary-100: #DBEAFE (hover 배경)
├── primary-500: #0969DA (메인)
├── primary-600: #0860CA (hover)
└── primary-700: #0756B8 (active)
```

#### 다크 모드
```
Primary Blue
├── primary-50:  #1A2332 (배경)
├── primary-100: #243447 (hover 배경)
├── primary-500: #58A6FF (메인)
├── primary-600: #4A9AEF (hover)
└── primary-700: #3C8EDF (active)
```

### 1.2 Semantic Colors

#### Success (성공 상태)
| 모드 | 배경 | 텍스트 | 아이콘 |
|------|------|--------|--------|
| 라이트 | #DCFCE7 | #15803D | #1A7F37 |
| 다크 | #1F3A29 | #7EE8A3 | #3FB950 |

#### Warning (경고 상태)
| 모드 | 배경 | 텍스트 | 아이콘 |
|------|------|--------|--------|
| 라이트 | #FEF3C7 | #A16207 | #9A6700 |
| 다크 | #3B2F1F | #F9D89A | #D29922 |

#### Error (오류 상태)
| 모드 | 배경 | 텍스트 | 아이콘 |
|------|------|--------|--------|
| 라이트 | #FEE2E2 | #B91C1C | #CF222E |
| 다크 | #4A2626 | #FECACA | #F85149 |

#### Info (정보 상태)
| 모드 | 배경 | 텍스트 | 아이콘 |
|------|------|--------|--------|
| 라이트 | #DBEAFE | #1D4ED8 | #0969DA |
| 다크 | #1A2E4A | #BFDBFE | #58A6FF |

### 1.3 Background Colors

#### 라이트 모드
```
Backgrounds
├── bg-primary:   #FFFFFF (메인 배경)
├── bg-secondary: #F6F8FA (패널, 사이드바)
├── bg-tertiary:  #EAEEF2 (코드 블록)
├── bg-elevated:  #FFFFFF (모달, 드롭다운) + shadow
└── bg-overlay:   rgba(0, 0, 0, 0.5) (오버레이)
```

#### 다크 모드
```
Backgrounds
├── bg-primary:   #0D1117 (메인 배경)
├── bg-secondary: #161B22 (패널, 사이드바)
├── bg-tertiary:  #1F2428 (코드 블록)
├── bg-elevated:  #21262D (모달, 드롭다운) + shadow
└── bg-overlay:   rgba(0, 0, 0, 0.7) (오버레이)
```

### 1.4 Text Colors

#### 라이트 모드
```
Text
├── text-primary:    #24292F (본문)
├── text-secondary:  #57606A (보조 텍스트)
├── text-tertiary:   #6E7781 (placeholder)
├── text-disabled:   #8C959F (비활성)
├── text-link:       #0969DA (링크)
└── text-link-hover: #0860CA (링크 hover)
```

#### 다크 모드
```
Text
├── text-primary:    #C9D1D9 (본문)
├── text-secondary:  #8B949E (보조 텍스트)
├── text-tertiary:   #6E7681 (placeholder)
├── text-disabled:   #484F58 (비활성)
├── text-link:       #58A6FF (링크)
└── text-link-hover: #4A9AEF (링크 hover)
```

### 1.5 Border Colors

#### 라이트 모드
```
Borders
├── border-default: #D0D7DE (기본 테두리)
├── border-muted:   #E5E9ED (연한 테두리)
└── border-strong:  #8C959F (강조 테두리)
```

#### 다크 모드
```
Borders
├── border-default: #30363D (기본 테두리)
├── border-muted:   #21262D (연한 테두리)
└── border-strong:  #484F58 (강조 테두리)
```

---

## 2. 타이포그래피 (Typography)

### 2.1 Font Families

```
Font Families
├── font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif
├── font-mono: ui-monospace, "Fira Code", "JetBrains Mono", "Consolas", "Courier New", monospace
└── font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif
```

### 2.2 Font Sizes

| 토큰명 | 크기 (px) | 크기 (rem) | 용도 |
|--------|-----------|------------|------|
| text-xs | 12px | 0.75rem | 캡션, 주석 |
| text-sm | 14px | 0.875rem | 보조 텍스트 |
| text-base | 16px | 1rem | 본문 (기본) |
| text-lg | 18px | 1.125rem | 강조 텍스트 |
| text-xl | 20px | 1.25rem | 소제목 |
| text-2xl | 24px | 1.5rem | 제목 h3 |
| text-3xl | 30px | 1.875rem | 제목 h2 |
| text-4xl | 36px | 2.25rem | 제목 h1 |

### 2.3 Font Weights

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| font-normal | 400 | 본문 |
| font-medium | 500 | 강조 |
| font-semibold | 600 | 제목 |
| font-bold | 700 | 강한 강조 |

### 2.4 Line Heights

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| leading-none | 1 | 타이트한 헤딩 |
| leading-tight | 1.25 | 헤딩 |
| leading-snug | 1.375 | 부제목 |
| leading-normal | 1.5 | 본문 (기본) |
| leading-relaxed | 1.625 | 여유로운 본문 |
| leading-loose | 2 | 코드 블록 |

### 2.5 Letter Spacing

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| tracking-tight | -0.025em | 큰 헤딩 |
| tracking-normal | 0 | 기본 |
| tracking-wide | 0.025em | 대문자 텍스트 |

---

## 3. 스페이싱 (Spacing)

### 3.1 Spacing Scale (4px 단위)

| 토큰명 | 값 (px) | 값 (rem) | 용도 |
|--------|---------|----------|------|
| space-0 | 0 | 0 | 여백 없음 |
| space-1 | 4px | 0.25rem | 최소 간격 |
| space-2 | 8px | 0.5rem | 작은 간격 |
| space-3 | 12px | 0.75rem | 중간 간격 |
| space-4 | 16px | 1rem | 기본 간격 |
| space-5 | 20px | 1.25rem | 여유 간격 |
| space-6 | 24px | 1.5rem | 큰 간격 |
| space-8 | 32px | 2rem | 섹션 간격 |
| space-10 | 40px | 2.5rem | 섹션 여백 |
| space-12 | 48px | 3rem | 큰 섹션 여백 |
| space-16 | 64px | 4rem | 페이지 여백 |

### 3.2 Component-Specific Spacing

| 컴포넌트 | Padding | Margin |
|----------|---------|--------|
| Button (sm) | space-2 space-3 (상하 좌우) | - |
| Button (md) | space-2 space-4 | - |
| Button (lg) | space-3 space-6 | - |
| Input | space-2 space-3 | - |
| Card | space-6 | space-4 (하단) |
| Modal | space-6 | - |
| Header | space-4 space-6 (상하 좌우) | - |
| Sidebar | space-4 | - |

---

## 4. Border Radius

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| rounded-none | 0 | 각진 모서리 |
| rounded-sm | 2px | 작은 요소 (태그) |
| rounded | 4px | 기본 (버튼, 입력) |
| rounded-md | 6px | 카드, 패널 |
| rounded-lg | 8px | 모달, 큰 카드 |
| rounded-xl | 12px | 특별한 강조 |
| rounded-full | 9999px | 원형 (아바타, 배지) |

---

## 5. Shadows

### 5.1 라이트 모드

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| shadow-sm | 0 1px 2px rgba(0, 0, 0, 0.05) | 버튼 hover |
| shadow | 0 1px 3px rgba(0, 0, 0, 0.1) | 카드 |
| shadow-md | 0 4px 6px rgba(0, 0, 0, 0.1) | 드롭다운 |
| shadow-lg | 0 10px 15px rgba(0, 0, 0, 0.1) | 모달 |
| shadow-xl | 0 20px 25px rgba(0, 0, 0, 0.15) | 큰 모달 |
| shadow-2xl | 0 25px 50px rgba(0, 0, 0, 0.25) | 최상위 레이어 |

### 5.2 다크 모드

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| shadow-sm | 0 1px 2px rgba(0, 0, 0, 0.5) | 버튼 hover |
| shadow | 0 1px 3px rgba(0, 0, 0, 0.6) | 카드 |
| shadow-md | 0 4px 6px rgba(0, 0, 0, 0.6) | 드롭다운 |
| shadow-lg | 0 10px 15px rgba(0, 0, 0, 0.7) | 모달 |
| shadow-xl | 0 20px 25px rgba(0, 0, 0, 0.8) | 큰 모달 |
| shadow-2xl | 0 25px 50px rgba(0, 0, 0, 0.9) | 최상위 레이어 |

---

## 6. Z-Index Layers

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| z-base | 0 | 기본 레이어 |
| z-dropdown | 1000 | 드롭다운 |
| z-sticky | 1020 | 고정 헤더 |
| z-fixed | 1030 | 고정 요소 |
| z-modal-backdrop | 1040 | 모달 배경 |
| z-modal | 1050 | 모달 |
| z-popover | 1060 | 팝오버 |
| z-tooltip | 1070 | 툴팁 |

---

## 7. Transitions & Animations

### 7.1 Duration

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| duration-fast | 100ms | 즉각 반응 (hover) |
| duration-normal | 150ms | 기본 트랜지션 |
| duration-slow | 200ms | 부드러운 전환 |
| duration-slower | 300ms | 느린 전환 (테마) |

### 7.2 Easing

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| ease-linear | linear | 일정한 속도 |
| ease-in | cubic-bezier(0.4, 0, 1, 1) | 가속 |
| ease-out | cubic-bezier(0, 0, 0.2, 1) | 감속 (기본) |
| ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | 가속 후 감속 |

---

## 8. Breakpoints (반응형)

| 토큰명 | 값 | 타겟 디바이스 |
|--------|-----|---------------|
| sm | 640px | 작은 모바일 |
| md | 768px | 태블릿 (세로) |
| lg | 1024px | 태블릿 (가로), 작은 데스크톱 |
| xl | 1280px | 데스크톱 |
| 2xl | 1536px | 큰 데스크톱 |

### Breakpoint 사용 전략

| 화면 크기 | 레이아웃 |
|-----------|----------|
| < 768px (md) | 모바일: 탭 전환 (에디터 ↔ 프리뷰) |
| 768px ~ 1023px | 태블릿: 좌우 분할, TOC 숨김 |
| ≥ 1024px (lg) | 데스크톱: 3단 구조 (TOC + 에디터 + 프리뷰) |

---

## 9. 아이콘 크기

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| icon-xs | 12px | 인라인 아이콘 |
| icon-sm | 16px | 작은 버튼 |
| icon-base | 20px | 기본 아이콘 |
| icon-lg | 24px | 헤더 아이콘 |
| icon-xl | 32px | 큰 강조 아이콘 |

---

## 10. Focus Ring (접근성)

### 라이트 모드
```css
outline: 2px solid #0969DA;
outline-offset: 2px;
```

### 다크 모드
```css
outline: 2px solid #58A6FF;
outline-offset: 2px;
```

---

## 11. Opacity Levels

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| opacity-0 | 0 | 숨김 |
| opacity-25 | 0.25 | 희미함 |
| opacity-50 | 0.5 | 반투명 |
| opacity-75 | 0.75 | 약간 투명 |
| opacity-100 | 1 | 불투명 (기본) |

---

## 수락 기준 체크리스트

- [x] 색상 팔레트 정의 (Primary, Secondary, Semantic, Background, Text)
- [x] 라이트/다크 모드 색상 매핑
- [x] 타이포그래피 스케일 정의 (h1-h6, body, code)
- [x] 스페이싱 시스템 정의 (4px 단위)
- [x] Border radius, Shadow 토큰 정의
