# 디자인 핸드오프: 설정 패널

> TODO: DES-006

## Settings Store

```typescript
interface SettingsStore {
  theme: 'light' | 'dark' | 'system';
  stylePreset: 'github' | 'notion' | 'vscode' | 'minimal';
  fontSize: number;
  showLineNumbers: boolean;
  autoSave: boolean;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setStylePreset: (preset: string) => void;
  setFontSize: (size: number) => void;
  toggleLineNumbers: () => void;
  toggleAutoSave: () => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>(
  persist(
    (set) => ({
      theme: 'system',
      stylePreset: 'github',
      fontSize: 16,
      showLineNumbers: true,
      autoSave: true,

      setTheme: (theme) => set({ theme }),
      setStylePreset: (stylePreset) => set({ stylePreset }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleLineNumbers: () => set((s) => ({ showLineNumbers: !s.showLineNumbers })),
      toggleAutoSave: () => set((s) => ({ autoSave: !s.autoSave })),
      reset: () => set({
        theme: 'system',
        stylePreset: 'github',
        fontSize: 16,
        showLineNumbers: true,
        autoSave: true,
      }),
    }),
    { name: 'md-preview-settings' }
  )
);
```

## Modal 컴포넌트

```tsx
<Dialog.Root open={isOpen} onOpenChange={onClose}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
    <Dialog.Content className="
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      bg-background rounded-lg shadow-xl
      w-[500px] max-w-[90vw] max-h-[85vh]
      z-50 overflow-y-auto
    ">
      {children}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```
