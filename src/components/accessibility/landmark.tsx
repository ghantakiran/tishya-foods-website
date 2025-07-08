'use client'

import React from 'react'

interface LandmarkProps {
  children: React.ReactNode
  role?: 'banner' | 'main' | 'navigation' | 'contentinfo' | 'complementary' | 'search' | 'region'
  ariaLabel?: string
  ariaLabelledBy?: string
  className?: string
  id?: string
}

export function Landmark({
  children,
  role = 'region',
  ariaLabel,
  ariaLabelledBy,
  className = '',
  id,
  ...props
}: LandmarkProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
      id={id}
      {...props}
    >
      {children}
    </div>
  )
}