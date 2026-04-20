'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { MenuItem } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// Extend JSX to include model-viewer element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          'ios-src'?: string
          poster?: string
          alt?: string
          'camera-controls'?: boolean | string
          'auto-rotate'?: boolean | string
          ar?: boolean | string
          'ar-modes'?: string
          'ar-scale'?: string
          'ar-placement'?: string
          'touch-action'?: string
          'interaction-prompt'?: string
          'interaction-prompt-style'?: string
          'interaction-prompt-threshold'?: string
          'reveal'?: string
          loading?: string
          'shadow-intensity'?: string
          'shadow-softness'?: string
          exposure?: string
          'camera-orbit'?: string
          'max-camera-orbit'?: string
          'min-camera-orbit'?: string
          'field-of-view'?: string
          scale?: string
          children?: React.ReactNode
          style?: React.CSSProperties
        },
        HTMLElement
      >
    }
  }
}

interface NativeARViewerProps {
  item: MenuItem
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  hasNext?: boolean
  hasPrev?: boolean
}

export default function NativeARViewer({ 
  item, 
  onClose, 
  onNext, 
  onPrev,
  hasNext,
  hasPrev 
}: NativeARViewerProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isARSupported, setIsARSupported] = useState(false)

  useEffect(() => {
    // Check if AR is supported (iOS Safari or Android)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    setIsARSupported(isIOS || isAndroid)
  }, [])

  const modelUrl = item.model_url || ''
  // Strip query params for extension check (Supabase URLs have ?token=xyz)
  const cleanUrl = modelUrl.split('?')[0].toLowerCase()
  const hasModel = modelUrl && (cleanUrl.endsWith('.glb') || cleanUrl.endsWith('.gltf') || cleanUrl.endsWith('.obj'))

  return (
    <>
      <Script
        src="https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"
        type="module"
        onLoad={() => setScriptLoaded(true)}
      />
      
      <div className="fixed inset-0 bg-black z-50">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/menu"
              className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>

            <button
              onClick={onClose}
              className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Navigation */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Model Viewer */}
        <div className="absolute inset-0">
          {!scriptLoaded ? (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p>Loading AR Viewer...</p>
              </div>
            </div>
          ) : hasModel ? (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - model-viewer is a custom element
            <model-viewer
              src={modelUrl}
              alt={`3D model of ${item.name}`}
              camera-controls="true"
              auto-rotate="true"
              ar="true"
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="auto"
              ar-placement="floor"
              touch-action="pan-y"
              interaction-prompt="none"
              reveal="interaction"
              loading="lazy"
              shadow-intensity="1"
              shadow-softness="0.5"
              exposure="1"
              camera-orbit="0deg 75deg 2m"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
              }}
            >
              {/* AR Button */}
              <button 
                slot="ar-button"
                className="absolute bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black rounded-full font-medium shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                View in AR
              </button>
            </model-viewer>
          ) : (
            <div className="flex items-center justify-center h-full text-white text-center px-4">
              <div>
                <p className="text-xl mb-2">No 3D Model Available</p>
                <p className="text-white/60">Upload a .glb, .gltf, or .obj file in the admin panel</p>
              </div>
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">{item.name}</h2>
              <p className="text-white/80 mt-1">{item.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{formatPrice(item.price)}</p>
            </div>
          </div>
          
          {!isARSupported && (
            <p className="text-sm text-white/60 mt-2 text-center">
              AR requires iPhone/iPad (iOS 12+) or Android device
            </p>
          )}
        </div>
      </div>
    </>
  )
}
