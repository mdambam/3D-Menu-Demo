'use client'

import { useRef, useCallback, ReactNode } from 'react'

interface SwipeGestureProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  minSwipeDistance?: number
  className?: string
}

export default function SwipeGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
  className = '',
}: SwipeGestureProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return

    const distanceX = touchStart.current.x - touchEnd.current.x
    const distanceY = touchStart.current.y - touchEnd.current.y
    const absDistanceX = Math.abs(distanceX)
    const absDistanceY = Math.abs(distanceY)

    // Determine primary direction
    if (absDistanceX > absDistanceY) {
      // Horizontal swipe
      if (absDistanceX > minSwipeDistance) {
        if (distanceX > 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }
    } else {
      // Vertical swipe
      if (absDistanceY > minSwipeDistance) {
        if (distanceY > 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }
  }, [minSwipeDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  // Mouse events for desktop drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    touchStart.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (e.buttons === 1) {
      touchEnd.current = { x: e.clientX, y: e.clientY }
    }
  }, [])

  const onMouseUp = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return

    const distanceX = touchStart.current.x - touchEnd.current.x
    const absDistanceX = Math.abs(distanceX)

    if (absDistanceX > minSwipeDistance) {
      if (distanceX > 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }
    touchStart.current = null
    touchEnd.current = null
  }, [minSwipeDistance, onSwipeLeft, onSwipeRight])

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {children}
    </div>
  )
}
