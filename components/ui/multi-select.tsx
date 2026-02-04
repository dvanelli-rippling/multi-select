"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchPeople, getAllPeople, type Person, PURCHASER_ID, createCustomAttendee, personExists, getPersonById } from "@/lib/people-db"
import { Plus } from "lucide-react"
import { ProfileHoverCard } from "@/components/ui/profile-hover-card"

export interface Option {
  value: string
  label: string
  avatar?: string
  initials?: string
  badge?: string
}

interface MultiSelectProps {
  options?: Option[] // Legacy support
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  perPersonAmount?: string
  usePeopleDatabase?: boolean // New prop to use people database
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
  // Predefined color palette
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

  // Simple hash function to get consistent color for same value
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

export function MultiSelect({
  options = [],
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  perPersonAmount,
  usePeopleDatabase = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [height, setHeight] = React.useState(162) // Default height for 4 people
  const [isResizing, setIsResizing] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const prevSelectedCountRef = React.useRef(selected.length)

  const handleUnselect = (value: string) => {
    // Prevent removing purchaser if they're the only one selected
    if (usePeopleDatabase && value === PURCHASER_ID) {
      // Only allow removal if there's at least one other person
      if (selected.length <= 1) {
        return // Don't allow removal
      }
    }
    onChange(selected.filter((s) => s !== value))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      // Don't allow deselecting purchaser if they're the only one
      if (usePeopleDatabase && value === PURCHASER_ID && selected.length === 1) {
        return
      }
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
      setSearchQuery("") // Clear search after selection
    }
  }

  // Get selected people/options - ordered by when they were added (selected array order)
  const selectedPeople = React.useMemo(() => {
    if (usePeopleDatabase) {
      const allPeople = getAllPeople()
      // Create a map for quick lookup
      const peopleMap = new Map(allPeople.map((person) => [person.id, person]))
      // Return people in the order they appear in the selected array
      return selected
        .map((id) => peopleMap.get(id))
        .filter((person): person is Person => person !== undefined)
    }
    // For legacy options, maintain selected array order
    const optionsMap = new Map(options.map((option) => [option.value, option]))
    return selected
      .map((value) => optionsMap.get(value))
      .filter((option): option is Option => option !== undefined)
  }, [selected, usePeopleDatabase, options])

  // Get available options based on search query - memoized to update when search changes
  const availableOptions = React.useMemo(() => {
    if (usePeopleDatabase) {
      const results = searchQuery.trim()
        ? searchPeople(searchQuery, selected)
        : getAllPeople(selected)
      // Limit to 10 results
      return results.slice(0, 10)
    }
    return options.filter((option) => !selected.includes(option.value))
  }, [searchQuery, selected, usePeopleDatabase, options])

  // Check if we should show "Create new attendee" option
  const shouldShowCreateOption = React.useMemo(() => {
    if (!usePeopleDatabase) return false
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery || trimmedQuery.length === 0) return false
    // Show if there are 3 or fewer results and person doesn't already exist
    const hasFewResults = availableOptions.length <= 3
    const personDoesNotExist = !personExists(trimmedQuery)
    return hasFewResults && personDoesNotExist
  }, [usePeopleDatabase, searchQuery, availableOptions])

  const handleCreateAttendee = () => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery || personExists(trimmedQuery)) return
    
    const newPerson = createCustomAttendee(trimmedQuery)
    handleSelect(newPerson.id)
  }

  // Clear search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("")
    }
  }, [open])

  // Auto-scroll to bottom when a new attendee is added
  React.useEffect(() => {
    if (selected.length > prevSelectedCountRef.current && scrollContainerRef.current) {
      // New attendee was added, scroll to bottom
      const scrollContainer = scrollContainerRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
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

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={containerRef}
            role="combobox"
            aria-expanded={open}
            aria-controls="multi-select-popover"
            className={cn(
              "bg-white border border-[rgba(0,0,0,0.1)] rounded-lg relative",
              "flex items-start gap-2 p-4 cursor-pointer hover:border-[rgba(0,0,0,0.2)] transition-colors"
            )}
            style={{ minHeight: `${height + 32}px`, height: "auto" }}
          >
            <div 
              ref={scrollContainerRef}
              className="flex flex-1 flex-col gap-1.5 items-start justify-start py-2 overflow-y-auto w-full scrollbar-thin"
              style={{ maxHeight: `${height}px`, minHeight: `${height}px` }}
            >
              {selectedPeople.length > 0 ? (
                selectedPeople.map((item) => {
                  const isPerson = usePeopleDatabase && "fullName" in item
                  const value = isPerson ? (item as Person).id : (item as Option).value
                  const person = isPerson ? (item as Person) : null
                  const baseLabel = isPerson ? (item as Person).fullName : (item as Option).label
                  // Format label: add "· Purchaser" if this is the purchaser, or "· Custom attendee" if custom
                  const label = usePeopleDatabase && person?.isPurchaser
                    ? `${baseLabel} · Purchaser`
                    : usePeopleDatabase && person?.isCustom
                    ? `${baseLabel} · Custom attendee`
                    : baseLabel
                  const avatarUrl = isPerson ? (item as Person).avatarUrl : undefined
                  const initials = isPerson
                    ? getInitials((item as Person).fullName)
                    : (item as Option).initials || (item as Option).avatar
                  
                  // Hide remove button for purchaser if they're the only one selected
                  const isPurchaserOnly = usePeopleDatabase && value === PURCHASER_ID && selected.length === 1
                  
                  // Get person data for hover card (only for people database)
                  const personData = usePeopleDatabase && isPerson ? getPersonById(value) : null

                  const hoverableContent = personData ? (
                    <ProfileHoverCard person={personData}>
                      <div className="flex items-center">
                        {avatarUrl || initials ? (
                          <Avatar className="h-5 w-5 mr-1.5">
                            {avatarUrl && (
                              <AvatarImage src={avatarUrl} alt={label} />
                            )}
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
                      {avatarUrl || initials ? (
                        <Avatar className="h-5 w-5 mr-1.5">
                          {avatarUrl && (
                            <AvatarImage src={avatarUrl} alt={label} />
                          )}
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
                      className="mr-1 mb-0.5 h-8 px-2 py-1 text-sm font-normal bg-secondary/50 hover:bg-secondary shrink-0"
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
                })
              ) : (
                <span className="text-muted-foreground text-sm">{placeholder}</span>
              )}
            </div>
            {/* Resize handle */}
            <div
              onMouseDown={handleResizeStart}
              className="absolute bottom-2 right-2 w-5 h-5 cursor-ns-resize flex items-center justify-center opacity-60 hover:opacity-80 transition-opacity z-10"
              style={{ cursor: "ns-resize" }}
              title="Drag to resize"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10.7143L11.2857 1M5.85714 11L11 5.85714" stroke="rgba(0,0,0,0.2)" strokeOpacity="1"/>
              </svg>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent id="multi-select-popover" className="w-[400px] p-0" align="start">
          <Command shouldFilter={!usePeopleDatabase}>
            <CommandInput
              placeholder="Search people..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {availableOptions.length > 0 ? (
                <CommandGroup>
                  {availableOptions.map((item) => {
                      const isPerson = usePeopleDatabase && "fullName" in item
                      const value = isPerson ? (item as Person).id : (item as Option).value
                      const person = isPerson ? (item as Person) : null
                      const baseLabel = isPerson ? (item as Person).fullName : (item as Option).label
                      // Format label: add "· Purchaser" if this is the purchaser, or "· Custom attendee" if custom
                      const label = usePeopleDatabase && person?.isPurchaser
                        ? `${baseLabel} · Purchaser`
                        : usePeopleDatabase && person?.isCustom
                        ? `${baseLabel} · Custom attendee`
                        : baseLabel
                      const subtitle = isPerson ? (item as Person).jobTitle : undefined
                      const avatarUrl = isPerson ? (item as Person).avatarUrl : undefined
                      const initials = isPerson
                        ? getInitials((item as Person).fullName)
                        : (item as Option).initials || (item as Option).avatar

                      return (
                        <CommandItem
                          key={value}
                          onSelect={() => handleSelect(value)}
                          className="cursor-pointer px-3"
                        >
                          {avatarUrl || initials ? (
                            <Avatar className="h-5 w-5 mr-2">
                              {avatarUrl && (
                                <AvatarImage src={avatarUrl} alt={label} />
                              )}
                              <AvatarFallback className={cn("text-xs text-white", getAvatarColor(value))}>
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          ) : null}
                          <div className="flex flex-col">
                            <span className="text-sm">{label}</span>
                            {subtitle && !person?.isPurchaser && !person?.isCustom && (
                              <span className="text-xs text-muted-foreground">{subtitle}</span>
                            )}
                          </div>
                        </CommandItem>
                      )
                    })}
                  {shouldShowCreateOption && (
                    <CommandItem
                      onSelect={handleCreateAttendee}
                      className="cursor-pointer px-3"
                    >
                      <div className="mr-2 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Plus className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-600">Create new attendee</span>
                        <span className="text-xs text-muted-foreground">{searchQuery.trim()}</span>
                      </div>
                    </CommandItem>
                  )}
                </CommandGroup>
              ) : shouldShowCreateOption ? (
                <>
                  <div className="px-2 py-1.5 text-sm text-muted-foreground border-b">
                    No results found for &apos;{searchQuery.trim()}&apos;
                  </div>
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleCreateAttendee}
                      className="cursor-pointer px-3"
                    >
                      <div className="mr-2 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Plus className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-600">Create new attendee</span>
                        <span className="text-xs text-muted-foreground">{searchQuery.trim()}</span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {perPersonAmount && (
        <p className="text-sm text-muted-foreground mt-1">{perPersonAmount}</p>
      )}
    </div>
  )
}
