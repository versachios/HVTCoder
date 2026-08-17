import * as React from "react";

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

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => false,
});

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = ({
  children,
  className = "",
}: DropdownMenuTriggerProps) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  return (
    <button
      type="button"
      className={`dropdown-trigger${className ? ` ${className}` : ""}`}
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
      className={`dropdown-content${className ? ` ${className}` : ""}`}
      role="menu"
    >
      {children}
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
      type="button"
      role="menuitem"
      className={`dropdown-item${className ? ` ${className}` : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
