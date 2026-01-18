# UI 설계: TOC 사이드바

> TODO: DES-005

## Figma 참조
| 컴포넌트 | Figma Node ID | 설명 |
|----------|---------------|------|
| TOC Sidebar (Light) | `4:39` | DES-005 TOC Sidebar (250x600) |
| TOC Sidebar (Dark) | `4:102` | DES-005 TOC Sidebar Dark (250x600) |
| TOC Overlay (Mobile) | `4:99` | DES-005 TOC Overlay Mobile (320x600) |

## 1. 와이어프레임

```
┌─────────────────────┐
│  TOC Sidebar        │
├─────────────────────┤
│                     │
│  • 목차              │
│                     │
│  • Introduction     │
│    • Getting Started│
│    • Installation   │
│  • Features         │
│    • Editor         │
│    • Preview        │
│  • Configuration    │
│                     │
│  [접기]             │
└─────────────────────┘
```

## 2. 컴포넌트

### TOCItem
```tsx
<button
  className={cn(
    "w-full text-left px-3 py-1.5 rounded text-sm",
    "hover:bg-bg-secondary transition-colors",
    isActive && "bg-primary/10 text-primary font-medium"
  )}
  style={{ paddingLeft: `${level * 12}px` }}
>
  {text}
</button>
```

## 3. 기능

- [x] 헤딩 계층 표시 (h1-h6)
- [x] 현재 위치 하이라이트
- [x] 클릭 시 스크롤
- [x] 접기/펼치기
- [x] 빈 목차 상태
