import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      className={`card${className ? ` ${className}` : ""}`}
      ref={ref}
      {...props}
    />
  )
);
Card.displayName = "Card";
