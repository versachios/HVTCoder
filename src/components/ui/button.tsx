import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "default" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={`btn btn-${variant} btn-${size}${className ? ` ${className}` : ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
