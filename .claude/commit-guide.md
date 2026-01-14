# Commit Message Guidelines

## 기본 원칙
- 모든 커밋 메시지는 **한국어**로 작성
- Conventional Commit 형식 준수
- 명확하고 간결하며 검색 가능한 메시지 작성
- 커밋 하나당 하나의 논리적 변경사항만 포함

## 커밋 메시지 구조
```
{type} : {subject}

{body}

{footer}
```

## Type 종류 및 사용 가이드

### `feat` : 새로운 기능 추가
- 새로운 컴포넌트, 훅, 유틸리티 함수 추가
- 새로운 API 엔드포인트 연동
- 새로운 페이지 또는 라우트 추가
- 사용자에게 보이는 새로운 기능

**예시:**
```
feat : 결제 위젯 렌더링 컴포넌트 추가

TossPayments와 KPN 결제 위젯을 렌더링하는
PaymentWidgetRenderer 컴포넌트 추가
```

### `fix` : 버그 수정
- 버그 수정
- 에러 핸들링 개선
- 예외 상황 처리 추가
- 타입 에러 수정

**예시:**
```
fix : 결제 프로세서에서 에러 핸들링 개선

결제 실패 시 사용자에게 명확한 에러 메시지 표시
및 에러 로그 기록 추가
```

### `refactor` : 코드 리팩토링
- 기능 변경 없이 코드 구조 개선
- 중복 코드 제거
- 함수/컴포넌트 분리
- 성능 최적화 (기능 변경 없음)

**예시:**
```
refactor : PaymentInfo 컴포넌트 리팩토링

700+ 라인 컴포넌트를 여러 Hook과 유틸로 분리
- usePaymentGateway: PG 선택 로직
- usePaymentProcessor: 결제 처리 로직
- validatePayment: 검증 로직
```

### `style` : 코드 스타일 변경
- 코드 포맷팅 (들여쓰기, 공백 등)
- 세미콜론 추가/제거
- 주석 추가/수정 (코드 동작 변경 없음)
- 변수명 변경 (기능 변경 없음)

### `docs` : 문서 수정
- README 수정
- 주석 추가/수정
- API 문서 업데이트

### `test` : 테스트 코드
- 테스트 코드 추가
- 테스트 코드 수정
- 테스트 설정 변경

**예시:**
```
test : PaymentProcessor 테스트 코드 추가

usePaymentProcessor 훅의 주요 로직에 대한
단위 테스트 추가
```

### `chore` : 빌드/설정 작업
- 패키지 설치/제거
- 빌드 설정 변경
- 환경 변수 추가/수정

### `perf` : 성능 개선
- 성능 최적화
- 불필요한 리렌더링 방지
- 메모리 누수 수정

### `ci` : CI/CD 설정
- GitHub Actions 설정
- 배포 스크립트 수정

### `build` : 빌드 시스템 변경
- Webpack/Vite 설정 변경
- TypeScript 설정 변경

## Subject 작성 규칙

1. **첫 글자**: 소문자로 시작
2. **마침표**: 사용하지 않음
3. **문체**: 명령형으로 작성
   - ✅ 좋은 예: "추가", "수정", "삭제", "개선"
   - ❌ 나쁜 예: "추가함", "수정했습니다"
4. **타입과 콜론 사이 공백**: `feat :` (공백 포함)
5. **구체성**: 무엇을 변경했는지 명확히 작성

## Body 작성 규칙 (선택사항)

1. **내용**:
   - 무엇을 변경했는지 (What)
   - 왜 변경했는지 (Why)
2. **구조**:
   - 변경 사항을 목록으로 나열
   - 영향 범위 설명

**예시:**
```
refactor : PaymentInfo 컴포넌트 리팩토링

700+ 라인 컴포넌트를 여러 Hook과 유틸로 분리하여
코드 가독성 및 유지보수성 향상

변경 사항:
- usePaymentGateway: PG 선택 로직 분리
- usePaymentProcessor: 결제 처리 로직 분리
- validatePayment: 검증 로직 유틸로 분리

영향 범위:
- PaymentInfo.tsx: 700라인 → 300라인으로 감소
- 기존 기능 100% 보존
```

## Footer 작성 규칙 (선택사항)

1. **이슈 참조**:
   - `Closes #123`: 이슈를 닫음
   - `Refs #456`: 관련 이슈 참조
   - `Fixes #789`: 버그 이슈 수정

2. **Breaking Changes**:
   ```
   BREAKING CHANGE: {설명}

   {마이그레이션 가이드}
   ```

## TODO 기반 커밋 메시지

dev-tasks.md의 TODO 완료 시 커밋 메시지 형식:

```
{type} : [DEV-XXX] {태스크 제목}

{태스크 설명}

변경 파일:
- src/components/XXX.tsx
- src/hooks/useXXX.ts

수락 기준:
- [x] 기준 1
- [x] 기준 2

Task: DEV-XXX
```

**예시:**
```
feat : [DEV-002] 에디터 컴포넌트 구현

CodeMirror 기반 마크다운 에디터 컴포넌트 구현

변경 파일:
- src/components/Editor/Editor.tsx
- src/components/Editor/EditorToolbar.tsx
- src/hooks/useMarkdown.ts

수락 기준:
- [x] CodeMirror 통합
- [x] 마크다운 입력 처리
- [x] 테스트 통과

Task: DEV-002
```

## 커밋 전 체크리스트

- [ ] 타입이 올바르게 선택되었는가?
- [ ] Subject가 명령형으로 작성되었는가?
- [ ] Subject가 무엇을 변경했는지 명확한가?
- [ ] 관련 태스크 ID가 포함되었는가? (DEV-XXX)
- [ ] 한국어로 작성되었는가?
- [ ] 콜론 앞에 공백이 있는가? (`feat :`)

## 좋은 예시 vs 나쁜 예시

| 나쁜 예 | 문제점 | 좋은 예 |
|---------|--------|---------|
| `fix : 버그 수정` | 너무 모호함 | `fix : [DEV-010] 스크롤 동기화 버그 수정` |
| `update : 파일 수정` | 불명확 | `refactor : [DEV-005] Preview 컴포넌트 리팩토링` |
| `feat: 추가` | 콜론 앞 공백 없음 | `feat : [DEV-001] 프로젝트 초기화` |
| `FEAT : 컴포넌트 추가` | 대문자 타입 | `feat : [DEV-002] 에디터 컴포넌트 추가` |
