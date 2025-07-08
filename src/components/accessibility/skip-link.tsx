'use client'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`
        absolute top-4 left-4 z-50 px-4 py-2 
        bg-blue-600 text-white rounded-md font-medium
        transform -translate-y-full opacity-0
        focus:translate-y-0 focus:opacity-100
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          const target = document.querySelector(href)
          if (target) {
            ;(target as HTMLElement).focus()
            target.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }}
    >
      {children}
    </a>
  )
}

export function SkipNavigation() {
  return (
    <>
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      <SkipLink href="#main-navigation" className="left-40">
        Skip to navigation
      </SkipLink>
      <SkipLink href="#footer" className="left-72">
        Skip to footer
      </SkipLink>
    </>
  )
}