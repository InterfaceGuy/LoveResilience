export interface Card {
  id: string
  name: string
  theme: string
  category?: string
  imagePath: string
  meaning?: string
  questions?: string[]
  actions?: string[]
}

export interface CardData {
  cards: Card[]
  backside: string
  cover: string
}

export type AppState = 'welcome' | 'centering' | 'selection' | 'viewing' | 'daily'

export interface Position {
  x: number
  y: number
  z: number
}