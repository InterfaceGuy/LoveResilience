import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock import.meta.glob before importing the module
const mockGlob = vi.fn()

Object.defineProperty(import.meta, 'glob', {
  value: mockGlob,
  writable: true
})

// Import after setting up mocks
const { loadCardData } = await import('../data/cardLoader')

describe('cardLoader', () => {
  const mockCardModules = {
    '/CardSet/0_let_the_light_in.jpg': () => Promise.resolve('/CardSet/0_let_the_light_in.jpg'),
    '/CardSet/1_accept_yourself.jpg': () => Promise.resolve('/CardSet/1_accept_yourself.jpg'),
    '/CardSet/47_priority_DISCIPLINE_CAUSAL_ANALYSIS.jpg': () => Promise.resolve('/CardSet/47_priority_DISCIPLINE_CAUSAL_ANALYSIS.jpg'),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockGlob.mockReturnValue(mockCardModules)
  })

  it('loads and parses card data correctly', async () => {
    const cardData = await loadCardData()
    
    expect(cardData).toHaveProperty('cards')
    expect(cardData).toHaveProperty('backside', '/Backside.jpg')
    expect(cardData).toHaveProperty('cover', '/Cover.png')
    
    expect(cardData.cards).toHaveLength(3)
    
    // Check first card
    const firstCard = cardData.cards.find(card => card.id === '0')
    expect(firstCard).toEqual({
      id: '0',
      name: '0_let_the_light_in',
      theme: 'let the light in',
      category: undefined,
      imagePath: '/CardSet/0_let_the_light_in.jpg',
      meaning: 'Reflect on the energy of let the light in. What does this mean for you in this moment?',
      questions: [
        'How does let the light in show up in your life right now?',
        'What would change if you embraced this energy more fully?',
        'What small action could honor this guidance today?'
      ],
      actions: [
        'Take three deep breaths and feel into this message',
        'Journal about how this theme relates to your current situation',
        'Set an intention to embody this energy today'
      ]
    })
    
    // Check card with category
    const cardWithCategory = cardData.cards.find(card => card.id === '47')
    expect(cardWithCategory?.theme).toBe('priority')
    expect(cardWithCategory?.category).toBe('DISCIPLINE_CAUSAL_ANALYSIS')
  })

  it('sorts cards by ID correctly', async () => {
    const cardData = await loadCardData()
    
    const cardIds = cardData.cards.map(card => parseInt(card.id))
    const sortedIds = [...cardIds].sort((a, b) => a - b)
    
    expect(cardIds).toEqual(sortedIds)
  })

  it('handles empty card set', async () => {
    mockGlob.mockReturnValue({})
    
    const cardData = await loadCardData()
    
    expect(cardData.cards).toHaveLength(0)
    expect(cardData.backside).toBe('/Backside.jpg')
    expect(cardData.cover).toBe('/Cover.png')
  })

  it('parses file names correctly', async () => {
    const testModules = {
      '/CardSet/25_grounding_IMPULSE_CONTROL.jpg': () => Promise.resolve('/CardSet/25_grounding_IMPULSE_CONTROL.jpg'),
      '/CardSet/35_let_the_light_in_POSITIVE_EMOTIONS.jpg': () => Promise.resolve('/CardSet/35_let_the_light_in_POSITIVE_EMOTIONS.jpg'),
      '/CardSet/42_music.jpg': () => Promise.resolve('/CardSet/42_music.jpg'),
    }
    
    mockGlob.mockReturnValue(testModules)
    
    const cardData = await loadCardData()
    
    // Test card with category
    const groundingCard = cardData.cards.find(card => card.id === '25')
    expect(groundingCard?.theme).toBe('grounding')
    expect(groundingCard?.category).toBe('IMPULSE_CONTROL')
    
    // Test card with multi-word theme and category
    const lightCard = cardData.cards.find(card => card.id === '35')
    expect(lightCard?.theme).toBe('let the light in')
    expect(lightCard?.category).toBe('POSITIVE_EMOTIONS')
    
    // Test card without category
    const musicCard = cardData.cards.find(card => card.id === '42')
    expect(musicCard?.theme).toBe('music')
    expect(musicCard?.category).toBeUndefined()
  })
})