# 디자인 핸드오프: 공통 컴포넌트

> TODO: DES-008

## Button 컴포넌트

```tsx
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        // Base
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors duration-150',
        'focus-visible:ring-2 ring-primary ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Variants
        {
          'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
          'bg-bg-secondary text-text-primary hover:bg-bg-tertiary': variant === 'secondary',
          'hover:bg-bg-secondary': variant === 'ghost',
          'hover:bg-bg-secondary': variant === 'icon',
        },

        // Sizes
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },

        // Icon variant size override
        variant === 'icon' && {
          'h-8 w-8 p-0': size === 'sm',
          'h-10 w-10 p-0': size === 'md',
          'h-12 w-12 p-0': size === 'lg',
        },

        className
      )}
      {...props}
    />
  );
};
```

## Modal 컴포넌트 (Radix UI 사용)

```bash
npm install @radix-ui/react-dialog
```

```tsx
import * as Dialog from '@radix-ui/react-dialog';

export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;

export const ModalContent = ({ children, ...props }: Dialog.DialogContentProps) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fadeIn" />
    <Dialog.Content
      className="
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        bg-background rounded-lg shadow-xl
        w-[500px] max-w-[90vw] max-h-[85vh]
        z-50 overflow-y-auto
        animate-slideUp
      "
      {...props}
    >
      {children}
    </Dialog.Content>
  </Dialog.Portal>
);
```

## Tooltip (Radix UI)

```bash
npm install @radix-ui/react-tooltip
```

```tsx
import * as Tooltip from '@radix-ui/react-tooltip';

export const TooltipProvider = Tooltip.Provider;
export const TooltipRoot = Tooltip.Root;
export const TooltipTrigger = Tooltip.Trigger;

export const TooltipContent = ({ children, ...props }: Tooltip.TooltipContentProps) => (
  <Tooltip.Portal>
    <Tooltip.Content
      className="
        bg-gray-900 text-white text-sm
        px-3 py-2 rounded
        shadow-lg z-50
        animate-fadeIn
      "
      sideOffset={5}
      {...props}
    >
      {children}
      <Tooltip.Arrow className="fill-gray-900" />
    </Tooltip.Content>
  </Tooltip.Portal>
);
```

## 필요 라이브러리

```json
{
  "dependencies": {
    "lucide-react": "^0.300.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

## cn 유틸

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
