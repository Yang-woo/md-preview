import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useSettingsStore } from '../../stores'
import { generateHeadingId } from '../../utils/headingId'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'
import '../../styles/presets/github.css'
import '../../styles/presets/notion.css'
import '../../styles/presets/vscode.css'
import '../../styles/presets/minimal.css'

export interface PreviewProps {
  content: string
  className?: string
}

export const Preview = memo(function Preview({ content, className = '' }: PreviewProps) {
  const { stylePreset } = useSettingsStore()

  // Memoize components to prevent recreation on every render
  const components = useMemo(() => ({
            // 체크박스를 인터랙티브하게 하지 않음 (읽기 전용)
            input: (props: any) => {
              if (props.type === 'checkbox') {
                return <input {...props} readOnly />
              }
              return <input {...props} />
            },
            // 링크를 새 탭에서 열기
            a: ({ node, ...props }: any) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
            // 헤딩에 ID 추가 (TOC 연동)
            h1: ({ node, children, ...props }: any) => {
              const text = String(children)
              return <h1 id={generateHeadingId(text)} {...props}>{children}</h1>
            },
            h2: ({ node, children, ...props }: any) => {
              const text = String(children)
              return <h2 id={generateHeadingId(text)} {...props}>{children}</h2>
            },
            h3: ({ node, children, ...props }: any) => {
              const text = String(children)
              return <h3 id={generateHeadingId(text)} {...props}>{children}</h3>
            },
            h4: ({ node, children, ...props }: any) => {
              const text = String(children)
              return <h4 id={generateHeadingId(text)} {...props}>{children}</h4>
            },
            h5: ({ node, children, ...props }: any) => {
              const text = String(children)
              return <h5 id={generateHeadingId(text)} {...props}>{children}</h5>
            },
            h6: ({ node, children, ...props }: any) => {
              const text = String(children)
              return <h6 id={generateHeadingId(text)} {...props}>{children}</h6>
            },
  }), [])

  return (
    <div className={`preset-${stylePreset} ${className}`} role="article" aria-label="Markdown Preview">
      <div className="preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
})
