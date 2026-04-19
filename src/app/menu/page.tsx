'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Eye, Scan, Box, Search } from 'lucide-react'
import { getMenuItems, mockMenuItems, MenuItem } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadItems = async () => {
      const data = await getMenuItems()
      setItems(data)
      setLoading(false)
    }
    loadItems()
  }, [])

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>

            <h1 className="font-display font-semibold text-xl">Our Menu</h1>

            <Link 
              href="/ar-multi"
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">View All in AR</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-medium mb-4">
              Discover Our <span className="text-gradient">Culinary</span> Art
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our menu and preview each dish in stunning 3D before you order
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full glass border border-muted/50 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl glass p-4 animate-pulse">
                  <div className="aspect-square rounded-xl bg-muted mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="h-10 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group relative"
                  >
                    <div className="relative overflow-hidden rounded-2xl glass border border-muted/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,169,98,0.15)]">
                      {/* Image */}
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass text-sm font-semibold">
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/ar?id=${item.id}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                          >
                            <Eye className="w-4 h-4" />
                            3D
                          </Link>
                          <Link
                            href={`/ar-native?id=${item.id}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-green-600 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                          >
                            <Scan className="w-4 h-4" />
                            Camera AR
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No dishes found matching your search.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
