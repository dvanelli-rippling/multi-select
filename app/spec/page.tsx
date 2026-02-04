"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SpecPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-12 py-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-medium text-[#202022]">Attendees Component - Specification Guide</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-12 py-8">
        <div className="space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              The Attendees component is a searchable multi-select input that allows users to add, remove, and manage attendees for expense reimbursement. 
              It includes advanced features like profile hover cards, dynamic cost calculation, and custom attendee creation.
            </p>
          </section>

          {/* Basic Interaction */}
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Basic Interaction</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Opening the Search</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Click anywhere on the attendees input field to open the search dropdown</li>
                <li>The input field displays selected attendees as chips/badges with avatars</li>
                <li>When empty, shows placeholder text: &quot;Select attendees...&quot;</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Searching for People</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Type in the search field to filter available people</li>
                <li>Search works across: full name, job title, email, and department</li>
                <li>Results are limited to 10 people maximum</li>
                <li>Already selected attendees are excluded from search results</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Selecting Attendees</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Click on any person in the search results to add them</li>
                <li>Selected person appears as a chip in the input field</li>
                <li>Search query clears automatically after selection</li>
                <li>Input automatically scrolls to show the newly added attendee</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Removing Attendees</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Click the X button on any attendee chip to remove them</li>
                <li>Removed attendees become available again in search results</li>
                <li>Attendees are displayed in the order they were added (most recent at bottom)</li>
              </ul>
            </Card>
          </section>

          {/* Purchaser Behavior */}
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Purchaser Behavior</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Default Purchaser</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Lando Norris is included by default as the purchaser</li>
                <li>Displayed as: <Badge variant="secondary" className="inline-flex h-6">Lando Norris · Purchaser</Badge></li>
                <li>The purchaser cannot be removed if they are the only selected attendee</li>
                <li>When the purchaser is the only one, the X button is hidden</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Removing the Purchaser</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>The purchaser can only be removed if at least one other person is selected</li>
                <li>When removed, the cost per person helper text appends: &quot;· Purchaser not on expense&quot;</li>
                <li>Example: &quot;$555.20 per person · Purchaser not on expense&quot;</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Re-adding the Purchaser</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>The purchaser can be searched and re-added like any other attendee</li>
                <li>When re-added, they appear at the bottom (most recently added position)</li>
                <li>The &quot;· Purchaser not on expense&quot; text is removed from the helper text</li>
              </ul>
            </Card>
          </section>

          {/* Custom Attendees */}
          <section>
            <h2 className="text-xl font-semibold mb-4">3. Creating Custom Attendees</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">When No Results Found</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>If a search query returns no results, a &quot;Create new attendee&quot; option appears</li>
                <li>Shows a message: &quot;No results found for &apos;[search query]&apos;&quot;</li>
                <li>Displays a blue circular button with a plus icon</li>
                <li>Shows &quot;Create new attendee&quot; in blue text</li>
                <li>Displays the name that will be created below in gray</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Creating the Attendee</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Click &quot;Create new attendee&quot; to add the person</li>
                <li>The name is automatically split on whitespace to create the full name</li>
                <li>Custom attendees are marked with: <Badge variant="secondary" className="inline-flex h-6">Name · Custom attendee</Badge></li>
                <li>They receive a generated email address based on their name</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Custom Attendee Behavior</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Custom attendees are searchable after creation</li>
                <li>They appear in search results with the &quot;· Custom attendee&quot; label</li>
                <li>They can be removed and re-added like regular attendees</li>
                <li>If removed and re-added, they appear at the bottom (most recent position)</li>
              </ul>
            </Card>
          </section>

          {/* Visual Features */}
          <section>
            <h2 className="text-xl font-semibold mb-4">4. Visual Features</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Avatar Colors</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Each attendee&apos;s avatar has a randomized background color</li>
                <li>Colors are consistent for the same person (based on their ID)</li>
                <li>Uses a palette of 15 different colors</li>
                <li>Colors are applied to both selected chips and search results</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Profile Hover Card</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Hover over an attendee&apos;s chip (avatar + name) to see their profile</li>
                <li>Hover card appears quickly (100ms delay)</li>
                <li>Shows: Employee type, name, email, avatar</li>
                <li>Action buttons: &quot;Profile&quot; and &quot;Org Chart&quot;</li>
                <li>Details: Position (job title + department), Work location, Manager (clickable), Tenure</li>
                <li>Hovering over the X button does NOT trigger the hover card</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Scrollable Input</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Input field shows exactly 4 people before scrolling is needed</li>
                <li>When more than 4 people are selected, a scrollbar appears</li>
                <li>Scrollbar is thin and styled to match the design</li>
                <li>Content scrolls from top to bottom</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Resizable Input</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Drag handle icon in the bottom-right corner</li>
                <li>Drag vertically to resize the input height</li>
                <li>Minimum height: 50px (for at least 1 person)</li>
                <li>Maximum height: 400px</li>
                <li>Scrollbar adjusts automatically based on the new height</li>
              </ul>
            </Card>
          </section>

          {/* Dynamic Calculations */}
          <section>
            <h2 className="text-xl font-semibold mb-4">5. Dynamic Calculations</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Cost Per Person</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Helper text below the input shows: &quot;$[amount] per person&quot;</li>
                <li>Calculated as: Total Amount ÷ Number of Attendees</li>
                <li>Updates automatically when attendees are added or removed</li>
                <li>Updates automatically when the total amount changes</li>
                <li>Formatted to 2 decimal places</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Purchaser Not on Expense</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>If the purchaser is removed from attendees, the helper text appends:</li>
                <li>&quot;· Purchaser not on expense&quot;</li>
                <li>Example: &quot;$555.20 per person · Purchaser not on expense&quot;</li>
                <li>This indicator is removed when the purchaser is re-added</li>
              </ul>
            </Card>
          </section>

          {/* Ordering & Display */}
          <section>
            <h2 className="text-xl font-semibold mb-4">6. Ordering & Display</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Display Order</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Attendees are displayed in the order they were added</li>
                <li>Most recently added attendees appear at the bottom</li>
                <li>If someone is removed and re-added, they appear at the bottom (new position)</li>
                <li>Order is independent of their position in the database</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Auto-Scroll</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>When a new attendee is added, the input automatically scrolls to the bottom</li>
                <li>This ensures the newly added attendee is visible</li>
                <li>Only scrolls when adding, not when removing</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Label Formatting</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Purchaser: <Badge variant="secondary" className="inline-flex h-6">Name · Purchaser</Badge></li>
                <li>Custom attendees: <Badge variant="secondary" className="inline-flex h-6">Name · Custom attendee</Badge></li>
                <li>Regular attendees: <Badge variant="secondary" className="inline-flex h-6">Name</Badge></li>
              </ul>
            </Card>
          </section>

          {/* Technical Details */}
          <section>
            <h2 className="text-xl font-semibold mb-4">7. Technical Details</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Database</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>In-memory database of 30+ people</li>
                <li>Each person includes: ID, full name, job title, avatar URL, email, department</li>
                <li>Profile data: work location, manager, tenure, employee type</li>
                <li>Custom attendees are stored separately and persist during the session</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Search Functionality</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Real-time search as you type</li>
                <li>Case-insensitive matching</li>
                <li>Searches across: name, job title, email, department</li>
                <li>Results limited to 10 people for performance</li>
                <li>Selected people are automatically excluded from results</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Component Props</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">selected</code>: Array of selected attendee IDs</li>
                <li><code className="bg-muted px-1 rounded">onChange</code>: Callback when selection changes</li>
                <li><code className="bg-muted px-1 rounded">placeholder</code>: Placeholder text when empty</li>
                <li><code className="bg-muted px-1 rounded">perPersonAmount</code>: Helper text showing cost per person</li>
                <li><code className="bg-muted px-1 rounded">usePeopleDatabase</code>: Enable people database mode</li>
              </ul>
            </Card>
          </section>

          {/* Edge Cases */}
          <section>
            <h2 className="text-xl font-semibold mb-4">8. Edge Cases & Validation</h2>
            
            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Empty States</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>If no attendees selected: shows placeholder text</li>
                <li>If search returns no results: shows &quot;Create new attendee&quot; option</li>
                <li>If person already exists: &quot;Create new attendee&quot; option is hidden</li>
              </ul>
            </Card>

            <Card className="p-6 mb-4">
              <h3 className="font-medium mb-3">Validation</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Purchaser cannot be removed if they&apos;re the only attendee</li>
                <li>Duplicate names are prevented when creating custom attendees</li>
                <li>Search query is trimmed of whitespace before processing</li>
                <li>Cost calculation handles division by zero (minimum 1 attendee)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-medium mb-3">Performance</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Search results are memoized to prevent unnecessary re-renders</li>
                <li>Hover card data is fetched on-demand</li>
                <li>Scroll container uses virtualization-friendly approach</li>
                <li>Avatar colors are calculated once and cached</li>
              </ul>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
