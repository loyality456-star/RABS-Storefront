import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site py-4xl text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-xs font-display text-headline-lg text-on-surface">
        This remedy is off the shelf
      </h1>
      <p className="mx-auto mt-sm max-w-md text-body-lg text-on-surface-variant">
        The page or product you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary mt-lg">
        Back home
      </Link>
    </div>
  );
}