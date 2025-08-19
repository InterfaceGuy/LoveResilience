import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Text } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../types/Card'
import * as THREE from 'three'

interface Card3DProps {
  position: [number, number, number]
  card: Card
  backside: string
  isHovered: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
}

const Card3D = ({ position, backside, isHovered, onClick, onHover }: Card3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const backsideTexture = useTexture(backside)
  
  const { scale, rotationY } = useSpring({
    scale: isHovered ? 1.1 : 1,
    rotationY: isHovered ? 0.1 : 0,
    config: { tension: 300, friction: 30 }
  })
  
  return (
    <a.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      rotation-y={rotationY}
      onClick={onClick}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <planeGeometry args={[1.2, 1.8]} />
      <meshStandardMaterial
        map={backsideTexture}
        transparent
        side={THREE.DoubleSide}
      />
    </a.mesh>
  )
}

const FloatingCards = () => {
  const { shuffledCards, cardData, setSelectedCard, setState } = useAppStore()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  if (!cardData) return null
  
  const displayCards = shuffledCards.slice(0, 12)
  const cardPositions = displayCards.map((_, index) => {
    const cols = 4
    const rows = 3
    const col = index % cols
    const row = Math.floor(index / cols)
    
    const x = (col - (cols - 1) / 2) * 1.8
    const y = (row - (rows - 1) / 2) * -2.2
    const z = Math.random() * 0.2 - 0.1
    
    return [x, y, z] as [number, number, number]
  })
  
  const handleCardClick = (card: Card) => {
    setSelectedCard(card)
    setState('viewing')
  }
  
  return (
    <group>
      {displayCards.map((card, index) => (
        <Card3D
          key={card.id}
          position={cardPositions[index]}
          card={card}
          backside={cardData.backside}
          isHovered={hoveredCard === card.id}
          onClick={() => handleCardClick(card)}
          onHover={(hovered) => setHoveredCard(hovered ? card.id : null)}
        />
      ))}
    </group>
  )
}

const CameraController = () => {
  const { camera } = useThree()
  
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.02)
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

export const CardSelection = () => {
  const { shuffleCards, setState } = useAppStore()
  
  useEffect(() => {
    shuffleCards()
  }, [shuffleCards])
  
  return (
    <div className="selection-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#d4af37" />
        
        <CameraController />
        <FloatingCards />
        
        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color="#5a5a5a"
          anchorX="center"
          anchorY="middle"
        >
          Trust Your Intuition
        </Text>
        
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.25}
          color="#8a8a8a"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
        >
          Feel into the cards and choose the one that calls to you
        </Text>
      </Canvas>
      
      <div className="selection-actions">
        <button 
          className="action-button secondary"
          onClick={shuffleCards}
        >
          Shuffle Cards
        </button>
        
        <button 
          className="action-button secondary"
          onClick={() => setState('welcome')}
        >
          Back to Welcome
        </button>
      </div>
      
      <style>{`
        .selection-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
          cursor: default;
        }
        
        .selection-actions {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .action-button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
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
          .selection-actions {
            flex-direction: column;
            bottom: 8%;
          }
          
          .action-button {
            min-width: 150px;
          }
        }
      `}</style>
    </div>
  )
}