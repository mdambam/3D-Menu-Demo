'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import ModelUploader from '@/components/ModelUploader'
import { createMenuItem, uploadImage } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

const categories = ['Mains', 'Seafood', 'Japanese', 'Desserts', 'Appetizers', 'Drinks']

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Mains',
    image_url: '',
    model_url: '',
  })
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        setMessage({ type: 'error', text: 'Please enter a valid price' })
        setIsSubmitting(false)
        return
      }

      console.log('Creating menu item with:', { name: formData.name, price, hasModel: !!modelFile, hasImage: !!imageFile })

      const result = await createMenuItem(
        {
          name: formData.name,
          description: formData.description,
          price,
          category: formData.category,
          image_url: formData.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
          model_url: '',
        },
        modelFile || undefined,
        imageFile || undefined
      )

      console.log('createMenuItem result:', result)

      if (result) {
        setMessage({ type: 'success', text: 'Menu item created successfully!' })
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'Mains',
          image_url: '',
          model_url: '',
        })
        setModelFile(null)
        setImageFile(null)
      } else {
        setMessage({ type: 'error', text: 'Failed to create menu item. Check browser console (F12) for details.' })
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      setMessage({ type: 'error', text: `Error: ${error.message || 'Unknown error'}` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-display font-bold">Admin - Add Menu Item</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mb-6 p-4 rounded-lg",
                  message.type === 'success' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}
              >
                {message.text}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., Wagyu Beef Steak"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-none"
                  placeholder="Describe the dish..."
                  required
                />
              </div>

              {/* Price & Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="29.99"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Food Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-3 p-4 glass rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {imageFile ? imageFile.name : 'Click to upload image'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {imageFile 
                          ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` 
                          : 'JPG, PNG, WebP supported'}
                      </p>
                    </div>
                  </label>
                  {!imageFile && (
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="Or enter image URL..."
                    />
                  )}
                </div>
              </div>

              {/* 3D Model Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">3D Model (.glb/.gltf)</label>
                <ModelUploader
                  onUpload={setModelFile}
                  currentUrl={formData.model_url}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Upload a 3D model for AR viewing. Supports .glb and .gltf formats.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Add Menu Item</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 glass rounded-xl text-sm text-muted-foreground"
          >
            <h3 className="font-medium text-foreground mb-2">Getting Started with 3D Models</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>Create 3D models in Blender, Sketchfab, or other 3D software</li>
              <li>Export as .glb (recommended) or .gltf format</li>
              <li>Keep file size under 10MB for optimal performance</li>
              <li>Center the model at origin (0,0,0) for proper AR placement</li>
              <li>Use PBR materials for realistic lighting in AR</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
