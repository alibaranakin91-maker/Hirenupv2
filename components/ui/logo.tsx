import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  }

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Logo Icon - Two blocks forming N shape */}
      <div className={cn(iconSizes[size], "relative")}>
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          className="w-full h-full"
        >
          {/* Top-left block */}
          <rect x="0" y="0" width="16" height="16" fill="#0284c7" rx="2"/>
          {/* Bottom-right block */}
          <rect x="24" y="24" width="16" height="16" fill="#0284c7" rx="2"/>
        </svg>
      </div>
      {showText && (
        <span className={cn(
          textSizes[size],
          "font-bold text-gray-900"
        )}>
          HireNUp
        </span>
      )}
    </div>
  )
}
