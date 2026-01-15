# 디자인 핸드오프: 프리뷰 영역

> TODO: DES-004

## 1. react-markdown 설정

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  className={`preview-${stylePreset}`}
>
  {content}
</ReactMarkdown>
```

## 2. 스타일 프리셋 CSS

### GitHub
```css
.preview-github {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial;
  line-height: 1.6;
  color: #24292f;
  padding: 24px;
}

.preview-github h1 {
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin-bottom: 16px;
}

.preview-github code {
  background: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 85%;
}

.preview-github pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}
```

## 3. 필요 라이브러리

```json
{
  "dependencies": {
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "highlight.js": "^11.9.0"
  }
}
```

## 4. 컴포넌트 파일

```
src/
└── components/
    └── Preview/
        ├── Preview.tsx
        ├── PreviewStyles.tsx
        └── styles/
            ├── github.css
            ├── notion.css
            ├── vscode.css
            └── minimal.css
```
