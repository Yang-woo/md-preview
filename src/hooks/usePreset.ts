import { useSettingsStore, type StylePreset } from '../stores'

export function usePreset() {
  const { stylePreset, setStylePreset } = useSettingsStore()

  const presets: StylePreset[] = ['github', 'notion', 'vscode', 'minimal']

  const changePreset = (preset: StylePreset) => {
    setStylePreset(preset)
  }

  return {
    currentPreset: stylePreset,
    presets,
    changePreset,
  }
}
