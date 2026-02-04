"use client"

import * as React from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Network } from "lucide-react"
import { type Person } from "@/lib/people-db"
import { getInitials } from "@/lib/utils"

interface ProfileHoverCardProps {
  person: Person
  children: React.ReactNode
}

export function ProfileHoverCard({ person, children }: ProfileHoverCardProps) {
  const initials = getInitials(person.fullName)

  return (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-[297px] p-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-lg border-0 bg-transparent" align="start">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] overflow-hidden rounded-lg">
          {/* Header Section */}
          <div className="bg-white p-4 rounded-tl-sm rounded-tr-sm">
            <div className="flex gap-[18px] items-center mb-[14px]">
              <Avatar className="h-12 w-12">
                <AvatarImage src={person.avatarUrl} alt={person.fullName} />
                <AvatarFallback className="text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-[11px] font-medium text-[#716f6c] uppercase tracking-wide leading-[14px] mb-1">
                  {person.employeeType || "Employee"}
                </div>
                <div className="text-[18px] font-medium text-black leading-[22px] mb-0.5">
                  {person.fullName}
                </div>
                <div className="text-[14px] font-normal text-[#716f6c] leading-[20px]">
                  {person.email}
                </div>
              </div>
            </div>
            <div className="flex gap-[6px] items-center">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <User className="h-3 w-3" />
                Profile
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Network className="h-3 w-3" />
                Org Chart
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[rgba(0,0,0,0.1)]" />

          {/* Content Section */}
          <div className="p-4 space-y-[18px]">
            {/* Position */}
            <div className="space-y-1">
              <div className="text-[11px] font-medium text-[#716f6c] uppercase tracking-wide leading-[14px]">
                Position
              </div>
              <div className="text-[16px] font-medium text-black leading-[24px]">
                {person.jobTitle}
              </div>
              <div className="text-[14px] font-normal text-[#716f6c] leading-[20px]">
                {person.department}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />

            {/* Work Location and Manager */}
            <div className="flex gap-6">
              <div className="space-y-1">
                <div className="text-[11px] font-medium text-[#716f6c] uppercase tracking-wide leading-[14px]">
                  work location
                </div>
                <div className="text-[14px] font-normal text-black leading-[20px]">
                  {person.workLocation || "Not specified"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-medium text-[#716f6c] uppercase tracking-wide leading-[14px]">
                  manager
                </div>
                {person.manager ? (
                  <div className="text-[14px] font-normal text-black leading-[20px] underline decoration-dotted">
                    {person.manager}
                  </div>
                ) : (
                  <div className="text-[14px] font-normal text-[#716f6c] leading-[20px]">
                    Not specified
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />

            {/* Tenure */}
            <div className="space-y-1">
              <div className="text-[11px] font-medium text-[#716f6c] uppercase tracking-wide leading-[14px]">
                tenure
              </div>
              <div className="text-[16px] font-medium text-black leading-[24px]">
                {person.tenure || "Not specified"}
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

