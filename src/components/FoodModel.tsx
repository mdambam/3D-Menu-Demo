'use client'

import { useRef, useMemo, Suspense } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import * as THREE from 'three'

interface FoodModelProps {
  color?: string
  type?: 'sphere' | 'box' | 'cylinder' | 'cone' | 'torus' | 'steak' | 'burger' | 'sushi' | 'dessert'
  isActive?: boolean
  modelUrl?: string
}

// Component to load external GLB/GLTF model
function ExternalModel({ url, isActive }: { url: string; isActive: boolean }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current && isActive) {
      const time = state.clock.getElapsedTime()
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.1
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05
    }
  })

  // Clone the scene to avoid mutations
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={1.5} />
      {/* Shadow plane */}
      <mesh 
        position={[0, -0.8, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  )
}

// Component to load OBJ model
function OBJModel({ url, isActive }: { url: string; isActive: boolean }) {
  const obj = useLoader(OBJLoader, url)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current && isActive) {
      const time = state.clock.getElapsedTime()
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.1
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05
    }
  })

  // Clone to avoid mutations and apply material
  const clonedObj = useMemo(() => {
    const clone = obj.clone()
    clone.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#c9a962',
          roughness: 0.3,
          metalness: 0.2,
        })
      }
    })
    return clone
  }, [obj])

  return (
    <group ref={groupRef}>
      <primitive object={clonedObj} scale={0.5} />
      {/* Shadow plane */}
      <mesh 
        position={[0, -0.8, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  )
}

// Loading fallback
function ModelLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#c9a962" wireframe />
    </mesh>
  )
}

export default function FoodModel({ color = '#c9a962', type = 'sphere', isActive = true, modelUrl }: FoodModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const shadowRef = useRef<THREE.Mesh>(null)

  // Floating animation
  useFrame((state) => {
    if (meshRef.current && isActive) {
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = Math.sin(time * 1.5) * 0.1
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.05
    }
  })

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.2,
    })
  }, [color])

  const renderGeometry = () => {
    switch (type) {
      case 'steak':
        return (
          <>
            {/* Main steak shape */}
            <mesh position={[0, 0, 0]} material={material}>
              <capsuleGeometry args={[0.6, 1.2, 4, 8]} />
            </mesh>
            {/* Grill marks */}
            <mesh position={[-0.2, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.02, 0.8, 0.02]} />
              <meshBasicMaterial color="#3d2817" />
            </mesh>
            <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.02, 0.8, 0.02]} />
              <meshBasicMaterial color="#3d2817" />
            </mesh>
            <mesh position={[0.2, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.02, 0.8, 0.02]} />
              <meshBasicMaterial color="#3d2817" />
            </mesh>
          </>
        )
      case 'burger':
        return (
          <>
            {/* Bottom bun */}
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.7, 0.6, 0.2, 32]} />
              <meshStandardMaterial color="#d4a574" />
            </mesh>
            {/* Patty */}
            <mesh position={[0, -0.05, 0]} material={material}>
              <cylinderGeometry args={[0.65, 0.65, 0.15, 32]} />
            </mesh>
            {/* Cheese */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.68, 0.68, 0.02, 32]} />
              <meshStandardMaterial color="#f4d03f" />
            </mesh>
            {/* Lettuce */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.7, 0.7, 0.03, 32]} />
              <meshStandardMaterial color="#52be80" />
            </mesh>
            {/* Top bun */}
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#d4a574" />
            </mesh>
            {/* Sesame seeds */}
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[
                Math.cos(i * Math.PI / 4) * 0.3,
                0.65,
                Math.sin(i * Math.PI / 4) * 0.3
              ]}>
                <sphereGeometry args={[0.02]} />
                <meshBasicMaterial color="#f5deb3" />
              </mesh>
            ))}
          </>
        )
      case 'sushi':
        return (
          <>
            {/* Main roll */}
            <mesh position={[0, 0, 0]} material={material}>
              <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
            </mesh>
            {/* Rice texture overlay */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.41, 0.41, 1.18, 32]} />
              <meshStandardMaterial color="#f5f5dc" roughness={0.8} />
            </mesh>
            {/* Nori (seaweed) */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </>
        )
      case 'dessert':
        return (
          <>
            {/* Cake base */}
            <mesh position={[0, -0.3, 0]} material={material}>
              <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
            </mesh>
            {/* Cake middle */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.48, 0.48, 0.3, 32]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Cream top */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.5, 0.4, 0.2, 32]} />
              <meshStandardMaterial color="#fffdd0" />
            </mesh>
            {/* Cherry */}
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial color="#dc143c" />
            </mesh>
          </>
        )
      case 'box':
        return (
          <mesh material={material}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        )
      case 'cylinder':
        return (
          <mesh material={material}>
            <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
          </mesh>
        )
      case 'cone':
        return (
          <mesh material={material}>
            <coneGeometry args={[0.5, 1, 32]} />
          </mesh>
        )
      case 'torus':
        return (
          <mesh material={material}>
            <torusGeometry args={[0.5, 0.2, 16, 32]} />
          </mesh>
        )
      default:
        return (
          <mesh material={material}>
            <sphereGeometry args={[0.6, 32, 32]} />
          </mesh>
        )
    }
  }

  // If external model URL is provided, use it
  if (modelUrl) {
    // OBJ files
    if (modelUrl.toLowerCase().endsWith('.obj')) {
      return (
        <Suspense fallback={<ModelLoader />}>
          <OBJModel url={modelUrl} isActive={isActive} />
        </Suspense>
      )
    }
    // GLB/GLTF files
    if (modelUrl.toLowerCase().endsWith('.glb') || modelUrl.toLowerCase().endsWith('.gltf')) {
      return (
        <Suspense fallback={<ModelLoader />}>
          <ExternalModel url={modelUrl} isActive={isActive} />
        </Suspense>
      )
    }
  }

  return (
    <group ref={meshRef}>
      {renderGeometry()}
      {/* Shadow plane */}
      <mesh 
        ref={shadowRef}
        position={[0, -0.8, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  )
}
