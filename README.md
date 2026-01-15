# MD Preview

![Beta](https://img.shields.io/badge/상태-베타-yellow)
![License](https://img.shields.io/badge/라이선스-MIT-blue)
![PWA](https://img.shields.io/badge/PWA-지원-brightgreen)

React와 TypeScript로 만든 실시간 마크다운 에디터입니다.

<!--
![스크린샷](./screenshots/preview.png)
-->

> **데모:** 준비 중

---

## 주요 기능

### 실시간 프리뷰
- 입력과 동시에 미리보기
- 에디터-프리뷰 스크롤 동기화
- 드래그로 분할 비율 조절

### 스타일 프리셋
4가지 테마 중 선택:
- **GitHub** - 깃허브 마크다운 스타일
- **Notion** - 노션 스타일
- **VS Code** - 개발자 친화적 다크 테마
- **Minimal** - 깔끔한 미니멀 디자인

### PWA & 오프라인 지원
- 데스크톱/모바일 앱으로 설치 가능
- 서비스 워커로 오프라인 사용
- 로컬 스토리지 자동 저장

### 에디터 기능
- 문법 강조 (CodeMirror 6)
- 마크다운 툴바
- 키보드 단축키
- 다크/라이트/시스템 테마

### 목차 (TOC)
- 헤딩 기반 자동 생성
- 클릭으로 해당 섹션 이동
- 현재 섹션 하이라이트

### 파일 처리
- `.md` 파일 열기
- 마크다운 파일 다운로드
- 드래그 앤 드롭 지원

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18, TypeScript |
| 빌드 | Vite |
| 에디터 | CodeMirror 6 |
| 마크다운 | react-markdown, remark-gfm, rehype-highlight |
| 스타일링 | Tailwind CSS |
| 상태 관리 | Zustand |
| UI 컴포넌트 | Radix UI |
| PWA | vite-plugin-pwa |
| 테스트 | Vitest, Testing Library |

---

## 시작하기

### 요구 사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/Yang-woo/md-preview.git
cd md-preview

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 테스트

```bash
npm test
```

---

## 키보드 단축키

| 단축키 | 동작 |
|--------|------|
| `Ctrl/Cmd + B` | 굵게 |
| `Ctrl/Cmd + I` | 기울임 |
| `Ctrl/Cmd + K` | 링크 삽입 |
| `Ctrl/Cmd + S` | 저장 |
| `Ctrl/Cmd + Shift + P` | 프리뷰 토글 |

---

## 라이선스

MIT License

---

React + TypeScript로 제작
