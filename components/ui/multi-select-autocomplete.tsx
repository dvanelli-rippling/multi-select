"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  searchPeople, 
  getAllPeople, 
  type Person, 
  PURCHASER_ID, 
  createCustomAttendee, 
  personExists, 
  getPersonById 
} from "@/lib/people-db"
import { ProfileHoverCard } from "@/components/ui/profile-hover-card"

interface MultiSelectAutocompleteProps {
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  perPersonAmount?: string
  draggable?: boolean
  verticalStack?: boolean
  showAvatar?: boolean
  processCSV?: boolean
}

// Helper to get initials from a name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Generate a consistent color based on a string value
const getAvatarColor = (value: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-emerald-500",
  ]

  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

export function MultiSelectAutocomplete({
  selected,
  onChange,
  placeholder = "Select attendees...",
  className,
  perPersonAmount,
  draggable = true,
  verticalStack = true,
  showAvatar = true,
  processCSV = false,
}: MultiSelectAutocompleteProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [inputWidth, setInputWidth] = React.useState(0)
  const [height, setHeight] = React.useState(162) // Default height for 4 people
  const [isResizing, setIsResizing] = React.useState(false)
  const [csvPeople, setCsvPeople] = React.useState<string[]>([]) // Array of full names from CSV
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const prevSelectedCountRef = React.useRef(selected.length)

  const handleUnselect = (value: string) => {
    if (value === PURCHASER_ID && selected.length <= 1) {
      return
    }
    onChange(selected.filter((s) => s !== value))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      if (value === PURCHASER_ID && selected.length === 1) {
        return
      }
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
      setSearchQuery("")
      setHighlightedIndex(-1)
      setIsFocused(true)
      // Use setTimeout to ensure focus happens after state updates
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  // Get selected people - ordered by when they were added (newest last for display)
  const selectedPeople = React.useMemo(() => {
    const allPeople = getAllPeople()
    const peopleMap = new Map(allPeople.map((person) => [person.id, person]))
    return selected
      .map((id) => peopleMap.get(id))
      .filter((person): person is Person => person !== undefined)
  }, [selected])

  // Get available options based on search query
  const availableOptions = React.useMemo(() => {
    const results = searchQuery.trim()
      ? searchPeople(searchQuery, selected)
      : getAllPeople(selected)
    return results.slice(0, 10)
  }, [searchQuery, selected])

  // Get autocomplete suggestion (first match)
  const autocompleteSuggestion = React.useMemo(() => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery || availableOptions.length === 0) return null
    
    const firstOption = availableOptions[0]
    const fullName = firstOption.fullName
    const queryLower = trimmedQuery.toLowerCase()
    const nameLower = fullName.toLowerCase()
    
    // Find where the query matches in the name
    if (nameLower.startsWith(queryLower)) {
      // Return the remaining part of the name
      return fullName.substring(trimmedQuery.length)
    }
    
    return null
  }, [searchQuery, availableOptions])

  // Check if we should show "Create new attendee" option
  const shouldShowCreateOption = React.useMemo(() => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery || trimmedQuery.length === 0) return false
    const hasFewResults = availableOptions.length <= 3
    const personDoesNotExist = !personExists(trimmedQuery)
    return hasFewResults && personDoesNotExist
  }, [searchQuery, availableOptions])

  const handleCreateAttendee = () => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery || personExists(trimmedQuery)) return
    
    const newPerson = createCustomAttendee(trimmedQuery)
    handleSelect(newPerson.id)
  }

  // Parse CSV input (handles both simple format and Google Calendar format)
  const parseCSV = React.useMemo(() => {
    if (!processCSV || !searchQuery.trim()) return []
    
    const trimmed = searchQuery.trim()
    // Check if it looks like CSV (contains commas)
    if (!trimmed.includes(',')) return []
    
    const entries = trimmed.split(',').map(entry => entry.trim()).filter(entry => entry.length > 0)
    const names: string[] = []
    
    for (const entry of entries) {
      // Handle Google Calendar format: "Name <email@domain.com>"
      const emailMatch = entry.match(/^(.+?)\s*<[^>]+>$/);
      if (emailMatch) {
        // Extract name part before the email
        const name = emailMatch[1].trim()
        if (name) {
          names.push(name)
        }
      } else {
        // Simple format: just the name
        // Split on whitespace to get first and last name
        const nameParts = entry.split(/\s+/).filter(part => part.length > 0)
        if (nameParts.length >= 2) {
          // Has at least first and last name
          names.push(entry.trim())
        } else if (nameParts.length === 1) {
          // Single word - still add it
          names.push(entry.trim())
        }
      }
    }
    
    // Filter out duplicates and people already selected
    const uniqueNames = Array.from(new Set(names))
    const allPeople = getAllPeople()
    return uniqueNames.filter(name => {
      // Check if person exists and is already selected
      const person = allPeople.find(p => p.fullName.toLowerCase() === name.toLowerCase())
      if (person) {
        return !selected.includes(person.id)
      }
      return true
    })
  }, [searchQuery, processCSV, selected])

  // Update csvPeople when parseCSV changes
  React.useEffect(() => {
    setCsvPeople(parseCSV)
  }, [parseCSV])

  // Handle adding all CSV people
  const handleAddCSVPeople = () => {
    if (csvPeople.length === 0) return
    
    const newIds: string[] = []
    const allPeople = getAllPeople()
    
    for (const name of csvPeople) {
      // First, try to find the person in the database (case-insensitive)
      const existingPerson = allPeople.find(
        p => p.fullName.toLowerCase() === name.toLowerCase()
      )
      
      if (existingPerson) {
        // Person exists in database, use their ID
        if (!selected.includes(existingPerson.id)) {
          newIds.push(existingPerson.id)
        }
      } else {
        // Person doesn't exist, create as custom attendee
        const newPerson = createCustomAttendee(name)
        if (!selected.includes(newPerson.id)) {
          newIds.push(newPerson.id)
        }
      }
    }
    
    if (newIds.length > 0) {
      onChange([...selected, ...newIds])
      setSearchQuery("")
      setCsvPeople([])
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If CSV action is available, it's at index -1
    const hasCSVAction = csvPeople.length > 0
    const totalOptions = availableOptions.length + (shouldShowCreateOption ? 1 : 0)
    const totalWithCSV = totalOptions + (hasCSVAction ? 1 : 0)
    
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        if (hasCSVAction && prev === -1) {
          return 0 // Move from CSV action to first option
        }
        return prev < totalOptions - 1 ? prev + 1 : prev
      })
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        if (prev === 0 && hasCSVAction) {
          return -1 // Move from first option to CSV action
        }
        return prev > 0 ? prev - 1 : (hasCSVAction ? -1 : 0)
      })
    } else if (e.key === "Tab") {
      e.preventDefault()
      // If there's a highlighted index, use that
      if (highlightedIndex === -1 && hasCSVAction) {
        handleAddCSVPeople()
      } else if (highlightedIndex >= 0) {
        if (highlightedIndex < availableOptions.length) {
          const option = availableOptions[highlightedIndex]
          handleSelect(option.id)
        } else if (shouldShowCreateOption) {
          handleCreateAttendee()
        }
      } else if (hasCSVAction) {
        // If CSV is available and nothing highlighted, use CSV action
        handleAddCSVPeople()
      } else if (availableOptions.length > 0 && autocompleteSuggestion) {
        // Accept the autocomplete suggestion
        handleSelect(availableOptions[0].id)
      } else if (shouldShowCreateOption) {
        handleCreateAttendee()
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
      // If CSV is detected and available, process it first
      if (hasCSVAction) {
        handleAddCSVPeople()
      } else if (highlightedIndex >= 0) {
        if (highlightedIndex < availableOptions.length) {
          const option = availableOptions[highlightedIndex]
          handleSelect(option.id)
        } else if (shouldShowCreateOption) {
          handleCreateAttendee()
        }
      } else if (shouldShowCreateOption) {
        handleCreateAttendee()
      } else if (availableOptions.length > 0 && autocompleteSuggestion) {
        // Accept the autocomplete suggestion
        handleSelect(availableOptions[0].id)
      }
    } else if (e.key === "Escape") {
      setSearchQuery("")
      setHighlightedIndex(-1)
      inputRef.current?.blur()
    }
  }

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const items = suggestionsRef.current.querySelectorAll('[data-suggestion-index]')
      const highlightedItem = items[highlightedIndex] as HTMLElement
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [highlightedIndex])

  // Reset highlighted index when search changes
  React.useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchQuery])

  // Auto-scroll to bottom when a new attendee is added
  React.useEffect(() => {
    if (selected.length > prevSelectedCountRef.current && scrollContainerRef.current) {
      // New attendee was added, scroll to bottom to show the newest person
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
        }
      }, 0)
    }
    prevSelectedCountRef.current = selected.length
  }, [selected.length])

  // Handle resize
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newHeight = e.clientY - containerRect.top
      
      // Minimum height (for at least 1 person) and maximum height constraint
      const minHeight = 50
      const maxHeight = 400
      const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))
      
      setHeight(constrainedHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "ns-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
  }

  // Measure input text width for autocomplete positioning
  React.useEffect(() => {
    if (inputRef.current && measureRef.current) {
      // Copy all relevant font styles from input to measurement span
      const inputStyles = window.getComputedStyle(inputRef.current)
      measureRef.current.style.font = inputStyles.font
      measureRef.current.style.fontSize = inputStyles.fontSize
      measureRef.current.style.fontFamily = inputStyles.fontFamily
      measureRef.current.style.fontWeight = inputStyles.fontWeight
      measureRef.current.style.letterSpacing = inputStyles.letterSpacing
      // Don't include padding in measurement since both input and overlay have same padding
      
      measureRef.current.textContent = inputRef.current.value || ''
      // Use requestAnimationFrame to ensure measurement happens after render
      requestAnimationFrame(() => {
        if (measureRef.current) {
          setInputWidth(measureRef.current.offsetWidth)
        }
      })
    }
  }, [searchQuery])

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <div
        ref={containerRef}
        className={cn(
          "bg-white border rounded-lg relative",
          isFocused ? "border-[rgba(0,0,0,0.3)]" : "border-[rgba(0,0,0,0.1)]",
          "flex flex-col"
        )}
        style={{ minHeight: `${height + 48}px`, height: "auto" }}
        onClick={(e) => {
          // If clicking on the container itself (not children), focus input
          if (e.target === e.currentTarget) {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
            }
            setTimeout(() => {
              inputRef.current?.focus()
            }, 0)
          }
        }}
      >
        {/* Selected attendees - scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="py-2 px-2 overflow-y-auto w-full scrollbar-thin cursor-text"
          style={{ maxHeight: `${height}px`, minHeight: `${height}px` }}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement
            // Don't handle clicks on badges or buttons
            if (target.closest('[data-badge="true"]') || 
                target.closest('button') ||
                target.closest('[role="button"]')) {
              return
            }
            // Prevent text selection
            e.preventDefault()
            // Scroll to bottom to show input
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
            }
            // Focus the input
            setTimeout(() => {
              inputRef.current?.focus()
            }, 0)
          }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            // Don't handle clicks on badges or buttons
            if (target.closest('[data-badge="true"]') || 
                target.closest('button') ||
                target.closest('[role="button"]')) {
              return
            }
            // Scroll to bottom to show input
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
            }
            // Focus the input
            setTimeout(() => {
              inputRef.current?.focus()
            }, 0)
          }}
        >
          {selectedPeople.length > 0 ? (
            <div className={cn(
              "flex items-start gap-1.5 w-full",
              verticalStack ? "flex-col" : "flex-wrap"
            )}>
              {selectedPeople.map((person) => {
                const value = person.id
                const baseLabel = person.fullName
                const label = person.isPurchaser
                  ? `${baseLabel} · Purchaser`
                  : person.isCustom
                  ? `${baseLabel} · Custom attendee`
                  : baseLabel
                const avatarUrl = person.avatarUrl
                const initials = getInitials(person.fullName)
                const isPurchaserOnly = value === PURCHASER_ID && selected.length === 1
                const personData = getPersonById(value)

                const hoverableContent = personData ? (
                  <ProfileHoverCard person={personData}>
                    <div className="flex items-center">
                      {showAvatar && (avatarUrl || initials) ? (
                        <Avatar className="h-5 w-5 mr-1.5">
                          {avatarUrl && <AvatarImage src={avatarUrl} alt={label} />}
                          <AvatarFallback className={cn("text-xs text-white", getAvatarColor(value))}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      ) : null}
                      <span className="cursor-default">{label}</span>
                    </div>
                  </ProfileHoverCard>
                ) : (
                  <div className="flex items-center">
                    {showAvatar && (avatarUrl || initials) ? (
                      <Avatar className="h-5 w-5 mr-1.5">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={label} />}
                        <AvatarFallback className={cn("text-xs text-white", getAvatarColor(value))}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                    <span>{label}</span>
                  </div>
                )

                return (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="h-8 px-2 py-1 text-sm font-normal bg-secondary/50 hover:bg-secondary shrink-0"
                    data-badge="true"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {hoverableContent}
                    {!isPurchaserOnly && (
                      <button
                        className="ml-1.5 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(value)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={() => handleUnselect(value)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </Badge>
                )
              })}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm px-2">{placeholder}</span>
          )}
        </div>

        {/* Input field - always visible at bottom */}
        <div 
          className="w-full relative px-2 pb-2 cursor-text"
          style={{ marginLeft: '4px' }}
          onClick={() => {
            inputRef.current?.focus()
          }}
        >
          <div className="relative w-full">
            {/* Hidden span for measuring text width */}
            <span
              ref={measureRef}
              className="absolute invisible text-sm"
              style={{ 
                visibility: 'hidden',
                whiteSpace: 'pre',
                position: 'absolute',
                top: '-9999px'
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                // Don't blur if clicking on suggestions dropdown
                const relatedTarget = e.relatedTarget as HTMLElement | null
                if (relatedTarget && suggestionsRef.current?.contains(relatedTarget)) {
                  return
                }
                // Delay to allow click events on suggestions
                setTimeout(() => setIsFocused(false), 200)
              }}
              onKeyDown={handleKeyDown}
              placeholder={selectedPeople.length === 0 ? placeholder : ""}
              className={cn(
                "w-full h-8 outline-none text-sm bg-transparent relative z-20",
                selectedPeople.length > 0 ? "pl-0" : "px-2"
              )}
              style={{ pointerEvents: 'auto' }}
            />
            {/* Autocomplete suggestion overlay - only shows the suggestion part */}
            {autocompleteSuggestion && isFocused && searchQuery.trim().length > 0 && (
              <div 
                className={cn(
                  "absolute left-0 top-0 h-8 flex items-center pointer-events-none z-0",
                  selectedPeople.length > 0 ? "pl-0" : "px-2"
                )}
              >
                <span 
                  className="text-sm text-muted-foreground/60 whitespace-pre"
                  style={{ 
                    marginLeft: `${inputWidth}px`
                  }}
                >
                  {autocompleteSuggestion}
                </span>
              </div>
            )}
          </div>
          
          {/* Resize handle - only show if draggable is enabled */}
          {draggable && (
            <div
              onMouseDown={(e) => {
                e.stopPropagation()
                handleResizeStart(e)
              }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2 right-2 w-5 h-5 cursor-ns-resize flex items-center justify-center opacity-60 hover:opacity-80 transition-opacity z-30"
              style={{ cursor: "ns-resize" }}
              title="Drag to resize"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10.7143L11.2857 1M5.85714 11L11 5.85714" stroke="rgba(0,0,0,0.2)" strokeOpacity="1"/>
              </svg>
            </div>
          )}
        </div>

          {/* Suggestions dropdown - positioned relative to container */}
        {isFocused && (
          (csvPeople.length > 0) ||
          (searchQuery.trim().length > 0 ? (availableOptions.length > 0 || shouldShowCreateOption) : availableOptions.length > 0)
        ) && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto"
            onMouseDown={(e) => {
              // Prevent input blur when clicking on dropdown
              e.preventDefault()
            }}
          >
            {/* CSV Summary Action */}
            {csvPeople.length > 0 && (
              <div
                data-suggestion-index={-1}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddCSVPeople()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted border-b border-[rgba(0,0,0,0.1)]",
                  highlightedIndex === -1 && "bg-muted"
                )}
                onMouseEnter={() => setHighlightedIndex(-1)}
              >
                <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <Plus className="h-3 w-3 text-white" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm text-green-600 font-medium">Add {csvPeople.length} {csvPeople.length === 1 ? 'attendee' : 'attendees'}</span>
                  <span className="text-xs text-muted-foreground">Multiple attendees detected. We&apos;ll add them or create new attendees</span>
                </div>
              </div>
            )}
            
            {/* Regular suggestions */}
            {availableOptions.map((person, index) => {
              const value = person.id
              const baseLabel = person.fullName
              const label = person.isPurchaser
                ? `${baseLabel} · Purchaser`
                : person.isCustom
                ? `${baseLabel} · Custom attendee`
                : baseLabel
              const subtitle = person.jobTitle
              const avatarUrl = person.avatarUrl
              const initials = getInitials(person.fullName)
              const isHighlighted = highlightedIndex === index

              return (
                <div
                  key={value}
                  data-suggestion-index={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSelect(value)
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted",
                    isHighlighted && "bg-muted"
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {showAvatar && (avatarUrl || initials) ? (
                    <Avatar className="h-5 w-5 shrink-0">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={label} />}
                      <AvatarFallback className={cn("text-xs text-white", getAvatarColor(value))}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm">{label}</span>
                    {subtitle && !person.isPurchaser && !person.isCustom && (
                      <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
                    )}
                  </div>
                </div>
              )
            })}
            
            {shouldShowCreateOption && (
              <div
                data-suggestion-index={availableOptions.length}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCreateAttendee()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted",
                  highlightedIndex === availableOptions.length && "bg-muted"
                )}
                onMouseEnter={() => setHighlightedIndex(availableOptions.length)}
              >
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Plus className="h-3 w-3 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-blue-600">Create new attendee</span>
                  <span className="text-xs text-muted-foreground">{searchQuery.trim()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {perPersonAmount && (
        <p className="text-sm text-muted-foreground mt-1">{perPersonAmount}</p>
      )}
    </div>
  )
}
