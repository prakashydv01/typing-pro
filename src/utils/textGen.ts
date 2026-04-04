import type { Difficulty, TestMode } from '../types/typing'
import { EN_WORDS } from '../data/englishWords'
import { NE_WORDS } from '../data/nepaliWords'

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function wordFilterByDifficulty(words: string[], difficulty: Difficulty) {
  if (difficulty === 'easy') return words.filter((w) => w.length <= 5)
  if (difficulty === 'hard') return words.filter((w) => w.length >= 6)
  return words
}

export function generateText(opts: {
  mode: TestMode
  difficulty: Difficulty
  language: 'en' | 'ne'
  wordCount?: number
  customText?: string
}): string {
  const { mode, difficulty, language, wordCount = 60, customText } = opts
  if (mode === 'custom' && customText?.trim()) return customText.trim()

  if (mode === 'numbers') {
    const parts = Array.from({ length: wordCount }, () =>
      String(randInt(0, difficulty === 'easy' ? 99 : difficulty === 'hard' ? 9999 : 999)),
    )
    return parts.join(' ')
  }

  if (mode === 'symbols') {
    const pool = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', ',', '.', '/', '?']
    const parts = Array.from({ length: wordCount }, () => pick(pool) + pick(pool))
    return parts.join(' ')
  }

  if (mode === 'code') {
    const snippets = [
      `function sum(a, b) { return a + b; }`,
      `const items = [1, 2, 3].map(x => x * 2);`,
      `for (let i = 0; i < 10; i++) { console.log(i); }`,
      `type User = { id: string; name: string; };`,
      `if (value == null) throw new Error("Missing value");`,
    ]
    const count = Math.max(2, Math.floor(wordCount / 20))
    return Array.from({ length: count }, () => pick(snippets)).join('\n')
  }

  const wordsBase = language === 'ne' ? NE_WORDS : EN_WORDS
  const words = wordFilterByDifficulty(wordsBase, difficulty)
  const safeWords = words.length ? words : wordsBase

  if (mode === 'sentences') {
    const sentenceCount = Math.max(3, Math.floor(wordCount / 12))
    const sentences = Array.from({ length: sentenceCount }, () => {
      const len = randInt(8, difficulty === 'easy' ? 10 : difficulty === 'hard' ? 16 : 12)
      const w = Array.from({ length: len }, () => pick(safeWords))
      const s = w.join(' ')
      return s.charAt(0).toUpperCase() + s.slice(1) + '.'
    })
    return sentences.join(' ')
  }

  if (mode === 'paragraphs') {
    const paraCount = 2
    const paragraphs: string[] = Array.from({ length: paraCount }, () => {
      const sentences = randInt(3, difficulty === 'easy' ? 4 : difficulty === 'hard' ? 6 : 5)
      return generateText({ mode: 'sentences', difficulty, language, wordCount: sentences * 12 })
    })
    return paragraphs.join('\n\n')
  }

  // words
  const parts = Array.from({ length: wordCount }, () => pick(safeWords))
  return parts.join(' ')
}

export function hashText(text: string) {
  // fast, non-crypto, deterministic
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

