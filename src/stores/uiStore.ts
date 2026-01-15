import { create } from 'zustand'

export type ViewMode = 'split' | 'editor' | 'preview'

export interface UIState {
  sidebarOpen: boolean
  settingsModalOpen: boolean
  helpModalOpen: boolean
  viewMode: ViewMode
  splitRatio: number // 0-100, percentage for editor width
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
}

export type UIStore = UIState & UIActions

const initialState: UIState = {
  sidebarOpen: true,
  settingsModalOpen: false,
  helpModalOpen: false,
  viewMode: 'split',
  splitRatio: 50,
}

export const useUIStore = create<UIStore>((set) => ({
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
}))
