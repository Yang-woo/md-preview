# 디자인 핸드오프: TOC 사이드바

> TODO: DES-005

## useTOC Hook

```typescript
interface Heading {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export function useTOC(content: string): Heading[] {
  return useMemo(() => {
    const headings: Heading[] = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length as 1 | 2 | 3 | 4 | 5 | 6;
        const text = match[2];
        const id = text.toLowerCase().replace(/\s+/g, '-');
        headings.push({ id, text, level });
      }
    });

    return headings;
  }, [content]);
}
```

## Intersection Observer로 현재 위치 추적

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    },
    { rootMargin: '-80px 0px -80% 0px' }
  );

  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}, []);
```
