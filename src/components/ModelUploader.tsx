'use client'

import { useState, useCallback } from 'react'
import { Upload, Box, X, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ModelUploaderProps {
  onUpload: (file: File) => void
  currentUrl?: string
  className?: string
}

export default function ModelUploader({ onUpload, currentUrl, className }: ModelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && isValidModelFile(file)) {
      setSelectedFile(file)
      onUpload(file)
    }
  }, [onUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidModelFile(file)) {
      setSelectedFile(file)
      onUpload(file)
    }
  }, [onUpload])

  const isValidModelFile = (file: File): boolean => {
    const validTypes = ['.glb', '.gltf', '.obj', 'model/gltf-binary', 'model/gltf+json', 'model/obj']
    const isValid = validTypes.some(type => 
      file.name.toLowerCase().endsWith(type) || file.type.includes(type)
    )
    
    if (!isValid) {
      alert('Please upload a valid 3D model file (.glb, .gltf, or .obj)')
    }
    return isValid
  }

  const clearFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className={cn("w-full", className)}>
      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 glass rounded-xl"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Box className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ) : currentUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 glass rounded-xl"
          >
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">3D Model Available</p>
              <p className="text-sm text-muted-foreground truncate">{currentUrl}</p>
            </div>
            <label className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept=".glb,.gltf,.obj"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </motion.div>
        ) : (
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-white/10 hover:border-white/20 hover:bg-white/5"
            )}
          >
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium">Drop 3D model here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to select (.glb, .gltf, .obj)
              </p>
            </div>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  )
}
