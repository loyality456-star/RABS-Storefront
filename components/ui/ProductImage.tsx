import Image from "next/image";

export function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-surface-container ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface-container via-secondary-container/60 to-tertiary-container/40 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-16 w-16 text-primary-container/60"
      >
        <path
          d="M12 22C12 22 3.5 16.5 3.5 9.5A8.5 8.5 0 0 1 12 3c3.5 4 4 8.5 8.5 8.5 1.2 0 2.4-.3 3.4-.9C20.9 19 12 22 12 22Z"
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">{alt}</span>
    </div>
  );
}