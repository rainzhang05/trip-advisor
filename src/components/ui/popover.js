"use client"

import React, { useState, useRef, useEffect } from "react"

export function Popover({ children }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="relative inline-block">
            {React.Children.map(children, (child) => {
                if (child.type === PopoverTrigger) {
                    return React.cloneElement(child, {
                        onClick: () => setOpen(!open),
                        open,
                    })
                }
                if (child.type === PopoverContent) {
                    return open ? React.cloneElement(child, { onClose: () => setOpen(false) }) : null
                }
                return child
            })}
        </div>
    )
}

export function PopoverTrigger({ children, onClick, open }) {
    return React.cloneElement(children, {
        onClick,
        "aria-expanded": open,
    })
}

export function PopoverContent({ children, onClose, className = "" }) {
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    return (
        <div ref={ref} className={`absolute z-50 mt-2 bg-white border rounded-md shadow-lg ${className}`}>
            {children}
        </div>
    )
}