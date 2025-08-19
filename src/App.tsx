import { useEffect, Suspense } from 'react'
import { useAppStore } from './store/useAppStore'
import { loadCardData } from './data/cardLoader'
import { Welcome } from './components/Welcome'
import { Centering } from './components/Centering'
import { CardSelection } from './components/CardSelection'
import { CardViewing } from './components/CardViewing'
import { DailyCard } from './components/DailyCard'

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-content">
      <div className="loading-orb"></div>
      <p>Loading your cards...</p>
    </div>
    
    <style>{`
      .loading-screen {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
      }
      
      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }
      
      .loading-orb {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d4af37, #b8941f);
        opacity: 0.6;
        animation: pulse 2s ease-in-out infinite;
      }
      
      .loading-content p {
        color: #8a8a8a;
        font-size: 1.1rem;
        font-weight: 400;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
    `}</style>
  </div>
)

function App() {
  const { currentState, setCardData, cardData } = useAppStore()
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = await loadCardData()
        setCardData(data)
      } catch (error) {
        console.error('Failed to load card data:', error)
      }
    }
    
    initializeApp()
  }, [setCardData])
  
  if (!cardData) {
    return <LoadingScreen />
  }
  
  return (
    <div className="app">
      <Suspense fallback={<LoadingScreen />}>
        {currentState === 'welcome' && <Welcome />}
        {currentState === 'centering' && <Centering />}
        {currentState === 'selection' && <CardSelection />}
        {currentState === 'viewing' && <CardViewing />}
        {currentState === 'daily' && <DailyCard />}
      </Suspense>
      
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
          font-smooth: antialiased;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          margin: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
        }
        
        #root {
          width: 100vw;
          height: 100vh;
        }
        
        .app {
          width: 100%;
          height: 100%;
        }
        
        button {
          font-family: inherit;
        }
        
        canvas {
          outline: none;
          touch-action: none;
        }
      `}</style>
    </div>
  )
}

export default App