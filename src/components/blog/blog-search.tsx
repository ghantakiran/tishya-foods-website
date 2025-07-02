'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface BlogSearchProps {
  onSearch: (query: string) => void
  initialValue?: string
  placeholder?: string
  autoFocus?: boolean
}

export function BlogSearch({ 
  onSearch, 
  initialValue = '', 
  placeholder = 'Search posts...',
  autoFocus = false 
}: BlogSearchProps) {
  const [query, setQuery] = useState(initialValue)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery !== initialValue) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch, initialValue])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  )
}