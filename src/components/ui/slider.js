"use client"

export function Slider({ value, min = 0, max = 100, step = 1, onValueChange, className = "" }) {
    const handleChange = (e) => {
        const newValue = Number.parseFloat(e.target.value)
        onValueChange && onValueChange([newValue])
    }

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleChange}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer font-['Exo_2'] ${className}`}
        />
    )
}