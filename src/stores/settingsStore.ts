import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type StylePreset = 'github' | 'notion' | 'vscode' | 'minimal'
export type FontSize = 'small' | 'medium' | 'large' | 'xl'

export interface SettingsState {
  theme: Theme
  stylePreset: StylePreset
  fontSize: FontSize
  lineHeight: number
  enableScrollSync: boolean
  enableAutoSave: boolean
  autoSaveInterval: number // seconds
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void
  setStylePreset: (preset: StylePreset) => void
  setFontSize: (size: FontSize) => void
  setLineHeight: (lineHeight: number) => void
  toggleScrollSync: () => void
  toggleAutoSave: () => void
  setAutoSaveInterval: (interval: number) => void
  reset: () => void
}

export type SettingsStore = SettingsState & SettingsActions

const initialState: SettingsState = {
  theme: 'system',
  stylePreset: 'github',
  fontSize: 'medium',
  lineHeight: 1.6,
  enableScrollSync: true,
  enableAutoSave: true,
  autoSaveInterval: 30,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme: Theme) =>
        set({ theme }),

      setStylePreset: (stylePreset: StylePreset) =>
        set({ stylePreset }),

      setFontSize: (fontSize: FontSize) =>
        set({ fontSize }),

      setLineHeight: (lineHeight: number) =>
        set({ lineHeight }),

      toggleScrollSync: () =>
        set((state) => ({ enableScrollSync: !state.enableScrollSync })),

      toggleAutoSave: () =>
        set((state) => ({ enableAutoSave: !state.enableAutoSave })),

      setAutoSaveInterval: (autoSaveInterval: number) =>
        set({ autoSaveInterval }),

      reset: () =>
        set(initialState),
    }),
    {
      name: 'md-preview-settings',
    }
  )
)
