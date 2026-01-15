# 디자인 핸드오프: 파일 핸들링

> TODO: DES-007

## useFileHandler Hook

```typescript
export function useFileHandler() {
  const { setContent, setFileName } = useEditorStore();

  const handleFileOpen = async (file: File) => {
    if (!file.name.endsWith('.md')) {
      alert('.md 파일만 지원합니다.');
      return;
    }

    const content = await file.text();
    setContent(content);
    setFileName(file.name);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) await handleFileOpen(file);
  };

  const handleDownload = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { handleDrop, handleDownload, handleFileOpen };
}
```

## 파일 입력 버튼

```tsx
<input
  type="file"
  accept=".md"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleFileOpen(file);
  }}
  className="hidden"
  id="file-input"
/>
<label htmlFor="file-input">
  <Button as="span">파일 열기</Button>
</label>
```
