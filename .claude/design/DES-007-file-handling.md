# UI 설계: 파일 핸들링 UI

> TODO: DES-007

## Figma 참조
| 컴포넌트 | Figma Node ID | 설명 |
|----------|---------------|------|
| File Drop Zone (Light) | `4:41` | DES-007 File Drop Zone (600x400) |
| File Drop Zone (Dark) | `4:104` | DES-007 File Drop Zone Dark (600x400) |

## 1. 드래그 앤 드롭 오버레이

```
┌─────────────────────────────────────┐
│                                     │
│         📄                          │
│                                     │
│    파일을 여기에 드롭하세요          │
│                                     │
│    .md 파일만 지원합니다            │
│                                     │
└─────────────────────────────────────┘
```

## 2. 컴포넌트

### FileDropZone
```tsx
<div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className={cn(
    "fixed inset-0 z-50",
    "bg-primary/10 backdrop-blur-sm",
    "flex items-center justify-center",
    isDragging ? "block" : "hidden"
  )}
>
  <div className="text-center">
    <FileIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
    <p className="text-xl font-semibold">파일을 여기에 드롭하세요</p>
    <p className="text-sm text-text-secondary">.md 파일만 지원합니다</p>
  </div>
</div>
```

### 파일명 표시 + 미저장 표시
```tsx
<div className="flex items-center gap-2">
  <FileIcon className="w-4 h-4" />
  <span className="text-sm font-medium">{fileName}</span>
  {isDirty && <div className="w-2 h-2 rounded-full bg-warning" />}
</div>
```

## 3. 기능

- [x] 드래그 오버 상태 오버레이
- [x] 파일 선택 버튼
- [x] 다운로드 버튼
- [x] 현재 파일명 표시
- [x] 미저장 변경사항 표시 (dot indicator)
