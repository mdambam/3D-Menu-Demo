'use client'

import { useEffect, useState } from 'react'
import QRCodeLib from 'qrcode'
import { X, Download, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface QRCodeProps {
  url: string
  isOpen: boolean
  onClose: () => void
}

export default function QRCode({ url, isOpen, onClose }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => {
    if (isOpen && url) {
      QRCodeLib.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#c9a962',
          light: '#0a0a0a',
        },
      }).then(setQrDataUrl)
    }
  }, [isOpen, url])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = '3d-menu-qr.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '3D Menu Demo',
          text: 'Scan to view our interactive 3D menu!',
          url: url,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass rounded-3xl p-6 text-center">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Scan to View Menu</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code */}
              <div className="relative bg-white rounded-2xl p-4 mb-6">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
              </div>

              {/* URL Display */}
              <p className="text-sm text-muted-foreground mb-6 break-all">
                {url}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Hint */}
              <p className="mt-4 text-xs text-muted-foreground">
                Point your camera at the QR code to open the menu
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
