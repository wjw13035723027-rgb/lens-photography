"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className="text-6xl font-serif tracking-widest text-muted/30">500</p>
      <p className="text-muted text-sm tracking-widest mt-6">出了点问题</p>
      <button
        onClick={reset}
        className="mt-8 px-8 py-3 text-xs tracking-[0.2em] border border-border rounded-full hover:bg-foreground hover:text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      >
        重试
      </button>
    </div>
  );
}
