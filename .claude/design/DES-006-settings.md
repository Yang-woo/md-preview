# UI 설계: 설정 패널

> TODO: DES-006

## Figma 참조
| 컴포넌트 | Figma Node ID | 설명 |
|----------|---------------|------|
| Settings Modal (Light) | `4:40` | DES-006 Settings Modal (480x500) |
| Settings Modal (Dark) | `4:103` | DES-006 Settings Modal Dark (480x500) |

## 1. 와이어프레임

```
┌───────────────────────────────────┐
│  ⚙️ 설정                    [X]   │
├───────────────────────────────────┤
│                                   │
│  테마                             │
│  ○ 라이트  ○ 다크  ● 시스템       │
│                                   │
│  스타일 프리셋                    │
│  [GitHub ▼]                       │
│                                   │
│  폰트 크기                        │
│  [────●────] 16px                 │
│                                   │
│  에디터 설정                      │
│  ☑ 라인 넘버 표시                │
│  ☑ 자동 저장                     │
│                                   │
│  [초기화]          [저장]        │
└───────────────────────────────────┘
```

## 2. 컴포넌트

### SettingsModal
```tsx
<Modal open={isOpen} onClose={onClose}>
  <div className="p-6 space-y-6">
    <ThemeSelector />
    <StylePresetSelector />
    <FontSizeSlider />
    <EditorOptions />

    <div className="flex gap-2 justify-end">
      <Button variant="ghost" onClick={handleReset}>
        초기화
      </Button>
      <Button onClick={handleSave}>
        저장
      </Button>
    </div>
  </div>
</Modal>
```

## 3. 설정 항목

- [x] 테마 선택 (라이트/다크/시스템)
- [x] 스타일 프리셋 선택
- [x] 폰트 크기 조절 (12-24px)
- [x] 라인 넘버 표시 ON/OFF
- [x] 자동 저장 ON/OFF
