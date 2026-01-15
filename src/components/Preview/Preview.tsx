import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useSettingsStore } from '../../stores'
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

export function Preview({ content, className = '' }: PreviewProps) {
  const { stylePreset } = useSettingsStore()

  return (
    <div className={`preset-${stylePreset} ${className}`}>
      <div className="preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // 체크박스를 인터랙티브하게 하지 않음 (읽기 전용)
            input: (props) => {
              if (props.type === 'checkbox') {
                return <input {...props} readOnly />
              }
              return <input {...props} />
            },
            // 링크를 새 탭에서 열기
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
