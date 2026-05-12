export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-foreground animate-spin" />
        <p className="text-xs text-muted tracking-[0.2em]">LOADING</p>
      </div>
    </div>
  );
}
