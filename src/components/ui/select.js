"use client"

import React, { useState, useRef, useEffect } from "react"

export function Select({ value, onValueChange, children, disabled }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref])

    return (
        <div ref={ref} className="relative">
            {React.Children.map(children, (child) => {
                if (child.type === SelectTrigger) {
                    return React.cloneElement(child, {
                        onClick: () => !disabled && setOpen(!open),
                        open,
                        disabled,
                    })
                }
                if (child.type === SelectContent) {
                    return open
                        ? React.cloneElement(child, {
                            value,
                            onValueChange,
                            onClose: () => setOpen(false),
                        })
                        : null
                }
                return child
            })}
        </div>
    )
}

export function SelectTrigger({ children, onClick, open, disabled, className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md ${
                open ? "border-primary" : "border-input"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        >
            {children}
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
                className={`w-4 h-4 transition-transform ${open ? "transform rotate-180" : ""}`}
            >
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
    )
}

export function SelectValue({ placeholder, children }) {
    return <span>{children || placeholder}</span>
}

export function SelectContent({ children, value, onValueChange, onClose }) {
    return (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
            <div className="py-1">
                {React.Children.map(children, (child) => {
                    if (child.type === SelectItem) {
                        return React.cloneElement(child, {
                            selected: child.props.value === value,
                            onSelect: () => {
                                onValueChange(child.props.value)
                                onClose()
                            },
                        })
                    }
                    return child
                })}
            </div>
        </div>
    )
}

export function SelectItem({ children, value, selected, onSelect, disabled, className = "" }) {
    return (
        <div
            onClick={disabled ? undefined : onSelect}
            className={`px-3 py-2 text-sm cursor-pointer ${
                selected ? "bg-accent text-accent-foreground" : ""
            } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground"} ${className}`}
        >
            {children}
        </div>
    )
}

