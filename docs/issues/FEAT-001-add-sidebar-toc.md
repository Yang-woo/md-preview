# FEAT-001: 사이드바 TOC(목차) 추가

## 메타 정보
| 항목 | 값 |
|------|-----|
| ID | FEAT-001 |
| 타입 | FEAT |
| 상태 | **RESOLVED** ✅ |
| 생성일 | 2026-01-16 |
| 복잡도 | 6/10 |

## 요구사항

### 사용자 요청
- 사이드바가 없어서 문서 탐색이 불편함
- TOC(목차) 기능 필요
- 파일 탐색기 기능 필요

### 우선순위
1. **TOC (목차)** - 마크다운 헤딩 기반 네비게이션
2. 파일 탐색기 - 추후 검토

## 현재 상태 분석

### 이미 구현된 부분
| 컴포넌트 | 파일 | 상태 |
|----------|------|------|
| TableOfContents | `src/components/TOC/TableOfContents.tsx` | ✅ 구현됨 |
| TOCContainer | `src/components/TOC/TOCContainer.tsx` | ✅ 구현됨 |
| useTOC | `src/hooks/useTOC.ts` | ✅ 구현됨 |
| useActiveHeading | `src/hooks/useActiveHeading.ts` | ✅ 구현됨 |
| sidebarOpen 상태 | `src/stores/uiStore.ts` | ✅ 구현됨 |

### 미구현 부분
- **Layout.tsx에 사이드바 통합 안됨**
- TOC 컴포넌트가 렌더링되지 않음

### 영향 파일
| 파일 | 영향도 | 수정 필요 |
|------|--------|-----------|
| `src/components/Layout/Layout.tsx` | 높음 | ✅ |
| `src/components/Layout/Header.tsx` | 중간 | ✅ (토글 버튼) |
| `src/components/TOC/TOCContainer.tsx` | 낮음 | ❌ |

## 수정 계획

### 1. Layout 구조 변경
```
현재:
┌─────────────────────────────────┐
│            Header               │
├────────────────┬────────────────┤
│    Editor      │    Preview     │
└────────────────┴────────────────┘

변경 후:
┌─────────────────────────────────────┐
│              Header                 │
├────────┬────────────────┬───────────┤
│  TOC   │    Editor      │  Preview  │
│ (접기) │                │           │
└────────┴────────────────┴───────────┘
```

### 2. 구현 순서
1. Layout.tsx에 TOCContainer 통합
2. 사이드바 토글 버튼 추가 (Header)
3. 반응형 처리 (모바일에서 숨김)
4. sidebarOpen 상태 연동

### 3. 수정 방향
```tsx
// Layout.tsx 수정
<main className="flex-1 overflow-hidden flex">
  {/* Sidebar */}
  {!isMobile && sidebarOpen && (
    <aside className="w-64 border-r">
      <TOCContainer content={content} />
    </aside>
  )}

  {/* Main Content */}
  <div className="flex-1">
    <SplitPane ... />
  </div>
</main>
```

## 처리 이력
| 일시 | 액션 | 담당 |
|------|------|------|
| 2026-01-16 | 이슈 생성 | bug-receiver |
| 2026-01-16 | 코드 수정 | dev-orchestrator |
| 2026-01-16 | 테스트 통과 | dev-orchestrator |
| 2026-01-16 | **이슈 해결** | issue-committer |

## 수정 내역
- `src/components/Layout/Layout.tsx` 사이드바 추가
- `src/test/setup.ts` IntersectionObserver mock 추가
