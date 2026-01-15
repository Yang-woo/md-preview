import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'split' | 'editor' | 'preview'

export interface UIState {
  sidebarOpen: boolean
  settingsModalOpen: boolean
  helpModalOpen: boolean
  viewMode: ViewMode
  splitRatio: number // 0-100, percentage for editor width
  editorScrollPosition: number
  previewScrollPosition: number
}

export interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
  openHelpModal: () => void
  closeHelpModal: () => void
  setViewMode: (mode: ViewMode) => void
  setSplitRatio: (ratio: number) => void
  setEditorScrollPosition: (position: number) => void
  setPreviewScrollPosition: (position: number) => void
}

export type UIStore = UIState & UIActions

const initialState: UIState = {
  sidebarOpen: true,
  settingsModalOpen: false,
  helpModalOpen: false,
  viewMode: 'split',
  splitRatio: 50,
  editorScrollPosition: 0,
  previewScrollPosition: 0,
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ...initialState,

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (sidebarOpen: boolean) =>
        set({ sidebarOpen }),

      openSettingsModal: () =>
        set({ settingsModalOpen: true }),

      closeSettingsModal: () =>
        set({ settingsModalOpen: false }),

      openHelpModal: () =>
        set({ helpModalOpen: true }),

      closeHelpModal: () =>
        set({ helpModalOpen: false }),

      setViewMode: (viewMode: ViewMode) =>
        set({ viewMode }),

      setSplitRatio: (splitRatio: number) =>
        set({ splitRatio: Math.max(20, Math.min(80, splitRatio)) }),

      setEditorScrollPosition: (position: number) =>
        set({ editorScrollPosition: Math.max(0, position) }),

      setPreviewScrollPosition: (position: number) =>
        set({ previewScrollPosition: Math.max(0, position) }),
    }),
    {
      name: 'md-preview-ui',
      partialize: (state) => ({
        viewMode: state.viewMode,
        splitRatio: state.splitRatio,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
