'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, useGLTF } from '@react-three/drei'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, MousePointer2 } from 'lucide-react'
import { mockMenuItems, MenuItem } from '@/lib/supabase'
import * as THREE from 'three'

interface TableItemProps {
  item: MenuItem
  position: [number, number, number]
  onClick?: () => void
  isSelected?: boolean
}

// Component to load external GLB/GLTF model
function ExternalTableModel({ url, position, isSelected, hovered }: { 
  url: string; 
  position: [number, number, number];
  isSelected?: boolean;
  hovered?: boolean;
}) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  const clonedScene = useMemo(() => scene.clone(), [scene])

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5 + position[0]) * 0.05
      
      const targetScale = hovered || isSelected ? 1.15 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <primitive object={clonedScene} scale={1.2} />
    </group>
  )
}

function TableItem({ item, position, onClick, isSelected }: TableItemProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + position[0]) * 0.05
      
      // Hover scale effect
      const targetScale = hovered || isSelected ? 1.15 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  // Use external model if available
  if (item.model_url && (item.model_url.endsWith('.glb') || item.model_url.endsWith('.gltf'))) {
    return (
      <Suspense fallback={null}>
        <group 
          position={position}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <ExternalTableModel 
            url={item.model_url} 
            position={position} 
            isSelected={isSelected}
            hovered={hovered}
          />
        </group>
      </Suspense>
    )
  }

  const getModelType = (item: MenuItem) => {
    const name = item.name.toLowerCase()
    if (name.includes('steak')) return 'steak'
    if (name.includes('burger')) return 'burger'
    if (name.includes('sushi')) return 'sushi'
    if (name.includes('cake') || name.includes('tiramisu') || name.includes('dessert')) return 'dessert'
    return 'sphere'
  }

  const getModelColor = (item: MenuItem) => {
    const name = item.name.toLowerCase()
    if (name.includes('steak')) return '#8b4513'
    if (name.includes('burger')) return '#cd853f'
    if (name.includes('sushi')) return '#ff6b6b'
    if (name.includes('cake') || name.includes('chocolate')) return '#5d4037'
    if (name.includes('tiramisu')) return '#d7ccc8'
    if (name.includes('lobster')) return '#ff6b6b'
    return '#c9a962'
  }

  const renderGeometry = () => {
    const type = getModelType(item)
    const color = getModelColor(item)
    const material = (
      <meshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.2}
        emissive={isSelected ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
    )

    switch (type) {
      case 'steak':
        return (
          <>
            <mesh>
              <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
              {material}
            </mesh>
            {[0, 1, 2].map(i => (
              <mesh key={i} position={[(i - 1) * 0.15, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[0.02, 0.6, 0.02]} />
                <meshBasicMaterial color="#3d2817" />
              </mesh>
            ))}
          </>
        )
      case 'burger':
        return (
          <>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.5, 0.4, 0.15, 32]} />
              <meshStandardMaterial color="#d4a574" />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.12, 32]} />
              {material}
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
      case 'sushi':
        return (
          <>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
              {material}
            </mesh>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.31, 0.31, 0.78, 32]} />
              <meshStandardMaterial color="#f5f5dc" />
            </mesh>
          </>
        )
      case 'dessert':
        return (
          <>
            <mesh position={[0, -0.15, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
              {material}
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
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            {material}
          </mesh>
        )
    }
  }

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderGeometry()}
      {/* Selection glow ring */}
      {isSelected && (
        <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color="#c9a962" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

function Table() {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial 
        color="#1a1a1a" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

function CameraController({ 
  targetPosition, 
  targetLookAt 
}: { 
  targetPosition: [number, number, number]
  targetLookAt: [number, number, number]
}) {
  const { camera } = useThree()
  
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...targetPosition), 0.05)
    camera.lookAt(...targetLookAt)
  })
  
  return null
}

export default function ARMultiPage() {
  const [items] = useState<MenuItem[]>(mockMenuItems.slice(0, 4))
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 4, 6])
  const [cameraLookAt, setCameraLookAt] = useState<[number, number, number]>([0, 0, 0])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Arrange items in a circle on the table
  const itemPositions: [number, number, number][] = useMemo(() => {
    const radius = 2
    return items.map((_, index) => {
      const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2
      return [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]
    })
  }, [items])

  const handleItemClick = (item: MenuItem, index: number) => {
    if (selectedItem === item.id) {
      setSelectedItem(null)
      setCameraPosition([0, 4, 6])
      setCameraLookAt([0, 0, 0])
    } else {
      setSelectedItem(item.id)
      const pos = itemPositions[index]
      setCameraPosition([pos[0], 2, pos[2] + 2])
      setCameraLookAt([pos[0], 0, pos[2]])
    }
  }

  const resetView = () => {
    setSelectedItem(null)
    setCameraPosition([0, 4, 6])
    setCameraLookAt([0, 0, 0])
  }

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Loading Screen */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-50 bg-black flex items-center justify-center ${isLoading ? '' : 'pointer-events-none'}`}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"
        />
      </motion.div>

      {/* 3D Canvas */}
      <div className="fixed inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 4, 6]} fov={60} />
          <CameraController 
            targetPosition={cameraPosition} 
            targetLookAt={cameraLookAt}
          />
          
          <ambientLight intensity={0.4} />
          <spotLight 
            position={[5, 10, 5]} 
            angle={0.3} 
            penumbra={0.5} 
            intensity={1.5}
            castShadow
            shadow-mapSize={1024}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#c9a962" />
          
          <Environment preset="studio" />
          
          {/* Table */}
          <Table />
          
          {/* Food Items */}
          {items.map((item, index) => (
            <TableItem
              key={item.id}
              item={item}
              position={itemPositions[index]}
              onClick={() => handleItemClick(item, index)}
              isSelected={selectedItem === item.id}
            />
          ))}
          
          {/* Shadows */}
          <ContactShadows 
            position={[0, -0.48, 0]} 
            opacity={0.6} 
            scale={20} 
            blur={2} 
            far={5}
          />
          
          <OrbitControls 
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/menu"
            className="flex items-center gap-2 px-4 py-2 glass rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Menu</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={resetView}
              className="p-2 glass rounded-full text-white hover:bg-white/10 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Instructions */}
      <div className="fixed top-20 left-4 right-4 z-30 pointer-events-none">
        <div className="flex justify-center">
          <div className="glass rounded-full px-4 py-2 text-white/70 text-sm flex items-center gap-2">
            <MousePointer2 className="w-4 h-4" />
            <span>Click on dishes to focus • Drag to rotate • Scroll to zoom</span>
          </div>
        </div>
      </div>

      {/* Selected Item Info */}
      {selectedItem && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4"
        >
          <div className="max-w-md mx-auto">
            {(() => {
              const item = items.find(i => i.id === selectedItem)
              if (!item) return null
              return (
                <div className="glass rounded-2xl p-5 text-white">
                  <h3 className="text-xl font-display font-semibold mb-1">{item.name}</h3>
                  <p className="text-primary text-lg font-semibold mb-2">
                    ${item.price}
                  </p>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              )
            })()}
          </div>
        </motion.div>
      )}

      {/* Table Layout Indicator */}
      <div className="fixed bottom-4 left-4 z-30">
        <div className="glass rounded-xl p-3 text-white/60 text-xs">
          <p className="font-medium mb-1">Table Setup</p>
          <p>{items.length} items placed</p>
        </div>
      </div>
    </main>
  )
}
