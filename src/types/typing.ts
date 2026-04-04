export type TestMode =
  | 'words'
  | 'sentences'
  | 'paragraphs'
  | 'numbers'
  | 'symbols'
  | 'code'
  | 'custom'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type TimerMode = { kind: 'countdown'; seconds: number } | { kind: 'custom'; seconds: number }

export type TypingResult = {
  id: string
  startedAt: number
  finishedAt: number
  mode: TestMode
  difficulty: Difficulty
  language: 'en' | 'ne'
  durationSec: number
  typedChars: number
  correctChars: number
  incorrectChars: number
  wpm: number
  cpm: number
  accuracy: number
  slowKeys: string[]
  weakKeys: string[]
  textHash: string
}

