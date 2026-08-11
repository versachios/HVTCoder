import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      className={
        `
        bg-card text-card-foreground rounded-lg border border-input
        shadow-sm hover:shadow-md transition-shadow duration-200 hover:scale-[1.02]
        ${className}
        `
      }
      ref={ref}
      {...props}
    >
      {props.children}
    </div>
  )
);
Card.displayName = "Card";
