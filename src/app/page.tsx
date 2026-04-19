'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ScanLine, ChefHat, Utensils, Eye } from 'lucide-react'
import QRCode from '@/components/QRCode'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

export default function Home() {
  const [showQR, setShowQR] = useState(false)
  const menuUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/menu` 
    : 'https://example.com/menu'

  return (
    <main className="min-h-screen bg-background">
      <QRCode 
        url={menuUrl}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[#0f0f0f]" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary"
            >
              <ChefHat className="w-4 h-4" />
              <span>Next Generation Dining</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-tight"
            >
              <span className="text-foreground">Experience Your</span>
              <br />
              <span className="text-gradient">Food Before You Order</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Interactive AR Menu for Modern Restaurants. 
              Preview dishes in stunning 3D before making your choice.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link 
                href="/menu"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium overflow-hidden transition-all hover:scale-105"
              >
                <span className="relative z-10">View Demo</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#d4b978] to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <button
                onClick={() => setShowQR(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 glass rounded-full font-medium transition-all hover:scale-105 hover:border-primary/50"
              >
                <ScanLine className="w-5 h-5 text-primary" />
                <span>Scan QR</span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50" />
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-medium mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to elevate your dining experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ScanLine,
                step: '01',
                title: 'Scan the Menu',
                description: 'Point your camera at the QR code on your table to access our interactive menu instantly.'
              },
              {
                icon: Eye,
                step: '02',
                title: 'Preview in 3D',
                description: 'Tap any dish to see it in stunning augmented reality. Rotate, zoom, and explore every detail.'
              },
              {
                icon: Utensils,
                step: '03',
                title: 'Order with Confidence',
                description: 'Know exactly what you are getting. Place your order with confidence and anticipation.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative p-8 rounded-2xl glass hover:bg-secondary/50 transition-all duration-300"
              >
                <div className="absolute top-6 right-6 text-6xl font-display font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">
                Elevate Your <span className="text-gradient">Restaurant</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Transform the way your guests experience dining. Our AR menu technology brings dishes to life, 
                increasing engagement and order confidence.
              </p>
              <div className="space-y-4">
                {[
                  'Increase order value by up to 25%',
                  'Reduce order errors and returns',
                  'Create memorable dining experiences',
                  'Easy setup, no special equipment needed'
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-foreground/90">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden glass glow-border">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/10 rounded-3xl transform rotate-45" />
                    <div className="absolute inset-4 bg-gradient-to-br from-primary/60 to-primary/20 rounded-2xl transform -rotate-12" />
                    <ChefHat className="absolute inset-0 m-auto w-24 h-24 text-primary" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-semibold text-xl">3D Menu Demo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 3D Menu Demo. A premium dining experience.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/menu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Menu
              </Link>
              <Link href="/ar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                AR Demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
