import { useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useAppStore } from '../store/useAppStore'
import { SafeTexture } from './TextureLoader'
import * as THREE from 'three'
import { useRef } from 'react'

const DailyCard3D = ({ imagePath }: { imagePath: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const { scale, rotationY } = useSpring({
    from: { scale: 0, rotationY: Math.PI },
    to: { scale: 1, rotationY: 0 },
    config: { tension: 200, friction: 60 }
  })
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })
  
  return (
    <SafeTexture url={imagePath}>
      {(texture) => (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <a.mesh ref={meshRef} scale={scale} rotation-y={rotationY}>
            <planeGeometry args={[2.5, 3.8]} />
            <meshStandardMaterial
              map={texture}
              transparent
              side={THREE.DoubleSide}
            />
          </a.mesh>
        </Float>
      )}
    </SafeTexture>
  )
}

const SunRays = () => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 4,
            Math.sin((i / 12) * Math.PI * 2) * 4,
            0
          ]}
          rotation={[0, 0, (i / 12) * Math.PI * 2]}
        >
          <planeGeometry args={[0.1, 2]} />
          <meshBasicMaterial
            color="#d4af37"
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

export const DailyCard = () => {
  const { getDailyCard, selectedCard, setState } = useAppStore()
  
  useEffect(() => {
    getDailyCard()
  }, [getDailyCard])
  
  if (!selectedCard) {
    return (
      <div className="daily-loading">
        <p>Preparing your daily card...</p>
      </div>
    )
  }
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="daily-container">
      <div className="daily-header">
        <h1 className="daily-title">Your Card for Today</h1>
        <p className="daily-date">{currentDate}</p>
      </div>
      
      <div className="daily-card-display">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />
          
          <SunRays />
          <DailyCard3D imagePath={selectedCard.imagePath} />
          
          <Text
            position={[0, -3, 0]}
            fontSize={0.8}
            color="#5a5a5a"
            anchorX="center"
            anchorY="middle"
            fontWeight="300"
          >
            {selectedCard.theme}
          </Text>
        </Canvas>
      </div>
      
      <div className="daily-content">
        <div className="daily-message">
          <h3>Today's Message</h3>
          <p>{selectedCard.meaning}</p>
        </div>
        
        <div className="daily-intention">
          <h3>Intention for Today</h3>
          <p>How might you embody the energy of <strong>{selectedCard.theme}</strong> in your day?</p>
        </div>
      </div>
      
      <div className="daily-actions">
        <button 
          className="action-button primary"
          onClick={() => setState('viewing')}
        >
          Explore Deeper
        </button>
        
        <button 
          className="action-button secondary"
          onClick={() => setState('centering')}
        >
          Draw Another Card
        </button>
        
        <button 
          className="action-button secondary"
          onClick={() => setState('welcome')}
        >
          Return Home
        </button>
      </div>
      
      <style>{`
        .daily-container {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #f5f3f0 0%, #faf8f5 50%, #e8e4e0 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          overflow-y: auto;
        }
        
        .daily-loading {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
        }
        
        .daily-loading p {
          color: #8a8a8a;
          font-size: 1.1rem;
        }
        
        .daily-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .daily-title {
          font-size: 2.5rem;
          color: #5a5a5a;
          font-weight: 300;
          margin-bottom: 0.5rem;
        }
        
        .daily-date {
          color: #8a8a8a;
          font-size: 1.1rem;
          font-weight: 400;
        }
        
        .daily-card-display {
          width: 100%;
          max-width: 500px;
          height: 400px;
          margin: 1rem 0;
        }
        
        .daily-content {
          max-width: 600px;
          margin: 1rem 0;
          text-align: center;
        }
        
        .daily-message, .daily-intention {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        
        .daily-message h3, .daily-intention h3 {
          color: #d4af37;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .daily-message p, .daily-intention p {
          color: #6a6a6a;
          line-height: 1.6;
          font-size: 1rem;
        }
        
        .daily-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .action-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
        }
        
        .action-button.primary {
          background: linear-gradient(135deg, #d4af37, #b8941f);
          color: white;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
        
        .action-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }
        
        .action-button.secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #5a5a5a;
          border: 2px solid #d4af37;
        }
        
        .action-button.secondary:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .daily-container {
            padding: 1rem;
          }
          
          .daily-title {
            font-size: 2rem;
          }
          
          .daily-date {
            font-size: 1rem;
          }
          
          .daily-card-display {
            height: 300px;
          }
          
          .daily-content {
            max-width: 90%;
          }
          
          .daily-message, .daily-intention {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          
          .daily-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .action-button {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  )
}