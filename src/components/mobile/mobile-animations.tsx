'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

// Animation variants for mobile
export const mobileAnimations = {
  // Slide animations
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 }
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 }
  },
  slideLeft: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  },
  slideRight: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 }
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },
  scaleOut: {
    initial: { scale: 1.2, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  },

  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },

  // Bounce animations
  bounceIn: {
    initial: { scale: 0.3, opacity: 0 },
    animate: { 
      scale: [0.3, 1.1, 0.9, 1], 
      opacity: 1,
      transition: {
        duration: 0.6,
        times: [0, 0.5, 0.8, 1]
      }
    },
    exit: { scale: 0.3, opacity: 0 }
  },

  // Rotation animations
  rotateIn: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 }
  },

  // Stagger animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  staggerItem: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  }
}

// Mobile-optimized transition settings
export const mobileTransitions = {
  fast: { duration: 0.2, ease: 'easeOut' },
  medium: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBounce: { type: 'spring', stiffness: 400, damping: 17 }
}

// Animated container component
interface AnimatedContainerProps {
  children: React.ReactNode
  animation?: keyof typeof mobileAnimations
  duration?: number
  delay?: number
  className?: string
  onAnimationComplete?: () => void
}

export const AnimatedContainer = ({
  children,
  animation = 'fadeIn',
  duration = 0.3,
  delay = 0,
  className,
  onAnimationComplete
}: AnimatedContainerProps) => {
  const animationVariants = mobileAnimations[animation]

  return (
    <motion.div
      className={className}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration, delay }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  )
}

// Animated list component
interface AnimatedListProps {
  children: React.ReactNode[]
  className?: string
  itemClassName?: string
  staggerDelay?: number
}

export const AnimatedList = ({
  children,
  className,
  itemClassName,
  staggerDelay = 0.1
}: AnimatedListProps) => {
  return (
    <motion.div
      className={className}
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      initial="initial"
      animate="animate"
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={mobileAnimations.staggerItem}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Page transition component
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      className={cn('min-h-screen', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={mobileTransitions.medium}
    >
      {children}
    </motion.div>
  )
}

// Touch feedback component
interface TouchFeedbackProps {
  children: React.ReactNode
  className?: string
  onTap?: () => void
  disabled?: boolean
  feedback?: 'scale' | 'opacity' | 'brightness'
}

export const TouchFeedback = ({
  children,
  className,
  onTap,
  disabled = false,
  feedback = 'scale'
}: TouchFeedbackProps) => {
  const feedbackVariants = {
    scale: {
      whileTap: { scale: 0.98 },
      transition: mobileTransitions.fast
    },
    opacity: {
      whileTap: { opacity: 0.8 },
      transition: mobileTransitions.fast
    },
    brightness: {
      whileTap: { filter: 'brightness(0.9)' },
      transition: mobileTransitions.fast
    }
  }

  return (
    <motion.div
      className={cn(
        'cursor-pointer touch-none select-none',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...feedbackVariants[feedback]}
      onTap={!disabled ? onTap : undefined}
    >
      {children}
    </motion.div>
  )
}

// Modal transition component
interface ModalTransitionProps {
  children: React.ReactNode
  isOpen: boolean
  onClose?: () => void
  className?: string
}

export const ModalTransition = ({
  children,
  isOpen,
  onClose,
  className
}: ModalTransitionProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={mobileTransitions.spring}
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center p-4',
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Bottom sheet transition
interface BottomSheetTransitionProps {
  children: React.ReactNode
  isOpen: boolean
  onClose?: () => void
  className?: string
}

export const BottomSheetTransition = ({
  children,
  isOpen,
  onClose,
  className
}: BottomSheetTransitionProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={mobileTransitions.spring}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 bg-gray-800 rounded-t-2xl',
              'max-h-[90vh] overflow-y-auto',
              className
            )}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-10 h-1 bg-gray-600 rounded-full" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Card flip animation
interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  isFlipped: boolean
  className?: string
}

export const FlipCard = ({
  front,
  back,
  isFlipped,
  className
}: FlipCardProps) => {
  return (
    <div className={cn('relative preserve-3d', className)}>
      <motion.div
        className="absolute inset-0 backface-hidden"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={mobileTransitions.medium}
      >
        {front}
      </motion.div>
      <motion.div
        className="absolute inset-0 backface-hidden"
        style={{ rotateY: 180 }}
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={mobileTransitions.medium}
      >
        {back}
      </motion.div>
    </div>
  )
}

// Parallax scroll component
interface ParallaxScrollProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export const ParallaxScroll = ({
  children,
  offset = 0.5,
  className
}: ParallaxScrollProps) => {
  return (
    <motion.div
      className={className}
      style={{
        y: `${offset * 100}%`
      }}
      transition={mobileTransitions.fast}
    >
      {children}
    </motion.div>
  )
}

// Reveal animation component
interface RevealAnimationProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

export const RevealAnimation = ({
  children,
  direction = 'up',
  delay = 0,
  className
}: RevealAnimationProps) => {
  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 }
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Floating action button animation
interface FloatingActionButtonProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export const FloatingActionButton = ({
  children,
  onClick,
  className,
  position = 'bottom-right'
}: FloatingActionButtonProps) => {
  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  }

  return (
    <motion.button
      className={cn(
        'z-50 bg-orange-600 hover:bg-orange-700 text-white',
        'w-14 h-14 rounded-full shadow-lg',
        'flex items-center justify-center',
        positions[position],
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={mobileTransitions.spring}
    >
      {children}
    </motion.button>
  )
}

// Progress indicator animation
interface ProgressIndicatorProps {
  progress: number
  className?: string
}

export const ProgressIndicator = ({
  progress,
  className
}: ProgressIndicatorProps) => {
  return (
    <div className={cn('w-full bg-gray-700 rounded-full h-2', className)}>
      <motion.div
        className="bg-orange-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={mobileTransitions.medium}
      />
    </div>
  )
}

// Notification slide animation
interface NotificationSlideProps {
  children: React.ReactNode
  isVisible: boolean
  position?: 'top' | 'bottom'
  className?: string
}

export const NotificationSlide = ({
  children,
  isVisible,
  position = 'top',
  className
}: NotificationSlideProps) => {
  const slideVariants = {
    top: {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -100, opacity: 0 }
    },
    bottom: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed left-4 right-4 z-50',
            position === 'top' ? 'top-4' : 'bottom-4',
            className
          )}
          variants={slideVariants[position]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={mobileTransitions.spring}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export {
  mobileAnimations,
  mobileTransitions
}