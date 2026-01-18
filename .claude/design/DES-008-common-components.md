# UI 설계: 공통 컴포넌트

> TODO: DES-008

## Figma 참조
| 컴포넌트 | Figma Node ID | 설명 |
|----------|---------------|------|
| Common Components (Light) | `4:42` | DES-008 Common Components (1200x800) |
| Common Components (Dark) | `4:119` | DES-008 Common Components Dark (1200x800) |
| Button States | `4:118` | DES-008 Button States (600x400) |
| Button Primary | `4:59` | Primary Button |
| Button Secondary | `4:60` | Secondary Button |
| Button Ghost | `4:61` | Ghost Button |
| Icon Button | `4:62` | Icon Button |
| Input Default | `4:64` | Input Field |
| Select Dropdown | `4:65` | Dropdown Select |
| Tooltip | `4:67` | Tooltip |
| Welcome Modal | `4:131` | Welcome Modal - 첫 방문자 온보딩 (480x400) |
| Help Modal | `4:132` | Help Modal - 단축키 안내 (480x500) |
| Recovery Prompt | `4:133` | Recovery Prompt - 자동 복구 알림 (400x200) |

## 1. Button 컴포넌트

### Variants
```tsx
// Primary
<Button variant="primary">저장</Button>

// Secondary
<Button variant="secondary">취소</Button>

// Ghost
<Button variant="ghost">더 보기</Button>

// Icon
<Button variant="icon" size="sm">
  <SettingsIcon />
</Button>
```

### Sizes
- `sm`: 32px height
- `md`: 40px height (기본)
- `lg`: 48px height

### States
- default
- hover (배경색 변경)
- active (눌린 상태)
- disabled (opacity 50%)
- focus (ring 표시)

## 2. Modal 컴포넌트

```tsx
<Modal open={isOpen} onClose={onClose}>
  <Modal.Header>
    <Modal.Title>제목</Modal.Title>
    <Modal.Close />
  </Modal.Header>
  <Modal.Body>
    내용
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={onClose}>취소</Button>
    <Button variant="primary" onClick={onSave}>저장</Button>
  </Modal.Footer>
</Modal>
```

## 3. Tooltip 컴포넌트

```tsx
<Tooltip content="설정 열기" side="bottom">
  <Button variant="icon">
    <SettingsIcon />
  </Button>
</Tooltip>
```

## 4. 아이콘 세트 (lucide-react)

- Menu, X
- Sun, Moon
- Settings, Download
- Bold, Italic, Code
- Link, Image
- List, ListOrdered, CheckSquare
- ChevronLeft, ChevronRight, ChevronDown
- File, FileText, Upload

## 구현 우선순위

### P0
- [x] Button (모든 variants, sizes, states)
- [x] Modal (header, body, footer)
- [x] Tooltip
- [x] 아이콘 세트 정의
