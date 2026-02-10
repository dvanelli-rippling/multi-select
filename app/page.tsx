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
  const [platform, setPlatform] = useState<"web" | "mobile">("web")
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
        <div className="max-w-7xl mx-auto px-12 py-3 flex items-center justify-end">
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
              
              {process.env.NEXT_PUBLIC_GITHUB_PAGES !== 'true' && (
                <div className="flex items-center gap-4">
                  <Label htmlFor="spec-platform" className="text-sm font-medium w-[180px] shrink-0">
                    Platform:
                  </Label>
                  <Select
                    value={platform}
                    onValueChange={(value) => {
                      if (value === "web" || value === "mobile") {
                        setPlatform(value)
                      }
                    }}
                  >
                    <SelectTrigger id="spec-platform" className="w-[200px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem 
                        value="web"
                        className="pl-2 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2"
                      >
                        Web
                      </SelectItem>
                      <SelectItem 
                        value="mobile"
                        className="pl-2 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2"
                      >
                        Mobile
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

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

            {platform === "web" ? (
              <>
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
              </>
            ) : (
              <>
                {/* Mobile Spec - 1-shot prompt */}
                <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>1-shot prompt for Cursor.</strong> This spec defines the mobile-responsive variant of the attendee multi-select with full feature parity. Use this to build the component end-to-end in a single pass.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Core purpose</h2>
                  <p className="text-muted-foreground">
                    A people-aware multi-select backed by HRIS data, optimized for admin workflows (search + copy/paste), resilient in dense states, and adaptable across device-specific interaction patterns.
                  </p>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <h2 className="text-xl font-semibold mb-4">1. Layout and responsiveness</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>The component must be fully responsive across desktop (with receipt component in a right rail), tablet, and mobile</li>
                    <li>When displayed alongside a receipt component in a right rail, the multi-select must not overflow horizontally</li>
                    <li>Chip layout must adapt to available width; input and chips must reflow without truncating critical information</li>
                    <li>Support inline chip layout when horizontal space allows, and vertical chip stacking when space is constrained</li>
                    <li>No horizontal scrolling for chips; vertical scrolling allowed within defined height limits</li>
                    <li>Resizing or collapsing the receipt rail must not break chip ordering, input focus, or scroll position</li>
                    <li>On mobile, the component expands to full width; receipt content stacks according to layout rules</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">2. Mobile-specific pattern adaptations</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Mobile interaction patterns may differ from desktop where appropriate</li>
                    <li>The active state of the attendee input should adapt for touch: use clearer focus and active affordances than desktop</li>
                    <li>Avoid dense inline states that are hard to interact with on touch devices</li>
                    <li>Searching for people or adding a pasted list may occur on a dedicated surface (e.g., a full-screen sheet or modal instead of inline dropdowns)</li>
                    <li>Any mobile-specific pattern changes must preserve feature parity and outcomes with desktop behavior</li>
                  </ul>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <h2 className="text-xl font-semibold mb-4">3. Data model</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>An attendee can be an existing person from HRIS (stable id) or a custom attendee (full name, optional email)</li>
                    <li>A purchaser exists and is selected by default</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">4. Basic interaction (desktop and mobile)</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Selecting the input opens a searchable typeahead</li>
                    <li>Search supports name, email, title, and department (max 10 results)</li>
                    <li>Selecting a result adds a chip and clears the query</li>
                    <li>Selected people are excluded from search results</li>
                    <li>Attendees render in the order they were added; removing and re-adding places them at the end</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">5. Typeahead behavior</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>The typeahead placeholder reads: <code className="bg-muted px-1 rounded text-xs">Search for people or paste a list</code></li>
                    <li>Autocomplete suggestions appear as the user types</li>
                    <li><strong>Desktop:</strong> Press <code className="bg-muted px-1 rounded text-xs">Tab</code> to accept the autocomplete suggestion; <code className="bg-muted px-1 rounded text-xs">Cmd+Z</code> / <code className="bg-muted px-1 rounded text-xs">Ctrl+Z</code> clears the entire query</li>
                    <li><strong>Mobile:</strong> Provide a clear-query control equivalent to <code className="bg-muted px-1 rounded text-xs">Cmd/Ctrl+Z</code></li>
                    <li>The search input is trimmed before processing</li>
                  </ul>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <h2 className="text-xl font-semibold mb-4">6. Purchaser behavior</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Purchaser is selected by default; chip label format: <Badge variant="secondary" className="inline-flex h-6 mx-1">Name · Purchaser</Badge></li>
                    <li>The purchaser cannot be removed if they are the only attendee</li>
                    <li>If removed while others remain, show helper text: <code className="bg-muted px-1 rounded text-xs">Purchaser not on expense</code></li>
                    <li>Re-adding the purchaser places them at the bottom of the list</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">7. Custom attendees</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>When there are 3 or fewer search results and no existing person matches, show <code className="bg-muted px-1 rounded text-xs">Create new attendee</code></li>
                    <li>Creates a custom attendee from the entered name; requires a full name (first + last)</li>
                    <li>Custom attendee chip label format: <Badge variant="secondary" className="inline-flex h-6 mx-1">Name · Custom attendee</Badge></li>
                    <li>Custom attendees behave like regular attendees for search, add, and remove</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">8. Validation</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>At least one attendee is always required (enforced by the parent)</li>
                    <li>Attendees added with only a single name are invalid; show inline validation: <code className="bg-muted px-1 rounded text-xs">Remove this attendee and enter a full name</code></li>
                    <li>The purchaser cannot be the only removable attendee</li>
                  </ul>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <h2 className="text-xl font-semibold mb-4">9. Visual behavior</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Hovering an attendee chip shows a profile card with role, org, and contact info (desktop)</li>
                    <li>Chips support optional avatar display</li>
                    <li>Show up to 4 attendees before vertical scrolling</li>
                    <li>The input supports vertical resizing from 50px to 400px</li>
                    <li>Chip layout adapts based on available width (inline vs stacked)</li>
                    <li>Dense states remain usable and readable next to the receipt rail</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">10. Cost calculation (parent-driven)</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Helper text shows <code className="bg-muted px-1 rounded text-xs">Amount per person</code></li>
                    <li>Calculated as total ÷ attendee count; updates automatically when attendees or total change</li>
                    <li>Appends <code className="bg-muted px-1 rounded text-xs">Purchaser not on expense</code> when applicable</li>
                  </ul>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <h2 className="text-xl font-semibold mb-4">11. Copy + paste (CSV) behavior</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Pasting a comma-separated list triggers CSV detection</li>
                    <li>Supported formats: simple names (<code className="bg-muted px-1 rounded text-xs">Jordan Alvarez, Alexandra Chen</code>) and Google Calendar format (<code className="bg-muted px-1 rounded text-xs">Alex Blue &lt;a.blue@rippling.com&gt;</code>)</li>
                    <li>For Google Calendar format, display the name and store the email on the back end</li>
                    <li>Each value is matched against Rippling, adding an existing person when found or creating a custom attendee otherwise</li>
                    <li>Repeated names in a pasted list are added once, even if they use different capitalization</li>
                    <li>Skip empty values and already-selected people</li>
                    <li>When CSV is detected, show <code className="bg-muted px-1 rounded text-xs">Add X attendees</code> to confirm; hide <code className="bg-muted px-1 rounded text-xs">Create new attendee</code></li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">12. Ordering and scrolling</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Attendees always render in add order; re-added attendees appear last</li>
                    <li>The list auto-scrolls to the newest addition</li>
                    <li>Scrolling within the multi-select must not affect receipt scroll behavior</li>
                  </ul>
                </section>

                <div className="h-px bg-border" />

                <section>
                  <h2 className="text-xl font-semibold mb-4">13. Parity requirements</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Desktop and mobile must support the same core behaviors and outcomes</li>
                    <li>Interaction patterns may differ to suit input method and screen size</li>
                    <li>No desktop-only functionality without a mobile equivalent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">14. Deliverables</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>A reusable, fully responsive component with clear separation of UI, state, and validation</li>
                    <li>Layout-aware behavior that adapts to a right-rail receipt and mobile surfaces</li>
                    <li>Predictable ordering and overflow handling</li>
                    <li>Inline comments where behavior deviates from native defaults (e.g., <code className="bg-muted px-1 rounded text-xs">Cmd/Ctrl+Z</code> handling)</li>
                  </ul>
                </section>

                <div className="h-px bg-border" />

                {/* Copyable prompt */}
                <section className="bg-muted/50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3">Copyable 1-shot prompt</h2>
                  <p className="text-sm text-muted-foreground mb-3">Copy the prompt below into Cursor to build the mobile-responsive variant with full parity.</p>
                  <div className="relative">
                    <pre id="mobile-prompt-text" className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4 text-xs text-muted-foreground overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre-wrap">
{`Build a production-ready attendee multi-select component with full desktop and mobile parity. This component is used when submitting a reimbursement and must behave correctly in responsive layouts, including when rendered next to a receipt viewer in a right-hand rail. Treat all requirements below as a specification, not suggestions.

## Core purpose

A people-aware multi-select backed by HRIS data, optimized for admin workflows (search + copy/paste), resilient in dense states, and adaptable across device-specific interaction patterns.

## Layout and responsiveness (critical)

- The component must be fully responsive across desktop (with receipt component in a right rail), tablet, and mobile
- When displayed alongside a receipt component in a right rail:
  - The multi-select must not overflow horizontally
  - Chip layout must adapt to available width
  - Input and chips must reflow without truncating critical information
- Support inline chip layout when horizontal space allows, and vertical chip stacking when space is constrained
- Chip overflow: no horizontal scrolling for chips; vertical scrolling allowed within defined height limits
- Resizing or collapsing the receipt rail must not break chip ordering, input focus, or scroll position
- On mobile: the component expands to full width; receipt content stacks according to layout rules

## Mobile-specific pattern adaptations

- Mobile interaction patterns may differ from desktop where appropriate
- The active state of the attendee input should adapt for touch: use clearer focus and active affordances than desktop
- Avoid dense inline states that are hard to interact with
- Searching for people or adding a pasted list may occur on a dedicated surface (e.g., a full-screen sheet or modal instead of inline dropdowns)
- Any mobile-specific pattern changes must preserve feature parity and outcomes with desktop behavior

## Data model

- An attendee can be: an existing person from HRIS (stable id), or a custom attendee (full name, optional email)
- A purchaser exists and is selected by default

## Basic interaction (desktop and mobile)

- Selecting the input opens a searchable typeahead
- Search supports name, email, title, and department (max 10 results)
- Selecting a result adds a chip and clears the query
- Selected people are excluded from search results
- Attendees render in the order they were added; removing and re-adding places them at the end

## Typeahead behavior

- The typeahead placeholder reads: "Search for people or paste a list"
- Autocomplete suggestions appear as the user types
- Desktop: Press Tab to accept the autocomplete suggestion; Cmd+Z / Ctrl+Z clears the entire query (custom behavior, not character-level undo)
- Mobile: Provide a clear-query control equivalent to Cmd/Ctrl+Z
- The search input is trimmed before processing

## Purchaser behavior

- Purchaser is selected by default; chip label format: Name · Purchaser
- The purchaser cannot be removed if they are the only attendee
- If removed while others remain, show helper text: "Purchaser not on expense"
- Re-adding the purchaser places them at the bottom of the list

## Custom attendees

- When there are 3 or fewer search results and no existing person matches, show "Create new attendee"
- Creates a custom attendee from the entered name; requires a full name (first + last)
- Custom attendee chip label format: Name · Custom attendee
- Custom attendees behave like regular attendees for search, add, and remove

## Validation

- At least one attendee is always required (enforced by the parent)
- Attendees added with only a single name are invalid; show inline validation: "Remove this attendee and enter a full name"
- The purchaser cannot be the only removable attendee

## Visual behavior

- Hovering an attendee chip shows a profile card with role, org, and contact info (desktop)
- Chips support optional avatar display
- Show up to 4 attendees before vertical scrolling
- The input supports vertical resizing from 50px to 400px
- Chip layout adapts based on available width (inline vs stacked)
- Dense states remain usable and readable next to the receipt rail

## Cost calculation (parent-driven)

- Helper text shows "Amount per person"
- Calculated as total ÷ attendee count; updates automatically when attendees or total change
- Appends "Purchaser not on expense" when applicable

## Copy + paste (CSV) behavior

- Pasting a comma-separated list triggers CSV detection
- Supported formats: simple names (Jordan Alvarez, Alexandra Chen) and Google Calendar format (Alex Blue <a.blue@rippling.com>)
- For Google Calendar format: display the name, store the email on the back end
- Each pasted value is checked against HRIS: if a match exists, add that person; otherwise, create a custom attendee
- Repeated names in a pasted list are added once, even if they use different capitalization (e.g., john doe and John Doe result in a single attendee)
- Skip empty values and already-selected people
- When CSV is detected: show "Add X attendees" to confirm adding all at once; hide "Create new attendee" to avoid conflicting actions

## Ordering and scrolling

- Attendees always render in add order; re-added attendees appear last
- The list auto-scrolls to the newest addition
- Scrolling within the multi-select must not affect receipt scroll behavior

## Parity requirements

- Desktop and mobile must support the same core behaviors and outcomes
- Interaction patterns may differ to suit input method and screen size
- No desktop-only functionality without a mobile equivalent

## Deliverables

- A reusable, fully responsive component with clear separation of UI, state, and validation
- Layout-aware behavior that adapts to a right-rail receipt and mobile surfaces
- Predictable ordering and overflow handling
- Inline comments where behavior deviates from native defaults (e.g., Cmd/Ctrl+Z handling)

Build this end to end with correctness, responsiveness, and parity as the top priorities.`}
                    </pre>
                    <button
                      className="absolute top-2 right-2 px-2 py-1 text-xs bg-white border border-[rgba(0,0,0,0.2)] rounded hover:bg-muted transition-colors"
                      onClick={() => {
                        const el = document.getElementById('mobile-prompt-text')
                        if (el) {
                          navigator.clipboard.writeText(el.textContent || '')
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </section>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
