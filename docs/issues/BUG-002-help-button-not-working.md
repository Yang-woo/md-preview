# BUG-002: 헤더 Help(?) 버튼 클릭 시 무반응

## 메타 정보
| 항목 | 값 |
|------|-----|
| ID | BUG-002 |
| 타입 | BUG |
| 상태 | **RESOLVED** ✅ |
| 생성일 | 2026-01-16 |
| 복잡도 | 2/10 |

## 문제 설명

### 현상
헤더의 Help(?) 버튼 클릭 시 아무 반응이 없음.

### 재현 방법
1. 애플리케이션 실행
2. 헤더 우측의 ? 버튼 클릭
3. 아무 일도 일어나지 않음

### 예상 동작
- 키보드 단축키 도움말 모달이 열림

### 실제 동작
- 클릭 이벤트는 발생하나 모달이 표시되지 않음

## 원인 분석

### 근본 원인
`KeyboardHelp` 모달 컴포넌트가 **App.tsx에서 렌더링되지 않음**.

### 발생 위치
- **정상**: `src/components/Layout/Header.tsx:63` - `onHelpClick={openHelpModal}` 연결됨
- **정상**: `src/stores/uiStore.ts:52-53` - `openHelpModal` 액션 존재
- **미구현**: `src/App.tsx` - `KeyboardHelp` 컴포넌트 미렌더링
- **존재**: `src/components/common/KeyboardHelp.tsx` - 컴포넌트 구현됨

### 문제 코드
```tsx
// src/App.tsx - 현재 상태
function App() {
  return (
    <>
      <Layout />
      <SettingsModal />
      <PWAInstallPrompt />
      {/* KeyboardHelp 누락! */}
    </>
  )
}
```

### 영향 파일
| 파일 | 영향도 | 수정 필요 |
|------|--------|-----------|
| `src/App.tsx` | 높음 | ✅ |
| `src/components/common/KeyboardHelp.tsx` | 낮음 | ❌ (이미 구현됨) |

## 수정 계획

### 수정 방향
```tsx
// src/App.tsx - 수정 후
import { KeyboardHelp } from './components/common'

function App() {
  return (
    <>
      <Layout />
      <SettingsModal />
      <KeyboardHelp />  // 추가
      <PWAInstallPrompt />
    </>
  )
}
```

## 처리 이력
| 일시 | 액션 | 담당 |
|------|------|------|
| 2026-01-16 | 이슈 생성 | bug-receiver |
| 2026-01-16 | 코드 수정 | bug-fixer |
| 2026-01-16 | 테스트 통과 | bug-fixer |
| 2026-01-16 | **이슈 해결** | issue-committer |

## 수정 내역
- `src/components/common/HelpModal.tsx` 신규 생성
- `src/components/common/index.ts` export 추가
- `src/App.tsx` HelpModal 렌더링 추가
