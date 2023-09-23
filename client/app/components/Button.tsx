import React from "react"
import { BiLoaderAlt } from "react-icons/bi"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isLoading, children, ...props }, ref) => {
    return (
      <button className={className} ref={ref} {...props} disabled={isLoading}>

        {isLoading ? <BiLoaderAlt className="h-6 w-6 animate-spin" /> : children}
        
      </button>
    )
  }
)
Button.displayName = "Button"

export default Button;
