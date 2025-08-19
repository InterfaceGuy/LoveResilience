import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppStore } from '../store/useAppStore'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useAppStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useAppStore.getState().reset()
  })

  it('initializes with correct default state', () => {
    const state = useAppStore.getState()
    
    expect(state.currentState).toBe('welcome')
    expect(state.cardData).toBeNull()
    expect(state.selectedCard).toBeNull()
    expect(state.shuffledCards).toEqual([])
    expect(state.dailyCard).toBeNull()
    expect(state.centeringProgress).toBe(0)
  })

  it('sets current state correctly', () => {
    const { setState } = useAppStore.getState()
    
    setState('centering')
    expect(useAppStore.getState().currentState).toBe('centering')
    
    setState('selection')
    expect(useAppStore.getState().currentState).toBe('selection')
  })

  it('sets and shuffles card data', () => {
    const mockCardData = {
      cards: [
        { id: '1', name: 'card1', theme: 'theme1', imagePath: '/path1.jpg' },
        { id: '2', name: 'card2', theme: 'theme2', imagePath: '/path2.jpg' },
        { id: '3', name: 'card3', theme: 'theme3', imagePath: '/path3.jpg' }
      ],
      backside: '/backside.jpg',
      cover: '/cover.png'
    }

    const { setCardData } = useAppStore.getState()
    setCardData(mockCardData)
    
    const state = useAppStore.getState()
    expect(state.cardData).toEqual(mockCardData)
    expect(state.shuffledCards).toHaveLength(3)
    // Cards should be shuffled (order might be different)
    expect(state.shuffledCards).toEqual(expect.arrayContaining(mockCardData.cards))
  })

  it('selects random card correctly', () => {
    const mockCardData = {
      cards: [
        { id: '1', name: 'card1', theme: 'theme1', imagePath: '/path1.jpg' },
        { id: '2', name: 'card2', theme: 'theme2', imagePath: '/path2.jpg' }
      ],
      backside: '/backside.jpg',
      cover: '/cover.png'
    }

    const { setCardData, selectRandomCard } = useAppStore.getState()
    setCardData(mockCardData)
    
    const selectedCard = selectRandomCard()
    
    expect(selectedCard).toBeDefined()
    expect(mockCardData.cards).toContain(selectedCard)
    expect(useAppStore.getState().selectedCard).toBe(selectedCard)
  })

  it('returns null when selecting random card with no data', () => {
    const { selectRandomCard } = useAppStore.getState()
    const result = selectRandomCard()
    
    expect(result).toBeNull()
    expect(useAppStore.getState().selectedCard).toBeNull()
  })

  it('generates daily card based on date', () => {
    localStorageMock.getItem.mockReturnValue('testUser')
    
    const mockCardData = {
      cards: [
        { id: '1', name: 'card1', theme: 'theme1', imagePath: '/path1.jpg' },
        { id: '2', name: 'card2', theme: 'theme2', imagePath: '/path2.jpg' }
      ],
      backside: '/backside.jpg',
      cover: '/cover.png'
    }

    const { setCardData, getDailyCard } = useAppStore.getState()
    setCardData(mockCardData)
    
    const dailyCard1 = getDailyCard()
    const dailyCard2 = getDailyCard()
    
    expect(dailyCard1).toBeDefined()
    expect(dailyCard1).toBe(dailyCard2) // Should return same card on same day
    expect(mockCardData.cards).toContain(dailyCard1)
  })

  it('sets centering progress', () => {
    const { setCenteringProgress } = useAppStore.getState()
    
    setCenteringProgress(0.5)
    expect(useAppStore.getState().centeringProgress).toBe(0.5)
    
    setCenteringProgress(1.0)
    expect(useAppStore.getState().centeringProgress).toBe(1.0)
  })

  it('resets state correctly', () => {
    const { setState, setSelectedCard, setCenteringProgress, reset } = useAppStore.getState()
    
    // Set some state
    setState('viewing')
    setSelectedCard({ id: '1', name: 'test', theme: 'test', imagePath: '/test.jpg' })
    setCenteringProgress(0.8)
    
    // Reset
    reset()
    
    const state = useAppStore.getState()
    expect(state.currentState).toBe('welcome')
    expect(state.selectedCard).toBeNull()
    expect(state.centeringProgress).toBe(0)
  })
})