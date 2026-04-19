'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import NativeARViewer from '@/components/NativeARViewer'
import { getMenuItems, MenuItem } from '@/lib/supabase'

export default function ARNativePage() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get('id')
  
  const [items, setItems] = useState<MenuItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadItems() {
      const data = await getMenuItems()
      setItems(data)
      
      // If itemId is provided, find its index
      if (itemId) {
        const index = data.findIndex(item => item.id === itemId)
        if (index !== -1) {
          setCurrentIndex(index)
        }
      }
      
      setLoading(false)
    }
    loadItems()
  }, [itemId])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>No menu items found</p>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  return (
    <NativeARViewer
      item={currentItem}
      onClose={() => window.location.href = '/menu'}
      onNext={items.length > 1 ? goToNext : undefined}
      onPrev={items.length > 1 ? goToPrev : undefined}
      hasNext={items.length > 1}
      hasPrev={items.length > 1}
    />
  )
}
