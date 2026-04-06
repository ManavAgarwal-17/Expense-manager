import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-[var(--background)] text-[var(--foreground)] animate-in fade-in zoom-in duration-500">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
          Ex Financer <br />
          <span className="text-[var(--primary)]">
            Smart Expense Tracking
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-[var(--muted)] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Take control of your finances with our intuitive expense tracker. Monitor your spending, set budgets, and achieve your financial goals.
        </p>

        <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center pt-4">
          <Link href="/login"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--primary)] px-8 text-sm font-medium text-black shadow transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Login
          </Link>
          <Link href="/register"
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Register <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
