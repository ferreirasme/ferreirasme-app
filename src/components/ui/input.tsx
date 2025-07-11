import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        elegant: "bg-background border border-input rounded-md px-4 py-2",
        luxury: "bg-pearl border border-primary/30 rounded-lg px-4 py-3",
        minimal: "bg-transparent border-b border-input px-1 py-2 rounded-none",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2",
      },
      inputSize: {
        sm: "h-9 text-sm",
        md: "h-10",
        lg: "h-11",
        xl: "h-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "elegant",
      inputSize: "md",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }