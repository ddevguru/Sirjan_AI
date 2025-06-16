export const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
      default: "bg-blue-600 text-white",
      secondary: "bg-gray-100 text-gray-900",
    }
  
    return (
      <div
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      >
        {children}
      </div>
    )
  }
  