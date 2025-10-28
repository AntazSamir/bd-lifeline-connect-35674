import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const dockVariants = cva("flex gap-2 p-2 bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700")

export interface DockProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dockVariants> {}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(dockVariants(), className)}
      {...props}
    />
  )
)
Dock.displayName = "Dock"

const DockItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    active?: boolean
    size?: "sm" | "md" | "lg"
  }
>(({ className, active, size = "md", children, ...props }, ref) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer",
        "hover:bg-primary/20 hover:scale-110 active:scale-95",
        sizeClasses[size],
        active && "bg-primary/30 scale-110",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DockItem.displayName = "DockItem"

export { Dock, DockItem, dockVariants }

