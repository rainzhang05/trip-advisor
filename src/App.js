"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe,
    Plane,
    Calendar,
    DollarSign,
    Users,
    StampIcon as Passport,
    ArrowRight,
    ArrowLeft,
    Home,
    Send,
    Camera,
    Mountain,
    Luggage,
    MapIcon,
    Cloud,
    Sun,
    Landmark,
    ChevronDown,
    MessageSquare,
} from "lucide-react"
import { Button } from "./components/ui/button"
import { Slider } from "./components/ui/slider"
import { Textarea } from "./components/ui/textarea"
import { format } from "date-fns"
import { ThemeProvider } from "./components/theme-provider"
import "./App.css"

function TravelAdvisor() {
    const [step, setStep] = useState(0)
    const [travelers, setTravelers] = useState(2)
    const [samePassport, setSamePassport] = useState(null)
    const [passport, setPassport] = useState("")
    const [budget, setBudget] = useState(2000)
    const [origin, setOrigin] = useState("")
    const [departDate, setDepartDate] = useState(undefined)
    const [returnDate, setReturnDate] = useState(undefined)
    const [chatMessage, setChatMessage] = useState("")
    const [chatHistory, setChatHistory] = useState([
        { message: "Hello! I'm your AI travel assistant. How can I help you with your trip?", isUser: false },
    ])

    // Custom select states
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
    const [originDropdownOpen, setOriginDropdownOpen] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [returnCalendarOpen, setReturnCalendarOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [returnMonth, setReturnMonth] = useState(new Date())

    // Add floating chat state and functionality
    const [floatingChatOpen, setFloatingChatOpen] = useState(false)
    const [floatingChatMessage, setFloatingChatMessage] = useState("")
    const [floatingChatHistory, setFloatingChatHistory] = useState([
        { message: "Hello! I'm your AI travel assistant. How can I help you plan your trip?", isUser: false },
    ])

    const floatingChatRef = useRef(null)

    const sendFloatingChatMessage = () => {
        if (floatingChatMessage.trim()) {
            setFloatingChatHistory([...floatingChatHistory, { message: floatingChatMessage, isUser: true }])
            setFloatingChatMessage("")

            // Simulate AI response
            setTimeout(() => {
                setFloatingChatHistory((prev) => [
                    ...prev,
                    {
                        message: "This is a placeholder response. The actual implementation will connect to the DeepSeek AI API.",
                        isUser: false,
                    },
                ])

                // Scroll to bottom of chat
                if (floatingChatRef.current) {
                    floatingChatRef.current.scrollTop = floatingChatRef.current.scrollHeight
                }
            }, 1000)
        }
    }

    const chatContainerRef = useRef(null)
    const countryDropdownRef = useRef(null)
    const originDropdownRef = useRef(null)
    const calendarRef = useRef(null)
    const returnCalendarRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
                setCountryDropdownOpen(false)
            }
            if (originDropdownRef.current && !originDropdownRef.current.contains(event.target)) {
                setOriginDropdownOpen(false)
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setCalendarOpen(false)
            }
            if (returnCalendarRef.current && !returnCalendarRef.current.contains(event.target)) {
                setReturnCalendarOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const totalSteps = 8

    const nextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        }
    }

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const resetForm = () => {
        setStep(0)
        setTravelers(2)
        setSamePassport(null)
        setPassport("")
        setBudget(2000)
        setOrigin("")
        setDepartDate(undefined)
        setReturnDate(undefined)
    }

    const sendChatMessage = () => {
        if (chatMessage.trim()) {
            setChatHistory([...chatHistory, { message: chatMessage, isUser: true }])
            setChatMessage("")

            // Simulate AI response
            setTimeout(() => {
                setChatHistory((prev) => [
                    ...prev,
                    {
                        message: "This is a placeholder response. The actual implementation will connect to the DeepSeek AI API.",
                        isUser: false,
                    },
                ])

                // Scroll to bottom of chat
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
                }
            }, 1000)
        }
    }

    const countries = [
        "Canada",
        "United States",
        "United Kingdom",
        "France",
        "Germany",
        "Japan",
        "Australia",
        "Brazil",
        "India",
        "South Africa",
    ]

    // Custom calendar functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const renderCalendar = (date, selectedDate, onSelectDate, minDate) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = getFirstDayOfMonth(year, month)

        const days = []
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day)
            const isSelected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year

            const isDisabled = minDate && currentDate < minDate

            days.push(
                <button
                    key={day}
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        isSelected
                            ? "bg-blue-500 text-white"
                            : isDisabled
                                ? "text-gray-300 cursor-not-allowed"
                                : "hover:bg-gray-100"
                    }`}
                    onClick={() => !isDisabled && onSelectDate(new Date(year, month, day))}
                    disabled={isDisabled}
                >
                    {day}
                </button>,
            )
        }

        return (
            <div className="p-4 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => onPrevMonth(date, setCurrentMonth)}>
                        <ArrowLeft size={16} />
                    </button>
                    <div>{format(date, "MMMM yyyy")}</div>
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => onNextMonth(date, setCurrentMonth)}>
                        <ArrowRight size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="text-center text-xs text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">{days}</div>
            </div>
        )
    }

    const onPrevMonth = (date, setMonth) => {
        const newDate = new Date(date)
        newDate.setMonth(newDate.getMonth() - 1)
        setMonth(newDate)
    }

    const onNextMonth = (date, setMonth) => {
        const newDate = new Date(date)
        newDate.setMonth(newDate.getMonth() + 1)
        setMonth(newDate)
    }

    return (
        <div className="container">
            {/* Background elements */}
            <div className="backgroundElements">
                <div className="backgroundElement plane1">
                    <motion.div
                        animate={{
                            x: [0, window.innerWidth + 200],
                            y: [-20, 50, -30, 20],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    >
                        <Plane size={80} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement plane2">
                    <motion.div
                        animate={{
                            x: [window.innerWidth + 100, -200],
                            y: [50, 100, 30, 80],
                        }}
                        transition={{
                            duration: 40,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                            delay: 5,
                        }}
                    >
                        <Plane size={60} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement globe">
                    <motion.div
                        animate={{
                            rotate: 360,
                            y: [0, 15, 0],
                        }}
                        transition={{
                            rotate: {
                                duration: 20,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            },
                            y: {
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            },
                        }}
                    >
                        <Globe size={120} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement map">
                    <motion.div
                        animate={{
                            rotate: [-5, 5, -5],
                            y: [0, 10, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <MapIcon size={100} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement camera">
                    <motion.div
                        animate={{
                            rotate: [-10, 10, -10],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <Camera size={70} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement luggage">
                    <motion.div
                        animate={{
                            y: [0, 15, 0],
                            x: [0, 10, 0, -10, 0],
                        }}
                        transition={{
                            duration: 9,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <Luggage size={80} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement mountain">
                    <motion.div
                        animate={{
                            y: [0, 10, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <Mountain size={110} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement landmark">
                    <motion.div
                        animate={{
                            y: [0, 15, 0],
                            rotate: [0, 2, 0, -2, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <Landmark size={90} className="travelIcon" />
                    </motion.div>
                </div>

                <div className="backgroundElement sun">
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 30,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            },
                            scale: {
                                duration: 8,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            },
                        }}
                    >
                        <Sun size={100} className="travelIcon" />
                    </motion.div>
                </div>

                {/* Clouds */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="backgroundElement cloud"
                        style={{
                            top: `${10 + i * 15}%`,
                            left: `${-20 + i * 5}%`,
                            opacity: 0.7 - i * 0.1,
                        }}
                    >
                        <motion.div
                            animate={{
                                x: [0, window.innerWidth + 200],
                            }}
                            transition={{
                                duration: 60 + i * 10,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                                delay: i * 5,
                            }}
                        >
                            <Cloud size={80 + i * 20} className="travelIcon" />
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Header */}
            <header className="header">
                <div className="headerContent">
                    <div className="logo">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <Globe className="logoIcon" />
                        </motion.div>
                        <h1 className="logoText">TRAVEL ADVISOR</h1>
                    </div>
                    <Button variant="ghost" size="icon" className="homeButton" onClick={resetForm}>
                        <Home className="homeIcon" />
                        <span className="sr-only">Home</span>
                    </Button>
                </div>
            </header>

            {/* Progress indicator */}
            <div className="progressContainer">
                <div className="progressTracker">
                    {[...Array(totalSteps + 1)].map((_, i) => (
                        <div key={i} className="progressStep">
                            <motion.div
                                className={`progressDot ${i <= step ? "progressDotActive" : ""}`}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: i === step ? [1, 1.2, 1] : 1,
                                    boxShadow: i <= step ? "0 0 10px rgba(56, 189, 248, 0.5)" : "none",
                                }}
                                transition={{ duration: 1, repeat: i === step ? Number.POSITIVE_INFINITY : 0 }}
                                whileHover={{ scale: 1.2 }}
                            >
                                <span className="progressNumber">{i + 1}</span>
                            </motion.div>
                            {i < totalSteps && <div className={`progressLine ${i < step ? "progressLineActive" : ""}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="mainContent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="glassCard"
                        whileHover={{
                            boxShadow: "0 10px 25px rgba(56, 189, 248, 0.3)",
                            y: -5,
                        }}
                    >
                        {step === 0 && (
                            <div className="welcomeStep">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: [0, 5, 0, -5, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="welcomeIcon"
                                    whileHover={{
                                        scale: 1.1,
                                        boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
                                    }}
                                >
                                    <Globe className="welcomeGlobe" />
                                </motion.div>
                                <motion.h2
                                    className="welcomeTitle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    TRAVEL ADVISOR
                                </motion.h2>
                                <motion.p
                                    className="welcomeText"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Embark on a journey with your AI-powered travel companion, crafting magical trips tailored just for
                                    you.
                                </motion.p>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                                    <Button
                                        onClick={nextStep}
                                        className="startButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Start Your Journey
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </motion.div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <Users className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">HOW MANY PEOPLE ARE TRAVELING?</h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="sliderLabels">
                                        <span className="sliderLabel">1</span>
                                        <span className="sliderLabel">10</span>
                                    </div>
                                    <div className="sliderContainer">
                                        <Slider
                                            value={[travelers]}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={(value) => setTravelers(value[0])}
                                            className="slider"
                                        />
                                        <motion.div
                                            className="travelersBadge"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                        >
                                            {travelers}
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="questionIcon"
                                    >
                                        <Passport className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">DOES EVERYONE HAVE THE SAME PASSPORT?</h2>
                                </div>
                                <div className="optionsGrid">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant={samePassport === true ? "default" : "outline"}
                                            onClick={() => setSamePassport(true)}
                                            className={`optionButton ${samePassport === true ? "optionButtonActive" : ""}`}
                                        >
                                            Yes
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant={samePassport === false ? "default" : "outline"}
                                            onClick={() => setSamePassport(false)}
                                            className={`optionButton ${samePassport === false ? "optionButtonActive" : ""}`}
                                        >
                                            No
                                        </Button>
                                    </motion.div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={samePassport === null}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ y: [0, -5, 0, 5, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <Passport className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">
                                        WHAT PASSPORT {travelers > 1 && samePassport ? "DOES EVERYONE" : "DO YOU"} HAVE?
                                    </h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="customSelect" ref={countryDropdownRef}>
                                        <div className="customSelectTrigger" onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}>
                                            {passport || "Select a country"}
                                            <ChevronDown size={16} />
                                        </div>
                                        {countryDropdownOpen && (
                                            <div className="customSelectDropdown">
                                                {countries.map((country) => (
                                                    <div
                                                        key={country}
                                                        className={`customSelectOption ${passport === country ? "customSelectOptionSelected" : ""}`}
                                                        onClick={() => {
                                                            setPassport(country)
                                                            setCountryDropdownOpen(false)
                                                        }}
                                                    >
                                                        {country}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!passport}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, 0, -10, 0],
                                        }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <DollarSign className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHAT IS YOUR BUDGET? (in CAD)</h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="sliderLabels">
                                        <span className="sliderLabel">$500</span>
                                        <span className="sliderLabel">$10,000</span>
                                    </div>
                                    <div className="sliderContainer">
                                        <Slider
                                            value={[budget]}
                                            min={500}
                                            max={10000}
                                            step={100}
                                            onValueChange={(value) => setBudget(value[0])}
                                            className="slider"
                                        />
                                        <motion.div
                                            className="budgetBadge"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 1, delay: 0.2, repeat: Number.POSITIVE_INFINITY }}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            ${budget}
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{
                                            x: [0, 10, 0, -10, 0],
                                            rotate: [0, 10, 0, -10, 0],
                                        }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                        className="questionIcon"
                                    >
                                        <Plane className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHERE ARE YOU TRAVELING FROM?</h2>
                                </div>
                                <div className="inputContainer">
                                    <div className="customSelect" ref={originDropdownRef}>
                                        <div className="customSelectTrigger" onClick={() => setOriginDropdownOpen(!originDropdownOpen)}>
                                            {origin || "Select a country"}
                                            <ChevronDown size={16} />
                                        </div>
                                        {originDropdownOpen && (
                                            <div className="customSelectDropdown">
                                                {countries.map((country) => (
                                                    <div
                                                        key={country}
                                                        className={`customSelectOption ${origin === country ? "customSelectOptionSelected" : ""}`}
                                                        onClick={() => {
                                                            setOrigin(country)
                                                            setOriginDropdownOpen(false)
                                                        }}
                                                    >
                                                        {country}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!origin}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 6 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="questionIcon"
                                    >
                                        <Calendar className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHEN DO YOU WANT TO TRAVEL?</h2>
                                </div>
                                <div className="inputContainer" ref={calendarRef}>
                                    <div className="dateButton" onClick={() => setCalendarOpen(!calendarOpen)}>
                                        {departDate ? format(departDate, "PPP") : "Select departure date"}
                                        <ChevronDown size={16} />
                                    </div>
                                    {calendarOpen && (
                                        <div className="calendarPopover">
                                            <div className="calendar">
                                                <div className="calendarHeader">
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => {
                                                            const newDate = new Date(currentMonth)
                                                            newDate.setMonth(newDate.getMonth() - 1)
                                                            setCurrentMonth(newDate)
                                                        }}
                                                    >
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <div className="calendarMonthTitle">{format(currentMonth, "MMMM yyyy")}</div>
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => {
                                                            const newDate = new Date(currentMonth)
                                                            newDate.setMonth(newDate.getMonth() + 1)
                                                            setCurrentMonth(newDate)
                                                        }}
                                                    >
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                                <div className="calendarDayNames">
                                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                                        <div key={day} className="calendarDayName">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="calendarGrid">
                                                    {Array.from({
                                                        length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(),
                                                    }).map((_, i) => (
                                                        <div key={`empty-${i}`}></div>
                                                    ))}
                                                    {Array.from({
                                                        length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(),
                                                    }).map((_, i) => {
                                                        const day = i + 1
                                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                                                        const isSelected =
                                                            departDate &&
                                                            departDate.getDate() === day &&
                                                            departDate.getMonth() === currentMonth.getMonth() &&
                                                            departDate.getFullYear() === currentMonth.getFullYear()

                                                        const isDisabled = date < new Date(new Date().setHours(0, 0, 0, 0))

                                                        return (
                                                            <button
                                                                key={day}
                                                                className={`calendarDay ${isSelected ? "calendarDaySelected" : ""} ${
                                                                    isDisabled ? "calendarDayDisabled" : ""
                                                                }`}
                                                                onClick={() => {
                                                                    if (!isDisabled) {
                                                                        setDepartDate(date)
                                                                        setCalendarOpen(false)
                                                                    }
                                                                }}
                                                                disabled={isDisabled}
                                                            >
                                                                {day}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!departDate}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 7 && (
                            <div className="formStep">
                                <div className="questionHeader">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="questionIcon"
                                    >
                                        <Calendar className="stepIcon" />
                                    </motion.div>
                                    <h2 className="questionText">WHEN DO YOU WANT TO RETURN?</h2>
                                </div>
                                <div className="inputContainer" ref={returnCalendarRef}>
                                    <div className="dateButton" onClick={() => setReturnCalendarOpen(!returnCalendarOpen)}>
                                        {returnDate ? format(returnDate, "PPP") : "Select return date"}
                                        <ChevronDown size={16} />
                                    </div>
                                    {returnCalendarOpen && (
                                        <div className="calendarPopover">
                                            <div className="calendar">
                                                <div className="calendarHeader">
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => {
                                                            const newDate = new Date(returnMonth)
                                                            newDate.setMonth(newDate.getMonth() - 1)
                                                            setReturnMonth(newDate)
                                                        }}
                                                    >
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                    <div className="calendarMonthTitle">{format(returnMonth, "MMMM yyyy")}</div>
                                                    <button
                                                        className="calendarNavButton"
                                                        onClick={() => {
                                                            const newDate = new Date(returnMonth)
                                                            newDate.setMonth(newDate.getMonth() + 1)
                                                            setReturnMonth(newDate)
                                                        }}
                                                    >
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                                <div className="calendarDayNames">
                                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                                        <div key={day} className="calendarDayName">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="calendarGrid">
                                                    {Array.from({
                                                        length: new Date(returnMonth.getFullYear(), returnMonth.getMonth(), 1).getDay(),
                                                    }).map((_, i) => (
                                                        <div key={`empty-${i}`}></div>
                                                    ))}
                                                    {Array.from({
                                                        length: new Date(returnMonth.getFullYear(), returnMonth.getMonth() + 1, 0).getDate(),
                                                    }).map((_, i) => {
                                                        const day = i + 1
                                                        const date = new Date(returnMonth.getFullYear(), returnMonth.getMonth(), day)
                                                        const isSelected =
                                                            returnDate &&
                                                            returnDate.getDate() === day &&
                                                            returnDate.getMonth() === returnMonth.getMonth() &&
                                                            returnDate.getFullYear() === returnMonth.getFullYear()

                                                        const isDisabled = departDate
                                                            ? date < departDate
                                                            : date < new Date(new Date().setHours(0, 0, 0, 0))

                                                        return (
                                                            <button
                                                                key={day}
                                                                className={`calendarDay ${isSelected ? "calendarDaySelected" : ""} ${
                                                                    isDisabled ? "calendarDayDisabled" : ""
                                                                }`}
                                                                onClick={() => {
                                                                    if (!isDisabled) {
                                                                        setReturnDate(date)
                                                                        setReturnCalendarOpen(false)
                                                                    }
                                                                }}
                                                                disabled={isDisabled}
                                                            >
                                                                {day}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        disabled={!returnDate}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                        <ArrowRight className="buttonIcon" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 8 && (
                            <div className="resultsStep">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="resultsTitle">YOUR DREAM DESTINATION AWAITS</h2>
                                    <h3 className="resultsSubtitle">
                                        Information will be retrieved from Travel Advisor API
                                        <motion.div
                                            className="titleUnderline"
                                            initial={{ width: 0 }}
                                            animate={{ width: 96 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                        />
                                    </h3>
                                </motion.div>

                                {/* Chat with AI section */}
                                <div className="chatSection">
                                    <h3 className="chatTitle">Chat with Travel Assistant</h3>
                                    <div ref={chatContainerRef} className="chatContainer">
                                        {chatHistory.map((chat, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`chatMessage ${chat.isUser ? "userMessage" : "aiMessage"}`}
                                            >
                                                <div className={chat.isUser ? "userBubble" : "aiBubble"}>{chat.message}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="chatInputContainer">
                                        <Textarea
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="Ask about your destination..."
                                            className="chatInput"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault()
                                                    sendChatMessage()
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={sendChatMessage}
                                            className="sendButton"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Send className="sendIcon" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="buttonContainer">
                                    <Button variant="outline" onClick={prevStep} className="backButton">
                                        <ArrowLeft className="buttonIcon" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={resetForm}
                                        className="nextButton"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Start Over
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}

            <footer className="footer">
                <div className="footerContent">
                    <p className="copyright">&copy; {new Date().getFullYear()} Travel Advisor. All rights reserved.</p>
                </div>
            </footer>

            {/* Floating orb with chat functionality */}
            <motion.div
                className="floatingOrb"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFloatingChatOpen(!floatingChatOpen)}
                animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                        "0 5px 15px rgba(56, 189, 248, 0.3)",
                        "0 10px 20px rgba(56, 189, 248, 0.5)",
                        "0 5px 15px rgba(56, 189, 248, 0.3)",
                    ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
                <MessageSquare className="orbIcon" />
            </motion.div>

            {/* Floating Chat Window */}
            {floatingChatOpen && (
                <div className="floatingChatWindow">
                    <div className="floatingChatHeader">
                        <div className="floatingChatTitle">
                            <Globe className="floatingChatIcon" />
                            <span>Travel Assistant</span>
                        </div>
                        <button className="floatingChatClose" onClick={() => setFloatingChatOpen(false)}>
                            &times;
                        </button>
                    </div>
                    <div className="floatingChatBody">
                        <div className="floatingChatMessages" ref={floatingChatRef}>
                            {floatingChatHistory.map((chat, index) => (
                                <div key={index} className={chat.isUser ? "floatingChatUserMessage" : "floatingChatAiMessage"}>
                                    {chat.message}
                                </div>
                            ))}
                        </div>
                        <div className="floatingChatInput">
              <textarea
                  className="floatingChatTextarea"
                  placeholder="Ask about your trip..."
                  value={floatingChatMessage}
                  onChange={(e) => setFloatingChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendFloatingChatMessage()
                      }
                  }}
              />
                            <button className="floatingChatSend" onClick={sendFloatingChatMessage}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <TravelAdvisor />
        </ThemeProvider>
    )
}

export default App

