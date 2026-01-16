# 에디터 툴바 기능 개선 - PRD

## 1. 개요

### 배경
현재 마크다운 에디터의 툴바 버튼은 사용자의 의도와 다르게 동작하여 사용 경험을 저해하고 있습니다.

**현재 문제점:**
- 툴바 버튼 클릭 시 커서 위치와 무관하게 항상 문서 끝에 텍스트가 추가됨
- 텍스트를 선택(드래그)한 상태에서 서식을 적용할 수 없음
- 사용자가 원하는 위치에 즉시 서식을 적용할 수 없어 불편함

**개선 필요성:**
- 일반적인 텍스트 에디터(MS Word, Google Docs, Notion 등)의 동작과 일관성 유지
- 사용자가 직관적으로 예상하는 방식으로 작동
- 마크다운 초보자의 진입장벽 낮춤

### 목표
- **주요 목표**: 툴바 버튼이 현재 커서 위치 및 선택 영역을 기준으로 동작하도록 개선
- **사용자 경험**: 직관적이고 예측 가능한 툴바 동작
- **개발 효율**: 기존 코드 구조 최대한 활용, 최소한의 변경으로 개선

### 성공 지표

#### 핵심 KPI
- **기능 정확도**: 툴바 버튼 클릭 시 100% 올바른 위치에 서식 적용
- **사용자 만족도**: 툴바 기능 만족도 4.0/5.0 이상
- **오류율**: 서식 적용 오류 발생률 0%

#### 성능 지표
- **응답 속도**: 버튼 클릭 후 서식 적용 완료까지 50ms 이내
- **커서 복원**: 서식 적용 후 커서 위치 복원 100% 성공

#### 사용성 지표
- **학습 시간**: 신규 사용자가 툴바 사용법 이해까지 30초 이내
- **실수율**: 의도하지 않은 위치에 서식 적용되는 비율 0%

---

## 2. 타겟 사용자

| 페르소나 | 현재 불편 사항 | 개선 후 기대 효과 |
|----------|----------------|-------------------|
| **마크다운 초보자** | 툴바 버튼 클릭 시 예상과 다른 위치에 삽입되어 혼란 | 직관적인 동작으로 마크다운 학습 용이 |
| **개발자** | 문서 중간에 코드 블록 삽입 시 매번 복사/붙여넣기 필요 | 커서 위치에 즉시 삽입으로 작업 효율 향상 |
| **PM/기획자** | 텍스트 선택 후 헤딩 적용 불가능 | 선택 영역에 직접 서식 적용으로 빠른 문서 작성 |
| **블로거** | 볼드/이탤릭 적용 시 수동으로 마크다운 문법 입력 필요 | 텍스트 드래그 후 버튼 클릭만으로 서식 적용 |

---

## 3. 사용자 스토리

### 주요 사용자 스토리

#### US-1: 커서 위치에 서식 삽입
```
As a 마크다운 사용자
I want to 툴바 버튼 클릭 시 현재 커서 위치에 서식이 삽입되길 원한다
So that 문서 중간에 자유롭게 콘텐츠를 추가할 수 있다

수락 기준:
- [ ] 문서 시작 위치에서 버튼 클릭 시 문서 시작에 삽입
- [ ] 문서 중간에서 버튼 클릭 시 해당 위치에 삽입
- [ ] 문서 끝에서 버튼 클릭 시 문서 끝에 삽입
- [ ] 모든 툴바 버튼(Bold, Italic, Header, Link, Code 등)에 적용
```

#### US-2: 선택 영역에 서식 적용
```
As a 텍스트를 작성한 사용자
I want to 텍스트를 드래그한 상태에서 툴바 버튼을 클릭하면 선택된 텍스트에만 서식이 적용되길 원한다
So that 이미 작성한 텍스트를 쉽게 꾸밀 수 있다

수락 기준:
- [ ] "hello"를 드래그 후 Bold 클릭 → "**hello**" 변환
- [ ] "title"을 드래그 후 H1 클릭 → "# title" 변환
- [ ] "code"를 드래그 후 Inline Code 클릭 → "`code`" 변환
- [ ] "link text"를 드래그 후 Link 클릭 → "[link text](url)" 변환
- [ ] 서식 적용 후 변환된 텍스트가 다시 선택 상태
```

#### US-3: 멀티라인 선택 영역 처리
```
As a 여러 줄의 텍스트를 편집하는 사용자
I want to 여러 줄을 드래그한 상태에서 리스트 버튼을 클릭하면 각 줄에 리스트 형식이 적용되길 원한다
So that 여러 줄을 한 번에 리스트로 변환할 수 있다

수락 기준:
- [ ] 3줄을 선택 후 Bullet List 클릭 → 각 줄에 "- " 접두사 추가
- [ ] 3줄을 선택 후 Numbered List 클릭 → "1. ", "2. ", "3. " 추가
- [ ] 3줄을 선택 후 Task List 클릭 → 각 줄에 "- [ ] " 추가
```

#### US-4: 커서 위치 복원
```
As a 서식을 적용한 사용자
I want to 툴바 버튼 클릭 후 커서가 적절한 위치에 자동으로 이동하길 원한다
So that 서식 적용 후 바로 텍스트를 입력할 수 있다

수락 기준:
- [ ] Bold 삽입 후 커서가 ** ** 사이에 위치
- [ ] Link 삽입 후 커서가 [link text] 부분 선택 상태
- [ ] Code Block 삽입 후 커서가 코드 입력 영역에 위치
- [ ] 선택 영역에 서식 적용 후 변환된 텍스트가 선택 상태
```

---

## 4. 기능 요구사항

### P0 (Must Have)

| ID | 기능 | 설명 | 수락 기준 |
|----|------|------|-----------|
| **FR-001** | 커서 위치 감지 | CodeMirror 에디터에서 현재 커서 위치(offset) 가져오기 | ✓ EditorView.state.selection.main.from 값 정확히 추출<br>✓ 문서 시작(0), 중간, 끝 모두 정확히 감지<br>✓ 성능: 1ms 이내 |
| **FR-002** | 선택 영역 감지 | CodeMirror 에디터에서 선택 영역(start, end, text) 가져오기 | ✓ 선택 시작/끝 위치 정확히 추출<br>✓ 선택된 텍스트 내용 추출<br>✓ 선택 없을 시 커서 위치만 반환 |
| **FR-003** | 커서 위치 삽입 | 툴바 버튼 클릭 시 현재 커서 위치에 서식 삽입 | ✓ 모든 툴바 버튼(13종) 커서 위치 기준 동작<br>✓ 기존 콘텐츠 유지<br>✓ 삽입 위치 정확도 100% |
| **FR-004** | 선택 영역 서식 적용 | 드래그한 텍스트에 서식 래핑 | ✓ Bold: "text" → "**text**"<br>✓ Italic: "text" → "*text*"<br>✓ Header: "text" → "# text" (줄 시작)<br>✓ Link: "text" → "[text](url)"<br>✓ Code: "text" → "`text`"<br>✓ 모든 인라인 서식 지원 |
| **FR-005** | 커서 위치 복원 | 서식 적용 후 커서를 적절한 위치로 이동 | ✓ 삽입 모드: 서식 내부(편집 영역)에 커서 위치<br>✓ 선택 모드: 변환된 텍스트를 다시 선택<br>✓ 복원 성공률 100% |
| **FR-006** | EditorView 참조 전달 | Editor 컴포넌트에서 EditorView 인스턴스를 외부로 노출 | ✓ useImperativeHandle 또는 callback으로 전달<br>✓ EditorWithToolbar에서 접근 가능<br>✓ 타입 안전성 보장 |

### P1 (Should Have)

| ID | 기능 | 설명 | 수락 기준 |
|----|------|------|-----------|
| **FR-007** | 멀티라인 선택 리스트 변환 | 여러 줄 선택 시 각 줄에 리스트 형식 적용 | ✓ Bullet List: 각 줄에 "- " 추가<br>✓ Numbered List: "1. ", "2. ", ... 추가<br>✓ Task List: 각 줄에 "- [ ] " 추가<br>✓ 빈 줄은 건너뛰기 |
| **FR-008** | 기존 서식 토글 | 이미 서식이 적용된 텍스트 재클릭 시 서식 제거 | ✓ "**bold**" 선택 후 Bold 클릭 → "bold" 변환<br>✓ "`code`" 선택 후 Code 클릭 → "code" 변환<br>✓ "# heading" 선택 후 H1 클릭 → "heading" 변환 |
| **FR-009** | 단축키 연동 | 키보드 단축키도 커서/선택 영역 기준 동작 | ✓ Ctrl+B (Bold) 커서 위치 기준<br>✓ Ctrl+I (Italic) 선택 영역 기준<br>✓ Ctrl+K (Link) 선택 영역 기준 |

### P2 (Nice to Have)

| ID | 기능 | 설명 | 수락 기준 |
|----|------|------|-----------|
| **FR-010** | 스마트 선택 확장 | 단어 일부 선택 시 자동으로 단어 전체 확장 | ✓ "hel" 선택 후 Bold 클릭 → "hello" 전체에 적용<br>✓ 설정에서 ON/OFF 가능 |
| **FR-011** | 서식 미리보기 | 툴바 버튼 호버 시 적용 예시 툴팁 표시 | ✓ Bold 호버: "**text**" 예시<br>✓ Link 호버: "[text](url)" 예시 |

---

## 5. 비기능 요구사항

### 성능
| 항목 | 기준 | 측정 방법 |
|------|------|-----------|
| **응답 속도** | 버튼 클릭 후 50ms 이내 서식 적용 | Performance.now() 측정 |
| **커서 감지** | 1ms 이내 커서 위치 추출 | CodeMirror API 호출 시간 측정 |
| **UI 응답성** | 60fps 유지 (16.67ms/frame) | React DevTools Profiler |
| **대용량 문서** | 1MB 파일에서도 지연 없음 | 1MB 마크다운 로드 후 테스트 |

### 호환성
| 항목 | 요구사항 |
|------|----------|
| **CodeMirror 버전** | CodeMirror 6.x 호환 |
| **브라우저** | Chrome, Firefox, Safari, Edge 최신 2개 버전 |
| **모바일** | iOS Safari, Android Chrome (터치 이벤트 지원) |

### 접근성
| 항목 | 요구사항 |
|------|----------|
| **키보드 내비게이션** | 툴바 버튼 Tab으로 순회 가능 |
| **포커스 인디케이터** | 현재 활성 버튼 명확히 표시 |
| **스크린리더** | 버튼 기능 및 적용 결과 안내 (aria-live) |
| **단축키 안내** | 툴바 버튼 툴팁에 단축키 표시 |

### 유지보수성
| 항목 | 요구사항 |
|------|----------|
| **기존 코드 재사용** | markdownCommands.ts 로직 최대한 활용 |
| **타입 안전성** | TypeScript 타입 정의 완전 |
| **테스트 커버리지** | 단위 테스트 90% 이상 |
| **문서화** | API 문서 및 예시 코드 제공 |

---

## 6. UI/UX 요구사항

### 동작 방식

#### 시나리오 1: 커서만 있을 때 (선택 없음)
```
[상황]
커서 위치: "Hello |world"
사용자 액션: Bold 버튼 클릭

[결과]
새 텍스트: "Hello **bold text**|world"
커서 위치: "Hello **|bold text**world" (텍스트 선택 상태)
```

#### 시나리오 2: 텍스트 선택 시
```
[상황]
선택 영역: "Hello [world]"
사용자 액션: Bold 버튼 클릭

[결과]
새 텍스트: "Hello [**world**]"
선택 상태: "**world**" 부분이 선택된 상태 유지
```

#### 시나리오 3: 헤딩 적용
```
[상황]
선택 영역: "Important [Title] here"
사용자 액션: H1 버튼 클릭

[결과]
새 텍스트: "# Important Title here"
설명: 줄 전체에 헤딩 적용 (줄 시작으로 이동)
```

#### 시나리오 4: 멀티라인 리스트
```
[상황]
선택 영역:
"""
[First item
Second item
Third item]
"""
사용자 액션: Bullet List 버튼 클릭

[결과]
새 텍스트:
"""
[- First item
- Second item
- Third item]
"""
선택 상태: 변환된 전체 리스트가 선택된 상태
```

### 시각적 피드백

| 상태 | 피드백 | 지속 시간 |
|------|--------|-----------|
| **버튼 클릭** | 버튼 배경색 변화 + 리플 효과 | 200ms |
| **서식 적용 중** | 미세한 로딩 인디케이터 (50ms 이상 소요 시) | 적용 완료까지 |
| **서식 적용 완료** | 변환된 텍스트 0.5초간 하이라이트 (옵션) | 500ms |
| **오류 발생** | 버튼 빨간색 흔들림 + 토스트 메시지 | 2초 |

### 오류 처리

| 오류 상황 | 사용자 피드백 | 시스템 동작 |
|-----------|---------------|-------------|
| **EditorView 접근 불가** | "에디터를 사용할 수 없습니다" 토스트 | 콘솔 에러 로그 + Sentry 전송 |
| **선택 영역 추출 실패** | 조용히 폴백 (문서 끝에 삽입) | 콘솔 경고 로그 |
| **커서 복원 실패** | 서식만 적용하고 커서는 그대로 | 기능 동작은 완료 |
| **잘못된 명령** | "지원하지 않는 서식입니다" 토스트 | 아무 동작 안 함 |

---

## 7. 기술 제약사항

### 기존 아키텍처 제약
| 제약 사항 | 영향 | 해결 방안 |
|-----------|------|-----------|
| **CodeMirror 캡슐화** | Editor 컴포넌트가 EditorView를 private으로 관리 | useImperativeHandle로 필요한 메서드만 노출 |
| **Zustand 상태 관리** | content는 Zustand store로만 변경 | 서식 적용 후 setContent 호출 |
| **React 단방향 데이터 흐름** | CodeMirror ↔ React 동기화 이슈 | updateListener에서 상태 동기화 |

### CodeMirror 6 API 활용
| 필요 API | 용도 | 문서 |
|----------|------|------|
| `EditorView.state.selection.main` | 커서 위치 및 선택 영역 추출 | [Selection](https://codemirror.net/docs/ref/#state.EditorSelection) |
| `EditorView.dispatch` | 문서 내용 변경 및 커서 이동 | [Dispatch](https://codemirror.net/docs/ref/#view.EditorView.dispatch) |
| `EditorView.state.doc.toString()` | 현재 문서 내용 추출 | [Text](https://codemirror.net/docs/ref/#state.Text) |
| `EditorView.state.sliceDoc(from, to)` | 특정 범위 텍스트 추출 | [State](https://codemirror.net/docs/ref/#state.EditorState) |

### 플랫폼 호환성
| 플랫폼 | 지원 | 제약 사항 |
|--------|------|-----------|
| **Desktop** | 완전 지원 | 없음 |
| **Mobile (Touch)** | 지원 | 텍스트 선택 UX가 OS 기본 동작 따름 |
| **iPad (Keyboard)** | 완전 지원 | 단축키도 정상 작동 |

---

## 8. 마일스톤

### Phase 1: 커서 위치 삽입 (P0)
| 작업 | 담당 | 예상 공수 | 우선순위 |
|------|------|-----------|----------|
| FR-001: 커서 위치 감지 구현 | dev | 2시간 | P0 |
| FR-006: EditorView 참조 전달 | dev | 2시간 | P0 |
| FR-003: 커서 위치 삽입 로직 | dev | 3시간 | P0 |
| 단위 테스트 작성 | dev | 2시간 | P0 |
| 통합 테스트 | dev | 1시간 | P0 |

**Phase 1 완료 기준:**
- [ ] 툴바 버튼 클릭 시 커서 위치에 삽입
- [ ] 모든 툴바 버튼 (13종) 작동 확인
- [ ] 테스트 커버리지 90% 이상

### Phase 2: 선택 영역 서식 적용 (P0)
| 작업 | 담당 | 예상 공수 | 우선순위 |
|------|------|-----------|----------|
| FR-002: 선택 영역 감지 구현 | dev | 2시간 | P0 |
| FR-004: 선택 영역 서식 적용 | dev | 3시간 | P0 |
| FR-005: 커서 위치 복원 | dev | 2시간 | P0 |
| 단위 테스트 작성 | dev | 2시간 | P0 |
| 통합 테스트 | dev | 2시간 | P0 |

**Phase 2 완료 기준:**
- [ ] 선택된 텍스트에 서식 적용
- [ ] 서식 적용 후 커서 올바른 위치에 복원
- [ ] 인라인 서식 (Bold, Italic, Code, Link 등) 모두 작동
- [ ] 테스트 커버리지 90% 이상

### Phase 3: 고급 기능 (P1)
| 작업 | 담당 | 예상 공수 | 우선순위 |
|------|------|-----------|----------|
| FR-007: 멀티라인 리스트 변환 | dev | 3시간 | P1 |
| FR-008: 기존 서식 토글 | dev | 3시간 | P1 |
| FR-009: 단축키 연동 | dev | 2시간 | P1 |
| 단위 테스트 작성 | dev | 2시간 | P1 |
| 통합 테스트 | dev | 2시간 | P1 |

**Phase 3 완료 기준:**
- [ ] 여러 줄 선택 시 리스트 일괄 변환
- [ ] 서식 토글 기능 작동
- [ ] 단축키와 툴바 버튼 동작 일치
- [ ] 테스트 커버리지 90% 이상

### Phase 4: QA 및 최적화
| 작업 | 담당 | 예상 공수 | 우선순위 |
|------|------|-----------|----------|
| 성능 테스트 (대용량 문서) | qa | 2시간 | P0 |
| 브라우저 호환성 테스트 | qa | 3시간 | P0 |
| 접근성 테스트 (WCAG 2.1 AA) | qa | 2시간 | P0 |
| 모바일 테스트 | qa | 2시간 | P0 |
| 사용자 피드백 수집 | pm | 1일 | P1 |
| 버그 수정 및 최적화 | dev | 4시간 | P0 |

**Phase 4 완료 기준:**
- [ ] 성능 기준 충족 (응답 50ms 이내)
- [ ] 모든 지원 브라우저에서 정상 작동
- [ ] WCAG 2.1 AA 준수
- [ ] 모바일에서 정상 작동
- [ ] 치명적 버그 0개

---

## 9. 미결 사항

### 기술적 의사결정
- [ ] **EditorView 노출 방식**: useImperativeHandle vs. callback vs. ref 전달
  - 권장: useImperativeHandle (캡슐화 유지 + 타입 안전)

- [ ] **서식 적용 후 커서 위치**: 텍스트 내부 vs. 텍스트 선택 vs. 텍스트 끝
  - 권장: 텍스트 선택 (사용자가 결과를 바로 확인 가능)

- [ ] **서식 토글 기능**: Phase 3에 포함 vs. 별도 기능
  - 권장: Phase 3 포함 (사용자 경험 향상)

### UX 의사결정
- [ ] **멀티라인 헤딩**: 여러 줄 선택 시 헤딩 적용 방법
  - 옵션 1: 첫 줄만 헤딩 적용
  - 옵션 2: 각 줄에 헤딩 적용
  - 옵션 3: 오류 메시지 표시
  - 권장: 옵션 1 (일반적인 마크다운 에디터 동작)

- [ ] **서식 적용 애니메이션**: 변환된 텍스트 하이라이트 여부
  - 권장: 옵션으로 제공 (설정에서 ON/OFF)

### 향후 확장 가능성
- [ ] **서식 조합**: Bold + Italic 동시 적용 (***text***)
- [ ] **서식 제거**: 모든 서식 한 번에 제거 버튼
- [ ] **커스텀 단축키**: 사용자가 단축키 직접 설정
- [ ] **서식 히스토리**: Ctrl+Z로 서식만 되돌리기

---

## 10. 참고 자료

### 경쟁 제품 분석
| 제품 | 툴바 동작 | 장점 | 단점 |
|------|-----------|------|------|
| **Notion** | 선택 영역 기준, 서식 토글 지원 | 직관적, 빠름 | 마크다운 문법 노출 안 됨 |
| **Typora** | 선택 영역 기준, 실시간 변환 | WYSIWYG, 자연스러움 | 데스크톱 앱만 지원 |
| **GitHub Editor** | 선택 영역 기준, 미리보기 툴팁 | 마크다운 학습 용이 | 기능 제한적 |
| **StackEdit** | 커서 위치 기준, 서식 토글 없음 | 가벼움 | 사용자 경험 아쉬움 |

**벤치마크 목표:**
- Notion 수준의 직관성
- Typora 수준의 자연스러움
- GitHub Editor 수준의 마크다운 친화성

### 기술 문서
- [CodeMirror 6 Selection API](https://codemirror.net/docs/ref/#state.EditorSelection)
- [CodeMirror 6 State Management](https://codemirror.net/docs/guide/#state-and-updates)
- [React useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)

### 디자인 참고
- [Microsoft Word 툴바 UX](https://support.microsoft.com/en-us/office/formatting-toolbar-basics-in-word-8e5ea4e0-bccc-4c83-a4e0-f05ca43c6e33)
- [Google Docs 텍스트 서식](https://support.google.com/docs/answer/46973)
- [Notion 텍스트 편집](https://www.notion.so/help/keyboard-shortcuts)

---

## 부록: 현재 시스템 분석

### 현재 구현 상태
```typescript
// EditorWithToolbar.tsx (현재)
const handleCommand = useCallback((command: MarkdownCommand) => {
  const selection = {
    start: content.length,  // ❌ 항상 문서 끝
    end: content.length,
    selectedText: '',
  }
  const { newContent } = applyMarkdownCommand(content, selection, command)
  setContent(newContent)
}, [content, setContent])
```

### 개선 방향
```typescript
// EditorWithToolbar.tsx (개선 후)
const handleCommand = useCallback((command: MarkdownCommand) => {
  // ✅ 실제 커서 위치 및 선택 영역 가져오기
  const selection = editorViewRef.current?.getSelection() ?? {
    start: content.length,
    end: content.length,
    selectedText: '',
  }

  const { newContent, newSelectionStart, newSelectionEnd } =
    applyMarkdownCommand(content, selection, command)

  setContent(newContent)

  // ✅ 커서 위치 복원
  editorViewRef.current?.setSelection(newSelectionStart, newSelectionEnd)
}, [content, setContent])
```

### 변경 파일 목록
| 파일 | 변경 내용 | 영향도 |
|------|-----------|--------|
| `src/components/Editor/Editor.tsx` | EditorView 참조 노출 | 중간 |
| `src/components/Editor/EditorWithToolbar.tsx` | handleCommand 로직 개선 | 높음 |
| `src/hooks/useKeyboardShortcuts.ts` | 단축키도 커서 위치 기준 동작 | 낮음 |
| `src/utils/markdownCommands.ts` | 멀티라인 리스트 로직 추가 (선택) | 낮음 |

### 테스트 전략
| 테스트 유형 | 도구 | 커버리지 목표 |
|-------------|------|----------------|
| **단위 테스트** | Vitest | 90% 이상 |
| **통합 테스트** | React Testing Library | 주요 시나리오 100% |
| **E2E 테스트** | Playwright (선택) | 핵심 플로우 커버 |
| **성능 테스트** | React DevTools Profiler | 응답 50ms 이내 검증 |
| **접근성 테스트** | axe DevTools | WCAG 2.1 AA 준수 |

---

_작성일: 2026-01-16_
_버전: 1.0_
_상태: 검증 대기_
