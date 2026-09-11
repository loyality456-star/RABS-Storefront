"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { RatingInput } from "@/components/ui/Stars";

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          customer_name: form.get("customer_name"),
          rating,
          comment: form.get("comment"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review.");
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card space-y-xs">
        <p className="text-title-md text-primary">Thank you!</p>
        <p className="text-body-md text-on-surface-variant">
          Your review has been posted. It means the world to our small, honest
          workshop.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-md">
      <h3 className="font-display text-headline-sm text-on-surface">
        Leave a review
      </h3>
      <Input label="Your name" name="customer_name" required placeholder="How should we thank you?" />
      <RatingInput value={rating} onChange={setRating} />
      <Textarea
        label="Your review"
        name="comment"
        required
        rows={4}
        placeholder="Share your experience with this remedy…"
      />
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}