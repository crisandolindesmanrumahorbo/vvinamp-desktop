import React, { ButtonHTMLAttributes } from "react";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children = "", className = "", ...props }: IButtonProps, forwardedRef) => {
    return (
      <button
        ref={forwardedRef}
        className={`px-4 py-1.5 text-base font-head transition-all rounded outline-hidden cursor-pointer duration-200 font-medium 
        flex items-center shadow-md hover:shadow-none bg-primary text-primary-foreground border-2 border-black 
        hover:translate-y-1 hover:bg-primary-hover ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
