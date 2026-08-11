import * as React from "react";
import { ChevronDown } from "lucide-react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => false, // This is a placeholder; the provider will override it.
});

export const DropdownMenuTrigger = ({
  children,
  className = "",
}: DropdownMenuTriggerProps) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext);

  return (
    <button
      className={
        `
        w-full flex items-center justify-between px-4 py-3 bg-card text-input-foreground border border-input
        rounded-md focus:ring-2 focus:ring-primary focus:outline-none
        hover:bg-accent/50 transition-colors duration-200 hover:scale-[1.02]
        ${className}
        `
      }
      onClick={() => setOpen(!open)}
    >
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({
  children,
  className = "",
}: DropdownMenuContentProps) => {
  const { open } = React.useContext(DropdownMenuContext);

  if (!open) return null;

  return (
    <div
      className={
        `
        z-50 mt-2 w-56 bg-card text-card-foreground rounded-lg border border-input
        shadow-lg shadow-black/20 transition-shadow duration-200
        ${className}
        `
      }
      style={{ position: "absolute", top: "100%", left: 0 }}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({
  children,
  onClick,
  className = "",
}: DropdownMenuItemProps) => {
  return (
    <button
      className={
        `
        flex w-full items-center px-4 py-2 text-sm text-left
        hover:bg-accent hover:text-primary-foreground transition-colors duration-200 hover:scale-[1.02]
        ${className}
        `
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};
