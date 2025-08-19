import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { useAppStore } from '../store/useAppStore'
import * as THREE from 'three'

const FloatingOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, -2]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

export const Welcome = () => {
  const setState = useAppStore(state => state.setState)
  
  useEffect(() => {
    if (!localStorage.getItem('loveResilience_userId')) {
      localStorage.setItem('loveResilience_userId', Math.random().toString(36).substring(7))
    }
  }, [])
  
  return (
    <div className="welcome-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <FloatingOrb />
        
        <Text
          position={[0, 2, 0]}
          fontSize={0.8}
          color="#5a5a5a"
          anchorX="center"
          anchorY="middle"
          fontWeight="300"
        >
          Love Resilience
        </Text>
        
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="#8a8a8a"
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
          textAlign="center"
        >
          A digital sanctuary for practical spirituality
        </Text>
      </Canvas>
      
      <div className="welcome-actions">
        <button 
          className="action-button primary"
          onClick={() => setState('daily')}
        >
          Card of the Day
        </button>
        
        <button 
          className="action-button secondary"
          onClick={() => setState('centering')}
        >
          Draw a Card
        </button>
        
        <p className="welcome-subtitle">
          Take a moment to center yourself and connect with your inner wisdom
        </p>
      </div>
      
      <style>{`
        .welcome-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%);
        }
        
        .welcome-actions {
          position: absolute;
          bottom: 20%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .action-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
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
        
        .welcome-subtitle {
          margin-top: 1.5rem;
          color: #8a8a8a;
          text-align: center;
          font-size: 0.9rem;
          max-width: 300px;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .welcome-actions {
            bottom: 15%;
          }
          
          .action-button {
            min-width: 250px;
            padding: 1.2rem 2rem;
          }
          
          .welcome-subtitle {
            max-width: 250px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  )
}