import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    const base =
      variant === "primary"
        ? "btn-primary"
        : variant === "secondary"
          ? "btn-secondary"
          : "btn-ghost";
    const sizing = size === "sm" ? "!h-10 !px-md !py-0 !text-label-md" : "";
    return (
      <button
        ref={ref}
        className={`${base} ${sizing} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";