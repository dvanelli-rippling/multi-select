"use client"

import { useState } from "react"
import { X, Calendar, ChevronDown, ChevronUp, HelpCircle, Plus, Edit, Download, Trash2, ZoomIn, ZoomOut, Info } from "lucide-react"
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([PURCHASER_ID])
  const [totalAmount, setTotalAmount] = useState("3331.20")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-12 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#202022]">Reimbursement</h1>
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
                "rounded-md px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                activeTab === "upload" && "bg-primary text-primary-foreground"
              )}
            >
              Upload receipt
            </TabsTrigger>
            <TabsTrigger
              value="mileage"
              className={cn(
                "rounded-md px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                activeTab === "mileage" && "bg-primary text-primary-foreground"
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
            <Card className="p-6 border border-[rgba(0,0,0,0.1)]">
              <h2 className="text-lg font-medium text-[#202022] mb-6 tracking-wide">
                Reimbursement
              </h2>
              <div className="space-y-4">
                {/* Vendor */}
                <div className="flex gap-4 items-start">
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Vendor
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="la-dauphine">
                      <SelectTrigger className="h-10 bg-white">
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
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Total amount
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <div className="flex h-10 border border-[rgba(0,0,0,0.2)] rounded-lg bg-white overflow-hidden">
                      <div className="flex items-center gap-2 px-4 border-r border-[rgba(0,0,0,0.2)] min-w-[96px] shrink-0">
                        <span className="text-[15px]">USD</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <Input
                        type="text"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className="border-0 focus-visible:ring-0 h-10 px-4 flex-1 min-w-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Purchase date */}
                <div className="flex gap-4 items-start">
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Purchase date
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <Input
                      type="date"
                      defaultValue="2020-03-19"
                      className="h-10 bg-white"
                    />
                  </div>
                </div>

                {/* Purchase location */}
                <div className="flex gap-4 items-start">
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Purchase location
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="paris">
                      <SelectTrigger className="h-10 bg-white">
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
            <Card className="p-6 border border-[rgba(0,0,0,0.1)]">
              <h2 className="text-lg font-medium text-[#202022] mb-6 tracking-wide">
                Expense purpose
              </h2>
              <div className="space-y-4">
                {/* Category */}
                <div className="flex gap-4 items-start">
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Category
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="meals">
                      <SelectTrigger className="h-10 bg-white">
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
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Memo
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <Input
                      type="text"
                      defaultValue="Got it on the go"
                      className="h-10 bg-white"
                      placeholder="Provide a memo"
                    />
                  </div>
                </div>

                {/* Expense report */}
                <div className="flex gap-4 items-start">
                  <Label className="w-[156px] h-10 flex items-center text-[15px] tracking-wide">
                    Expense report
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="h-10 bg-white">
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
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Purchaser
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <Select defaultValue="lando">
                      <SelectTrigger className="h-10 bg-white">
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
                    <Label className="text-[15px] tracking-wide">Attendees</Label>
                    <span className="text-[#c3402c]">*</span>
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
            <Card className="p-6 border border-[rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-[#202022] tracking-wide">
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
                <div className="flex gap-4 items-start">
                  <Label className="w-[156px] h-10 flex items-center gap-1 text-[15px] tracking-wide">
                    Custom dimension
                    <span className="text-[#c3402c]">*</span>
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="h-10 bg-white">
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
                    <Label className="text-[15px] tracking-wide">Tax rate</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="h-10 bg-white">
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
                  <Label className="w-[156px] h-10 flex items-center text-[15px] tracking-wide">
                    GL vendor
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="h-10 bg-white">
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
                  <Label className="w-[156px] h-10 flex items-center text-[15px] tracking-wide">
                    GL customer
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="h-10 bg-white">
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
                  <Label className="w-[156px] h-10 flex items-center text-[15px] tracking-wide">
                    GL billable
                  </Label>
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger className="h-10 bg-white">
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
                  <Label className="w-[156px] h-10 flex items-center text-[15px] tracking-wide">
                    Accounting date
                  </Label>
                  <div className="flex-1">
                    <div className="flex h-10 border border-[rgba(0,0,0,0.2)] rounded-lg bg-white px-4 items-center gap-2">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="MM/DD/YYYY"
                        className="border-0 focus-visible:ring-0 h-10 px-0 flex-1 text-muted-foreground"
                      />
                      <div className="flex flex-col">
                        <ChevronUp className="h-6 w-6" />
                        <ChevronDown className="h-6 w-6 -mt-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Taxable income */}
                <div className="flex gap-4 items-start">
                  <div className="w-[156px] flex items-center gap-1">
                    <Label className="text-[15px] tracking-wide">Taxable income</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Select defaultValue="na">
                      <SelectTrigger className="h-10 bg-white">
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
                    <Label className="text-[15px] tracking-wide">Amortization</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm text-muted-foreground">Disabled</span>
                    </div>
                  </div>
                </div>

                {/* Expense splitting */}
                <div className="flex gap-4 items-center">
                  <div className="w-[156px] flex items-center gap-1">
                    <Label className="text-[15px] tracking-wide">Expense splitting</Label>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm text-muted-foreground">Disabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Receipt */}
          <div className="w-[288px] space-y-4">
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
            <Card className="border border-[rgba(0,0,0,0.2)] p-0 overflow-hidden">
              <div className="aspect-[2448/3264] bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Receipt Image
                </div>
                <div className="absolute bottom-2 right-2 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-lg p-1 flex flex-col gap-1">
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
            <div className="flex items-center gap-1 text-sm">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600">3 details</span>
              <span className="text-muted-foreground">scanned from receipt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.1)]">
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
