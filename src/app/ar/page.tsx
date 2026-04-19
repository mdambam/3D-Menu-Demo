'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, X, Info } from 'lucide-react'
import FoodModel from '@/components/FoodModel'
import { mockMenuItems, MenuItem } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import * as THREE from 'three'

// Swipe detection hook
function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStart = useRef<number | null>(null)
  const touchEnd = useRef<number | null>(null)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null
    touchStart.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return
    const distance = touchStart.current - touchEnd.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) onSwipeLeft()
    if (isRightSwipe) onSwipeRight()
  }

  return { onTouchStart, onTouchMove, onTouchEnd }
}

export default function ARPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [items] = useState<MenuItem[]>(mockMenuItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [showInfo, setShowInfo] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from URL param
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const index = items.findIndex(item => item.id === id)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [searchParams, items])

  const currentItem = items[currentIndex]

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goToPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const swipeHandlers = useSwipe(goToNext, goToPrev)

  // Get model type based on item
  const getModelType = (item: MenuItem) => {
    const name = item.name.toLowerCase()
    if (name.includes('steak')) return 'steak'
    if (name.includes('burger')) return 'burger'
    if (name.includes('sushi')) return 'sushi'
    if (name.includes('cake') || name.includes('tiramisu') || name.includes('dessert')) return 'dessert'
    if (name.includes('lobster')) return 'sphere'
    return 'sphere'
  }

  // Get color based on item
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  }

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div 
        className="fixed inset-0 touch-none"
        {...swipeHandlers}
      >
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Environment preset="city" />
          
          {/* Food Model with Animation */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.group
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
            >
              <FoodModel 
                type={getModelType(currentItem)}
                color={getModelColor(currentItem)}
                isActive={true}
                modelUrl={currentItem.model_url}
              />
            </motion.group>
          </AnimatePresence>
          
          {/* Ground shadow */}
          <ContactShadows 
            position={[0, -0.8, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4}
          />
          
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* AR Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(201, 169, 98, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(201, 169, 98, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/menu"
            className="flex items-center gap-2 px-4 py-2 glass rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Back to Menu</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 glass rounded-full text-xs text-white/80">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 glass rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 p-3 glass rounded-full text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
        aria-label="Previous item"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 p-3 glass rounded-full text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
        aria-label="Next item"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Food Info Card */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6"
          >
            <div className="max-w-md mx-auto">
              <div className="glass rounded-2xl p-5 sm:p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-semibold mb-1">
                      {currentItem?.name}
                    </h2>
                    <p className="text-2xl sm:text-3xl font-semibold text-primary">
                      {currentItem && formatPrice(currentItem.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInfo(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  {currentItem?.description}
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/menu"
                    className="flex-1 py-3 px-4 bg-white/10 rounded-xl text-center text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    View Menu
                  </Link>
                  <Link
                    href={`/ar-multi?id=${currentItem?.id}`}
                    className="flex-1 py-3 px-4 bg-primary rounded-xl text-center text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    View Table Setup
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      >
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Swipe or use arrows to navigate</span>
          <span className="sm:hidden">Swipe to navigate</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>
    </main>
  )
}
