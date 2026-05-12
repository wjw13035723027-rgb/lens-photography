import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-9xl font-serif text-border/40 select-none tracking-widest">404</p>
      <p className="mt-6 text-muted text-sm tracking-widest">页面不存在</p>
      <Link
        href="/"
        className="mt-10 px-8 py-2.5 border border-border rounded-full text-xs text-muted tracking-widest hover:text-foreground hover:border-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      >
        返回首页
      </Link>
    </div>
  );
}
