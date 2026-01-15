# CLAUDE.md

> Claude Code가 이 프로젝트를 이해하기 위한 컨텍스트 문서

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Markdown Preview |
| 버전 | 1.0.0 |
| 설명 | 브라우저에서 마크다운을 실시간 편집하고 프리뷰하는 웹 앱 |
| 타겟 사용자 | 개발자, PM/기획자, 블로거, 학생 |

### 핵심 기능
- CodeMirror 기반 마크다운 에디터
- 실시간 마크다운 프리뷰 (react-markdown)
- 4가지 스타일 프리셋 (GitHub, Notion, VS Code, Minimal)
- TOC(목차) 사이드바
- 파일 드래그 앤 드롭 / 다운로드
- 다크/라이트 테마
- 자동 저장 (localStorage)
- 키보드 단축키
- 첫 방문자 온보딩

---

## 기술 스택

### 프레임워크 & 빌드
```
React 18 + TypeScript + Vite 5
```

### 주요 라이브러리
| 라이브러리 | 용도 |
|------------|------|
| `codemirror` / `@codemirror/*` | 에디터 |
| `react-markdown` + `remark-gfm` | 마크다운 렌더링 |
| `rehype-highlight` | 코드 하이라이팅 |
| `zustand` | 상태 관리 |
| `tailwindcss` | 스타일링 |
| `lucide-react` | 아이콘 |
| `@radix-ui/*` | UI 컴포넌트 (Dialog, Tooltip, Dropdown) |

### 개발 도구
| 도구 | 용도 |
|------|------|
| `vitest` | 테스트 러너 |
| `@testing-library/react` | 컴포넌트 테스트 |
| `eslint` | 린트 |
| `vite-plugin-pwa` | PWA 지원 (미완료) |

---

## 프로젝트 구조

```
md-preview/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── Editor/          # CodeMirror 에디터
│   │   ├── Preview/         # 마크다운 프리뷰
│   │   ├── Layout/          # 레이아웃 (Header, SplitPane)
│   │   ├── FileHandler/     # 파일 드래그앤드롭
│   │   ├── Settings/        # 설정 모달
│   │   ├── TOC/             # 목차 사이드바
│   │   └── common/          # 공통 컴포넌트 (Modal, Tooltip 등)
│   ├── hooks/               # 커스텀 훅
│   │   ├── useAutoSave.ts
│   │   ├── useFileHandler.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useScrollSync.ts
│   │   ├── useTheme.ts
│   │   ├── useTOC.ts
│   │   └── useWelcome.ts    # 온보딩
│   ├── stores/              # Zustand 스토어
│   │   ├── editorStore.ts   # 에디터 상태 (content, fileName)
│   │   ├── settingsStore.ts # 설정 (theme, preset, fontSize)
│   │   └── uiStore.ts       # UI 상태 (modal, sidebar)
│   ├── constants/           # 상수
│   │   └── welcomeContent.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── presets/         # 스타일 프리셋 CSS
│   ├── utils/               # 유틸리티 함수
│   ├── App.tsx
│   └── main.tsx
├── .claude/                 # Claude Code 에이전트 시스템
│   ├── agents/              # 에이전트 정의 파일 (28개)
│   ├── tasks/               # TODO 리스트
│   │   ├── design-tasks.md
│   │   └── dev-tasks.md
│   ├── design/              # 디자인 스펙
│   ├── commit-guide.md      # 커밋 메시지 가이드
│   └── pipeline-overview.md # 파이프라인 개요
├── docs/
│   └── issues/              # 이슈 리포트
├── public/                  # 정적 파일
└── design/                  # 디자인 토큰
```

---

## 주요 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 테스트
npm test

# 린트
npm run lint

# 프리뷰 (빌드 결과 확인)
npm run preview
```

---

## 에이전트 시스템

이 프로젝트는 `.claude/agents/` 폴더에 정의된 에이전트 시스템을 사용합니다.

### 오케스트레이터
| 에이전트 | 설명 | 호출 키워드 |
|----------|------|-------------|
| `master-orchestrator` | 전체 파이프라인 총괄 | "전체 파이프라인", "풀 사이클" |
| `planning-orchestrator` | 기획 단계 | "기획 파이프라인" |
| `design-orchestrator` | 디자인 단계 | "디자인 파이프라인" |
| `dev-orchestrator` | 개발 단계 | "개발 파이프라인", "개발 전체" |
| `issue-orchestrator` | 이슈 처리 | "이슈 처리", "버그 수정" |

### 개발 에이전트
| 에이전트 | 역할 |
|----------|------|
| `tdd-writer` | TDD 테스트 먼저 작성 (Red) |
| `component-builder` | 컴포넌트 구현 (Green) |
| `code-reviewer` | 코드 리뷰 및 점수 부여 (9점 이상 통과) |
| `refactorer` | 리팩토링 |
| `test-generator` | 추가 테스트 생성 |
| `committer` | 커밋 (수락 기준 검증 필수) |

### 파이프라인 흐름
```
tdd-writer → component-builder → code-reviewer (9점↑) → refactorer → test-generator → committer
```

### 품질 게이트
- **모든 게이트 9점 이상 통과 필수**
- 9점 미만 시 자동 재작업 (최대 5회)
- `committer`는 수락 기준을 실제로 검증한 후에만 완료 처리

---

## 커밋 가이드라인

### 형식
```
{type} : {subject}

{body}

{footer}
```

### 타입
| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `test` | 테스트 |
| `docs` | 문서 |
| `chore` | 빌드/설정 |
| `perf` | 성능 개선 |

### 규칙
- **한국어 작성**
- **콜론 앞 공백**: `feat :` (공백 포함)
- **명령형 문체**: "추가", "수정", "삭제"
- **TODO ID 포함** (해당 시): `[DEV-XXX]`
- **마침표 없음**

### 예시
```
feat : [DEV-016] 환영 플레이스홀더 (온보딩) 구현

첫 방문자를 위한 환영 모달 및 샘플 마크다운 기능 추가

변경 파일:
- src/hooks/useWelcome.ts
- src/components/common/WelcomeModal.tsx
- src/constants/welcomeContent.ts

수락 기준:
- [x] 첫 방문 감지 (localStorage)
- [x] 환영 샘플 마크다운 콘텐츠
- [x] "시작하기" 버튼

Task: DEV-016
```

---

## 코딩 컨벤션

### TypeScript
- 모든 파일은 TypeScript 사용
- `any` 타입 사용 금지 (불가피한 경우 주석으로 이유 명시)
- 인터페이스 > 타입 별칭 선호

### React
- 함수형 컴포넌트만 사용
- 커스텀 훅은 `use` 접두사
- 컴포넌트 파일명은 PascalCase
- 한 파일에 하나의 컴포넌트

### 테스트
- 테스트 파일: `*.test.ts` 또는 `*.test.tsx`
- 컴포넌트 테스트: `@testing-library/react` 사용
- 훅 테스트: `renderHook` 사용

### 스타일
- Tailwind CSS 클래스 사용
- 글로벌 CSS는 `src/styles/globals.css`에만
- 스타일 프리셋은 `src/styles/presets/`에 개별 CSS 파일

---

## 테스트

### 실행
```bash
npm test           # 전체 테스트
npm test -- --run  # 워치 모드 없이 1회 실행
```

### 테스트 구조
```
src/
├── hooks/
│   ├── useAutoSave.ts
│   └── useAutoSave.test.ts      # 훅 테스트
├── components/
│   ├── Editor/
│   │   ├── Editor.tsx
│   │   └── Editor.test.tsx      # 컴포넌트 테스트
│   └── common/
│       └── WelcomeModal.integration.test.tsx  # 통합 테스트
└── stores/
    ├── editorStore.ts
    └── editorStore.test.ts      # 스토어 테스트
```

---

## 현재 진행 상태

### dev-tasks.md 기준
| 상태 | 개수 |
|------|------|
| 완료 | 15/17 |
| 미완료 | 2/17 |
| **진행률** | **88%** |

### 미완료 태스크
| ID | 태스크 | 우선순위 |
|----|--------|----------|
| DEV-014 | PWA 설정 | P1 |
| DEV-017 | 다국어 지원 (i18n) | P1 |

### 해결된 이슈
- BUG-001: 스크롤 동기화 미작동 ✅
- BUG-002: Help 버튼 미작동 ✅
- BUG-003: 스크롤 동기화 타이밍 이슈 ✅
- FEAT-001: 사이드바 TOC 추가 ✅

---

## 주의사항

### 에이전트 사용 시
- 에이전트 파일 수정 후 세션 재시작 **불필요** (다음 호출 시 자동 반영)
- `committer`는 반드시 수락 기준을 실제로 검증해야 함
- 품질 게이트 9점 미만 시 자동 재작업

### 파일 시스템
- `.env` 파일 커밋 금지 (gitignore에 설정됨)
- `dist/`, `dev-dist/` 빌드 산출물 커밋 금지
- `.claude/settings.local.json` 커밋 금지 (로컬 설정)

### 보안
- 민감정보 없음 (프론트엔드 온리 앱)
- 외부 API 연동 없음
- 데이터는 로컬스토리지에만 저장

---

## 참고 문서

| 문서 | 위치 | 설명 |
|------|------|------|
| PRD | `PRD.md` | 제품 요구사항 정의서 |
| 커밋 가이드 | `.claude/commit-guide.md` | 커밋 메시지 작성 규칙 |
| 파이프라인 개요 | `.claude/pipeline-overview.md` | 에이전트 파이프라인 상세 |
| 개발 태스크 | `.claude/tasks/dev-tasks.md` | 개발 TODO 리스트 |
| 디자인 태스크 | `.claude/tasks/design-tasks.md` | 디자인 TODO 리스트 |
| 접근성 | `ACCESSIBILITY.md` | WCAG 2.1 AA 준수 가이드 |
| 성능 | `PERFORMANCE.md` | 성능 최적화 가이드 |

---

_마지막 업데이트: 2026-01-16_
