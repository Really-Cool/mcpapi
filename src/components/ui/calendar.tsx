"use client"

import * as React from "react"
import { cn } from "@/utils/helpers/common-utils"

export interface CalendarProps {
  /** The selected date */
  selected?: Date
  /** Function called when date changes */
  onSelect?: (date: Date | undefined) => void
  /** Whether to show days outside the current month */
  showOutsideDays?: boolean
  /** Initial display month */
  month?: Date
  /** Function called when month changes */
  onMonthChange?: (month: Date) => void
  /** Number of months to display */
  numberOfMonths?: number
  /** Disable specific dates */
  disabled?: Date[] | ((date: Date) => boolean)
  /** Locale for formatting dates */
  locale?: string
  /** Additional class names */
  className?: string
}

/**
 * Calendar component placeholder
 * 
 * This is a simplified placeholder for the Calendar component.
 * The original implementation using react-day-picker was removed due to
 * compatibility issues with React 19.
 */
function Calendar({
  className,
  selected,
  onSelect,
  showOutsideDays = true,
  ...props
}: CalendarProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>) {
  return (
    <div className={cn("p-3 border rounded-md", className)} {...props}>
      <div className="text-center p-4">
        <p className="text-sm text-muted-foreground">
          Calendar component placeholder
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          The calendar component was removed due to compatibility issues with React 19.
        </p>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
