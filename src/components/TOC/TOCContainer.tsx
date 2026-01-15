import { useTOC } from '../../hooks/useTOC'
import { useActiveHeading } from '../../hooks/useActiveHeading'
import { TableOfContents } from './TableOfContents'

export interface TOCContainerProps {
  content: string
  className?: string
}

/**
 * TOC 컨테이너 컴포넌트
 * useTOC와 useActiveHeading을 사용해 TOC를 렌더링
 */
export function TOCContainer({ content, className }: TOCContainerProps) {
  const { headings } = useTOC(content)
  const activeId = useActiveHeading(headings.map((h) => h.id))

  return (
    <TableOfContents
      headings={headings}
      activeId={activeId}
      className={className}
    />
  )
}
