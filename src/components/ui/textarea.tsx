import * as React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={`textarea${className ? ` ${className}` : ""}`}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
