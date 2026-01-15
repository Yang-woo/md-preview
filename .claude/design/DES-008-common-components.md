# UI 설계: 공통 컴포넌트

> TODO: DES-008

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
