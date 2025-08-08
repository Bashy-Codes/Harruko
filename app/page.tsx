"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Mail, Heart, Music, ChevronRight, Lock, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function HarrukoApp() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'password' | 'letter' | 'response'>('welcome')
  const [password, setPassword] = useState('')
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [showSadModal, setShowSadModal] = useState(false)
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const [isChasing, setIsChasing] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const audioRef = useRef<HTMLAudioElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const chaseIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const correctPassword = "bashy-secret.123"

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setCurrentStep('letter')
      setShowPasswordError(false)
    } else {
      setShowPasswordError(true)
      setTimeout(() => setShowPasswordError(false), 3000)
    }
  }

  const handleYes = () => {
    setShowThankYou(true)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const handleNoHover = () => {
    if (!isChasing) {
      setIsChasing(true)
      startChasing()
    }
  }

  const handleNoLeave = () => {
    setIsChasing(false)
    if (chaseIntervalRef.current) {
      clearInterval(chaseIntervalRef.current)
    }
  }

  const handleNoClick = () => {
    // Only open modal if button is currently running/chasing
    if (isChasing) {
      setShowSadModal(true)
      setIsChasing(false)
      if (chaseIntervalRef.current) {
        clearInterval(chaseIntervalRef.current)
      }
    }
  }

  const startChasing = () => {
    moveNoButton()
    chaseIntervalRef.current = setInterval(() => {
      if (isChasing) {
        moveNoButton()
      }
    }, 800)
  }

  const moveNoButton = () => {
    const maxX = window.innerWidth - 200
    const maxY = window.innerHeight - 100
    const newX = Math.random() * maxX
    const newY = Math.random() * maxY
    setNoButtonPosition({ x: newX, y: newY })
  }

  const BackgroundGrid = () => (
    <div className="fixed inset-0 opacity-[0.02]">
      <div className="absolute inset-0" 
           style={{
             backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
             backgroundSize: '50px 50px'
           }} 
      />
    </div>
  )

  const FloatingOrbs = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background: `radial-gradient(circle, ${i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#06b6d4'} 0%, transparent 70%)`
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
        />
      ))}
    </div>
  )

  const FighterJet = () => (
    <motion.div
      className="fixed pointer-events-none z-50"
      animate={{
        x: mousePosition.x - 30,
        y: mousePosition.y - 15,
        rotate: Math.atan2(mousePosition.y - window.innerHeight/2, mousePosition.x - window.innerWidth/2) * 180 / Math.PI + 90
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {/* Fighter Jet SVG */}
      <svg width="60" height="30" viewBox="0 0 60 30" className="drop-shadow-lg">
        {/* Jet Body */}
        <path
          d="M30 2 L35 8 L35 22 L30 28 L25 22 L25 8 Z"
          fill="#4a5568"
          stroke="#2d3748"
          strokeWidth="1"
        />
        {/* Wings */}
        <path
          d="M20 12 L40 12 L42 16 L38 18 L22 18 L18 16 Z"
          fill="#2d3748"
          stroke="#1a202c"
          strokeWidth="1"
        />
        {/* Cockpit */}
        <circle cx="30" cy="8" r="3" fill="#63b3ed" opacity="0.8" />
        {/* Engine Glow */}
        <circle cx="30" cy="25" r="2" fill="#f56565" opacity="0.9">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" repeatCount="indefinite" />
        </circle>
        {/* Exhaust */}
        <path
          d="M28 26 L32 26 L31 30 L29 30 Z"
          fill="#f56565"
          opacity="0.7"
        >
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="0.3s" repeatCount="indefinite" />
        </path>
      </svg>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <BackgroundGrid />
      <FloatingOrbs />
      {currentStep === 'letter' && <FighterJet />}
      
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />

      <audio ref={audioRef} preload="auto">
        <source src="/celebration.mp3" type="audio/mpeg" />
      </audio>

      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-12"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 1, -1, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-6"
                >
                  <Sparkles className="w-12 h-12 text-blue-400" />
                </motion.div>
                
                <h1 className="text-5xl font-light text-white mb-4 tracking-tight">
                  Welcome
                </h1>
                <p className="text-xl text-gray-400 font-light">
                  Something special awaits you
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800/50 shadow-2xl">
                  <CardContent className="p-8">
                    <Button 
                      onClick={() => setCurrentStep('password')}
                      className="w-full bg-white text-black hover:bg-gray-100 h-12 text-lg font-medium transition-all duration-300 group"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentStep === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-2xl mb-6">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                
                <h2 className="text-3xl font-light text-white mb-3 tracking-tight">
                  Identity Verification
                </h2>
                <p className="text-gray-400 font-light">
                  Are you really Harruko?
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800/50 shadow-2xl">
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Enter the password Bashy shared with you
                      </label>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 h-12 focus:border-blue-500/50 focus:ring-blue-500/20"
                        onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      />
                    </div>
                    
                    <Button 
                      onClick={handlePasswordSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-medium transition-all duration-300"
                    >
                      Verify Identity
                    </Button>
                    
                    <AnimatePresence>
                      {showPasswordError && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg"
                        >
                          <p className="text-red-400 text-sm text-center">
                            Incorrect password. Please try again.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentStep === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-6 border border-blue-500/30">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                
                <h2 className="text-4xl font-light text-white mb-4 tracking-tight drop-shadow-lg">
                  Personal Message
                </h2>
                <p className="text-xl text-gray-300 font-light">
                  From Bashy to Harruko
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="bg-gray-900/70 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                  <CardContent className="p-10">
                    <div className="prose prose-invert max-w-none">
                      <div className="mb-8 space-y-4 text-gray-200 leading-relaxed">
                        <p className="text-lg font-medium text-white">
                          Hey Harruko,
                        </p>
                        <p className="text-base">
                          I hope this message finds you well. I've been thinking about our conversations 
                          and the connection we've built, and I wanted to reach out with something that's 
                          been on my mind.
                        </p>
                        <p className="text-base">
                          Friendship is one of life's most precious gifts, and I believe we have the 
                          foundation for something really meaningful.
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-8 text-center">
                        <h3 className="text-3xl font-light text-white mb-8 drop-shadow-lg">
                          Would you like to be friends?
                        </h3>
                        
                        <div className="flex gap-4 justify-center relative">
                          <Button
                            onClick={handleYes}
                            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-medium transition-all duration-300 min-w-[120px]"
                          >
                            Yes
                          </Button>
                          
                          <motion.div
                            style={{
                              position: isChasing ? 'fixed' : 'relative',
                              left: isChasing ? noButtonPosition.x : 'auto',
                              top: isChasing ? noButtonPosition.y : 'auto',
                              zIndex: isChasing ? 50 : 'auto'
                            }}
                            animate={isChasing ? { 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            } : {}}
                            transition={{ duration: 0.2, repeat: isChasing ? Infinity : 0 }}
                          >
                            <Button
                              ref={noButtonRef}
                              onMouseEnter={handleNoHover}
                              onMouseLeave={handleNoLeave}
                              onClick={handleNoClick}
                              variant="outline"
                              className={`border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg font-medium transition-all duration-300 min-w-[180px] ${
                                isChasing ? 'cursor-pointer shadow-lg shadow-red-500/20 border-red-500/50 text-red-300 bg-red-900/20' : ''
                              }`}
                            >
                              {isChasing ? "Please don't click me!" : "No"}
                            </Button>
                          </motion.div>
                        </div>
                        
                        {isChasing && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-gray-400 mt-4"
                          >
                            Try to catch the button if you can! 🏃‍♂️
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setShowThankYou(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600/20 rounded-full">
                  <Heart className="w-10 h-10 text-green-400" />
                </div>
              </motion.div>
              
              <h3 className="text-3xl font-light text-white mb-4">
                Thank You
              </h3>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                I'm so happy we're friends now! This means a lot to me.
              </p>
              
              <div className="flex items-center justify-center gap-3 text-gray-400 mb-8">
                <Music className="w-5 h-5" />
                <span className="text-sm">Playing celebration music</span>
              </div>
              
              <Button
                onClick={() => setShowThankYou(false)}
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 font-medium transition-all duration-300"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sad Modal */}
      <AnimatePresence>
        {showSadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setShowSadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/20 rounded-full">
                  <div className="text-4xl">😔</div>
                </div>
              </div>
              
              <h3 className="text-3xl font-light text-white mb-4">
                You Caught Me!
              </h3>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Wow, you're persistent! That's okay though. I respect your decision. Maybe we can be friends another time.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setShowSadModal(false)
                    setCurrentStep('letter')
                    setIsChasing(false)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 font-medium transition-all duration-300"
                >
                  Reconsider
                </Button>
                
                <Button
                  onClick={() => setShowSadModal(false)}
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 py-3 font-medium transition-all duration-300"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
