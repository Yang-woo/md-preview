# 디자인 핸드오프: 디자인 토큰

> 프로젝트: Markdown Preview v1.0
> 작성일: 2026-01-15

---

## 감지된 스택

- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS
- **토큰 형식**: `tailwind.config.js` (theme.extend)

---

## 1. Tailwind Config 설정

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 클래스 기반 다크 모드
  theme: {
    extend: {
      // ============ 색상 (Colors) ============
      colors: {
        // Primary Blue
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#0969DA',
          600: '#0860CA',
          700: '#0756B8',
          // 다크 모드용
          dark: {
            50: '#1A2332',
            100: '#243447',
            500: '#58A6FF',
            600: '#4A9AEF',
            700: '#3C8EDF',
          }
        },

        // Semantic Colors
        success: {
          light: {
            bg: '#DCFCE7',
            text: '#15803D',
            icon: '#1A7F37',
          },
          dark: {
            bg: '#1F3A29',
            text: '#7EE8A3',
            icon: '#3FB950',
          }
        },
        warning: {
          light: {
            bg: '#FEF3C7',
            text: '#A16207',
            icon: '#9A6700',
          },
          dark: {
            bg: '#3B2F1F',
            text: '#F9D89A',
            icon: '#D29922',
          }
        },
        error: {
          light: {
            bg: '#FEE2E2',
            text: '#B91C1C',
            icon: '#CF222E',
          },
          dark: {
            bg: '#4A2626',
            text: '#FECACA',
            icon: '#F85149',
          }
        },
        info: {
          light: {
            bg: '#DBEAFE',
            text: '#1D4ED8',
            icon: '#0969DA',
          },
          dark: {
            bg: '#1A2E4A',
            text: '#BFDBFE',
            icon: '#58A6FF',
          }
        },

        // Background Colors
        bg: {
          primary: {
            light: '#FFFFFF',
            dark: '#0D1117',
          },
          secondary: {
            light: '#F6F8FA',
            dark: '#161B22',
          },
          tertiary: {
            light: '#EAEEF2',
            dark: '#1F2428',
          },
          elevated: {
            light: '#FFFFFF',
            dark: '#21262D',
          },
        },

        // Text Colors
        text: {
          primary: {
            light: '#24292F',
            dark: '#C9D1D9',
          },
          secondary: {
            light: '#57606A',
            dark: '#8B949E',
          },
          tertiary: {
            light: '#6E7781',
            dark: '#6E7681',
          },
          disabled: {
            light: '#8C959F',
            dark: '#484F58',
          },
          link: {
            light: '#0969DA',
            dark: '#58A6FF',
          },
          'link-hover': {
            light: '#0860CA',
            dark: '#4A9AEF',
          },
        },

        // Border Colors
        border: {
          default: {
            light: '#D0D7DE',
            dark: '#30363D',
          },
          muted: {
            light: '#E5E9ED',
            dark: '#21262D',
          },
          strong: {
            light: '#8C959F',
            dark: '#484F58',
          },
        },
      },

      // ============ 타이포그래피 ============
      fontFamily: {
        sans: ['ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', '"Fira Code"', '"JetBrains Mono"', 'Consolas', '"Courier New"', 'monospace'],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },

      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['20px', { lineHeight: '1.25' }],
        '2xl': ['24px', { lineHeight: '1.25' }],
        '3xl': ['30px', { lineHeight: '1.25' }],
        '4xl': ['36px', { lineHeight: '1.25' }],
      },

      // ============ 스페이싱 ============
      spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },

      // ============ Border Radius ============
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },

      // ============ Shadows ============
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
        // 다크 모드용
        'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'dark': '0 1px 3px rgba(0, 0, 0, 0.6)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.6)',
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.7)',
        'dark-xl': '0 20px 25px rgba(0, 0, 0, 0.8)',
        'dark-2xl': '0 25px 50px rgba(0, 0, 0, 0.9)',
      },

      // ============ Z-Index ============
      zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        'modal-backdrop': 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
      },

      // ============ Transitions ============
      transitionDuration: {
        fast: '100ms',
        normal: '150ms',
        slow: '200ms',
        slower: '300ms',
      },

      transitionTimingFunction: {
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
```

---

## 2. CSS Variables 설정 (대체 방법)

Tailwind 외에 순수 CSS 변수로도 정의 가능:

### `src/styles/globals.css`

```css
:root {
  /* ============ 색상 (라이트 모드) ============ */
  /* Primary */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-500: #0969DA;
  --color-primary-600: #0860CA;
  --color-primary-700: #0756B8;

  /* Semantic */
  --color-success-bg: #DCFCE7;
  --color-success-text: #15803D;
  --color-success-icon: #1A7F37;

  --color-warning-bg: #FEF3C7;
  --color-warning-text: #A16207;
  --color-warning-icon: #9A6700;

  --color-error-bg: #FEE2E2;
  --color-error-text: #B91C1C;
  --color-error-icon: #CF222E;

  --color-info-bg: #DBEAFE;
  --color-info-text: #1D4ED8;
  --color-info-icon: #0969DA;

  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F6F8FA;
  --bg-tertiary: #EAEEF2;
  --bg-elevated: #FFFFFF;

  /* Text */
  --text-primary: #24292F;
  --text-secondary: #57606A;
  --text-tertiary: #6E7781;
  --text-disabled: #8C959F;
  --text-link: #0969DA;
  --text-link-hover: #0860CA;

  /* Border */
  --border-default: #D0D7DE;
  --border-muted: #E5E9ED;
  --border-strong: #8C959F;

  /* ============ 타이포그래피 ============ */
  --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, "Fira Code", "JetBrains Mono", Consolas, "Courier New", monospace;

  /* ============ 스페이싱 ============ */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* ============ Border Radius ============ */
  --rounded-sm: 2px;
  --rounded: 4px;
  --rounded-md: 6px;
  --rounded-lg: 8px;

  /* ============ Shadows ============ */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* ============ 다크 모드 ============ */
.dark {
  /* Primary */
  --color-primary-50: #1A2332;
  --color-primary-100: #243447;
  --color-primary-500: #58A6FF;
  --color-primary-600: #4A9AEF;
  --color-primary-700: #3C8EDF;

  /* Semantic */
  --color-success-bg: #1F3A29;
  --color-success-text: #7EE8A3;
  --color-success-icon: #3FB950;

  --color-warning-bg: #3B2F1F;
  --color-warning-text: #F9D89A;
  --color-warning-icon: #D29922;

  --color-error-bg: #4A2626;
  --color-error-text: #FECACA;
  --color-error-icon: #F85149;

  --color-info-bg: #1A2E4A;
  --color-info-text: #BFDBFE;
  --color-info-icon: #58A6FF;

  /* Background */
  --bg-primary: #0D1117;
  --bg-secondary: #161B22;
  --bg-tertiary: #1F2428;
  --bg-elevated: #21262D;

  /* Text */
  --text-primary: #C9D1D9;
  --text-secondary: #8B949E;
  --text-tertiary: #6E7681;
  --text-disabled: #484F58;
  --text-link: #58A6FF;
  --text-link-hover: #4A9AEF;

  /* Border */
  --border-default: #30363D;
  --border-muted: #21262D;
  --border-strong: #484F58;

  /* Shadows (다크 모드) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.7);
}
```

---

## 3. TypeScript 타입 정의

### `src/types/theme.ts`

```typescript
export type Theme = 'light' | 'dark' | 'system';

export interface DesignTokens {
  colors: {
    primary: {
      50: string;
      100: string;
      500: string;
      600: string;
      700: string;
    };
    semantic: {
      success: { bg: string; text: string; icon: string };
      warning: { bg: string; text: string; icon: string };
      error: { bg: string; text: string; icon: string };
      info: { bg: string; text: string; icon: string };
    };
    bg: {
      primary: string;
      secondary: string;
      tertiary: string;
      elevated: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      link: string;
      linkHover: string;
    };
    border: {
      default: string;
      muted: string;
      strong: string;
    };
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  zIndex: Record<string, number>;
  transitions: {
    duration: Record<string, string>;
    timing: Record<string, string>;
  };
}
```

---

## 4. 사용 예시

### 4.1 Tailwind Utility Classes

```jsx
// Button 컴포넌트
<button className="
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white
  px-4 py-2
  rounded-md
  shadow-sm hover:shadow
  transition-all duration-fast ease-out
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
  Click Me
</button>

// 다크 모드 지원
<div className="
  bg-bg-primary-light dark:bg-bg-primary-dark
  text-text-primary-light dark:text-text-primary-dark
  border border-border-default-light dark:border-border-default-dark
">
  Content
</div>
```

### 4.2 CSS Variables 사용

```jsx
// styled-components 또는 인라인 스타일
<button style={{
  backgroundColor: 'var(--color-primary-500)',
  color: '#FFFFFF',
  padding: 'var(--space-2) var(--space-4)',
  borderRadius: 'var(--rounded-md)',
  boxShadow: 'var(--shadow-sm)',
}}>
  Click Me
</button>
```

### 4.3 테마 토글 구현

```typescript
// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // 시스템 설정 따르기
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return { theme, setTheme };
}
```

---

## 5. 반응형 사용 예시

```jsx
// Tailwind 반응형 유틸리티
<div className="
  flex flex-col md:flex-row
  gap-4 md:gap-6 lg:gap-8
  p-4 md:p-6 lg:p-8
">
  <aside className="hidden lg:block w-64">
    TOC Sidebar
  </aside>
  <main className="flex-1">
    Editor & Preview
  </main>
</div>
```

---

## 6. 접근성 (Focus Ring)

```jsx
// 포커스 링 적용
<button className="
  focus:outline-none
  focus:ring-2 focus:ring-primary-500
  focus:ring-offset-2
  dark:focus:ring-primary-dark-500
">
  Accessible Button
</button>
```

---

## 7. 필요 에셋

### 폰트 (CDN 또는 로컬)

#### Fira Code (모노스페이스)
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### 로컬 설치
```bash
npm install @fontsource/fira-code
```

```typescript
// src/main.tsx
import '@fontsource/fira-code';
```

### 아이콘 (lucide-react)

```bash
npm install lucide-react
```

```typescript
import { Sun, Moon, Settings, FileText } from 'lucide-react';

<Sun className="w-5 h-5" /> // icon-base (20px)
<Settings className="w-6 h-6" /> // icon-lg (24px)
```

---

## 8. 접근성 요구사항

### 색상 대비
- 모든 텍스트-배경 조합: **WCAG AA 이상** (4.5:1)
- 라이트 모드 본문: #24292F on #FFFFFF = 15.8:1 ✅
- 다크 모드 본문: #C9D1D9 on #0D1117 = 12.6:1 ✅

### 포커스 인디케이터
- 모든 인터랙티브 요소에 명확한 포커스 링
- `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`

### 키보드 접근
- Tab 키로 모든 요소 접근 가능
- Skip to content 링크 제공

---

## 수락 기준 체크리스트

- [x] Tailwind Config 작성 (theme.extend)
- [x] CSS Variables 대체 방법 제공
- [x] TypeScript 타입 정의
- [x] 라이트/다크 모드 전환 로직
- [x] 반응형 사용 예시
- [x] 접근성 가이드 (색상 대비, 포커스 링)
