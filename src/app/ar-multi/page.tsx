'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MenuItem, getMenuItems } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'

interface TableItemProps {
  item: MenuItem
  position: [number, number, number]
  onClick: () => void
  isSelected: boolean
}

// External model component
function ExternalTableModel({ url, isSelected }: { url: string; isSelected: boolean }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.05
      const targetScale = isSelected ? 1.3 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const clonedScene = useMemo(() => scene.clone(), [scene])

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={1} />
    </group>
  )
}

function TableItem({ item, position, onClick, isSelected }: TableItemProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + position[0]) * 0.05
      const targetScale = hovered || isSelected ? 1.15 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  // Check for external model
  if (item.model_url && (item.model_url.endsWith('.glb') || item.model_url.endsWith('.gltf'))) {
    return (
      <group 
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ExternalTableModel url={item.model_url} isSelected={isSelected} />
      </group>
    )
  }

  // Get color based on item name
  const getColor = () => {
    const name = item.name.toLowerCase()
    if (name.includes('steak') || name.includes('beef')) return '#8B4513'
    if (name.includes('burger')) return '#D2691E'
    if (name.includes('sushi')) return '#F5DEB3'
    if (name.includes('lobster') || name.includes('seafood')) return '#FF6347'
    if (name.includes('dessert') || name.includes('cake') || name.includes('tiramisu')) return '#DDA0DD'
    return '#C9A962'
  }

  const color = getColor()

  // Procedural shapes
  const renderShape = () => {
    const name = item.name.toLowerCase()
    
    if (name.includes('burger')) {
      return (
        <>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.5, 0.4, 0.15, 32]} />
            <meshStandardMaterial color="#d4a574" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.12, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.47, 0.47, 0.02, 32]} />
            <meshStandardMaterial color="#f4d03f" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#d4a574" />
          </mesh>
        </>
      )
    }

    if (name.includes('steak')) {
      return (
        <>
          <mesh>
            <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
          </mesh>
          {[0, 1, 2].map(i => (
            <mesh key={i} position={[(i - 1) * 0.15, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.02, 0.6, 0.02]} />
              <meshBasicMaterial color="#3d2817" />
            </mesh>
          ))}
        </>
      )
    }

    if (name.includes('sushi')) {
      return (
        <>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.31, 0.31, 0.78, 32]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
        </>
      )
    }

    if (name.includes('dessert') || name.includes('cake') || name.includes('tiramisu')) {
      return (
        <>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.33, 0.33, 0.2, 32]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#dc143c" />
          </mesh>
        </>
      )
    }

    // Default sphere
    return (
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
    )
  }

  return (
    <group 
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderShape()}
      {isSelected && (
        <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color="#c9a962" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}

export default function ARMultiPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 5, 8])

  useEffect(() => {
    async function loadItems() {
      const data = await getMenuItems()
      setItems(data.slice(0, 6))
      setLoading(false)
    }
    loadItems()
  }, [])

  const selectedItem = items.find(item => item.id === selectedId)

  const positions: [number, number, number][] = [
    [-2.5, 0, 0],
    [0, 0, 0],
    [2.5, 0, 0],
    [-2.5, 0, -2.5],
    [0, 0, -2.5],
    [2.5, 0, -2.5],
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="fixed inset-0 bg-black overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/menu"
            className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        className="w-full h-full"
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        {/* Table */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.5, -1.25]}
          receiveShadow
        >
          <planeGeometry args={[10, 8]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Food Items */}
        {items.map((item, index) => (
          <TableItem
            key={item.id}
            item={item}
            position={positions[index] || [0, 0, 0]}
            onClick={() => {
              setSelectedId(item.id)
              setCameraPosition([positions[index][0], 4, 6])
            }}
            isSelected={selectedId === item.id}
          />
        ))}

        <OrbitControls 
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* Selected Item Info */}
      {selectedItem && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        >
          <div className="flex items-end justify-between max-w-lg mx-auto">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">{selectedItem.name}</h2>
              <p className="text-white/80 mt-1 text-sm">{selectedItem.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{formatPrice(selectedItem.price)}</p>
              <Link
                href={`/ar?id=${selectedItem.id}`}
                className="mt-2 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                View Full 3D
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!selectedId && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center">
          <p>Click on any dish to view details</p>
          <p className="text-xs mt-1">Drag to rotate • Scroll to zoom</p>
        </div>
      )}
    </main>
  )
}
