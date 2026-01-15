# Development Tasks

> PRD: Markdown Preview v1.0
> 생성일: 2026-01-15
> 총 태스크: 15개
> 예상 공수: 14일 (3주)

## 태스크 목록

### [DEV-001] 프로젝트 초기화
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 낮음
- **예상 공수**: 0.5일
- **의존성**: 없음
- **담당**: component-builder

**설명**:
Vite + React + TypeScript 프로젝트 설정 및 기본 폴더 구조 생성

**수락 기준**:
- [x] Vite 5 + React 18 + TypeScript 설정
- [x] Tailwind CSS 설정
- [x] ESLint + Prettier 설정
- [x] 폴더 구조 생성 (components, hooks, stores, utils, styles)
- [x] 기본 의존성 설치 (zustand, react-markdown 등)
- [x] 개발 서버 정상 실행

---

### [DEV-002] 에디터 컴포넌트 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 높음
- **예상 공수**: 2일
- **의존성**: DEV-001
- **담당**: tdd-writer → component-builder

**설명**:
CodeMirror 6 기반 마크다운 에디터 구현

**수락 기준**:
- [x] CodeMirror 통합 및 기본 설정
- [x] 마크다운 언어 지원 (@codemirror/lang-markdown)
- [x] 라인 넘버 표시
- [x] 현재 줄 하이라이트
- [x] 에디터 내용 변경 이벤트 처리
- [x] 테마 (라이트/다크) 지원
- [x] 테스트 코드 작성

---

### [DEV-003] 프리뷰 컴포넌트 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-001
- **담당**: tdd-writer → component-builder

**설명**:
react-markdown 기반 마크다운 렌더링 컴포넌트 구현

**수락 기준**:
- [x] react-markdown + remark-gfm 통합
- [x] GFM 지원 (테이블, 체크박스, 취소선)
- [x] 코드 블록 syntax highlighting (rehype-highlight)
- [x] 이미지, 링크 렌더링
- [x] XSS 방지 처리 (react-markdown 기본 제공)
- [x] 테스트 코드 작성

---

### [DEV-004] 스타일 프리셋 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 2일
- **의존성**: DEV-003
- **담당**: component-builder

**설명**:
4가지 스타일 프리셋 (GitHub, Notion, VS Code, 미니멀) 구현

**수락 기준**:
- [x] GitHub 스타일 CSS
- [x] Notion 스타일 CSS
- [x] VS Code 스타일 CSS
- [x] 미니멀 스타일 CSS
- [x] 프리셋 전환 로직
- [x] settingsStore에 프리셋 상태 저장

---

### [DEV-005] 레이아웃 컴포넌트 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-002, DEV-003
- **담당**: component-builder

**설명**:
Header, SplitPane, 반응형 레이아웃 구현

**수락 기준**:
- [x] Header 컴포넌트 (로고, 파일명, 액션 버튼)
- [x] SplitPane 컴포넌트 (드래그 리사이즈)
- [x] 반응형 브레이크포인트 (Desktop/Tablet/Mobile)
- [x] 모바일 탭 전환 UI
- [x] 레이아웃 비율 localStorage 저장

---

### [DEV-006] 파일 핸들러 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-002
- **담당**: tdd-writer → component-builder

**설명**:
파일 드래그 앤 드롭, 파일 선택, 다운로드 기능 구현

**수락 기준**:
- [x] FileDropZone 컴포넌트 (드래그 앤 드롭)
- [x] FileInput 컴포넌트 (파일 선택)
- [x] .md 파일 필터링
- [x] 파일 내용 읽기 및 에디터 로드
- [x] 다운로드 기능 (.md 파일)
- [x] 대용량 파일 경고 (5MB 이상)
- [x] 테스트 코드 작성

---

### [DEV-007] 상태 관리 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 0.5일
- **의존성**: DEV-001
- **담당**: component-builder

**설명**:
Zustand 스토어 설정 (editor, settings, ui)

**수락 기준**:
- [x] editorStore (content, fileName, isDirty)
- [x] settingsStore (theme, preset, fontSize)
- [x] uiStore (sidebarOpen, modalOpen)
- [x] localStorage persist 미들웨어
- [x] 테스트 코드 작성

---

### [DEV-008] TOC 사이드바 구현
- **상태**: 대기
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-003
- **담당**: tdd-writer → component-builder

**설명**:
목차(Table of Contents) 추출 및 사이드바 구현

**수락 기준**:
- [ ] useTOC 훅 (헤딩 추출 로직)
- [ ] TableOfContents 컴포넌트
- [ ] 헤딩 계층 구조 표시 (h1-h6)
- [ ] 클릭 시 스크롤 이동
- [ ] 현재 위치 하이라이트 (Intersection Observer)
- [ ] 테스트 코드 작성

---

### [DEV-009] 툴바 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-002
- **담당**: component-builder

**설명**:
에디터 서식 툴바 버튼 구현

**수락 기준**:
- [x] Bold, Italic, Strikethrough 버튼
- [x] 헤딩 (H1-H3) 버튼
- [x] 링크, 이미지 삽입 버튼
- [x] 코드 블록, 인라인 코드 버튼
- [x] 리스트 (순서/비순서) 버튼
- [x] 체크박스 버튼
- [x] 툴팁 표시

---

### [DEV-010] 단축키 구현
- **상태**: 대기
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-002, DEV-009
- **담당**: component-builder

**설명**:
키보드 단축키 지원 구현

**수락 기준**:
- [ ] useKeyboardShortcuts 훅
- [ ] Ctrl/Cmd + B (Bold)
- [ ] Ctrl/Cmd + I (Italic)
- [ ] Ctrl/Cmd + K (링크)
- [ ] Ctrl/Cmd + S (다운로드)
- [ ] Ctrl/Cmd + Shift + P (프리뷰 토글)
- [ ] 단축키 도움말 표시

---

### [DEV-011] 자동 저장 구현
- **상태**: 대기
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-007
- **담당**: tdd-writer → component-builder

**설명**:
브라우저 localStorage 자동 저장 기능 구현

**수락 기준**:
- [ ] useAutoSave 훅
- [ ] 30초 간격 자동 저장
- [ ] 페이지 종료 전 저장 (beforeunload)
- [ ] 복구 프롬프트 (이전 세션 복구)
- [ ] 저장 상태 표시
- [ ] 테스트 코드 작성

---

### [DEV-012] 설정 패널 구현
- **상태**: 대기
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 0.5일
- **의존성**: DEV-004, DEV-007
- **담당**: component-builder

**설명**:
설정 모달 (테마, 프리셋, 폰트 크기) 구현

**수락 기준**:
- [ ] SettingsModal 컴포넌트
- [ ] 테마 선택 (라이트/다크/시스템)
- [ ] 스타일 프리셋 선택
- [ ] 폰트 크기 조절
- [ ] 설정 저장 및 적용

---

### [DEV-013] 테마 시스템 구현
- **상태**: 완료 ✅
- **우선순위**: P0
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-001
- **담당**: component-builder

**설명**:
라이트/다크/시스템 테마 전환 구현

**수락 기준**:
- [x] useTheme 훅
- [x] CSS 변수 기반 테마
- [x] 시스템 설정 감지 (prefers-color-scheme)
- [x] 테마 전환 애니메이션
- [x] localStorage 저장

---

### [DEV-014] PWA 설정
- **상태**: 대기
- **우선순위**: P1
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-005
- **담당**: component-builder

**설명**:
PWA 설정 및 오프라인 지원

**수락 기준**:
- [ ] vite-plugin-pwa 설정
- [ ] Service Worker 등록
- [ ] 오프라인 캐싱 전략
- [ ] 설치 프롬프트
- [ ] 앱 아이콘 및 manifest.json

---

### [DEV-015] 성능 최적화 및 접근성
- **상태**: 대기
- **우선순위**: P1
- **복잡도**: 중간
- **예상 공수**: 1일
- **의존성**: DEV-002, DEV-003, DEV-005
- **담당**: refactorer → qa-validator

**설명**:
성능 최적화 및 WCAG 2.1 AA 접근성 준수

**수락 기준**:
- [ ] React.memo, useMemo 적용
- [ ] 대용량 파일 가상화 (필요 시)
- [ ] Lighthouse 성능 점수 90+
- [ ] 키보드 네비게이션 지원
- [ ] aria-label, role 속성 추가
- [ ] 색상 대비 WCAG AA 준수
- [ ] 스크린 리더 테스트

---

## 진행 현황

| 상태 | 개수 |
|------|------|
| 대기 | 6 |
| 진행 중 | 0 |
| 완료 | 9 |
| **총계** | **15** |

## 의존성 그래프

```
DEV-001 (초기화)
    ├── DEV-002 (에디터)
    │       ├── DEV-005 (레이아웃)
    │       ├── DEV-006 (파일)
    │       ├── DEV-009 (툴바)
    │       │       └── DEV-010 (단축키)
    │       └── DEV-015 (최적화)
    ├── DEV-003 (프리뷰)
    │       ├── DEV-004 (스타일)
    │       │       └── DEV-012 (설정)
    │       ├── DEV-005 (레이아웃)
    │       │       └── DEV-014 (PWA)
    │       ├── DEV-008 (TOC)
    │       └── DEV-015 (최적화)
    ├── DEV-007 (상태관리)
    │       ├── DEV-011 (자동저장)
    │       └── DEV-012 (설정)
    └── DEV-013 (테마)
```

## 개발 일정

### Week 1: 핵심 기능
| 태스크 | 예상 |
|--------|------|
| DEV-001 프로젝트 초기화 | 0.5일 |
| DEV-002 에디터 컴포넌트 | 2일 |
| DEV-003 프리뷰 컴포넌트 | 1일 |
| DEV-007 상태 관리 | 0.5일 |
| DEV-005 레이아웃 | 1일 |

### Week 2: 차별화 기능
| 태스크 | 예상 |
|--------|------|
| DEV-004 스타일 프리셋 | 2일 |
| DEV-008 TOC 사이드바 | 1일 |
| DEV-009 툴바 | 1일 |
| DEV-006 파일 핸들러 | 1일 |

### Week 3: 완성
| 태스크 | 예상 |
|--------|------|
| DEV-010 단축키 | 1일 |
| DEV-011 자동 저장 | 1일 |
| DEV-012 설정 패널 | 0.5일 |
| DEV-013 테마 시스템 | 1일 |
| DEV-014 PWA 설정 | 1일 |
| DEV-015 최적화/접근성 | 1일 |
