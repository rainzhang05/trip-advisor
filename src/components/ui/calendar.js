"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"

export function Calendar({ mode = "single", selected, onSelect, disabled, initialFocus, className = "" }) {
    const [currentMonth, setCurrentMonth] = useState(selected || new Date())

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    })

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const handleSelectDate = (day) => {
        if (disabled && disabled(day)) return
        onSelect(day)
    }

    return (
        <div className={`p-3 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-accent" type="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <div className="font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-accent" type="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center text-xs text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                    const isSelected = selected && isSameDay(day, selected)
                    const isDisabled = disabled && disabled(day)

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => handleSelectDate(day)}
                            disabled={isDisabled}
                            className={`h-9 w-9 rounded-md text-center text-sm p-0 ${
                                isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            type="button"
                        >
                            {format(day, "d")}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}