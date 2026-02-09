"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Calendar, ChevronDown, ChevronUp, HelpCircle, Plus, Edit, Download, Trash2, ZoomIn, ZoomOut, Info, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsSwitch, TabsSwitchList, TabsSwitchTrigger } from "@/components/ui/tabs-switch"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MultiSelect } from "@/components/ui/multi-select"
import { MultiSelectAutocomplete } from "@/components/ui/multi-select-autocomplete"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PURCHASER_ID } from "@/lib/people-db"
import "./pebble/pebble-styles.css"

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([PURCHASER_ID])
  const [totalAmount, setTotalAmount] = useState("3331.20")
  const [usePebbleStyle, setUsePebbleStyle] = useState(false)
  const [specGuideOpen, setSpecGuideOpen] = useState(false)
  const [searchMode, setSearchMode] = useState<"dropdown" | "input">("input")
  const [isDraggable, setIsDraggable] = useState(true)
  const [verticalStack, setVerticalStack] = useState(true)
  const [showAvatar, setShowAvatar] = useState(true)
  const [processCSV, setProcessCSV] = useState(true)
  const [receiptWidth, setReceiptWidth] = useState(288)
  const [isResizing, setIsResizing] = useState(false)
  const [isFormNarrow, setIsFormNarrow] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  const formColumnRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(288)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const deltaX = startXRef.current - e.clientX // Negative when dragging left (making receipt wider)
      const newWidth = startWidthRef.current + deltaX
      
      // Constrain between 200px and 600px
      const constrainedWidth = Math.max(200, Math.min(600, newWidth))
      setReceiptWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  // Monitor form column width to determine if labels should stack
  useEffect(() => {
    if (!formColumnRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        // Stack vertically when form column is narrower than 500px
        setIsFormNarrow(width < 500)
      }
    })

    resizeObserver.observe(formColumnRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className={cn("min-h-screen", usePebbleStyle && "pebble-theme")} style={usePebbleStyle ? { backgroundColor: '#fafafa' } : { backgroundColor: '#fafafa' }}>
      {/* Navigation Bar - Outside Prototype */}
      <div className="sticky top-0 z-50 bg-white border-b border-[rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-12 py-3 flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm font-normal"
            onClick={() => setSpecGuideOpen(true)}
          >
            <FileText className="h-4 w-4" />
            Multi-select spec guide
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className={cn("border-b", usePebbleStyle ? "pebble-header bg-white" : "bg-white")} style={usePebbleStyle ? { 
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      } : {}}>
        <div className="max-w-7xl mx-auto px-12 py-6 flex items-center justify-between">
          <h1 className={cn("text-2xl font-medium", usePebbleStyle ? "pebble-title-large" : "")} style={usePebbleStyle ? { 
            color: 'var(--colorOnSurface, #202022)',
            fontSize: '24px',
            fontWeight: 500
          } : { color: '#202022' }}>
            Reimbursement
          </h1>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-12 py-4">
        {usePebbleStyle ? (
          <TabsSwitch value={activeTab} onValueChange={setActiveTab}>
            <TabsSwitchList>
              <TabsSwitchTrigger value="upload">
                Upload receipt
              </TabsSwitchTrigger>
              <TabsSwitchTrigger value="mileage">
                Enter mileage
              </TabsSwitchTrigger>
            </TabsSwitchList>
          </TabsSwitch>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="upload">
                Upload receipt
              </TabsTrigger>
              <TabsTrigger value="mileage">
                Enter mileage
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-12 pb-16">
        <div className="flex gap-6">
          {/* Left Column - Form */}
          <div ref={formColumnRef} className="flex-1 space-y-6" style={{ minWidth: 0 }}>
            {/* Reimbursement Section */}
            <Card className={cn("p-6", usePebbleStyle ? "pebble-card" : "border border-[rgba(0,0,0,0.1)]")}>
              <h2 className={cn("mb-6", usePebbleStyle ? "pebble-title-medium" : "text-lg font-medium text-[#202022] tracking-wide")}>
                Reimbursement
              </h2>
              <div className="space-y-4">
                {/* Vendor */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Vendor
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select defaultValue="la-dauphine">
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">LA</AvatarFallback>
                          </Avatar>
                          <SelectValue placeholder="Select vendor" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="la-dauphine">La Dauphine</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Total amount */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Total amount
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <div className={cn("flex h-10 rounded-lg overflow-hidden", usePebbleStyle ? "pebble-input-border" : "border border-[rgba(0,0,0,0.2)] bg-white")}>
                      <div className={cn("flex items-center gap-2 px-4 border-r min-w-[96px] shrink-0", usePebbleStyle ? "pebble-border" : "border-[rgba(0,0,0,0.2)]")}>
                        <span className={usePebbleStyle ? "pebble-body-medium" : "text-[15px]"}>USD</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <Input
                        type="text"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className={cn("border-0 focus-visible:ring-0 h-10 px-4 flex-1 min-w-0", usePebbleStyle && "pebble-input")}
                      />
                    </div>
                  </div>
                </div>

                {/* Purchase date */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Purchase date
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Input
                      type="date"
                      defaultValue="2020-03-19"
                      className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}
                    />
                  </div>
                </div>

                {/* Purchase location */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Purchase location
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select defaultValue="paris">
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paris">Paris, France</SelectItem>
                        <SelectItem value="london">London, UK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Expense Purpose Section */}
            <Card className={cn("p-6", usePebbleStyle ? "pebble-card" : "border border-[rgba(0,0,0,0.1)]")}>
              <h2 className={cn("mb-6", usePebbleStyle ? "pebble-title-medium" : "text-lg font-medium text-[#202022] tracking-wide")}>
                Expense purpose
              </h2>
              <div className="space-y-4">
                {/* Category */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Category
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select defaultValue="meals">
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meals">Meals & Entertainment</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Memo */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Memo
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Input
                      type="text"
                      defaultValue="Got it on the go"
                      className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}
                      placeholder="Provide a memo"
                    />
                  </div>
                </div>

                {/* Expense report */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Expense report
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select>
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="report1">Report 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Purchaser */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Purchaser
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select defaultValue="lando">
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">LN</AvatarFallback>
                          </Avatar>
                          <SelectValue placeholder="Select purchaser" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lando">Lando Norris (You)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Attendees - Multi-select */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <div className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px]")}>
                    <Label className={cn(usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>Attendees</Label>
                    <span className="text-[#c3402c]">*</span>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    {searchMode === "dropdown" ? (
                      <MultiSelect
                        selected={selectedAttendees}
                        onChange={setSelectedAttendees}
                        placeholder="Select attendees..."
                        perPersonAmount={(() => {
                          const amount = parseFloat(totalAmount) || 0
                          const attendeeCount = selectedAttendees.length || 1
                          const perPerson = amount / attendeeCount
                          const isPurchaserIncluded = selectedAttendees.includes(PURCHASER_ID)
                          const baseText = perPerson > 0 ? `$${perPerson.toFixed(2)} per person` : undefined
                          return baseText && !isPurchaserIncluded 
                            ? `${baseText} · Purchaser not on expense`
                            : baseText
                        })()}
                        usePeopleDatabase={true}
                      />
                    ) : (
                      <MultiSelectAutocomplete
                        selected={selectedAttendees}
                        onChange={setSelectedAttendees}
                        placeholder="Select attendees..."
                        draggable={isDraggable}
                        verticalStack={verticalStack}
                        showAvatar={showAvatar}
                        processCSV={processCSV}
                        perPersonAmount={(() => {
                          const amount = parseFloat(totalAmount) || 0
                          const attendeeCount = selectedAttendees.length || 1
                          const perPerson = amount / attendeeCount
                          const isPurchaserIncluded = selectedAttendees.includes(PURCHASER_ID)
                          const baseText = perPerson > 0 ? `$${perPerson.toFixed(2)} per person` : undefined
                          return baseText && !isPurchaserIncluded 
                            ? `${baseText} · Purchaser not on expense`
                            : baseText
                        })()}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Add attachments */}
              <div className="mt-6">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add attachments
                </Button>
              </div>
            </Card>

            {/* Accounting Categorization Section */}
            <Card className={cn("p-6", usePebbleStyle ? "pebble-card" : "border border-[rgba(0,0,0,0.1)]")}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={cn(usePebbleStyle ? "pebble-title-medium" : "text-lg font-medium text-[#202022] tracking-wide")}>
                  Accounting categorization
                </h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {/* Custom dimension */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Custom dimension
                    <span style={usePebbleStyle ? { color: 'var(--colorError, #c3402c)' } : {}} className={!usePebbleStyle ? "text-[#c3402c]" : ""}>*</span>
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select>
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dim1">Dimension 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tax rate */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <div className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px]")}>
                    <Label className={cn(usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>Tax rate</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select>
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tax1">Tax 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* GL vendor */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    GL vendor
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select>
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gl1">GL Vendor 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* GL customer */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    GL customer
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select>
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gl1">GL Customer 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* GL billable */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    GL billable
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select>
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gl1">GL Billable 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Accounting date */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <Label className={cn("flex items-center", isFormNarrow ? "w-auto h-auto" : "w-[156px] h-10", usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>
                    Accounting date
                  </Label>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Input
                      type="date"
                      className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}
                    />
                  </div>
                </div>

                {/* Taxable income */}
                <div className={cn("flex gap-4 items-start", isFormNarrow && "flex-col gap-2")}>
                  <div className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px]")}>
                    <Label className={cn(usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>Taxable income</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <Select defaultValue="na">
                      <SelectTrigger className={cn("h-10", usePebbleStyle ? "pebble-input" : "bg-white")}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="na">Not applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amortization */}
                <div className={cn("flex gap-4 items-center", isFormNarrow && "flex-col gap-2 items-start")}>
                  <div className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px]")}>
                    <Label className={cn(usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>Amortization</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm text-muted-foreground">Disabled</span>
                    </div>
                  </div>
                </div>

                {/* Expense splitting */}
                <div className={cn("flex gap-4 items-center", isFormNarrow && "flex-col gap-2 items-start")}>
                  <div className={cn("flex items-center gap-1", isFormNarrow ? "w-auto h-auto" : "w-[156px]")}>
                    <Label className={cn(usePebbleStyle ? "pebble-label" : "text-[15px] tracking-wide")}>Expense splitting</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={cn(isFormNarrow ? "w-full" : "flex-1")}>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm text-muted-foreground">Disabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            className="w-2 bg-transparent hover:bg-border/50 cursor-col-resize transition-colors group relative flex-shrink-0"
            onMouseDown={(e) => {
              e.preventDefault()
              startXRef.current = e.clientX
              startWidthRef.current = receiptWidth
              setIsResizing(true)
            }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 group-hover:bg-border" />
          </div>

          {/* Right Column - Receipt */}
          <div className="space-y-4" style={{ width: `${receiptWidth}px`, flexShrink: 0 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#202022] tracking-wide">
                Receipt
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Card className={cn("p-0 overflow-hidden", usePebbleStyle ? "pebble-card" : "border border-[rgba(0,0,0,0.2)]")}>
              <div className="aspect-[2448/3264] bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Receipt image
                </div>
                <div className="absolute bottom-2 right-2 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-lg py-1 flex flex-col gap-1 items-center">
                  <Button variant="ghost" size="icon" className="h-10 w-10 flex items-center justify-center">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 flex items-center justify-center">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs flex items-center justify-center">
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
            <div className="flex items-center gap-1 text-sm">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">3 details</span>
              <span className="text-muted-foreground">scanned from receipt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cn("fixed bottom-0 left-0 right-0 border-t bg-white", usePebbleStyle ? "pebble-footer" : "border-[rgba(0,0,0,0.1)]")} style={usePebbleStyle ? { 
        borderTop: '1px solid rgba(0,0,0,0.1)'
      } : {}}>
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Button variant="ghost" className="text-destructive hover:text-destructive">
            Delete
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">Save draft</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </div>

      {/* Spec Guide Sheet */}
      <Sheet open={specGuideOpen} onOpenChange={setSpecGuideOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col overflow-hidden">
          <SheetHeader className="flex-shrink-0 bg-white border-b p-6 pb-4 flex flex-row items-center justify-between">
            <SheetTitle className="text-2xl font-medium text-[#202022]">
              Multi-select spec guide
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSpecGuideOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Component Controls */}
            <section className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold mb-2">Configurable props</h2>
              
              <div className="flex items-center gap-4">
                <Label htmlFor="spec-search-mode" className="text-sm font-medium w-[180px] shrink-0">
                  Search mode:
                </Label>
                <Select
                  value={searchMode}
                  onValueChange={(value) => {
                    if (value === "dropdown" || value === "input") {
                      setSearchMode(value)
                    }
                  }}
                >
                  <SelectTrigger id="spec-search-mode" className="w-[200px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      value="input"
                      className="pl-2 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2"
                    >
                      Search in input
                    </SelectItem>
                    <SelectItem 
                      value="dropdown"
                      className="pl-2 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2"
                    >
                      Search in dropdown
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="spec-draggable" className="text-sm font-medium w-[180px] shrink-0">
                  Draggable (resizable):
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="spec-draggable"
                    checked={isDraggable}
                    onCheckedChange={setIsDraggable}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="spec-vertical-stack" className="text-sm font-medium w-[180px] shrink-0">
                  Vertical stacking:
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="spec-vertical-stack"
                    checked={verticalStack}
                    onCheckedChange={setVerticalStack}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="spec-show-avatar" className="text-sm font-medium w-[180px] shrink-0">
                  Show avatar:
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="spec-show-avatar"
                    checked={showAvatar}
                    onCheckedChange={setShowAvatar}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="spec-process-csv" className="text-sm font-medium w-[180px] shrink-0">
                  Process CSV:
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="spec-process-csv"
                    checked={processCSV}
                    onCheckedChange={setProcessCSV}
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-border" />

            {/* Context */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Context</h2>
              <p className="text-muted-foreground">
                This proposal extends the standard multi-select with configurable props to improve integration with HRIS people data, better support admin workflows like copy-pasting, and introduce clearer patterns for handling overflow and displaying information more readably.
              </p>
            </section>

            <div className="h-px bg-border" />

            {/* Basic Interaction */}
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Basic interaction</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Selecting the input opens search</li>
                <li>Search by name, email, title, or department (max 10 results)</li>
                <li>Selecting a result adds a chip and clears the query</li>
                <li>Selected people are excluded from search and shown in add order</li>
                <li>The typeahead placeholder reads: <code className="bg-muted px-1 rounded text-xs">Search for people or paste a list</code></li>
                <li>Autocomplete suggestions appear as you type; press <code className="bg-muted px-1 rounded text-xs">Tab</code> to complete</li>
                <li>While typing in the typeahead, <code className="bg-muted px-1 rounded text-xs">Cmd+Z</code> / <code className="bg-muted px-1 rounded text-xs">Ctrl+Z</code> clears the current query</li>
              </ul>
            </section>

            {/* Purchaser Behavior */}
            <section>
              <h2 className="text-xl font-semibold mb-4">2. Purchaser behavior</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>A purchaser is selected by default and labeled <Badge variant="secondary" className="inline-flex h-6 mx-1">Name · Purchaser</Badge></li>
                <li>The purchaser cannot be removed if they are the only attendee</li>
                <li>If removed while others remain, helper text shows <code className="bg-muted px-1 rounded text-xs">Purchaser not on expense</code></li>
                <li>Re-adding the purchaser places them at the bottom of the list</li>
              </ul>
            </section>

            {/* Custom Attendees */}
            <section>
              <h2 className="text-xl font-semibold mb-4">3. Custom attendees</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>When there are 3 or fewer results and no match exists, show <code className="bg-muted px-1 rounded text-xs">Create new attendee</code></li>
                <li>Selecting it creates a custom attendee from the entered name</li>
                <li>Custom attendees are labeled <Badge variant="secondary" className="inline-flex h-6 mx-1">Name · Custom attendee</Badge></li>
                <li>Custom attendees behave like regular attendees for search, add, and remove</li>
              </ul>
            </section>

            {/* Visual Features */}
            <section>
              <h2 className="text-xl font-semibold mb-4">4. Visual behavior</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Hovering an attendee chip shows a profile card with role, org, and contact info</li>
                <li>Up to 4 attendees are visible before scrolling</li>
                <li>The input is vertically resizable (50px–400px)</li>
              </ul>
            </section>

            {/* Dynamic Calculations */}
            <section>
              <h2 className="text-xl font-semibold mb-4">5. Cost calculation</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Helper text shows <code className="bg-muted px-1 rounded text-xs">Amount per person</code></li>
                <li>Calculated as total ÷ attendee count</li>
                <li>Updates when attendees or total change</li>
                <li>Appends <code className="bg-muted px-1 rounded text-xs">Purchaser not on expense</code> when applicable</li>
              </ul>
            </section>

            {/* Ordering & Display */}
            <section>
              <h2 className="text-xl font-semibold mb-4">6. Ordering</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Attendees render in the order added</li>
                <li>Re-added attendees always appear last</li>
                <li>The list auto-scrolls to the newest addition</li>
              </ul>
            </section>

            <div className="h-px bg-border" />

            {/* Copy-Paste Behavior */}
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Copy and paste (CSV) behavior</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Pasting a comma-separated list triggers CSV detection</li>
                <li>Supports simple names and Google Calendar format (<code className="bg-muted px-1 rounded text-xs">Name &lt;email&gt;</code>)</li>
                <li>The name is displayed; the email is stored</li>
                <li>Each value is matched against Rippling, adding an existing person when found or creating a custom attendee otherwise.</li>
                <li>Repeated names in a pasted list are added once, even if they use different capitalization (for example, <code className="bg-muted px-1 rounded text-xs">john doe</code> and <code className="bg-muted px-1 rounded text-xs">John Doe</code>).</li>
                <li>Empty entries and already-selected people are skipped</li>
                <li>Show <code className="bg-muted px-1 rounded text-xs">Add X attendees</code> to confirm adding all at once</li>
                <li>When CSV is detected, <code className="bg-muted px-1 rounded text-xs">Create new attendee</code> is hidden</li>
              </ul>
            </section>

            <div className="h-px bg-border" />

            {/* Edge Cases */}
            <section>
              <h2 className="text-xl font-semibold mb-4">8. Validation and edge cases</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>The purchaser cannot be the only removable attendee</li>
                <li>Search input is trimmed before processing</li>
                <li>At least one attendee is required (enforced by the parent component)</li>
                <li>Attendees added with only a single name are invalid. Show inline validation: <code className="bg-muted px-1 rounded text-xs">Remove this attendee and enter a full name</code></li>
              </ul>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
