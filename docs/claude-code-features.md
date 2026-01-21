# Claude Code 주요 기능 총정리

> Claude Code의 모든 주요 기능과 개념에 대한 상세 가이드

---

## 1. 기능 개요 비교표

| 기능 | 정의 | 호출 방식 | 컨텍스트 | 복잡도 |
|------|------|----------|---------|--------|
| **에이전트 (Agents)** | 특정 작업을 수행하는 자동화 시스템 | 자동 위임 | 독립적 | 중 |
| **서브에이전트 (Subagents)** | 백그라운드/포그라운드에서 실행되는 독립 AI | 명시적/자동 | 독립적 | 중 |
| **스킬 (Skills)** | 재사용 가능한 지식 모듈 | 자동 발견 | 메인과 통합 | 높음 |
| **슬래시 커맨드** | 명시적 단축 프롬프트 | `/command` | 메인과 통합 | 낮음 |
| **훅 (Hooks)** | 이벤트 기반 자동 실행 셸 스크립트 | 자동 | - | 중 |
| **MCP 서버** | 외부 도구/API 연동 프로토콜 | 필요시 | - | 높음 |
| **CLAUDE.md** | 프로젝트/개인 메모리 파일 | 자동 로드 | - | 낮음 |
| **Plan Mode** | 읽기 전용 계획 수립 모드 | 명시적 토글 | 메인과 통합 | 낮음 |
| **Todo List** | 구조화된 작업 목록 관리 | 자동/수동 | - | 낮음 |
| **백그라운드 태스크** | 병렬 실행 기능 | Ctrl+B / 명시적 | 독립적 | 중 |

---

## 2. 에이전트 (Agents)

### 정의
에이전트는 Claude Code에서 특정 작업을 자동으로 수행하는 자동화 시스템입니다. `.claude/agents/` 폴더에 Markdown 파일로 정의합니다.

### 주요 특징
- **독립적 컨텍스트**: 각 에이전트는 자체 컨텍스트 윈도우에서 실행
- **커스텀 시스템 프롬프트**: 에이전트별로 고유한 역할 정의 가능
- **제한된 도구 접근**: 필요한 도구만 선택적으로 제공 가능
- **자동 위임**: Claude Code가 작업의 성격에 따라 자동으로 적절한 에이전트에 위임

### 에이전트 파일 구조

```markdown
---
name: code-reviewer
description: Expert code reviewer. Reviews code for quality, security, and best practices.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a senior code reviewer...
[시스템 프롬프트 내용]
```

### 빌트인 에이전트

| 에이전트 | 용도 | 특징 |
|---------|------|------|
| **Explore** | 코드베이스 탐색 | 빠른 읽기 전용, Haiku 모델 |
| **Plan** | 계획 모드 연구 | 읽기 전용, 컨텍스트 수집 |
| **General-purpose** | 복합 작업 | 모든 도구, 높은 능력 |
| **Bash** | 백그라운드 명령 | 터미널 명령 실행 |

---

## 3. 서브에이전트 (Subagents)

### 정의
서브에이전트는 특정 작업을 백그라운드 또는 포그라운드에서 실행할 수 있는 독립적인 AI 어시스턴트입니다.

### 에이전트 vs 서브에이전트 비교

| 구분 | 에이전트 | 서브에이전트 |
|------|---------|-------------|
| **실행 모드** | 포그라운드만 | 포그라운드/백그라운드 |
| **컨텍스트** | 독립 (새 컨텍스트) | 독립 (선택적 공유) |
| **중첩 가능** | 불가 (무한 루프 방지) | 제한적 가능 |
| **사용 시점** | 전문가 역할 필요 | 격리된 장시간 작업 |

### 포그라운드 vs 백그라운드

- **포그라운드**: 사용자 입력 필요한 경우 중단
- **백그라운드**: 자동 승인, 권한 불일치 시 작업 실패하지만 계속 진행

---

## 4. 스킬 (Skills)

### 정의
스킬은 Claude Code에 특정 방식으로 작업을 수행하도록 가르치는 재사용 가능한 지식 모듈입니다.

### 스킬 vs 슬래시 커맨드 비교

| 구분 | 스킬 | 슬래시 커맨드 |
|------|-----|-------------|
| **호출 방식** | 자동 (Claude 결정) | 명시적 (`/command`) |
| **구조** | 디렉토리 (SKILL.md + 리소스) | 단일 파일 |
| **복잡도** | 높음 (여러 파일, 스크립트) | 낮음 (간단한 프롬프트) |
| **사용 시점** | 관련성 기반 | 사용자 요청 기반 |

### 스킬 파일 구조

```
my-skill/
├── SKILL.md              # 필수: 개요와 지시사항
├── reference.md          # 선택: 상세 문서
├── examples.md           # 선택: 사용 예제
└── scripts/
    └── helper.py         # 선택: 실행 스크립트
```

---

## 5. 슬래시 커맨드 (Slash Commands)

### 정의
슬래시 커맨드는 사용자가 명시적으로 호출하는 단축 프롬프트입니다. `/command` 형태로 사용됩니다.

### 빌트인 주요 명령어

| 명령어 | 용도 | 설명 |
|--------|------|------|
| `/help` | 도움말 | 사용 가능한 명령어 목록 |
| `/config` | 설정 | 설정 인터페이스 열기 |
| `/model` | 모델 변경 | 사용 모델 전환 |
| `/plan` | 계획 모드 | Plan Mode 진입 |
| `/agents` | 에이전트 관리 | 에이전트 목록/생성 |
| `/mcp` | MCP 관리 | MCP 서버 관리 |
| `/memory` | 메모리 편집 | CLAUDE.md 편집 |
| `/compact` | 대화 압축 | 컨텍스트 절약 |
| `/context` | 컨텍스트 | 컨텍스트 사용량 시각화 |
| `/cost` | 비용 조회 | 토큰 사용량 확인 |
| `/export` | 내보내기 | 대화 내용 내보내기 |
| `/init` | 초기화 | CLAUDE.md 초기 생성 |

### 커스텀 슬래시 커맨드

**프로젝트 커맨드**: `.claude/commands/*.md`
**개인 커맨드**: `~/.claude/commands/*.md`

```markdown
---
description: Generate commit messages from git diffs
allowed-tools: Bash(git diff:*)
---

Review staged changes and suggest a commit message.
```

---

## 6. 훅 (Hooks)

### 정의
훅은 Claude Code의 특정 이벤트 발생 시 자동으로 실행되는 셸 스크립트입니다.

### 훅 이벤트 종류

| 이벤트 | 발생 시점 | 주요 용도 |
|--------|----------|----------|
| `PreToolUse` | 도구 실행 전 | 명령어 검증, 권한 확인 |
| `PostToolUse` | 도구 실행 후 | 자동 포매팅, 린팅 |
| `PermissionRequest` | 권한 요청 시 | 자동 승인/거부 |
| `UserPromptSubmit` | 사용자 입력 후 | 프롬프트 수정, 검증 |
| `Notification` | 알림 발생 시 | 시스템 알림 |
| `Stop` | 응답 완료 시 | 후처리 작업 |
| `SubagentStop` | 서브에이전트 완료 시 | 정리 작업 |
| `SessionStart` | 세션 시작 시 | 환경 설정 |
| `SessionEnd` | 세션 종료 시 | 정리 작업 |

### 훅 설정 예시

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

---

## 7. MCP 서버 (MCP Servers)

### 정의
MCP (Model Context Protocol)는 Claude Code가 외부 도구와 데이터 소스에 접근할 수 있게 해주는 표준입니다.

### 인기 있는 MCP 서버

- **GitHub**: PR 검토, 이슈 관리
- **Sentry**: 에러 모니터링
- **PostgreSQL**: 데이터베이스 쿼리
- **Stripe**: 결제 관리
- **Slack**: 팀 커뮤니케이션
- **Figma**: 디자인 도구 연동

### 설치 방법

```bash
# HTTP 서버
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Stdio 서버 (로컬)
claude mcp add --transport stdio postgres \
  --env DATABASE_URL=postgresql://user:pass@localhost/db \
  -- npx -y @modelcontextprotocol/server-postgres
```

### 설치 범위

| 범위 | 위치 | 공유 범위 |
|------|------|---------|
| **Local** | `~/.claude.json` (프로젝트별) | 해당 프로젝트만 |
| **Project** | `.mcp.json` | git으로 팀 공유 |
| **User** | `~/.claude.json` | 모든 프로젝트 |

---

## 8. CLAUDE.md 파일

### 정의
CLAUDE.md는 Claude Code가 자동으로 로드하는 메모리 파일로, 프로젝트 또는 개인 지침, 규칙, 표준을 저장합니다.

### 메모리 계층 구조

| 레벨 | 파일 위치 | 범위 | 공유 여부 |
|------|----------|------|----------|
| 조직 | `/Library/Application Support/ClaudeCode/CLAUDE.md` | 조직 전체 | 관리자만 |
| 프로젝트 | `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` | 프로젝트 | git 공유 |
| 경로별 규칙 | `./.claude/rules/*.md` | 특정 경로 | git 공유 |
| 개인 전역 | `~/.claude/CLAUDE.md` | 모든 프로젝트 | 아니오 |
| 개인 프로젝트 | `./CLAUDE.local.md` | 해당 프로젝트 | 아니오 |

### 경로별 규칙 예시

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "tests/**/*.test.ts"
---

# API 개발 규칙

- 모든 API 엔드포인트는 입력 검증 필수
- 표준 에러 응답 형식 사용
```

---

## 9. Plan Mode

### 정의
Plan Mode는 Claude Code가 읽기 전용으로 코드베이스를 분석한 후 계획을 제시하고 사용자의 승인을 기다리는 모드입니다.

### 특징
- **안전한 탐색**: 변경 없이 코드 분석
- **대화형**: 사용자에게 확인 요청
- **계획 우선**: 실행 전 계획 검토

### 사용 방법

```bash
# 세션 시작 시
claude --permission-mode plan

# 기존 세션에서 토글
Shift+Tab  # 순환: Normal → Accept Edits → Plan

# 기본값 설정 (.claude/settings.json)
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

---

## 10. Todo List (TodoWrite)

### 정의
TodoWrite는 구조화된 작업 목록을 생성하고 관리하는 도구입니다.

### 주요 기능
- **구조화된 작업**: 단계별 분해
- **상태 추적**: 완료/미완료 상태
- **우선순위**: 작업 중요도 표시
- **진행률**: 전체 진행도 시각화

### 사용 예시

```bash
# 현재 TODO 목록 보기
/todos

# Claude가 자동으로 분해:
[ ] 1. 사용자 모델 생성
[ ] 2. 입력 검증 로직
[ ] 3. 비밀번호 해싱
[x] 4. 데이터베이스 저장  # 완료됨
[ ] 5. 이메일 확인
```

---

## 11. 백그라운드 태스크

### 정의
백그라운드 태스크는 오래 걸리는 작업을 메인 대화와 독립적으로 실행하는 기능입니다.

### 특징
- **비블로킹**: 메인 대화 계속 가능
- **병렬 실행**: 여러 태스크 동시 실행
- **자동 승인**: 미리 승인된 권한 사용

### 사용 방법

```bash
# 자동 백그라운드
> npm test를 백그라운드에서 실행해줘

# 수동 백그라운드
Ctrl+B  # 실행 중인 작업을 백그라운드로 이동

# 결과 확인
/bashes  # 실행 중인 백그라운드 작업 목록
```

---

## 12. 설정 (Settings)

### 설정 파일 위치

| 레벨 | 파일 위치 | 범위 | 공유 여부 |
|------|----------|------|----------|
| 조직 | `/etc/claude-code/managed-settings.json` | 조직 전체 | 관리자만 |
| 개인 전역 | `~/.claude/settings.json` | 모든 프로젝트 | 아니오 |
| 프로젝트 공유 | `.claude/settings.json` | 해당 프로젝트 | git 공유 |
| 프로젝트 개인 | `.claude/settings.local.json` | 해당 프로젝트 | 아니오 |

### 주요 설정 옵션

```json
{
  "permissions": {
    "allow": ["Bash(npm run:*)", "Read(.env)"],
    "deny": ["Bash(rm -rf:*)"],
    "defaultMode": "plan"
  },
  "model": "claude-opus-4-5-20251101",
  "sandbox": {
    "enabled": true
  },
  "alwaysThinkingEnabled": true,
  "language": "korean"
}
```

---

## 13. 키보드 단축키

### 일반 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl+C` | 현재 입력 취소 |
| `Ctrl+D` | 세션 종료 |
| `Ctrl+L` | 화면 지우기 |
| `Ctrl+B` | 백그라운드로 이동 |
| `Ctrl+R` | 명령어 히스토리 검색 |
| `Ctrl+V` / `Cmd+V` | 이미지 붙여넣기 |
| `Shift+Tab` | 권한 모드 순환 |
| `Alt+P` / `Option+P` | 모델 전환 |
| `Alt+T` / `Option+T` | 확장 사고(thinking) 토글 |

### 텍스트 편집

| 단축키 | 기능 |
|--------|------|
| `Ctrl+K` | 줄 끝까지 삭제 |
| `Ctrl+U` | 전체 줄 삭제 |
| `Ctrl+Y` | 삭제된 텍스트 붙여넣기 |
| `Alt+B` | 단어 왼쪽 이동 |
| `Alt+F` | 단어 오른쪽 이동 |
| `Up/Down` | 명령어 히스토리 |

### Vim 모드

```bash
# Vim 모드 활성화
/vim

# 또는 설정에서
/config → Vim Mode 체크
```

---

## 14. 기능별 사용 시점 가이드

| 상황 | 추천 기능 | 이유 |
|------|----------|------|
| 특정 전문가 역할 필요 | **에이전트** | 독립 컨텍스트, 전문화된 시스템 프롬프트 |
| 장시간 격리된 작업 | **서브에이전트** | 백그라운드 실행, 병렬 처리 |
| 재사용 가능한 워크플로우 | **스킬** | 자동 발견, 여러 파일 지원 |
| 빠른 단축 명령 | **슬래시 커맨드** | 명시적 호출, 단순 구조 |
| 자동화된 검증/포매팅 | **훅** | 이벤트 기반 자동 실행 |
| 외부 API/도구 연동 | **MCP 서버** | 표준화된 프로토콜 |
| 변경 전 계획 검토 | **Plan Mode** | 읽기 전용 탐색 |
| 복잡한 작업 추적 | **Todo List** | 단계별 분해, 진행률 추적 |

---

## 15. 이 프로젝트의 커스텀 에이전트 (28개)

### 오케스트레이터

| 에이전트 | 역할 | 호출 키워드 |
|----------|------|-------------|
| `master-orchestrator` | 전체 파이프라인 총괄 | "전체 파이프라인", "풀 사이클" |
| `planning-orchestrator` | 기획 단계 관리 | "기획 파이프라인" |
| `design-orchestrator` | 디자인 단계 관리 | "디자인 파이프라인" |
| `dev-orchestrator` | 개발 단계 관리 | "개발 파이프라인", "개발 전체" |
| `issue-orchestrator` | 이슈 처리 관리 | "이슈 처리", "버그 수정" |

### 개발 에이전트

| 에이전트 | 역할 |
|----------|------|
| `tdd-writer` | TDD 테스트 작성 (Red 단계) |
| `component-builder` | 컴포넌트 구현 (Green 단계) |
| `code-reviewer` | 코드 리뷰 및 점수 부여 |
| `refactorer` | 리팩토링 |
| `test-generator` | 테스트 생성 |
| `committer` | 커밋 실행 |

### 기획 에이전트

| 에이전트 | 역할 |
|----------|------|
| `prd-writer` | PRD 작성 |
| `prd-validator` | PRD 검증 |
| `prd-analyzer` | PRD 분석 |
| `roadmap-generator` | TODO 리스트 생성 |
| `task-validator` | TODO 리스트 검증 |

### 디자인 에이전트

| 에이전트 | 역할 |
|----------|------|
| `ui-designer` | UI/UX 설계 |
| `design-handoff` | 디자인 스펙 변환 |
| `design-committer` | 디자인 단계 커밋 |

### 품질/이슈 에이전트

| 에이전트 | 역할 |
|----------|------|
| `qa-validator` | 최종 품질 검증 |
| `qa-updater` | QA 체크리스트 업데이트 |
| `bug-receiver` | 버그 접수 |
| `bug-analyzer` | 버그 분석 |
| `bug-fixer` | 버그 수정 |
| `issue-committer` | 이슈 커밋 |

### 기타

| 에이전트 | 역할 |
|----------|------|
| `worklog-writer` | 워크로그 기록 |
| `planning-committer` | 기획 단계 커밋 |
| `agent-validator` | 에이전트 파일 검증 |

---

## 참고 자료

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)

---

_마지막 업데이트: 2026-01-21_
