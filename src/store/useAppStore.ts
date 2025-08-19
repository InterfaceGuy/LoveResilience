import { create } from 'zustand'
import { Card, CardData, AppState } from '../types/Card'

interface AppStore {
  // State
  currentState: AppState
  cardData: CardData | null
  selectedCard: Card | null
  shuffledCards: Card[]
  dailyCard: Card | null
  centeringProgress: number
  
  // Actions
  setState: (state: AppState) => void
  setCardData: (data: CardData) => void
  setSelectedCard: (card: Card | null) => void
  shuffleCards: () => void
  selectRandomCard: () => Card | null
  getDailyCard: () => Card | null
  setCenteringProgress: (progress: number) => void
  reset: () => void
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const getDailyCardId = (): string => {
  const today = new Date().toDateString()
  const userId = localStorage.getItem('loveResilience_userId') || 'default'
  const seed = today + userId
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  return Math.abs(hash).toString()
}

export const useAppStore = create<AppStore>((set, get) => ({
  currentState: 'welcome',
  cardData: null,
  selectedCard: null,
  shuffledCards: [],
  dailyCard: null,
  centeringProgress: 0,
  
  setState: (state) => set({ currentState: state }),
  
  setCardData: (data) => {
    set({ cardData: data })
    get().shuffleCards()
  },
  
  setSelectedCard: (card) => set({ selectedCard: card }),
  
  shuffleCards: () => {
    const { cardData } = get()
    if (cardData) {
      const shuffled = shuffleArray(cardData.cards)
      set({ shuffledCards: shuffled })
    }
  },
  
  selectRandomCard: () => {
    const { cardData } = get()
    if (!cardData || cardData.cards.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * cardData.cards.length)
    const card = cardData.cards[randomIndex]
    set({ selectedCard: card })
    return card
  },
  
  getDailyCard: () => {
    const { cardData, dailyCard } = get()
    if (!cardData || cardData.cards.length === 0) return null
    
    if (dailyCard) return dailyCard
    
    const dailyCardId = getDailyCardId()
    const cardIndex = parseInt(dailyCardId) % cardData.cards.length
    const card = cardData.cards[cardIndex]
    
    set({ dailyCard: card, selectedCard: card })
    return card
  },
  
  setCenteringProgress: (progress) => set({ centeringProgress: progress }),
  
  reset: () => set({
    currentState: 'welcome',
    selectedCard: null,
    centeringProgress: 0
  })
}))