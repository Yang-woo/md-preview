# Deep Analysis: Markdown Preview 구현 전략

## Problem Analysis

### Core Challenge
PRD에 정의된 마크다운 프리뷰어를 **프론트엔드만으로** 구현하면서, 다음을 달성해야 함:
- 13개 v1.0 기능 + 10개 v1.1 기능 + 4개 v1.2 기능
- 4가지 스타일 프리셋, 다크/라이트 테마
- 대용량 파일 성능, PWA 오프라인
- 초보자와 전문가 모두 만족

### Key Constraints

| 제약 | 영향 |
|------|------|
| 프론트엔드 only | 서버 의존 기능 제외 (클라우드, 협업) |
| 정적 호스팅 | Vercel/Netlify 무료 티어 활용 |
| 번들 크기 | Mermaid(~2MB), KaTeX(~1MB) 무거움 |
| 브라우저 API 한계 | 파일 시스템 접근 제한 |

### Critical Success Factors
1. **첫 인상**: 3초 내 로딩, 즉시 사용 가능
2. **핵심 루프**: 입력 → 프리뷰 실시간 반영 (16ms 이하)
3. **차별화**: 다양한 스타일 + 확장 문법이 "설치 없이" 동작

---

## Multi-Dimensional Analysis

### Technical Perspective

#### 아키텍처 선택지

**Option A: 모놀리식 컴포넌트**
```
App
├── Editor (textarea/CodeMirror)
├── Preview (react-markdown)
├── TOC
├── Toolbar
└── Settings
```
- 장점: 단순, 빠른 개발
- 단점: 상태 관리 복잡해짐, 리렌더링 이슈

**Option B: 기능별 모듈 분리 (추천)**
```
App
├── core/ (상태, 파서, 유틸)
├── editor/ (에디터 모듈)
├── preview/ (렌더러 모듈)
├── ui/ (공통 UI)
└── features/ (TOC, 템플릿 등)
```
- 장점: 확장성, 테스트 용이
- 단점: 초기 설계 비용

**Option C: 마이크로 프론트엔드**
- 이 규모에서는 불필요 (과잉)

#### 핵심 기술 결정

| 영역 | 선택지 | 추천 | 이유 |
|------|--------|------|------|
| 에디터 | textarea vs CodeMirror vs Monaco | **CodeMirror 6** | 가벼움(~150KB), 단축키/하이라이팅 내장 |
| 마크다운 | react-markdown vs marked vs markdown-it | **react-markdown** | React 친화적, remark 생태계 |
| 상태관리 | Context vs Zustand vs Jotai | **Zustand** | 간결, devtools, persist 내장 |
| 스타일링 | Tailwind vs CSS Modules vs styled | **Tailwind** | 빠른 개발, 테마 변수 활용 |

#### 성능 리스크

| 리스크 | 영향 | 완화 전략 |
|--------|------|-----------|
| Mermaid 번들 크기 | 초기 로딩 +2MB | Dynamic import, 첫 사용 시 로드 |
| KaTeX 번들 크기 | 초기 로딩 +1MB | Dynamic import |
| 대용량 파일 렌더링 | UI 블로킹 | Web Worker, 가상화 |
| 실시간 프리뷰 | 타이핑 지연 | Debounce 150-300ms |

---

### Business Perspective

#### 경쟁 분석

| 제품 | 강점 | 약점 | 우리 차별화 |
|------|------|------|-------------|
| Typora | 완성도 높음 | 설치 필요, 유료 | 웹 기반 무료 |
| StackEdit | 웹 기반 | 디자인 구식, 느림 | 모던 UI, 빠름 |
| Dillinger | 심플 | 기능 부족 | 확장 문법, 스타일 다양 |
| HackMD | 협업 강점 | 복잡함, 계정 필요 | 계정 없이 즉시 사용 |

#### MVP 가치 검증
v1.0에서 검증해야 할 핵심 가설:
1. "설치 없이 브라우저에서" → 사용자 유입
2. "다양한 스타일 프리셋" → 재방문/공유
3. "GFM + 코드 하이라이팅" → 개발자 타겟 만족

---

### User Perspective

#### 사용자 여정 분석

```
첫 방문 → 환영 문서 확인 → 파일 드래그 또는 직접 입력
       ↓
      편집 → 실시간 프리뷰 확인 → 스타일 변경
       ↓
      저장 → 다운로드 (.md) 또는 브라우저 저장
       ↓
      재방문 → 이전 문서 이어서 편집
```

#### UX 리스크

| 리스크 | 영향 | 완화 |
|--------|------|------|
| 첫 화면 복잡함 | 이탈 | 환영 문서로 안내, 미니멀 기본 |
| 파일 저장 혼란 | 데이터 손실 불안 | 자동 저장 표시, 명확한 피드백 |
| 모바일 사용성 | 편집 불편 | 프리뷰 전용 모드 기본 |
| 단축키 학습 | 진입장벽 | 툴바 버튼 + 툴팁 |

---

### System Perspective

#### 의존성 분석

```
react-markdown (핵심)
├── remark-gfm (GFM)
├── remark-math (수식)
├── rehype-katex (수식 렌더링)
├── rehype-highlight (코드)
└── mermaid (다이어그램)

codemirror (에디터)
├── @codemirror/lang-markdown
└── @codemirror/theme-one-dark

tailwindcss (스타일)
zustand (상태)
i18next (다국어)
vite-plugin-pwa (오프라인)
```

총 의존성: ~20개 (관리 가능 수준)

#### 확장성 고려

v2.0 서버 추가 시 영향받는 부분:
- 저장 로직 → 추상화 필요 (StorageAdapter 패턴)
- 인증 → 없음 → OAuth 추가
- 상태 → 로컬 → 서버 동기화

**지금 해야 할 것**: Storage 레이어 추상화

---

## Solution Options

### Option 1: Minimal MVP (속도 우선)

**접근법**: v1.0 기능만 빠르게 구현, 나머지 후순위

**범위**:
- 에디터 + 프리뷰 (좌우 분할)
- GFM + 코드 하이라이팅
- 다크/라이트 모드
- 파일 드래그/다운로드
- 기본 단축키

**제외**: TOC, 툴바, 스타일 프리셋, 수식, 다이어그램

| 장점 | 단점 |
|------|------|
| 1-2주 내 배포 가능 | 차별화 부족 |
| 빠른 피드백 수집 | 경쟁 제품 대비 부족 |
| 기술 부채 적음 | 재방문 동기 약함 |

**적합**: 빠른 검증이 목표일 때

---

### Option 2: Full MVP (PRD v1.0 전체)

**접근법**: PRD v1.0 전체 구현 후 배포

**범위**: PRD v1.0 전체 (13개 기능)

| 장점 | 단점 |
|------|------|
| 차별화 포인트 포함 | 3-4주 소요 |
| 완성도 높은 첫인상 | 초기 개발 부담 |
| 스타일 프리셋으로 바이럴 가능 | 복잡도 증가 |

**적합**: 완성도 있는 런칭을 원할 때

---

### Option 3: Phased MVP (단계별 출시) - 추천

**접근법**: 핵심 → 차별화 → 완성 순서로 3단계 배포

**Phase 1 (1주)** - 핵심 기능:
- 에디터 + 프리뷰
- GFM + 코드 하이라이팅
- 파일 드래그/다운로드
- 다크/라이트 모드

**Phase 2 (1주)** - 차별화:
- 4가지 스타일 프리셋
- TOC 사이드바
- 툴바 버튼
- 환영 플레이스홀더

**Phase 3 (1주)** - 완성:
- 단축키 전체
- 드래그 비율 조절
- 반응형 레이아웃
- 설정 패널

| 장점 | 단점 |
|------|------|
| 빠른 출시 + 점진적 개선 | 3번 배포 관리 |
| 각 단계별 피드백 반영 | 일관성 유지 노력 |
| 리스크 분산 | |

**적합**: 균형 잡힌 접근

---

### Option 4: Feature Flag MVP

**접근법**: 모든 기능 구현하되 Feature Flag로 점진적 활성화

```typescript
const features = {
  toc: false,
  mermaid: false,
  katex: false,
  stylePresets: true,
  // ...
}
```

| 장점 | 단점 |
|------|------|
| A/B 테스트 가능 | 구현 복잡도 증가 |
| 문제 시 빠른 롤백 | 초기 설정 비용 |
| 점진적 출시 | 1인 프로젝트에서 과잉 |

**적합**: 팀 프로젝트, 큰 사용자 베이스

---

## Recommendation

### 추천 접근법: Option 3 (Phased MVP)

#### 이유
1. **빠른 검증**: Phase 1으로 1주 내 핵심 기능 배포
2. **차별화 확보**: Phase 2에서 스타일 프리셋으로 경쟁력
3. **리스크 분산**: 단계별 피드백으로 방향 조정 가능
4. **동기 부여**: 주 단위 성과로 모멘텀 유지

### Implementation Roadmap

```
Week 1: Phase 1 (Core)
├── Day 1-2: 프로젝트 설정, 기본 레이아웃
├── Day 3-4: 에디터 + 프리뷰 연동
├── Day 5: 파일 처리, 다크모드
└── Day 6-7: 테스트, 배포

Week 2: Phase 2 (Differentiation)
├── Day 1-2: 스타일 프리셋 시스템
├── Day 3-4: TOC 사이드바
├── Day 5: 툴바, 환영 문서
└── Day 6-7: 테스트, 배포

Week 3: Phase 3 (Polish)
├── Day 1-2: 단축키, 설정 패널
├── Day 3-4: 반응형, 드래그 조절
├── Day 5-6: 접근성, 성능 최적화
└── Day 7: 최종 테스트, v1.0 릴리즈
```

### 폴더 구조 제안

```
src/
├── components/
│   ├── Editor/
│   │   ├── Editor.tsx
│   │   ├── Toolbar.tsx
│   │   └── index.ts
│   ├── Preview/
│   │   ├── Preview.tsx
│   │   ├── styles/ (4가지 프리셋)
│   │   └── index.ts
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx (TOC)
│   │   ├── SplitPane.tsx
│   │   └── index.ts
│   └── Settings/
│       └── SettingsPanel.tsx
├── hooks/
│   ├── useMarkdown.ts
│   ├── useTheme.ts
│   ├── useStorage.ts
│   └── useKeyboard.ts
├── stores/
│   ├── editorStore.ts
│   ├── settingsStore.ts
│   └── index.ts
├── utils/
│   ├── markdown.ts
│   ├── file.ts
│   └── storage.ts
├── styles/
│   ├── themes/
│   │   ├── github.css
│   │   ├── notion.css
│   │   ├── vscode.css
│   │   └── minimal.css
│   └── global.css
├── i18n/
│   ├── ko.json
│   └── en.json
├── App.tsx
└── main.tsx
```

### Success Metrics

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| 초기 로딩 | < 3초 | Lighthouse |
| 타이핑 지연 | < 50ms | Performance API |
| 번들 크기 | < 500KB (초기) | Vite 분석 |
| Lighthouse 점수 | > 90 | Lighthouse |

### Risk Mitigation

| 리스크 | 완화 전략 |
|--------|-----------|
| CodeMirror 학습 곡선 | 공식 문서 + 예제 충분 |
| 스타일 프리셋 작업량 | GitHub 스타일 먼저, 나머지 점진적 |
| 반응형 복잡도 | 모바일은 프리뷰 전용 모드 기본 |
| PWA 설정 | vite-plugin-pwa 기본값 활용 |

---

## Alternative Perspectives

### Contrarian View
"스타일 프리셋이 정말 차별화인가?"
- 대부분 사용자는 기본 스타일만 사용할 가능성
- 차라리 **성능과 단순함**에 집중하는 게 나을 수도

### Future Considerations
- v1.1에서 수식/다이어그램 추가 시 번들 크기 급증 → 코드 스플리팅 필수
- v1.2 PWA 시 오프라인 저장소 한계 (IndexedDB 용량)
- v2.0 서버 추가 시 아키텍처 큰 변화 → 지금부터 Storage 추상화

### Areas for Further Research
- CodeMirror 6 vs Monaco: 정확한 번들 크기 비교
- react-markdown 대안: mdx-js 고려 여부
- 대용량 파일 처리: 가상화 라이브러리 선정

---

## 결론

**Phase 1부터 시작**하고, 주 단위로 배포하면서 피드백 반영하는 것을 추천.

### 다음 단계
1. 프로젝트 초기 설정 (Vite + React + TypeScript + Tailwind)
2. 폴더 구조 생성
3. Phase 1 구현 시작
