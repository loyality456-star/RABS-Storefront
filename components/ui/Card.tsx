import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`card ${hover ? "card-hover" : ""} ${className}`}
      {...props}
    />
  );
}