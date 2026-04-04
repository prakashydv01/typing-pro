import { useEffect, useMemo } from 'react'
import { useSettingsStore } from '../store/settingsStore'

function makeOscillatorSound(freq: number, durationMs: number, volume: number) {
  const AudioContextImpl =
    window.AudioContext || (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext
  if (!AudioContextImpl) return () => {}

  const ctx = new AudioContextImpl()
  return () => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.value = volume
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    setTimeout(() => {
      o.stop()
    }, durationMs)
  }
}

export function SoundToggle() {
  const soundsEnabled = useSettingsStore((s) => s.soundsEnabled)
  const setSoundsEnabled = useSettingsStore((s) => s.setSoundsEnabled)

  const click = useMemo(() => makeOscillatorSound(880, 25, 0.03), [])

  useEffect(() => {
    // warm audio on first gesture
    const onKeyDown = () => {}
    window.addEventListener('keydown', onKeyDown, { once: true })
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <button
      type="button"
      className="btn-ghost border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
      onClick={() => {
        click()
        setSoundsEnabled(!soundsEnabled)
      }}
      aria-pressed={soundsEnabled}
      title="Toggle sounds"
    >
      {soundsEnabled ? 'Sound: On' : 'Sound: Off'}
    </button>
  )
}

