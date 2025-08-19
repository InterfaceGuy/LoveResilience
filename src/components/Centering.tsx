import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useAppStore } from '../store/useAppStore'
import * as THREE from 'three'

const BreathingOrb = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current && isActive) {
      const breathCycle = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 + 0.5
      const scale = 0.5 + breathCycle * 0.3
      
      meshRef.current.scale.setScalar(scale)
      materialRef.current.opacity = 0.3 + breathCycle * 0.4
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#d4af37"
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.5}
      />
    </mesh>
  )
}

const CenteringText = ({ phase }: { phase: string; progress: number }) => {
  const texts = {
    check: "How are you feeling right now?",
    breathe: "Follow the gentle rhythm with your breath",
    intention: "Set your intention for this moment",
    ready: "You are centered and ready"
  }
  
  return (
    <Text
      position={[0, -1.5, 0]}
      fontSize={0.4}
      color="#5a5a5a"
      anchorX="center"
      anchorY="middle"
      maxWidth={8}
      textAlign="center"
    >
      {texts[phase as keyof typeof texts]}
    </Text>
  )
}

export const Centering = () => {
  const { setState, setCenteringProgress } = useAppStore()
  const [phase, setPhase] = useState<'check' | 'breathe' | 'intention' | 'ready'>('check')
  const [progress] = useState(0)
  
  const startBreathing = () => {
    setPhase('breathe')
    setCenteringProgress(0.3)
    
    setTimeout(() => {
      setPhase('intention')
      setCenteringProgress(0.7)
      
      setTimeout(() => {
        setPhase('ready')
        setCenteringProgress(1)
      }, 3000)
    }, 8000)
  }
  
  const skipCentering = () => {
    setCenteringProgress(1)
    setState('selection')
  }
  
  useEffect(() => {
    if (phase === 'ready') {
      const timer = setTimeout(() => {
        setState('selection')
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [phase, setState])
  
  return (
    <div className="centering-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        
        <BreathingOrb isActive={phase === 'breathe'} />
        <CenteringText phase={phase} progress={progress} />
      </Canvas>
      
      <div className="centering-actions">
        {phase === 'check' && (
          <div className="check-options">
            <button 
              className="action-button primary"
              onClick={startBreathing}
            >
              I'd like to center myself
            </button>
            
            <button 
              className="action-button secondary"
              onClick={() => setState('selection')}
            >
              I'm already centered
            </button>
          </div>
        )}
        
        {phase === 'breathe' && (
          <div className="breath-guidance">
            <p className="breath-instruction">
              Breathe in as the orb expands, breathe out as it contracts
            </p>
            <button 
              className="action-button secondary small"
              onClick={skipCentering}
            >
              Skip to cards
            </button>
          </div>
        )}
        
        {phase === 'intention' && (
          <div className="intention-guidance">
            <p className="intention-instruction">
              What guidance are you seeking today?
            </p>
          </div>
        )}
        
        {phase === 'ready' && (
          <div className="ready-message">
            <p className="ready-text">
              Trust your intuition to guide you to the right card
            </p>
          </div>
        )}
      </div>
      
      <style>{`
        .centering-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
        }
        
        .centering-actions {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .check-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        
        .action-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 220px;
          text-align: center;
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
        
        .action-button.small {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          min-width: 150px;
        }
        
        .breath-guidance, .intention-guidance, .ready-message {
          text-align: center;
          max-width: 300px;
        }
        
        .breath-instruction, .intention-instruction, .ready-text {
          color: #6a6a6a;
          font-size: 0.95rem;
          line-height: 1.4;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .centering-actions {
            bottom: 15%;
          }
          
          .action-button {
            min-width: 250px;
            padding: 1.2rem 2rem;
          }
        }
      `}</style>
    </div>
  )
}