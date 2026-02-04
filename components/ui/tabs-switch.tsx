"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const TabsSwitch = TabsPrimitive.Root

const TabsSwitchList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-2",
      className
    )}
    {...props}
  />
))
TabsSwitchList.displayName = "TabsSwitchList"

const TabsSwitchTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-[15px] font-[485] transition-all",
      "bg-white border border-[rgba(0,0,0,0.1)] text-[#7a005d]",
      "hover:bg-[#f5f5f5]",
      "data-[state=active]:bg-[#7a005d] data-[state=active]:text-white data-[state=active]:border-[#7a005d] data-[state=active]:font-[535]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TabsSwitchTrigger.displayName = "TabsSwitchTrigger"

const TabsSwitchContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
))
TabsSwitchContent.displayName = "TabsSwitchContent"

export { TabsSwitch, TabsSwitchList, TabsSwitchTrigger, TabsSwitchContent }
