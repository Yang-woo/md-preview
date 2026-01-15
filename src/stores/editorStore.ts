import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EditorState {
  content: string
  fileName: string
  isDirty: boolean
  lastSaved: number | null
}

export interface EditorActions {
  setContent: (content: string) => void
  setFileName: (fileName: string) => void
  markAsSaved: () => void
  loadFile: (fileName: string, content: string) => void
  reset: () => void
}

export type EditorStore = EditorState & EditorActions

const initialState: EditorState = {
  content: '',
  fileName: 'untitled.md',
  isDirty: false,
  lastSaved: null,
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      ...initialState,

      setContent: (content: string) =>
        set({ content, isDirty: true }),

      setFileName: (fileName: string) =>
        set({ fileName, isDirty: true }),

      markAsSaved: () =>
        set({ isDirty: false, lastSaved: Date.now() }),

      loadFile: (fileName: string, content: string) =>
        set({ fileName, content, isDirty: false, lastSaved: null }),

      reset: () =>
        set(initialState),
    }),
    {
      name: 'md-preview-editor',
      partialize: (state) => ({
        content: state.content,
        fileName: state.fileName,
        lastSaved: state.lastSaved,
      }),
    }
  )
)
