import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import * as cardLoader from '../data/cardLoader'

// Mock the card loader
vi.mock('../data/cardLoader', () => ({
  loadCardData: vi.fn()
}))

// Mock three.js components that cause issues in tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useFrame: () => null,
  useThree: () => ({ viewport: { width: 1, height: 1 }, camera: { position: { lerp: vi.fn() }, lookAt: vi.fn() } })
}))

vi.mock('@react-three/drei', () => ({
  Text: ({ children, ...props }: any) => <div data-testid="text" {...props}>{children}</div>,
  Float: ({ children }: any) => <div>{children}</div>,
  useTexture: () => ({})
}))

vi.mock('@react-spring/three', () => ({
  useSpring: () => ({ scale: 1, rotationY: 0 }),
  a: {
    mesh: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

const mockCardData = {
  cards: [
    {
      id: '0',
      name: 'test_card',
      theme: 'test theme',
      imagePath: '/test.jpg',
      meaning: 'Test meaning',
      questions: ['Test question?'],
      actions: ['Test action']
    }
  ],
  backside: '/Backside.jpg',
  cover: '/Cover.png'
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(cardLoader.loadCardData).mockResolvedValue(mockCardData)
  })

  it('shows loading screen initially', () => {
    render(<App />)
    expect(screen.getByText('Loading your cards...')).toBeInTheDocument()
  })

  it('loads card data on mount', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(cardLoader.loadCardData).toHaveBeenCalled()
    })
  })

  it('renders welcome screen components', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Card of the Day')).toBeInTheDocument()
      expect(screen.getByText('Draw a Card')).toBeInTheDocument()
    })
  })
})