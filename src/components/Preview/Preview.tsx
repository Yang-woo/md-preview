import { memo, useEffect, useMemo, isValidElement, type ReactNode } from 'react'
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

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: { startOnLoad: boolean; securityLevel: 'strict' | 'loose' }) => void
      run: (options?: { querySelector?: string }) => Promise<void>
    }
    __mermaidScriptLoadingPromise?: Promise<void>
  }
}

const MERMAID_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'

const loadMermaidScript = async (): Promise<void> => {
  if (window.mermaid) {
    return
  }

  if (!window.__mermaidScriptLoadingPromise) {
    window.__mermaidScriptLoadingPromise = new Promise<void>((resolve, reject) => {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${MERMAID_SCRIPT_SRC}"]`)

      const handleLoad = () => resolve()
      const handleError = () => reject(new Error('Failed to load Mermaid script'))

      if (!script) {
        script = document.createElement('script')
        script.src = MERMAID_SCRIPT_SRC
        script.async = true
        script.addEventListener('load', handleLoad, { once: true })
        script.addEventListener('error', handleError, { once: true })
        document.body.appendChild(script)
        return
      }

      if (window.mermaid) {
        resolve()
        return
      }

      script.addEventListener('load', handleLoad, { once: true })
      script.addEventListener('error', handleError, { once: true })
    })
  }

  await window.__mermaidScriptLoadingPromise
}

export const Preview = memo(function Preview({ content, className = '' }: PreviewProps) {
  const { stylePreset } = useSettingsStore()

  useEffect(() => {
    if (!content.includes('```mermaid')) {
      return
    }

    let cancelled = false

    const runMermaid = async () => {
      try {
        await loadMermaidScript()
        if (!window.mermaid || cancelled) {
          return
        }

        window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
        await window.mermaid.run({ querySelector: '.preview-content .mermaid' })
      } catch {
        // Ignore rendering errors and keep raw mermaid source visible.
      }
    }

    void runMermaid()

    return () => {
      cancelled = true
    }
  }, [content])

  const components = useMemo(
    () => ({
      input: (props: any) => {
        if (props.type === 'checkbox') {
          return <input {...props} readOnly />
        }
        return <input {...props} />
      },
      a: ({ node, ...props }: any) => <a {...props} target="_blank" rel="noopener noreferrer" />,
      pre: ({ node, children, ...props }: any) => {
        const child = Array.isArray(children) ? children[0] : children

        if (isValidElement(child)) {
          const childProps = child.props as { className?: string; children?: ReactNode }
          if (childProps.className?.includes('language-mermaid')) {
            const diagram = String(childProps.children ?? '').replace(/\n$/, '')
            return <div className="mermaid">{diagram}</div>
          }
        }

        return <pre {...props}>{children}</pre>
      },
      code: ({ node, className: codeClassName, children, ...props }: any) => (
        <code className={codeClassName} {...props}>
          {children}
        </code>
      ),
      h1: ({ node, children, ...props }: any) => {
        const text = String(children)
        return (
          <h1 id={generateHeadingId(text)} {...props}>
            {children}
          </h1>
        )
      },
      h2: ({ node, children, ...props }: any) => {
        const text = String(children)
        return (
          <h2 id={generateHeadingId(text)} {...props}>
            {children}
          </h2>
        )
      },
      h3: ({ node, children, ...props }: any) => {
        const text = String(children)
        return (
          <h3 id={generateHeadingId(text)} {...props}>
            {children}
          </h3>
        )
      },
      h4: ({ node, children, ...props }: any) => {
        const text = String(children)
        return (
          <h4 id={generateHeadingId(text)} {...props}>
            {children}
          </h4>
        )
      },
      h5: ({ node, children, ...props }: any) => {
        const text = String(children)
        return (
          <h5 id={generateHeadingId(text)} {...props}>
            {children}
          </h5>
        )
      },
      h6: ({ node, children, ...props }: any) => {
        const text = String(children)
        return (
          <h6 id={generateHeadingId(text)} {...props}>
            {children}
          </h6>
        )
      },
    }),
    []
  )

  return (
    <div className={`preset-${stylePreset} ${className}`} role="article" aria-label="Markdown Preview">
      <div className="preview-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
})
