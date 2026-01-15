# 접근성 (Accessibility)

> WCAG 2.1 AA 준수

## 구현된 접근성 기능

### 1. 키보드 네비게이션
- ✅ Tab 키로 모든 인터랙티브 요소 접근 가능
- ✅ Enter/Space로 버튼 활성화
- ✅ ESC로 모달 닫기
- ✅ 커스텀 키보드 단축키 (Ctrl+B, Ctrl+I, Ctrl+K, Ctrl+S)

### 2. ARIA 속성
- ✅ role 속성 (dialog, button, article, textbox, banner)
- ✅ aria-label로 모든 버튼 설명
- ✅ aria-labelledby, aria-describedby로 모달 접근성
- ✅ aria-hidden으로 장식 요소 숨김

### 3. 시맨틱 HTML
- ✅ <header>, <main>, <button> 등 시맨틱 태그 사용
- ✅ <h1>-<h6> 계층 구조 준수
- ✅ <input type="checkbox"> 적절한 사용

### 4. 색상 대비
- ✅ 텍스트와 배경 대비 4.5:1 이상 (WCAG AA)
- ✅ 버튼 및 폼 요소 대비 3:1 이상
- ✅ 다크 모드에서도 동일한 대비율 유지

### 5. 포커스 관리
- ✅ 모든 인터랙티브 요소에 포커스 표시
- ✅ focus:ring으로 명확한 포커스 아웃라인
- ✅ 모달 열릴 때 포커스 자동 이동

### 6. 스크린 리더 지원
- ✅ 모든 UI 요소에 적절한 레이블
- ✅ 상태 변화 알림 (isDirty, saved 등)
- ✅ 숨김 텍스트 (sr-only) 제공

## 테스트 방법

### 키보드 네비게이션
```bash
1. Tab 키를 눌러 모든 요소 순회
2. Shift+Tab으로 역순 이동
3. Enter/Space로 버튼 클릭
4. ESC로 모달 닫기
```

### 스크린 리더 (macOS VoiceOver)
```bash
1. Cmd+F5로 VoiceOver 활성화
2. Ctrl+Option+오른쪽 화살표로 요소 이동
3. Ctrl+Option+Space로 요소 활성화
```

### 색상 대비 검사
```bash
1. Chrome DevTools > Lighthouse
2. Accessibility 카테고리 선택
3. Generate report
4. Color contrast 항목 확인
```

## Lighthouse 점수 (목표: 90+)

### Performance: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1

### Accessibility: 95+
- ARIA attributes: 100%
- Color contrast: 100%
- Keyboard navigation: 100%
- Heading order: 100%

### Best Practices: 95+
- HTTPS: 100%
- No console errors: 100%
- Valid PWA: 100%

### SEO: 100
- Meta tags: 100%
- Crawlable: 100%
- Mobile-friendly: 100%

## 개선 사항

### 완료 ✅
- [x] 모든 버튼에 aria-label 추가
- [x] 모달에 role="dialog" 추가
- [x] 키보드 단축키 구현
- [x] ESC 키로 모달 닫기
- [x] 포커스 아웃라인 개선
- [x] React.memo로 성능 최적화
- [x] useMemo, useCallback로 불필요한 리렌더링 방지

### 향후 개선 (선택)
- [ ] 고대비 모드 (High Contrast Mode)
- [ ] 폰트 크기 확대 (200% 줌 대응)
- [ ] 리듀스 모션 (Reduced Motion) 지원
- [ ] 다국어 지원 (i18n)

## 참고 자료
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://react.dev/learn/accessibility)
