import { HTMLAttributes } from "react";

type ButtonProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ children, ...props }: ButtonProps) {
  return (
    <span
      className="bg-muted text-muted-foreground px-2 py-1 text-xs rounded-sm"
      {...props}
    >
      {children}
    </span>
  );
}
