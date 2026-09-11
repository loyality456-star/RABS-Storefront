export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div
      className={`flex items-center gap-[2px] ${className}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            star <= Math.round(rating) ? "text-[#8FA668]" : "text-outline-variant"
          }`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.4 5.9.9-4.3 4.1 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.8l5.9-.9L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-xs">
      <span className="label mb-0">Your rating</span>
      <div className="flex gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`${star} star`}
            className="p-[2px]"
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-6 w-6 transition-colors ${
                star <= value ? "text-[#8FA668]" : "text-outline-variant"
              }`}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 1.5l2.6 5.4 5.9.9-4.3 4.1 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.8l5.9-.9L10 1.5Z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}