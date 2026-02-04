"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Calendar, ChevronDown, ChevronUp, HelpCircle, Plus, Edit, Download, Trash2, ZoomIn, ZoomOut, Info, ArrowLeft } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MultiSelect } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"
import { PURCHASER_ID } from "@/lib/people-db"
import "./pebble-styles.css"

export default function PebblePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([PURCHASER_ID])
  const [totalAmount, setTotalAmount] = useState("3331.20")

  return (
    <div className="pebble-theme min-h-screen" style={{ backgroundColor: 'var(--colorSurface, #fafafa)' }}>
      {/* Header */}
      <div className="pebble-header" style={{ 
        backgroundColor: 'var(--colorSurfaceBright, white)',
        borderBottom: '1px solid var(--colorOutlineVariant, rgba(0,0,0,0.1))'
      }}>
        <div className="max-w-7xl mx-auto px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="pebble-title-large" style={{ 
              color: 'var(--colorOnSurface, #202022)',
              fontSize: '24px',
              fontWeight: 535,
              lineHeight: '29px',
              margin: 0
            }}>Reimbursement (Pebble Style)</h1>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-12 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0 h-auto gap-0">
            <TabsTrigger
              value="upload"
              className={cn(
                "pebble-tab rounded-md px-4 py-2",
                activeTab === "upload" && "pebble-tab-active"
              )}
            >
              Upload receipt
            </TabsTrigger>
            <TabsTrigger
              value="mileage"
              className={cn(
                "pebble-tab rounded-md px-4 py-2",
                activeTab === "mileage" && "pebble-tab-active"
              )}
            >
              Enter mileage
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-12 pb-16">
        <div className="flex gap-6">
          {/* Left Column - Form */}
          <div className="flex-1 space-y-6">
            {/* Reimbursement Section */}
            <Card className="pebble-card p-6">
              <h2 className="pebble-title-medium mb-6">Reimbursement</h2>
              <div className="space-y-4">
                {/* Vendor */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Vendor
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="la-dauphine">
                      <SelectTrigger className="pebble-input h-10">
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
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Total amount
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <div className="flex h-10 pebble-input-border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-2 px-4 border-r pebble-border min-w-[96px] shrink-0">
                        <span className="pebble-body-medium">USD</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <Input
                        type="text"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className="border-0 focus-visible:ring-0 h-10 px-4 flex-1 min-w-0 pebble-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Purchase date */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Purchase date
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <Input
                      type="date"
                      defaultValue="2020-03-19"
                      className="h-10 pebble-input"
                    />
                  </div>
                </div>

                {/* Purchase location */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Purchase location
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="paris">
                      <SelectTrigger className="pebble-input h-10">
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
            <Card className="pebble-card p-6">
              <h2 className="pebble-title-medium mb-6">Expense purpose</h2>
              <div className="space-y-4">
                {/* Category */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Category
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="meals">
                      <SelectTrigger className="pebble-input h-10">
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
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Memo
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <Input
                      type="text"
                      defaultValue="Got it on the go"
                      className="h-10 pebble-input"
                      placeholder="Provide a memo"
                    />
                  </div>
                </div>

                {/* Expense report */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center">
                    Expense report
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="pebble-input h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="report1">Report 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Purchaser */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Purchaser
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="lando">
                      <SelectTrigger className="pebble-input h-10">
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
                <div className="flex gap-4 items-start">
                  <div className="w-[156px] flex items-center gap-1">
                    <Label className="pebble-label">Attendees</Label>
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
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
            <Card className="pebble-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="pebble-title-medium">Accounting categorization</h2>
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
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center gap-1">
                    Custom dimension
                    <span style={{ color: 'var(--colorError, #c3402c)' }}>*</span>
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="pebble-input h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dim1">Dimension 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tax rate */}
                <div className="flex gap-4 items-start">
                  <div className="w-[156px] flex items-center gap-1">
                    <Label className="pebble-label">Tax rate</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="pebble-input h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tax1">Tax 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* GL vendor */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center">
                    GL vendor
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="pebble-input h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gl1">GL Vendor 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* GL customer */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center">
                    GL customer
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="pebble-input h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gl1">GL Customer 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* GL billable */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center">
                    GL billable
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="pebble-input h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gl1">GL Billable 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Accounting date */}
                <div className="flex gap-4 items-start">
                  <Label className="pebble-label w-[156px] h-10 flex items-center">
                    Accounting date
                  </Label>
                  <div className="flex-1">
                    <Input
                      type="date"
                      placeholder="MM/DD/YYYY"
                      className="h-10 pebble-input"
                    />
                  </div>
                </div>

                {/* Taxable income */}
                <div className="flex gap-4 items-start">
                  <div className="w-[156px] flex items-center gap-1">
                    <Label className="pebble-label">Taxable income</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="na">
                      <SelectTrigger className="pebble-input h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="na">Not applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amortization */}
                <div className="flex gap-4 items-center">
                  <div className="w-[156px] flex items-center gap-1">
                    <Label className="pebble-label">Amortization</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="pebble-body-small text-muted-foreground">Disabled</span>
                    </div>
                  </div>
                </div>

                {/* Expense splitting */}
                <div className="flex gap-4 items-center">
                  <div className="w-[156px] flex items-center gap-1">
                    <Label className="pebble-label">Expense splitting</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="pebble-body-small text-muted-foreground">Disabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Receipt */}
          <div className="w-[288px] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="pebble-title-medium">Receipt</h2>
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
            <Card className="pebble-card border pebble-border p-0 overflow-hidden">
              <div className="aspect-[2448/3264] bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Receipt Image
                </div>
                <div className="absolute bottom-2 right-2 bg-white border pebble-border rounded-lg shadow-lg p-1 flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
            <div className="flex items-center gap-1 pebble-body-small">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">3 details</span>
              <span className="text-muted-foreground">scanned from receipt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 pebble-footer" style={{
        backgroundColor: 'var(--colorSurfaceBright, white)',
        borderTop: '1px solid var(--colorOutlineVariant, rgba(0,0,0,0.1))'
      }}>
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
    </div>
  )
}
