import '@testing-library/jest-dom'

// i18n mock for translation tests
// Returns the last segment of the translation key as the translated text
// e.g., "welcome:cta.later" -> "later"
// This provides better test readability than returning the full key
vi.mock('react-i18next', () => {
  const translations: Record<string, string> = {
    // common
    'common:saving': '저장 중...',
    'common:justSaved': '방금 저장됨',
    'common:saved': '저장됨',
    'common:unsaved': '(저장되지 않음)',
    'common:close': '닫기',
    'common:cancel': '취소',
    'common:confirm': '확인',
    'common:reset': '초기화',
    // header
    'header:openFile': '파일 열기',
    'header:download': '다운로드',
    'header:help': '도움말',
    'header:settings': '설정',
    // settings
    'settings:title': '설정',
    'settings:theme': '테마',
    'settings:themeLight': '라이트',
    'settings:themeDark': '다크',
    'settings:themeSystem': '시스템',
    'settings:stylePreset': '스타일 프리셋',
    'settings:styleMinimal': '미니멀',
    'settings:fontSize': '폰트 크기',
    'settings:editorSettings': '에디터 설정',
    'settings:scrollSync': '스크롤 동기화',
    'settings:autoSave': '자동 저장',
    'settings:language': '언어',
    'settings:languageKo': '한국어',
    'settings:languageEn': 'English',
    // welcome
    'welcome:title': '환영합니다!',
    'welcome:subtitle': 'Markdown Preview에 오신 것을 환영합니다',
    'welcome:feature.preview.title': '실시간 미리보기',
    'welcome:feature.preview.description': '마크다운을 작성하면 즉시 결과를 확인할 수 있습니다',
    'welcome:feature.styles.title': '다양한 스타일',
    'welcome:feature.styles.description': 'GitHub, Notion, VS Code 등 4가지 스타일 프리셋을 제공합니다',
    'welcome:feature.autoSave.title': '자동 저장',
    'welcome:feature.autoSave.description': '30초마다 자동으로 작업 내용을 저장합니다',
    'welcome:feature.shortcuts.title': '단축키 지원',
    'welcome:feature.shortcuts.description': 'Ctrl/Cmd + B, I, K 등 다양한 단축키를 지원합니다',
    'welcome:moreFeatures.title': '더 많은 기능',
    'welcome:moreFeatures.dragDrop': '파일 드래그 앤 드롭',
    'welcome:moreFeatures.toc': '목차(TOC) 자동 생성',
    'welcome:moreFeatures.theme': '라이트/다크 테마',
    'welcome:moreFeatures.highlight': '코드 블록 syntax highlighting',
    'welcome:moreFeatures.gfm': 'GFM(GitHub Flavored Markdown) 지원',
    'welcome:cta.title': '지금 시작하기',
    'welcome:cta.description': '샘플 마크다운으로 시작하거나, 바로 작성을 시작할 수 있습니다.',
    'welcome:cta.start': '시작하기 (샘플 로드)',
    'welcome:cta.later': '나중에',
    'welcome:tips.shortcut': '버튼을 클릭하면 모든 단축키를 확인할 수 있습니다',
    'welcome:tips.settings': '우측 상단의 설정 버튼에서 테마와 스타일을 변경할 수 있습니다',
    // help
    'help:title': '도움말',
    'help:keyboardShortcuts': '키보드 단축키',
    'help:shortcuts.bold': 'Bold',
    'help:shortcuts.italic': 'Italic',
    'help:shortcuts.link': '링크 삽입',
    'help:shortcuts.save': '저장/다운로드',
    'help:shortcuts.previewToggle': '미리보기 전환',
    // recovery
    'recovery:title': '저장되지 않은 내용 발견',
    'recovery:description': '이전 세션의 저장되지 않은 내용이 있습니다. 복구하시겠습니까?',
    'recovery:restore': '복구하기',
    'recovery:discard': '삭제하기',
    // pwa
    'pwa:title': '앱으로 설치하기',
    'pwa:description': 'Markdown Preview를 앱으로 설치하여 오프라인에서도 사용하세요.',
    'pwa:install': '설치',
    'pwa:later': '나중에',
    // toc
    'toc:title': '목차',
    'toc:empty': '목차가 없습니다',
    'toc:ariaLabel': '목차',
    // file
    'file:selectFile': '파일 선택',
    'file:dropZone.main': '.md 파일을 여기에 드래그 앤 드롭하세요',
    'file:dropZone.sub': '또는 아래 버튼을 클릭하여 파일을 선택하세요',
    // layout
    'layout:editor': '에디터',
    'layout:preview': '미리보기',
    'layout:sidebarOpen': '사이드바 열기',
    'layout:sidebarClose': '사이드바 닫기',
    // toolbar
    'toolbar:ariaLabel': '마크다운 툴바',
    'toolbar:bold.label': '굵게',
    'toolbar:italic.label': '기울임',
    'toolbar:strikethrough.label': '취소선',
    'toolbar:heading1.label': '제목 1',
    'toolbar:heading2.label': '제목 2',
    'toolbar:heading3.label': '제목 3',
    'toolbar:link.label': '링크 삽입',
    'toolbar:image.label': '이미지 삽입',
    'toolbar:inlineCode.label': '인라인 코드',
    'toolbar:codeBlock.label': '코드 블록',
    'toolbar:bulletList.label': '글머리 기호 목록',
    'toolbar:numberedList.label': '번호 매기기 목록',
    'toolbar:taskList.label': '작업 목록',
  }

  return {
    useTranslation: (namespace?: string) => ({
      t: (key: string, options?: Record<string, unknown>) => {
        // Build full key with namespace if provided
        const fullKey = namespace ? `${namespace}:${key}` : key

        // Check direct key match
        if (translations[fullKey]) {
          let result = translations[fullKey]
          // Handle interpolation
          if (options) {
            Object.entries(options).forEach(([k, v]) => {
              result = result.replace(`{{${k}}}`, String(v))
            })
          }
          return result
        }

        // Also try without namespace (for keys that already include namespace like 'common:close')
        if (translations[key]) {
          let result = translations[key]
          if (options) {
            Object.entries(options).forEach(([k, v]) => {
              result = result.replace(`{{${k}}}`, String(v))
            })
          }
          return result
        }

        // Fallback: return the key itself
        return key
      },
      i18n: {
        language: 'ko',
        changeLanguage: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
      },
    }),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  }
})

// matchMedia mock for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// IntersectionObserver mock for TOC/useActiveHeading
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(private callback: IntersectionObserverCallback) {}

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})
