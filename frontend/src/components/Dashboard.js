"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  Eye,
  Upload,
  Trash2,
  Edit3,
  Move,
  Type,
  ImageIcon,
  Layout,
  Mail,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Undo,
  Redo,
  Share2,
  Phone,
  Mic,
  Sparkles,
  FileIcon as FileTemplate,
  ArrowLeft,
  Square,
  Settings,
  Zap,
  Star,
  Users,
  TrendingUp,
  Save,
  Video,
  Map,
  BarChart,
  Clock,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  ImagePlus,
  Copy,
  Clipboard,
  X,
} from "lucide-react"
import "./Dashboard.css"

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState("method-selection")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [viewMode, setViewMode] = useState("desktop")
  const [websiteData, setWebsiteData] = useState({
    name: "",
    type: "Business",
    theme: "Modern",
    primaryColor: "#3b82f6",
    secondaryColor: "#f97316",
    fontFamily: "Inter",
    fontSize: "16px",
    components: [],
    seoSettings: { title: "", description: "", keywords: "" },
    globalStyles: {
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      linkColor: "#3b82f6",
      borderRadius: "8px",
      spacing: "16px",
    },
  })

  const [selectedComponent, setSelectedComponent] = useState(null)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [clipboard, setClipboard] = useState(null)

  // Voice call states
  const [isRecording, setIsRecording] = useState(false)
  const [callStatus, setCallStatus] = useState("idle")
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Template states
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateCategory, setTemplateCategory] = useState("all")

  // Media states
  const [mediaLibrary, setMediaLibrary] = useState([])
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recognitionRef = useRef(null)
  const iframeRef = useRef(null)
  const loadInputRef = useRef(null)

  // Enhanced component templates with more options
  const componentTemplates = {
    hero: {
      type: "hero",
      config: {
        title: "Welcome to Our Website",
        subtitle: "Create amazing experiences with our platform",
        buttonText: "Get Started",
        buttonLink: "#",
        backgroundImage: "",
        backgroundVideo: "",
        alignment: "center",
        overlay: true,
        overlayOpacity: 0.5,
        textColor: "#ffffff",
        buttonColor: "#3b82f6",
        animation: "fadeIn",
      },
      styles: {
        padding: "80px 20px",
        backgroundColor: "#f8fafc",
        textAlign: "center",
        minHeight: "500px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      },
    },
    text: {
      type: "text",
      config: {
        content: "Edit this text content by clicking on it...",
        heading: "h2",
        alignment: "left",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "1.6",
        color: "#1f2937",
        backgroundColor: "transparent",
        padding: "20px",
        margin: "0px",
        animation: "none",
      },
      styles: {
        padding: "20px",
        fontSize: "16px",
        lineHeight: "1.6",
      },
    },
    image: {
      type: "image",
      config: {
        src: "/placeholder.svg?height=300&width=600",
        alt: "Image description",
        caption: "",
        alignment: "center",
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        shadow: false,
        hover: "none",
        link: "",
        animation: "none",
      },
      styles: {
        padding: "20px",
        maxWidth: "100%",
        textAlign: "center",
      },
    },
    video: {
      type: "video",
      config: {
        src: "",
        poster: "/placeholder.svg?height=300&width=600",
        controls: true,
        autoplay: false,
        loop: false,
        muted: false,
        width: "100%",
        height: "auto",
        alignment: "center",
      },
      styles: {
        padding: "20px",
        textAlign: "center",
      },
    },
    gallery: {
      type: "gallery",
      config: {
        images: [],
        columns: 3,
        spacing: "10px",
        showCaptions: false,
        lightbox: true,
        aspectRatio: "square",
        hoverEffect: "zoom",
      },
      styles: {
        padding: "20px",
      },
    },
    contact: {
      type: "contact",
      config: {
        title: "Contact Us",
        fields: ["name", "email", "message"],
        submitText: "Send Message",
        successMessage: "Thank you for your message!",
        backgroundColor: "#f9fafb",
        textColor: "#1f2937",
        buttonColor: "#3b82f6",
        layout: "vertical",
      },
      styles: {
        padding: "40px 20px",
        backgroundColor: "#f9fafb",
      },
    },
    footer: {
      type: "footer",
      config: {
        copyright: "© 2025 Your Company. All rights reserved.",
        socialLinks: {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
        },
        links: [],
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        layout: "centered",
      },
      styles: {
        padding: "40px 20px",
        backgroundColor: "#1f2937",
        color: "#ffffff",
      },
    },
    button: {
      type: "button",
      config: {
        text: "Click Me",
        link: "#",
        style: "primary",
        size: "medium",
        alignment: "center",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        borderRadius: "8px",
        animation: "none",
        icon: "",
      },
      styles: {
        padding: "20px",
        textAlign: "center",
      },
    },
    spacer: {
      type: "spacer",
      config: {
        height: "50px",
        backgroundColor: "transparent",
      },
      styles: {
        height: "50px",
        backgroundColor: "transparent",
      },
    },
    divider: {
      type: "divider",
      config: {
        style: "solid",
        color: "#e5e7eb",
        thickness: "1px",
        width: "100%",
        alignment: "center",
      },
      styles: {
        padding: "20px",
        textAlign: "center",
      },
    },
    map: {
      type: "map",
      config: {
        address: "New York, NY",
        zoom: 12,
        height: "400px",
        showMarker: true,
        style: "roadmap",
      },
      styles: {
        padding: "20px",
      },
    },
    social: {
      type: "social",
      config: {
        platforms: ["facebook", "twitter", "instagram", "linkedin"],
        style: "icons",
        size: "medium",
        alignment: "center",
        color: "#3b82f6",
      },
      styles: {
        padding: "20px",
        textAlign: "center",
      },
    },
    testimonial: {
      type: "testimonial",
      config: {
        quote: "This is an amazing service!",
        author: "John Doe",
        position: "CEO, Company",
        avatar: "/placeholder.svg?height=80&width=80",
        rating: 5,
        style: "card",
      },
      styles: {
        padding: "40px 20px",
        backgroundColor: "#f9fafb",
      },
    },
    pricing: {
      type: "pricing",
      config: {
        plans: [
          {
            name: "Basic",
            price: "$9",
            period: "month",
            features: ["Feature 1", "Feature 2", "Feature 3"],
            highlighted: false,
          },
        ],
        currency: "$",
        billing: "monthly",
      },
      styles: {
        padding: "40px 20px",
      },
    },
    countdown: {
      type: "countdown",
      config: {
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        title: "Coming Soon",
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        style: "modern",
      },
      styles: {
        padding: "40px 20px",
        textAlign: "center",
      },
    },
  }

  // Enhanced template data with more templates
  const templateData = {
    business: [
      {
        id: "modern-business",
        name: "Modern Business",
        description: "Clean and professional design for modern businesses",
        preview: "/placeholder.svg?height=120&width=200",
        type: "business",
        color: "blue",
        components: [
          {
            type: "hero",
            config: {
              title: "Your Business Name",
              subtitle: "Professional services you can trust",
              backgroundImage: "/placeholder.svg?height=500&width=1200",
            },
          },
          { type: "text", config: { content: "About our company and services..." } },
          { type: "gallery", config: { images: [] } },
          { type: "contact", config: { title: "Get In Touch" } },
          { type: "footer", config: { copyright: "© 2025 Your Business" } },
        ],
      },
      {
        id: "corporate",
        name: "Corporate Excellence",
        description: "Enterprise-level design for large corporations",
        preview: "/placeholder.svg?height=120&width=200",
        type: "business",
        color: "orange",
        components: [
          { type: "hero", config: { title: "Corporate Excellence", subtitle: "Leading the industry forward" } },
          { type: "text", config: { content: "Our corporate mission and values..." } },
          { type: "testimonial", config: { quote: "Excellent service and support" } },
          { type: "contact", config: { title: "Contact Our Team" } },
          { type: "footer", config: { copyright: "© 2025 Corporate Name" } },
        ],
      },
      {
        id: "startup",
        name: "Startup Launch",
        description: "Perfect for new startups and entrepreneurs",
        preview: "/placeholder.svg?height=120&width=200",
        type: "business",
        color: "purple",
        components: [
          {
            type: "hero",
            config: { title: "Revolutionary Startup", subtitle: "Changing the world one step at a time" },
          },
          { type: "text", config: { content: "Our innovative solution..." } },
          { type: "pricing", config: { plans: [] } },
          { type: "countdown", config: { title: "Launch Countdown" } },
          { type: "footer", config: { copyright: "© 2025 Startup Name" } },
        ],
      },
    ],
    ecommerce: [
      {
        id: "online-store",
        name: "Online Store",
        description: "Perfect for selling products online",
        preview: "/placeholder.svg?height=120&width=200",
        type: "ecommerce",
        color: "purple",
        components: [
          { type: "hero", config: { title: "Shop Now", subtitle: "Discover amazing products" } },
          { type: "gallery", config: { images: [] } },
          { type: "text", config: { content: "Featured products and categories..." } },
          { type: "testimonial", config: { quote: "Great products and fast shipping!" } },
          { type: "contact", config: { title: "Customer Support" } },
          { type: "footer", config: { copyright: "© 2025 Your Store" } },
        ],
      },
      {
        id: "marketplace",
        name: "Marketplace Hub",
        description: "Multi-vendor marketplace design",
        preview: "/placeholder.svg?height=120&width=200",
        type: "ecommerce",
        color: "blue",
        components: [
          { type: "hero", config: { title: "Marketplace", subtitle: "Buy and sell with confidence" } },
          { type: "text", config: { content: "Welcome to our marketplace..." } },
          { type: "gallery", config: { images: [] } },
          { type: "pricing", config: { plans: [] } },
          { type: "footer", config: { copyright: "© 2025 Marketplace" } },
        ],
      },
    ],
    restaurant: [
      {
        id: "fine-dining",
        name: "Fine Dining",
        description: "Elegant design for upscale restaurants",
        preview: "/placeholder.svg?height=120&width=200",
        type: "restaurant",
        color: "orange",
        components: [
          { type: "hero", config: { title: "Fine Dining Experience", subtitle: "Exquisite cuisine awaits" } },
          { type: "text", config: { content: "Our menu and specialties..." } },
          { type: "gallery", config: { images: [] } },
          { type: "map", config: { address: "Restaurant Location" } },
          { type: "contact", config: { title: "Reservations" } },
          { type: "footer", config: { copyright: "© 2025 Restaurant Name" } },
        ],
      },
      {
        id: "casual-dining",
        name: "Casual Dining",
        description: "Friendly and welcoming restaurant design",
        preview: "/placeholder.svg?height=120&width=200",
        type: "restaurant",
        color: "purple",
        components: [
          { type: "hero", config: { title: "Welcome to Our Restaurant", subtitle: "Great food, great atmosphere" } },
          { type: "text", config: { content: "About our restaurant..." } },
          { type: "testimonial", config: { quote: "Best food in town!" } },
          { type: "contact", config: { title: "Visit Us" } },
          { type: "footer", config: { copyright: "© 2025 Restaurant" } },
        ],
      },
    ],
    portfolio: [
      {
        id: "creative-portfolio",
        name: "Creative Portfolio",
        description: "Showcase your creative work beautifully",
        preview: "/placeholder.svg?height=120&width=200",
        type: "portfolio",
        color: "blue",
        components: [
          { type: "hero", config: { title: "Creative Portfolio", subtitle: "Showcasing my best work" } },
          { type: "gallery", config: { images: [] } },
          { type: "text", config: { content: "About my work and experience..." } },
          { type: "testimonial", config: { quote: "Amazing creative work!" } },
          { type: "contact", config: { title: "Let's Work Together" } },
          { type: "footer", config: { copyright: "© 2025 Your Name" } },
        ],
      },
      {
        id: "professional-portfolio",
        name: "Professional Portfolio",
        description: "Clean and professional portfolio design",
        preview: "/placeholder.svg?height=120&width=200",
        type: "portfolio",
        color: "orange",
        components: [
          { type: "hero", config: { title: "Professional Portfolio", subtitle: "My professional journey" } },
          { type: "text", config: { content: "Professional experience and skills..." } },
          { type: "gallery", config: { images: [] } },
          { type: "contact", config: { title: "Get In Touch" } },
          { type: "footer", config: { copyright: "© 2025 Professional Name" } },
        ],
      },
    ],
    blog: [
      {
        id: "personal-blog",
        name: "Personal Blog",
        description: "Share your thoughts and stories",
        preview: "/placeholder.svg?height=120&width=200",
        type: "blog",
        color: "purple",
        components: [
          { type: "hero", config: { title: "My Blog", subtitle: "Thoughts, stories, and insights" } },
          { type: "text", config: { content: "Welcome to my blog..." } },
          { type: "text", config: { content: "Recent blog posts..." } },
          { type: "social", config: { platforms: ["twitter", "facebook", "instagram"] } },
          { type: "contact", config: { title: "Subscribe" } },
          { type: "footer", config: { copyright: "© 2025 Blog Name" } },
        ],
      },
      {
        id: "tech-blog",
        name: "Tech Blog",
        description: "Technology-focused blog design",
        preview: "/placeholder.svg?height=120&width=200",
        type: "blog",
        color: "blue",
        components: [
          { type: "hero", config: { title: "Tech Blog", subtitle: "Latest in technology" } },
          { type: "text", config: { content: "Technology articles and tutorials..." } },
          { type: "gallery", config: { images: [] } },
          { type: "footer", config: { copyright: "© 2025 Tech Blog" } },
        ],
      },
    ],
    landing: [
      {
        id: "product-launch",
        name: "Product Launch",
        description: "Perfect for launching new products",
        preview: "/placeholder.svg?height=120&width=200",
        type: "landing",
        color: "blue",
        components: [
          { type: "hero", config: { title: "Revolutionary Product", subtitle: "Coming Soon" } },
          { type: "countdown", config: { title: "Launch Countdown" } },
          { type: "text", config: { content: "Product features and benefits..." } },
          { type: "pricing", config: { plans: [] } },
          { type: "contact", config: { title: "Get Notified" } },
          { type: "footer", config: { copyright: "© 2025 Product Name" } },
        ],
      },
      {
        id: "event-landing",
        name: "Event Landing",
        description: "Promote events and conferences",
        preview: "/placeholder.svg?height=120&width=200",
        type: "landing",
        color: "orange",
        components: [
          {
            type: "hero",
            config: { title: "Amazing Event 2025", subtitle: "Join us for an unforgettable experience" },
          },
          { type: "countdown", config: { title: "Event Countdown" } },
          { type: "text", config: { content: "Event details and schedule..." } },
          { type: "map", config: { address: "Event Venue" } },
          { type: "contact", config: { title: "Register Now" } },
          { type: "footer", config: { copyright: "© 2025 Event Name" } },
        ],
      },
    ],
  }

  // Initialize history with empty state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([websiteData])
      setHistoryIndex(0)
    }
  }, [])

  // Web Speech API setup
  useEffect(() => {
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("")
        setVoiceTranscript(transcript)
        setAiPrompt(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setError(`Speech recognition error: ${event.error}`)
        setIsRecording(false)
        setCallStatus("idle")
      }

      recognitionRef.current.onend = () => {
        if (isRecording) {
          try {
            recognitionRef.current.start()
          } catch (error) {
            console.error("Error restarting recognition:", error)
            setIsRecording(false)
            setCallStatus("idle")
          }
        }
      }
    }

    // Listen for messages from iframe
    const handleIframeMessage = (event) => {
      try {
        if (event.data && event.data.type) {
          switch (event.data.type) {
            case "updateComponent":
              const { id, updates } = event.data.payload
              updateComponent(id, updates)
              break
            case "dragEnd":
              const { sourceIndex, destinationIndex } = event.data.payload
              handleDragEnd(sourceIndex, destinationIndex)
              break
            case "addComponent":
              const { type, index } = event.data.payload
              addComponent(type, index)
              break
            case "selectComponent":
              const { id: componentId } = event.data.payload
              setSelectedComponent(componentId)
              break
            case "deleteComponent":
              const { id: deleteId } = event.data.payload
              deleteComponent(deleteId)
              break
            case "duplicateComponent":
              const { id: duplicateId } = event.data.payload
              duplicateComponent(duplicateId)
              break
            case "copyComponent":
              const { id: copyId } = event.data.payload
              copyComponent(copyId)
              break
            case "uploadImage":
              const { componentId: uploadComponentId, files } = event.data.payload
              // Handle file upload simulation
              console.log("Upload image request:", uploadComponentId, files)
              break
          }
        }
      } catch (error) {
        console.error("Error handling iframe message:", error)
      }
    }

    window.addEventListener("message", handleIframeMessage)
    return () => window.removeEventListener("message", handleIframeMessage)
  }, [isRecording])

  // Auto-generate preview when components change
  useEffect(() => {
    if (websiteData.components.length > 0) {
      generatePreview()
    }
  }, [websiteData.components])

  // Get all templates or filtered by category
  const getTemplates = () => {
    if (templateCategory === "all") {
      return Object.values(templateData).flat()
    }
    return templateData[templateCategory] || []
  }

  // Method selection handlers
  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
  }

  const handleContinueWithMethod = () => {
    if (selectedMethod) {
      setCurrentStep(selectedMethod)
    }
  }

  // Voice recording functionality
  const startVoiceRecording = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setIsRecording(true)
        setCallStatus("recording")
        setError("")
      } else {
        // Fallback to MediaRecorder
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream)
        audioChunksRef.current = []

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
          await processVoiceRecording(audioBlob)
        }

        mediaRecorderRef.current.start()
        setIsRecording(true)
        setCallStatus("recording")
        setError("")
      }
    } catch (error) {
      console.error("Voice recording error:", error)
      setError("Could not access microphone. Please check permissions and try again.")
      setCallStatus("idle")
    }
  }

  const stopVoiceRecording = () => {
    try {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop()
        setIsRecording(false)
        setCallStatus("idle")
      } else if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
        setCallStatus("processing")
      }
    } catch (error) {
      console.error("Error stopping voice recording:", error)
      setIsRecording(false)
      setCallStatus("idle")
    }
  }

  const processVoiceRecording = async (audioBlob) => {
    // Simulate voice processing - in real app, send to speech-to-text service
    setCallStatus("processing")
    setTimeout(() => {
      const sampleTranscripts = [
        "Create a modern business website with hero section, about us, and contact form",
        "I want to create a restaurant website with online menu and reservation system",
        "Build a portfolio website for a graphic designer with project gallery",
        "Design an e-commerce store for handmade jewelry with product showcase",
      ]
      const randomTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)]
      setVoiceTranscript(randomTranscript)
      setAiPrompt(randomTranscript)
      setCallStatus("idle")
    }, 2000)
  }

  // Phone call functionality
  const makePhoneCall = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number")
      return
    }

    setCallStatus("calling")
    setError("")

    // Simulate phone call - in real app, integrate with telephony service
    setTimeout(() => {
      setCallStatus("connected")
      setTimeout(() => {
        setCallStatus("idle")
        const callTranscripts = [
          "I want to create a restaurant website with online menu and reservation system",
          "Create a modern business website with hero section and contact form",
          "Build a portfolio website to showcase my photography work",
          "Design an online store for my handmade crafts business",
        ]
        const randomTranscript = callTranscripts[Math.floor(Math.random() * callTranscripts.length)]
        setVoiceTranscript(randomTranscript)
        setAiPrompt(randomTranscript)
      }, 5000)
    }, 3000)
  }

  // Template selection handler
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    const updatedData = {
      ...websiteData,
      name: template.name,
      type: template.type,
      components: template.components.map((comp, index) => ({
        id: `${comp.type}_${Date.now()}_${index}`,
        ...componentTemplates[comp.type],
        config: { ...componentTemplates[comp.type].config, ...comp.config },
      })),
    }
    setWebsiteData(updatedData)
    updateHistory(updatedData)
    setCurrentStep("builder")
  }

  // AI Website Generation
  const generateWebsiteFromPrompt = async () => {
    if (!aiPrompt.trim()) {
      setError("Please enter a description for your website")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate AI generation - in real app, call AI service
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate components based on prompt keywords
      const components = []
      const prompt = aiPrompt.toLowerCase()

      // Always add hero
      components.push({
        id: `hero_${Date.now()}`,
        ...componentTemplates.hero,
        config: {
          ...componentTemplates.hero.config,
          title: prompt.includes("restaurant")
            ? "Welcome to Our Restaurant"
            : prompt.includes("portfolio")
              ? "My Portfolio"
              : prompt.includes("shop") || prompt.includes("store")
                ? "Shop Now"
                : "Welcome to Our Website",
          subtitle: prompt.includes("restaurant")
            ? "Delicious food and great atmosphere"
            : prompt.includes("portfolio")
              ? "Showcasing my best work"
              : prompt.includes("shop") || prompt.includes("store")
                ? "Discover amazing products"
                : "Create amazing experiences with our platform",
        },
      })

      // Add relevant components based on prompt
      if (prompt.includes("about") || prompt.includes("story")) {
        components.push({
          id: `text_${Date.now()}_1`,
          ...componentTemplates.text,
          config: {
            ...componentTemplates.text.config,
            content: "About Us - Tell your story here...",
          },
        })
      }

      if (prompt.includes("gallery") || prompt.includes("portfolio") || prompt.includes("images")) {
        components.push({
          id: `gallery_${Date.now()}`,
          ...componentTemplates.gallery,
        })
      }

      if (prompt.includes("video") || prompt.includes("demo")) {
        components.push({
          id: `video_${Date.now()}`,
          ...componentTemplates.video,
        })
      }

      if (prompt.includes("testimonial") || prompt.includes("review")) {
        components.push({
          id: `testimonial_${Date.now()}`,
          ...componentTemplates.testimonial,
        })
      }

      if (prompt.includes("pricing") || prompt.includes("plan")) {
        components.push({
          id: `pricing_${Date.now()}`,
          ...componentTemplates.pricing,
        })
      }

      if (prompt.includes("contact") || prompt.includes("form")) {
        components.push({
          id: `contact_${Date.now()}`,
          ...componentTemplates.contact,
        })
      }

      if (prompt.includes("map") || prompt.includes("location")) {
        components.push({
          id: `map_${Date.now()}`,
          ...componentTemplates.map,
        })
      }

      // Always add footer
      components.push({
        id: `footer_${Date.now()}`,
        ...componentTemplates.footer,
      })

      const generatedData = {
        ...websiteData,
        name: "AI Generated Website",
        type: prompt.includes("restaurant")
          ? "Restaurant"
          : prompt.includes("portfolio")
            ? "Portfolio"
            : prompt.includes("shop") || prompt.includes("store")
              ? "E-Commerce"
              : "Business",
        components,
      }

      setWebsiteData(generatedData)
      updateHistory(generatedData)
      setCurrentStep("builder")
      setAiPrompt("")
    } catch (err) {
      setError("Failed to generate website: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Component Management
  const addComponent = useCallback((type, index = null) => {
    const template = componentTemplates[type]
    if (!template) {
      console.error(`Component template not found for type: ${type}`)
      return
    }

    const newComponent = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...JSON.parse(JSON.stringify(template)), // Deep clone to avoid reference issues
    }

    setWebsiteData((prevData) => {
      const components = [...prevData.components]
      const insertIndex = index !== null ? index : components.length
      components.splice(insertIndex, 0, newComponent)

      const updatedData = { ...prevData, components }
      updateHistory(updatedData)
      return updatedData
    })
  }, [])

  const updateComponent = useCallback((id, updates) => {
    setWebsiteData((prevData) => {
      const updatedComponents = prevData.components.map((comp) => {
        if (comp.id === id) {
          return {
            ...comp,
            ...updates,
            config: updates.config ? { ...comp.config, ...updates.config } : comp.config,
            styles: updates.styles ? { ...comp.styles, ...updates.styles } : comp.styles,
          }
        }
        return comp
      })

      const updatedData = { ...prevData, components: updatedComponents }
      updateHistory(updatedData)
      return updatedData
    })
  }, [])

  const deleteComponent = useCallback(
    (id) => {
      if (!id) return

      setWebsiteData((prevData) => {
        const updatedComponents = prevData.components.filter((comp) => comp.id !== id)
        const updatedData = { ...prevData, components: updatedComponents }
        updateHistory(updatedData)

        // Clear selection if deleted component was selected
        if (selectedComponent === id) {
          setSelectedComponent(null)
        }

        return updatedData
      })
    },
    [selectedComponent],
  )

  const duplicateComponent = useCallback(
    (id) => {
      const component = websiteData.components.find((comp) => comp.id === id)
      if (!component) return

      const duplicatedComponent = {
        ...JSON.parse(JSON.stringify(component)), // Deep clone
        id: `${component.type}_${Date.now()}_copy_${Math.random().toString(36).substr(2, 9)}`,
      }

      setWebsiteData((prevData) => {
        const componentIndex = prevData.components.findIndex((comp) => comp.id === id)
        const components = [...prevData.components]
        components.splice(componentIndex + 1, 0, duplicatedComponent)

        const updatedData = { ...prevData, components }
        updateHistory(updatedData)
        return updatedData
      })
    },
    [websiteData.components],
  )

  const copyComponent = useCallback(
    (id) => {
      const component = websiteData.components.find((comp) => comp.id === id)
      if (component) {
        setClipboard(JSON.parse(JSON.stringify(component))) // Deep clone
      }
    },
    [websiteData.components],
  )

  const pasteComponent = useCallback(
    (index = null) => {
      if (!clipboard) return

      const pastedComponent = {
        ...JSON.parse(JSON.stringify(clipboard)), // Deep clone
        id: `${clipboard.type}_${Date.now()}_paste_${Math.random().toString(36).substr(2, 9)}`,
      }

      setWebsiteData((prevData) => {
        const components = [...prevData.components]
        const insertIndex = index !== null ? index : components.length
        components.splice(insertIndex, 0, pastedComponent)

        const updatedData = { ...prevData, components }
        updateHistory(updatedData)
        return updatedData
      })
    },
    [clipboard],
  )

  const handleDragEnd = useCallback((sourceIndex, destinationIndex) => {
    if (sourceIndex === destinationIndex) return

    setWebsiteData((prevData) => {
      const items = Array.from(prevData.components)
      const [reorderedItem] = items.splice(sourceIndex, 1)
      items.splice(destinationIndex, 0, reorderedItem)

      const updatedData = { ...prevData, components: items }
      updateHistory(updatedData)
      return updatedData
    })
  }, [])

  const onDragEnd = (result) => {
    if (!result.destination) return
    handleDragEnd(result.source.index, result.destination.index)
  }

  // History Management
  const updateHistory = useCallback(
    (data) => {
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1)
        newHistory.push(JSON.parse(JSON.stringify(data)))
        setHistoryIndex(newHistory.length - 1)
        return newHistory
      })
    },
    [historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setWebsiteData(JSON.parse(JSON.stringify(history[newIndex])))
    }
  }, [historyIndex, history])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setWebsiteData(JSON.parse(JSON.stringify(history[newIndex])))
    }
  }, [historyIndex, history])

  // Enhanced preview generation with real-time editing
  const generateClientPreview = useCallback(() => {
    const componentHtml = websiteData.components
      .map((comp, index) => {
        let content = ""
        const isSelected = selectedComponent === comp.id

        switch (comp.type) {
          case "hero":
            content = `
            <div class="component-hero ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              ${comp.config.backgroundImage ? `<div class="hero-background" style="background-image: url('${comp.config.backgroundImage}'); position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center;"></div>` : ""}
              ${comp.config.overlay ? `<div class="hero-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,${comp.config.overlayOpacity || 0.5});"></div>` : ""}
              <div style="position: relative; z-index: 2;">
                <h1 class="editable hero-title" contenteditable="true" data-id="${comp.id}" data-field="title" style="color: ${comp.config.textColor}; margin-bottom: 1rem; font-size: 3rem; font-weight: bold;">${comp.config.title}</h1>
                <p class="editable hero-subtitle" contenteditable="true" data-id="${comp.id}" data-field="subtitle" style="color: ${comp.config.textColor}; margin-bottom: 2rem; font-size: 1.2rem;">${comp.config.subtitle}</p>
                <button class="hero-button" style="background: ${comp.config.buttonColor}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer;">${comp.config.buttonText}</button>
              </div>
            </div>
          `
            break
          case "text":
            content = `
            <div class="component-text ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <${comp.config.heading} class="editable" contenteditable="true" data-id="${comp.id}" data-field="content" style="color: ${comp.config.color}; font-size: ${comp.config.fontSize}; font-weight: ${comp.config.fontWeight}; line-height: ${comp.config.lineHeight}; text-align: ${comp.config.alignment};">${comp.config.content}</${comp.config.heading}>
            </div>
          `
            break
          case "image":
            content = `
            <div class="component-image ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <img src="${comp.config.src}" alt="${comp.config.alt}" style="width: ${comp.config.width}; height: ${comp.config.height}; border-radius: ${comp.config.borderRadius}; ${comp.config.shadow ? "box-shadow: 0 4px 8px rgba(0,0,0,0.1);" : ""}" />
              ${comp.config.caption ? `<p class="image-caption editable" contenteditable="true" data-id="${comp.id}" data-field="caption" style="text-align: center; margin-top: 0.5rem; color: #666;">${comp.config.caption}</p>` : ""}
            </div>
          `
            break
          case "video":
            content = `
            <div class="component-video ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <video ${comp.config.controls ? "controls" : ""} ${comp.config.autoplay ? "autoplay" : ""} ${comp.config.loop ? "loop" : ""} ${comp.config.muted ? "muted" : ""} poster="${comp.config.poster}" style="width: ${comp.config.width}; height: ${comp.config.height};">
                ${comp.config.src ? `<source src="${comp.config.src}" type="video/mp4">` : ""}
                Your browser does not support the video tag.
              </video>
            </div>
          `
            break
          case "gallery":
            content = `
            <div class="component-gallery ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <div style="display: grid; grid-template-columns: repeat(${comp.config.columns}, 1fr); gap: ${comp.config.spacing};">
                ${
                  comp.config.images && comp.config.images.length
                    ? comp.config.images
                        .map(
                          (img) => `
                  <div style="position: relative; overflow: hidden; border-radius: 8px;">
                    <img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
                    ${comp.config.showCaptions && img.caption ? `<p style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 0.5rem; margin: 0;">${img.caption}</p>` : ""}
                  </div>
                `,
                        )
                        .join("")
                    : "<p style='text-align: center; color: #666; grid-column: 1 / -1;'>No images in gallery. Click to add images.</p>"
                }
              </div>
            </div>
          `
            break
          case "contact":
            content = `
            <div class="component-contact ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <h2 class="editable" contenteditable="true" data-id="${comp.id}" data-field="title" style="color: ${comp.config.textColor}; margin-bottom: 2rem; text-align: center;">${comp.config.title}</h2>
              <form style="max-width: 600px; margin: 0 auto;">
                ${comp.config.fields.includes("name") ? '<input type="text" placeholder="Your Name" style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px;" />' : ""}
                ${comp.config.fields.includes("email") ? '<input type="email" placeholder="Your Email" style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px;" />' : ""}
                ${comp.config.fields.includes("phone") ? '<input type="tel" placeholder="Your Phone" style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px;" />' : ""}
                ${comp.config.fields.includes("message") ? '<textarea placeholder="Your Message" rows="5" style="width: 100%; padding: 1rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical;"></textarea>' : ""}
                <button type="submit" style="background: ${comp.config.buttonColor}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">${comp.config.submitText}</button>
              </form>
            </div>
          `
            break
          case "footer":
            content = `
            <footer class="component-footer ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <div style="text-align: center;">
                <p class="editable" contenteditable="true" data-id="${comp.id}" data-field="copyright" style="color: ${comp.config.textColor}; margin-bottom: 1rem;">${comp.config.copyright}</p>
                <div style="display: flex; justify-content: center; gap: 1rem;">
                  ${Object.entries(comp.config.socialLinks || {})
                    .filter(([_, url]) => url)
                    .map(
                      ([platform, url]) => `
                    <a href="${url}" style="color: ${comp.config.textColor}; text-decoration: none;">${platform}</a>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            </footer>
          `
            break
          case "button":
            content = `
            <div class="component-button ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <button class="editable" contenteditable="true" data-id="${comp.id}" data-field="text" style="background: ${comp.config.backgroundColor}; color: ${comp.config.textColor}; padding: ${comp.config.size === "small" ? "0.5rem 1rem" : comp.config.size === "large" ? "1.5rem 3rem" : "1rem 2rem"}; border: none; border-radius: ${comp.config.borderRadius}; cursor: pointer; font-size: ${comp.config.size === "small" ? "0.9rem" : comp.config.size === "large" ? "1.2rem" : "1rem"};">${comp.config.text}</button>
            </div>
          `
            break
          case "spacer":
            content = `
            <div class="component-spacer ${isSelected ? "selected" : ""}" style="height: ${comp.config.height}; background: ${comp.config.backgroundColor};" data-component-id="${comp.id}">
              ${isSelected ? '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 0.9rem;">Spacer</div>' : ""}
            </div>
          `
            break
          case "divider":
            content = `
            <div class="component-divider ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <hr style="border: none; border-top: ${comp.config.thickness} ${comp.config.style} ${comp.config.color}; width: ${comp.config.width}; margin: 0 auto;" />
            </div>
          `
            break
          case "testimonial":
            content = `
            <div class="component-testimonial ${isSelected ? "selected" : ""}" style="${Object.entries(
              comp.styles || {},
            )
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                <blockquote class="editable" contenteditable="true" data-id="${comp.id}" data-field="quote" style="font-size: 1.2rem; font-style: italic; margin-bottom: 1rem; color: #374151;">"${comp.config.quote}"</blockquote>
                <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                  <img src="${comp.config.avatar}" alt="${comp.config.author}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <p class="editable" contenteditable="true" data-id="${comp.id}" data-field="author" style="font-weight: bold; margin: 0;">${comp.config.author}</p>
                    <p class="editable" contenteditable="true" data-id="${comp.id}" data-field="position" style="color: #666; margin: 0; font-size: 0.9rem;">${comp.config.position}</p>
                  </div>
                </div>
              </div>
            </div>
          `
            break
          case "social":
            content = `
            <div class="component-social ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <div style="display: flex; justify-content: ${comp.config.alignment}; gap: 1rem;">
                ${comp.config.platforms
                  .map(
                    (platform) => `
                  <a href="#" style="color: ${comp.config.color}; font-size: ${comp.config.size === "small" ? "1.2rem" : comp.config.size === "large" ? "2rem" : "1.5rem"}; text-decoration: none;">
                    ${platform === "facebook" ? "📘" : platform === "twitter" ? "🐦" : platform === "instagram" ? "📷" : platform === "linkedin" ? "💼" : "🔗"}
                  </a>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
            break
          case "pricing":
            content = `
            <div class="component-pricing ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
                ${comp.config.plans
                  .map(
                    (plan) => `
                  <div style="background: white; border: 2px solid ${plan.highlighted ? "#3b82f6" : "#e5e7eb"}; border-radius: 12px; padding: 2rem; text-align: center; ${plan.highlighted ? "transform: scale(1.05);" : ""}">
                    <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${plan.name}</h3>
                    <div style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">${plan.price}<span style="font-size: 1rem; color: #666;">/${plan.period}</span></div>
                    <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                      ${plan.features.map((feature) => `<li style="padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">✓ ${feature}</li>`).join("")}
                    </ul>
                    <button style="background: ${plan.highlighted ? "#3b82f6" : "#6b7280"}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; cursor: pointer; width: 100%;">Choose Plan</button>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `
            break
          case "countdown":
            content = `
            <div class="component-countdown ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <h2 class="editable" contenteditable="true" data-id="${comp.id}" data-field="title" style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">${comp.config.title}</h2>
              <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <div style="font-size: 3rem; font-weight: bold; color: #3b82f6;">07</div>
                  <div style="color: #666;">Days</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 3rem; font-weight: bold; color: #3b82f6;">12</div>
                  <div style="color: #666;">Hours</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 3rem; font-weight: bold; color: #3b82f6;">34</div>
                  <div style="color: #666;">Minutes</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 3rem; font-weight: bold; color: #3b82f6;">56</div>
                  <div style="color: #666;">Seconds</div>
                </div>
              </div>
            </div>
          `
            break
          case "map":
            content = `
            <div class="component-map ${isSelected ? "selected" : ""}" style="${Object.entries(comp.styles || {})
              .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
              .join(";")}" data-component-id="${comp.id}">
              <div style="background: #f0f0f0; height: ${comp.config.height}; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #666;">
                🗺️ Map: ${comp.config.address}
              </div>
            </div>
          `
            break
          default:
            content = `<div class="${isSelected ? "selected" : ""}" data-component-id="${comp.id}">Unknown component type: ${comp.type}</div>`
        }

        return `
        <div class="draggable-component ${isSelected ? "component-selected" : ""}" draggable="true" data-id="${comp.id}" data-index="${index}" style="position: relative; margin: 10px 0; ${isSelected ? "outline: 2px solid #3b82f6; outline-offset: 4px;" : ""}">
          ${content}
          <div class="component-toolbar" style="display: ${isSelected ? "flex" : "none"}; position: absolute; top: -40px; right: 0; background: rgba(0,0,0,0.8); padding: 8px; border-radius: 8px; gap: 8px; z-index: 1000;">
            <button class="toolbar-btn edit-component" data-id="${comp.id}" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;" title="Edit">✏️</button>
            <button class="toolbar-btn copy-component" data-id="${comp.id}" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;" title="Copy">📋</button>
            <button class="toolbar-btn duplicate-component" data-id="${comp.id}" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;" title="Duplicate">📄</button>
            <button class="toolbar-btn delete-component" data-id="${comp.id}" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;" title="Delete">🗑️</button>
          </div>
        </div>
      `
      })
      .join("")

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: ${websiteData.fontFamily}; 
            font-size: ${websiteData.fontSize}; 
            margin: 0; 
            background: ${websiteData.globalStyles.backgroundColor};
            color: ${websiteData.globalStyles.textColor};
          }
          .draggable-component { 
            position: relative; 
            margin: 10px 0; 
            border: 2px dashed transparent; 
            transition: all 0.3s ease;
          }
          .draggable-component:hover { 
            border-color: ${websiteData.primaryColor}; 
          }
          .draggable-component.dragging { 
            opacity: 0.5; 
          }
          .component-toolbar { 
            display: none; 
            position: absolute; 
            top: -40px; 
            right: 0; 
            background: rgba(0,0,0,0.8); 
            padding: 8px; 
            border-radius: 8px;
            gap: 8px;
            z-index: 1000;
          }
          .draggable-component:hover .component-toolbar,
          .component-selected .component-toolbar { 
            display: flex; 
          }
          .toolbar-btn { 
            background: none; 
            border: none; 
            color: white; 
            cursor: pointer; 
            padding: 4px;
            border-radius: 4px;
            transition: background 0.2s;
          }
          .toolbar-btn:hover {
            background: rgba(255,255,255,0.2);
          }
          .editable:focus { 
            outline: 2px solid ${websiteData.primaryColor}; 
            outline-offset: 2px;
          }
          .component-hero { 
            text-align: center; 
            position: relative;
            overflow: hidden;
          }
          .component
            position: relative;
            overflow: hidden;
          }
          .component-text { 
            margin: 20px; 
          }
          .component-image img { 
            max-width: 100%; 
            transition: transform 0.3s ease;
          }
          .component-image img:hover {
            transform: scale(1.02);
          }
          .component-contact .contact-form-placeholder { 
            padding: 20px; 
            background: #f0f0f0; 
          }
          .add-component-placeholder { 
            height: 60px; 
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0); 
            margin: 10px 0; 
            text-align: center; 
            line-height: 60px; 
            cursor: pointer; 
            border: 2px dashed #ccc;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 600;
            color: #666;
          }
          .add-component-placeholder:hover { 
            background: linear-gradient(135deg, #e0e0e0, #d0d0d0); 
            border-color: ${websiteData.primaryColor};
            color: ${websiteData.primaryColor};
            transform: translateY(-2px);
          }
          .selected {
            outline: 2px solid ${websiteData.primaryColor};
            outline-offset: 4px;
          }
          .component-selected {
            outline: 2px solid ${websiteData.primaryColor};
            outline-offset: 4px;
          }
          
          /* Animation classes */
          .fadeIn { animation: fadeIn 1s ease-in; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          
          .slideInUp { animation: slideInUp 0.8s ease-out; }
          @keyframes slideInUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          
          .slideInLeft { animation: slideInLeft 0.8s ease-out; }
          @keyframes slideInLeft { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          
          .zoomIn { animation: zoomIn 0.6s ease-out; }
          @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>
      </head>
      <body>
        <div id="components">
          ${componentHtml}
          <div class="add-component-placeholder" data-index="${websiteData.components.length}">+ Add Component</div>
        </div>
        <script>
          let selectedComponentId = null;
          
          // Prevent default drag behavior on images
          document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
              e.preventDefault();
            }
          });
          
          // Handle component selection
          document.addEventListener('click', (e) => {
            e.stopPropagation();
            const component = e.target.closest('.draggable-component');
            if (component) {
              // Remove previous selection
              document.querySelectorAll('.component-selected').forEach(el => {
                el.classList.remove('component-selected');
              });
              
              // Add selection to clicked component
              component.classList.add('component-selected');
              selectedComponentId = component.dataset.id;
              
              window.parent.postMessage({
                type: 'selectComponent',
                payload: { id: selectedComponentId }
              }, '*');
            }
          });

          // Handle inline editing
          document.querySelectorAll('.editable').forEach(elem => {
            elem.addEventListener('blur', () => {
              const id = elem.dataset.id;
              const field = elem.dataset.field;
              const value = elem.innerText;
              window.parent.postMessage({
                type: 'updateComponent',
                payload: { id, updates: { config: { [field]: value } } }
              }, '*');
            });
            
            elem.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                elem.blur();
              }
            });
          });

          // Handle drag and drop
          const components = document.querySelectorAll('.draggable-component');
          components.forEach(comp => {
            comp.addEventListener('dragstart', (e) => {
              comp.classList.add('dragging');
              e.dataTransfer.setData('text/plain', comp.dataset.index);
              e.dataTransfer.effectAllowed = 'move';
            });
            
            comp.addEventListener('dragend', () => {
              comp.classList.remove('dragging');
            });
            
            comp.addEventListener('dragover', (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            });
            
            comp.addEventListener('drop', (e) => {
              e.preventDefault();
              const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
              const destinationIndex = parseInt(comp.dataset.index);
              if (sourceIndex !== destinationIndex) {
                window.parent.postMessage({
                  type: 'dragEnd',
                  payload: { sourceIndex, destinationIndex }
                }, '*');
              }
            });
          });

          // Handle toolbar actions
          document.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.classList.contains('edit-component')) {
              const id = e.target.dataset.id;
              window.parent.postMessage({
                type: 'selectComponent',
                payload: { id }
              }, '*');
            } else if (e.target.classList.contains('copy-component')) {
              const id = e.target.dataset.id;
              window.parent.postMessage({
                type: 'copyComponent',
                payload: { id }
              }, '*');
            } else if (e.target.classList.contains('duplicate-component')) {
              const id = e.target.dataset.id;
              window.parent.postMessage({
                type: 'duplicateComponent',
                payload: { id }
              }, '*');
            } else if (e.target.classList.contains('delete-component')) {
              const id = e.target.dataset.id;
              if (confirm('Are you sure you want to delete this component?')) {
                window.parent.postMessage({
                  type: 'deleteComponent',
                  payload: { id }
                }, '*');
              }
            }
          });

          // Handle add component placeholder
          document.querySelectorAll('.add-component-placeholder').forEach(placeholder => {
            placeholder.addEventListener('click', (e) => {
              e.stopPropagation();
              const index = parseInt(placeholder.dataset.index);
              window.parent.postMessage({
                type: 'addComponent',
                payload: { type: 'text', index }
              }, '*');
            });
          });
          
          // Handle image uploads via drag and drop
          document.addEventListener('dragover', (e) => {
            e.preventDefault();
          });
          
          document.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length > 0) {
              const component = e.target.closest('.draggable-component');
              if (component) {
                window.parent.postMessage({
                  type: 'uploadImage',
                  payload: { 
                    componentId: component.dataset.id,
                    files: imageFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
                  }
                }, '*');
              }
            }
          });
        </script>
      </body>
      </html>
    `
  }, [websiteData, selectedComponent])

  // Generate preview
  const generatePreview = useCallback(() => {
    const html = generateClientPreview()
    setPreviewHtml(html)
  }, [generateClientPreview])

  // Media upload handlers
  const handleImageUpload = async (files, componentId = null) => {
    const uploadedImages = []

    for (const file of files) {
      // Simulate upload - in real app, upload to cloud storage
      const imageUrl = URL.createObjectURL(file)
      uploadedImages.push({
        src: imageUrl,
        alt: file.name,
        caption: "",
      })

      // Add to media library
      setMediaLibrary((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: "image",
          src: imageUrl,
          name: file.name,
          size: file.size,
        },
      ])
    }

    if (componentId) {
      const component = websiteData.components.find((c) => c.id === componentId)
      if (component && component.type === "image") {
        updateComponent(componentId, {
          config: { ...component.config, src: uploadedImages[0].src },
        })
      } else if (component && component.type === "gallery") {
        updateComponent(componentId, {
          config: { ...component.config, images: [...(component.config.images || []), ...uploadedImages] },
        })
      }
    }

    return uploadedImages
  }

  const handleVideoUpload = async (file, componentId = null) => {
    // Simulate upload - in real app, upload to cloud storage
    const videoUrl = URL.createObjectURL(file)

    // Add to media library
    setMediaLibrary((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type: "video",
        src: videoUrl,
        name: file.name,
        size: file.size,
      },
    ])

    if (componentId) {
      updateComponent(componentId, {
        config: { src: videoUrl },
      })
    }

    return videoUrl
  }

  // Website Publishing
  const publishWebsite = async () => {
    if (!websiteData.name.trim()) {
      setError("Please enter a website name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate publishing - in real app, deploy to hosting service
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const websiteUrl = `https://${websiteData.name.toLowerCase().replace(/\s+/g, "-")}.example.com`
      alert(`Website published successfully! Visit: ${websiteUrl}`)
    } catch (err) {
      setError("Failed to publish website: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Save website data
  const saveWebsite = () => {
    const dataStr = JSON.stringify(websiteData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${websiteData.name || "website"}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Load website data
  const loadWebsite = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          setWebsiteData(data)
          updateHistory(data)
          setCurrentStep("builder")
        } catch (err) {
          setError("Failed to load website file: " + err.message)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="gradient-waves"></div>
        <div className="floating-shapes"></div>
        <div className="color-bubbles"></div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🚀</div>
            <h1 className="logo-text">Sirjan Ai Studio</h1>
          </div>

          {currentStep !== "method-selection" && (
            <button onClick={() => setCurrentStep("method-selection")} className="back-button">
              <ArrowLeft size={16} />
              <span>Back to Methods</span>
            </button>
          )}

          <div className="dashboard-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <Users size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-number">500K+</div>
                <div className="stat-label">Users</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <TrendingUp size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          {currentStep === "method-selection" && (
            <div className="method-selection">
              <div className="section-header">
                <h3 className="section-title">Choose Creation Method</h3>
                <p className="section-description">Select how you'd like to create your website</p>
              </div>

              <div className="method-cards">
                <div
                  className={`method-card ${selectedMethod === "ai-generator" ? "selected" : ""}`}
                  onClick={() => handleMethodSelect("ai-generator")}
                >
                  <div className="method-icon ai">
                    <Sparkles size={32} />
                  </div>
                  <div className="method-content">
                    <h4 className="method-title">AI Generator</h4>
                    <p className="method-description">
                      Describe your website in natural language and let AI create it for you
                    </p>
                  </div>
                  <div className="method-badge">
                    <Star size={12} />
                    <span>Popular</span>
                  </div>
                </div>

                <div
                  className={`method-card ${selectedMethod === "templates" ? "selected" : ""}`}
                  onClick={() => handleMethodSelect("templates")}
                >
                  <div className="method-icon templates">
                    <FileTemplate size={32} />
                  </div>
                  <div className="method-content">
                    <h4 className="method-title">Templates</h4>
                    <p className="method-description">
                      Choose from professionally designed templates for different industries
                    </p>
                  </div>
                  <div className="method-badge">
                    <Zap size={12} />
                    <span>Fast</span>
                  </div>
                </div>

                <div
                  className={`method-card ${selectedMethod === "voice-call" ? "selected" : ""}`}
                  onClick={() => handleMethodSelect("voice-call")}
                >
                  <div className="method-icon voice">
                    <Phone size={32} />
                  </div>
                  <div className="method-content">
                    <h4 className="method-title">Voice Call</h4>
                    <p className="method-description">
                      Call us or record your voice to describe what you want to create
                    </p>
                  </div>
                  <div className="method-badge">
                    <Mic size={12} />
                    <span>New</span>
                  </div>
                </div>
              </div>

              {selectedMethod && (
                <button onClick={handleContinueWithMethod} className="continue-button">
                  <span>
                    Continue with{" "}
                    {selectedMethod === "ai-generator"
                      ? "AI Generator"
                      : selectedMethod === "templates"
                        ? "Templates"
                        : "Voice Call"}
                  </span>
                  <span className="btn-arrow">→</span>
                </button>
              )}
            </div>
          )}

          {currentStep === "ai-generator" && (
            <div className="ai-generator">
              <div className="section-header">
                <h3 className="section-title">Generate with AI</h3>
                <p className="section-description">Describe your website and let AI create it for you</p>
              </div>

              <div className="ai-prompt-section">
                <div className="prompt-examples">
                  <h4>Try these examples:</h4>
                  <div className="example-chips">
                    <button
                      className="example-chip"
                      onClick={() =>
                        setAiPrompt(
                          "Create a modern restaurant website with menu, about section, and contact form. Use warm colors and elegant design.",
                        )
                      }
                    >
                      Restaurant Website
                    </button>
                    <button
                      className="example-chip"
                      onClick={() =>
                        setAiPrompt(
                          "Build a portfolio website for a graphic designer with project gallery and contact information.",
                        )
                      }
                    >
                      Portfolio Site
                    </button>
                    <button
                      className="example-chip"
                      onClick={() =>
                        setAiPrompt(
                          "Design an e-commerce store for handmade jewelry with product showcase and shopping cart.",
                        )
                      }
                    >
                      E-commerce Store
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Describe your website</label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., Create a modern restaurant website with menu, about section, and contact form. Use warm colors and elegant design."
                    className="ai-textarea"
                  />
                </div>

                <button
                  onClick={generateWebsiteFromPrompt}
                  disabled={isLoading || !aiPrompt.trim()}
                  className={`generate-button ${isLoading || !aiPrompt.trim() ? "disabled" : ""}`}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate Website</span>
                    </>
                  )}
                </button>
              </div>

              <div className="quick-settings">
                <h4 className="settings-title">Quick Settings</h4>
                <div className="settings-grid">
                  <div className="form-group">
                    <label className="form-label">Website Name</label>
                    <input
                      type="text"
                      value={websiteData.name}
                      onChange={(e) => setWebsiteData({ ...websiteData, name: e.target.value })}
                      className="form-input"
                      placeholder="My Awesome Website"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Website Type</label>
                    <select
                      value={websiteData.type}
                      onChange={(e) => setWebsiteData({ ...websiteData, type: e.target.value })}
                      className="form-select"
                    >
                      <option value="Business">Business</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Blog">Blog</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Agency">Agency</option>
                      <option value="Landing">Landing Page</option>
                    </select>
                  </div>

                  <div className="color-inputs">
                    <div className="form-group">
                      <label className="form-label">Primary Color</label>
                      <input
                        type="color"
                        value={websiteData.primaryColor}
                        onChange={(e) => setWebsiteData({ ...websiteData, primaryColor: e.target.value })}
                        className="color-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Secondary Color</label>
                      <input
                        type="color"
                        value={websiteData.secondaryColor}
                        onChange={(e) => setWebsiteData({ ...websiteData, secondaryColor: e.target.value })}
                        className="color-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "templates" && (
            <div className="templates">
              <div className="section-header">
                <h3 className="section-title">Choose Template</h3>
                <p className="section-description">Select a professionally designed template</p>
              </div>

              <div className="category-filter">
                {["all", "business", "ecommerce", "restaurant", "portfolio", "blog", "landing"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setTemplateCategory(category)}
                    className={`category-button ${templateCategory === category ? "active" : ""}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <div className="template-grid">
                {getTemplates().map((template) => (
                  <div
                    key={template.id}
                    className={`template-card ${template.color} ${selectedTemplate?.id === template.id ? "selected" : ""}`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="template-preview">
                      <img src={template.preview || "/placeholder.svg"} alt={template.name} />
                      <div className="template-overlay">
                        <button className="preview-button">
                          <Eye size={16} />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                    <div className="template-info">
                      <div className="template-type">{template.type}</div>
                      <h4 className="template-name">{template.name}</h4>
                      <p className="template-description">{template.description}</p>
                      <button className="use-template-button">
                        <span>Use Template</span>
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === "voice-call" && (
            <div className="voice-call">
              <div className="section-header">
                <h3 className="section-title">Voice Call Creation</h3>
                <p className="section-description">Call us or record your voice to describe your website</p>
              </div>

              <div className="voice-options">
                <div className="voice-option">
                  <div className="option-header">
                    <div className="option-icon">
                      <Phone size={24} />
                    </div>
                    <h4 className="option-title">Option 1: Call Us</h4>
                  </div>
                  <p className="option-description">Speak directly with our AI assistant</p>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number (e.g., +1234567890)"
                    className="phone-input"
                  />
                  <button
                    onClick={makePhoneCall}
                    disabled={callStatus !== "idle" || !phoneNumber.trim()}
                    className={`call-button ${callStatus === "calling" ? "calling" : ""}`}
                  >
                    <Phone size={20} />
                    <span>
                      {callStatus === "idle" && "Call Now"}
                      {callStatus === "calling" && "Calling..."}
                      {callStatus === "connected" && "Connected"}
                    </span>
                  </button>
                </div>

                <div className="voice-divider">
                  <span>or</span>
                </div>

                <div className="voice-option">
                  <div className="option-header">
                    <div className="option-icon">
                      <Mic size={24} />
                    </div>
                    <h4 className="option-title">Option 2: Voice Recording</h4>
                  </div>
                  <p className="option-description">Record your voice describing your website</p>

                  <div className="recording-area">
                    <button
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      disabled={callStatus === "processing"}
                      className={`record-button ${isRecording ? "recording" : ""}`}
                    >
                      {isRecording ? <Square size={32} /> : <Mic size={32} />}
                    </button>
                    <p className="recording-status">
                      {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                    </p>
                  </div>

                  {voiceTranscript && (
                    <div className="transcript-section">
                      <label className="form-label">Transcript:</label>
                      <div className="transcript-box">{voiceTranscript}</div>
                      <button
                        onClick={() => {
                          setAiPrompt(voiceTranscript)
                          generateWebsiteFromPrompt()
                        }}
                        className="generate-from-voice-button"
                      >
                        <Sparkles size={16} />
                        <span>Generate Website from Voice</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === "builder" && (
            <div className="builder">
              <div className="section-header">
                <h3 className="section-title">Website Builder</h3>
                <p className="section-description">Add and customize components for your website</p>
              </div>

              <div className="add-components">
                <h4 className="subsection-title">Add Components</h4>
                <div className="component-grid">
                  {Object.entries(componentTemplates).map(([type, template]) => (
                    <button key={type} onClick={() => addComponent(type)} className="component-button">
                      <div className="component-icon">
                        {type === "hero" && <Layout size={20} />}
                        {type === "text" && <Type size={20} />}
                        {type === "image" && <ImageIcon size={20} />}
                        {type === "video" && <Video size={20} />}
                        {type === "gallery" && <Grid size={20} />}
                        {type === "contact" && <Mail size={20} />}
                        {type === "footer" && <Layout size={20} />}
                        {type === "button" && <Square size={20} />}
                        {type === "spacer" && <Move size={20} />}
                        {type === "divider" && <Move size={20} />}
                        {type === "map" && <Map size={20} />}
                        {type === "social" && <Share2 size={20} />}
                        {type === "testimonial" && <Quote size={20} />}
                        {type === "pricing" && <BarChart size={20} />}
                        {type === "countdown" && <Clock size={20} />}
                      </div>
                      <span className="component-label">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {websiteData.components.length > 0 && (
                <div className="component-list-section">
                  <h4 className="subsection-title">Components ({websiteData.components.length})</h4>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="components">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="component-list">
                          {websiteData.components.map((component, index) => (
                            <Draggable key={component.id} draggableId={component.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`component-item ${selectedComponent === component.id ? "selected" : ""}`}
                                  style={provided.draggableProps.style}
                                >
                                  <div className="component-header">
                                    <div className="component-info">
                                      <div {...provided.dragHandleProps} className="drag-handle">
                                        <Move size={16} />
                                      </div>
                                      <span className="component-name">{component.type}</span>
                                    </div>
                                    <div className="component-actions">
                                      <button
                                        onClick={() => copyComponent(component.id)}
                                        className="component-action copy"
                                        title="Copy"
                                      >
                                        <Copy size={16} />
                                      </button>
                                      <button
                                        onClick={() => duplicateComponent(component.id)}
                                        className="component-action duplicate"
                                        title="Duplicate"
                                      >
                                        <Clipboard size={16} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          setSelectedComponent(selectedComponent === component.id ? null : component.id)
                                        }
                                        className="component-action edit"
                                      >
                                        <Edit3 size={16} />
                                      </button>
                                      <button
                                        onClick={() => deleteComponent(component.id)}
                                        className="component-action delete"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}

              {clipboard && (
                <div className="clipboard-section">
                  <h4 className="subsection-title">Clipboard</h4>
                  <div className="clipboard-item">
                    <span>{clipboard.type} component</span>
                    <button onClick={() => pasteComponent()} className="paste-button">
                      <Clipboard size={16} />
                      <span>Paste</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedComponent && (
                <div className="component-editor">
                  <ComponentEditor
                    component={websiteData.components.find((c) => c.id === selectedComponent)}
                    onUpdate={(updates) => updateComponent(selectedComponent, updates)}
                    onImageUpload={handleImageUpload}
                    onVideoUpload={handleVideoUpload}
                    mediaLibrary={mediaLibrary}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentStep === "builder" && (
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="history-controls">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className={`history-button ${historyIndex <= 0 ? "disabled" : ""}`}
                >
                  <Undo size={20} />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className={`history-button ${historyIndex >= history.length - 1 ? "disabled" : ""}`}
                >
                  <Redo size={20} />
                </button>
              </div>

              <div className="viewport-controls">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`viewport-button ${viewMode === "desktop" ? "active" : ""}`}
                >
                  <Monitor size={16} />
                </button>
                <button
                  onClick={() => setViewMode("tablet")}
                  className={`viewport-button ${viewMode === "tablet" ? "active" : ""}`}
                >
                  <Tablet size={16} />
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`viewport-button ${viewMode === "mobile" ? "active" : ""}`}
                >
                  <Smartphone size={16} />
                </button>
              </div>

              <div className="website-info">
                <span className="website-name">{websiteData.name || "Untitled Website"}</span>
                <span className="website-type">{websiteData.type}</span>
              </div>
            </div>

            <div className="top-bar-right">
              <button onClick={saveWebsite} className="action-button save">
                <Save size={16} />
                <span>Save</span>
              </button>
              <input type="file" accept=".json" onChange={loadWebsite} style={{ display: "none" }} ref={loadInputRef} />
              <button onClick={() => loadInputRef.current?.click()} className="action-button load">
                <Upload size={16} />
                <span>Load</span>
              </button>
              <button onClick={generatePreview} className="action-button preview">
                <Eye size={16} />
                <span>Preview</span>
              </button>
              <button
                onClick={publishWebsite}
                disabled={isLoading}
                className={`action-button publish ${isLoading ? "disabled" : ""}`}
              >
                <Share2 size={16} />
                <span>{isLoading ? "Publishing..." : "Publish"}</span>
              </button>
            </div>
          </div>
        )}

        <div className="preview-area">
          <div className={`preview-container ${viewMode}`}>
            {previewHtml ? (
              <iframe
                ref={iframeRef}
                srcDoc={previewHtml}
                className="preview-iframe"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="empty-preview">
                <div className="empty-preview-icon">
                  <Globe size={64} />
                </div>
                <div className="empty-preview-content">
                  <h3 className="empty-preview-title">
                    {currentStep === "method-selection"
                      ? "Choose a creation method to get started"
                      : currentStep === "builder"
                        ? "No preview available"
                        : "Create your website"}
                  </h3>
                  <p className="empty-preview-description">
                    {currentStep === "method-selection"
                      ? "Select AI Generator, Templates, or Voice Call to begin building your website"
                      : currentStep === "builder"
                        ? "Generate or build your website to see preview"
                        : "Follow the steps to create your amazing website"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {currentStep === "builder" && (
            <div className="preview-toolbar">
              <h4>Quick Add</h4>
              <div className="toolbar-buttons">
                {Object.keys(componentTemplates)
                  .slice(0, 6)
                  .map((type) => (
                    <button
                      key={type}
                      onClick={() => addComponent(type)}
                      className="toolbar-button"
                      title={`Add ${type}`}
                    >
                      <div className="toolbar-icon">
                        {type === "hero" && <Layout size={16} />}
                        {type === "text" && <Type size={16} />}
                        {type === "image" && <ImageIcon size={16} />}
                        {type === "video" && <Video size={16} />}
                        {type === "gallery" && <Grid size={16} />}
                        {type === "contact" && <Mail size={16} />}
                      </div>
                      <span>{type}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <div className="error-text">
                <p>{error}</p>
                <button onClick={() => setError("")} className="error-dismiss">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden-input"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          if (files.length && selectedComponent) {
            handleImageUpload(files, selectedComponent)
          }
        }}
      />

      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden-input"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && selectedComponent) {
            handleVideoUpload(file, selectedComponent)
          }
        }}
      />

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="media-library-modal">
          <div className="media-library-content">
            <div className="media-library-header">
              <h3>Media Library</h3>
              <button onClick={() => setShowMediaLibrary(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="media-library-grid">
              {mediaLibrary.map((item) => (
                <div key={item.id} className="media-item">
                  {item.type === "image" ? (
                    <img src={item.src || "/placeholder.svg"} alt={item.name} />
                  ) : (
                    <video src={item.src} />
                  )}
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced Component Editor with more styling options
const ComponentEditor = ({ component, onUpdate, onImageUpload, onVideoUpload, mediaLibrary }) => {
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      await onImageUpload(files, component.id)
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await onVideoUpload(file, component.id)
    }
  }

  if (!component) return null

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-icon">
          <Settings size={20} />
        </div>
        <h4 className="editor-title">Edit {component.type}</h4>
      </div>

      <div className="editor-content">
        {component.type === "hero" && (
          <div className="editor-fields">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={component.config.title}
                onChange={(e) => onUpdate({ config: { ...component.config, title: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subtitle</label>
              <textarea
                value={component.config.subtitle}
                onChange={(e) => onUpdate({ config: { ...component.config, subtitle: e.target.value } })}
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Button Text</label>
              <input
                type="text"
                value={component.config.buttonText}
                onChange={(e) => onUpdate({ config: { ...component.config, buttonText: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Text Color</label>
              <input
                type="color"
                value={component.config.textColor}
                onChange={(e) => onUpdate({ config: { ...component.config, textColor: e.target.value } })}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Button Color</label>
              <input
                type="color"
                value={component.config.buttonColor}
                onChange={(e) => onUpdate({ config: { ...component.config, buttonColor: e.target.value } })}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Background Image</label>
              <button onClick={() => fileInputRef.current?.click()} className="image-upload-button">
                <Upload size={20} />
                <span>Upload Background</span>
              </button>
            </div>
          </div>
        )}

        {component.type === "text" && (
          <div className="editor-fields">
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                value={component.config.content}
                onChange={(e) => onUpdate({ config: { ...component.config, content: e.target.value } })}
                className="form-textarea large"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Heading Level</label>
              <select
                value={component.config.heading}
                onChange={(e) => onUpdate({ config: { ...component.config, heading: e.target.value } })}
                className="form-select"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="p">Paragraph</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Font Size</label>
              <input
                type="range"
                min="12"
                max="48"
                value={Number.parseInt(component.config.fontSize)}
                onChange={(e) => onUpdate({ config: { ...component.config, fontSize: e.target.value + "px" } })}
                className="form-range"
              />
              <span>{component.config.fontSize}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Text Color</label>
              <input
                type="color"
                value={component.config.color}
                onChange={(e) => onUpdate({ config: { ...component.config, color: e.target.value } })}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alignment</label>
              <div className="alignment-buttons">
                <button
                  onClick={() => onUpdate({ config: { ...component.config, alignment: "left" } })}
                  className={`alignment-button ${component.config.alignment === "left" ? "active" : ""}`}
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => onUpdate({ config: { ...component.config, alignment: "center" } })}
                  className={`alignment-button ${component.config.alignment === "center" ? "active" : ""}`}
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => onUpdate({ config: { ...component.config, alignment: "right" } })}
                  className={`alignment-button ${component.config.alignment === "right" ? "active" : ""}`}
                >
                  <AlignRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {component.type === "image" && (
          <div className="editor-fields">
            {component.config.src && (
              <div className="image-preview-container">
                <img src={component.config.src || "/placeholder.svg"} alt="Preview" className="image-preview" />
              </div>
            )}
            <button onClick={() => fileInputRef.current?.click()} className="image-upload-button">
              <Upload size={20} />
              <span>Upload Image</span>
            </button>
            <div className="form-group">
              <label className="form-label">Alt Text</label>
              <input
                type="text"
                value={component.config.alt}
                onChange={(e) => onUpdate({ config: { ...component.config, alt: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Caption</label>
              <input
                type="text"
                value={component.config.caption}
                onChange={(e) => onUpdate({ config: { ...component.config, caption: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Border Radius</label>
              <input
                type="range"
                min="0"
                max="50"
                value={Number.parseInt(component.config.borderRadius)}
                onChange={(e) => onUpdate({ config: { ...component.config, borderRadius: e.target.value + "px" } })}
                className="form-range"
              />
              <span>{component.config.borderRadius}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Shadow</label>
              <input
                type="checkbox"
                checked={component.config.shadow}
                onChange={(e) => onUpdate({ config: { ...component.config, shadow: e.target.checked } })}
                className="form-checkbox"
              />
            </div>
          </div>
        )}

        {component.type === "video" && (
          <div className="editor-fields">
            <button onClick={() => videoInputRef.current?.click()} className="image-upload-button">
              <Video size={20} />
              <span>Upload Video</span>
            </button>
            <div className="form-group">
              <label className="form-label">Controls</label>
              <input
                type="checkbox"
                checked={component.config.controls}
                onChange={(e) => onUpdate({ config: { ...component.config, controls: e.target.checked } })}
                className="form-checkbox"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Autoplay</label>
              <input
                type="checkbox"
                checked={component.config.autoplay}
                onChange={(e) => onUpdate({ config: { ...component.config, autoplay: e.target.checked } })}
                className="form-checkbox"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Loop</label>
              <input
                type="checkbox"
                checked={component.config.loop}
                onChange={(e) => onUpdate({ config: { ...component.config, loop: e.target.checked } })}
                className="form-checkbox"
              />
            </div>
          </div>
        )}

        {component.type === "gallery" && (
          <div className="editor-fields">
            <button onClick={() => fileInputRef.current?.click()} className="image-upload-button">
              <ImagePlus size={20} />
              <span>Add Images</span>
            </button>
            <div className="form-group">
              <label className="form-label">Columns</label>
              <input
                type="range"
                min="1"
                max="6"
                value={component.config.columns}
                onChange={(e) =>
                  onUpdate({ config: { ...component.config, columns: Number.parseInt(e.target.value) } })
                }
                className="form-range"
              />
              <span>{component.config.columns}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Spacing</label>
              <input
                type="range"
                min="0"
                max="50"
                value={Number.parseInt(component.config.spacing)}
                onChange={(e) => onUpdate({ config: { ...component.config, spacing: e.target.value + "px" } })}
                className="form-range"
              />
              <span>{component.config.spacing}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Show Captions</label>
              <input
                type="checkbox"
                checked={component.config.showCaptions}
                onChange={(e) => onUpdate({ config: { ...component.config, showCaptions: e.target.checked } })}
                className="form-checkbox"
              />
            </div>
          </div>
        )}

        {component.type === "contact" && (
          <div className="editor-fields">
            <div className="form-group">
              <label className="form-label">Form Title</label>
              <input
                type="text"
                value={component.config.title}
                onChange={(e) => onUpdate({ config: { ...component.config, title: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Submit Button Text</label>
              <input
                type="text"
                value={component.config.submitText}
                onChange={(e) => onUpdate({ config: { ...component.config, submitText: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Button Color</label>
              <input
                type="color"
                value={component.config.buttonColor}
                onChange={(e) => onUpdate({ config: { ...component.config, buttonColor: e.target.value } })}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Form Fields</label>
              <div className="checkbox-group">
                {["name", "email", "phone", "message"].map((field) => (
                  <label key={field} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={component.config.fields.includes(field)}
                      onChange={(e) => {
                        const fields = e.target.checked
                          ? [...component.config.fields, field]
                          : component.config.fields.filter((f) => f !== field)
                        onUpdate({ config: { ...component.config, fields } })
                      }}
                      className="form-checkbox"
                    />
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {component.type === "button" && (
          <div className="editor-fields">
            <div className="form-group">
              <label className="form-label">Button Text</label>
              <input
                type="text"
                value={component.config.text}
                onChange={(e) => onUpdate({ config: { ...component.config, text: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Link URL</label>
              <input
                type="url"
                value={component.config.link}
                onChange={(e) => onUpdate({ config: { ...component.config, link: e.target.value } })}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Background Color</label>
              <input
                type="color"
                value={component.config.backgroundColor}
                onChange={(e) => onUpdate({ config: { ...component.config, backgroundColor: e.target.value } })}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Text Color</label>
              <input
                type="color"
                value={component.config.textColor}
                onChange={(e) => onUpdate({ config: { ...component.config, textColor: e.target.value } })}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Size</label>
              <select
                value={component.config.size}
                onChange={(e) => onUpdate({ config: { ...component.config, size: e.target.value } })}
                className="form-select"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        )}

        {component.type === "spacer" && (
          <div className="editor-fields">
            <div className="form-group">
              <label className="form-label">Height</label>
              <input
                type="range"
                min="10"
                max="200"
                value={Number.parseInt(component.config.height)}
                onChange={(e) => onUpdate({ config: { ...component.config, height: e.target.value + "px" } })}
                className="form-range"
              />
              <span>{component.config.height}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Background Color</label>
              <input
                type="color"
                value={component.config.backgroundColor}
                onChange={(e) => onUpdate({ config: { ...component.config, backgroundColor: e.target.value } })}
                className="color-input"
              />
            </div>
          </div>
        )}

        {component.type === "testimonial" && (
          <div className="editor-fields">
            <div className="form-group">
              <label className="form-label">Quote</label>
              <textarea
                value={component.config.quote}
                onChange={(e) => onUpdate({ config: { ...component.config, quote: e.target.value } })}
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Author</label>
              <input
                type="text"
                value={component.config.author}
                onChange={(e) => onUpdate({ config: { ...component.config, author: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Position</label>
              <input
                type="text"
                value={component.config.position}
                onChange={(e) => onUpdate({ config: { ...component.config, position: e.target.value } })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar</label>
              <button onClick={() => fileInputRef.current?.click()} className="image-upload-button">
                <Upload size={20} />
                <span>Upload Avatar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={component.type === "gallery"}
        className="hidden-input"
        onChange={handleImageUpload}
      />

      <input ref={videoInputRef} type="file" accept="video/*" className="hidden-input" onChange={handleVideoUpload} />
    </div>
  )
}

export default Dashboard
