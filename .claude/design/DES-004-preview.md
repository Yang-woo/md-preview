# UI 설계: 프리뷰 영역

> TODO: DES-004
> 작성일: 2026-01-15

## Figma 참조
| 컴포넌트 | Figma Node ID | 설명 |
|----------|---------------|------|
| Preview - GitHub | `4:38` | DES-004 Preview Component (800x600) |
| Preview - Notion | `4:87` | DES-004 Preview - Notion Style (800x600) |
| Preview - VS Code | `4:88` | DES-004 Preview - VS Code Style (800x600) |
| Preview - Minimal | `4:89` | DES-004 Preview - Minimal Style (800x600) |
| Preview (Dark) | `4:101` | DES-004 Preview Dark (800x600) |
| Empty State | `4:117` | Empty State - Preview (800x500) |

## 1. 와이어프레임

### 프리뷰 영역 (4가지 스타일 프리셋)

#### GitHub 스타일
```
┌─────────────────────────────────────────┐
│  PreviewPane (GitHub Style)             │
├─────────────────────────────────────────┤
│                                         │
│  # Markdown Preview                     │
│  ══════════════════════════════════════  │
│                                         │
│  실시간으로 마크다운 문서를 작성하고      │
│  프리뷰할 수 있습니다.                   │
│                                         │
│  ## 주요 기능                           │
│                                         │
│  • 실시간 프리뷰                        │
│  • GFM 지원                            │
│  • 코드 하이라이팅                      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ const hello = "world";          │    │
│  │ console.log(hello);             │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

#### Notion 스타일
```
┌─────────────────────────────────────────┐
│  # Markdown Preview                     │
│                                         │
│  실시간으로 마크다운 문서를 작성하고      │
│  프리뷰할 수 있습니다.                   │
│                                         │
│  ## 주요 기능                           │
│                                         │
│  • 실시간 프리뷰                        │
│  • GFM 지원                            │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  const hello = "world";           │  │
│  │  console.log(hello);              │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 2. 컴포넌트 계층

```
PreviewPane
├── StyleSelector (설정에서 선택)
└── Preview
    ├── PreviewContent (react-markdown)
    │   ├── Heading (h1-h6)
    │   ├── Paragraph
    │   ├── List (ol, ul)
    │   ├── CodeBlock
    │   ├── InlineCode
    │   ├── Link
    │   ├── Image
    │   ├── Blockquote
    │   ├── Table
    │   └── TaskList (GFM)
    └── ScrollSyncOverlay
```

## 3. 스타일 프리셋

### GitHub 스타일
- Font: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- H1: border-bottom, padding-bottom
- Code block: background #f6f8fa, border-radius 6px
- Link: color #0969DA

### Notion 스타일
- Font: ui-sans-serif, -apple-system
- H1: font-weight 700, font-size 1.875em
- Code block: background rgba(135,131,120,0.15)
- 여백: 넓은 line-height

### VS Code 스타일
- Font: Consolas, Monaco, 'Courier New'
- Dark background 기본
- Code block: background #1e1e1e
- Syntax highlighting 강조

### 미니멀 스타일
- Font: Georgia, serif
- 여백 많음
- 최소한의 색상
- Code block: border 1px solid

## 4. 구현 우선순위

### P0
- [x] 4가지 스타일 프리셋 CSS
- [x] react-markdown 통합
- [x] GFM 지원 (테이블, 체크박스)
- [x] 코드 syntax highlighting

### P1
- [ ] 스크롤 동기화
- [ ] 이미지 lazy loading
- [ ] 테이블 반응형
