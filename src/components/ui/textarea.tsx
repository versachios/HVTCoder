import * as React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={
        `
        w-full px-4 py-3 bg-card text-input-foreground border border-input
        rounded-md focus:ring-2 focus:ring-primary focus:outline-none
        resize-y min-h-[80px] disabled:opacity-50 disabled:cursor-not-allowed
        hover:bg-accent/50 transition-colors duration-200
        ${className}
        `
      }
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
