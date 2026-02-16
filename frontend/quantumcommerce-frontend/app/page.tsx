import Link from 'next/link';

const categories = [
  { name: 'Electronics', tagline: 'Innovation at your fingertips' },
  { name: 'Clothing', tagline: 'Modern essentials, refined' },
  { name: 'Books', tagline: 'Knowledge, beautifully curated' },
  { name: 'Furniture', tagline: 'Living spaces, elevated' },
];

const techStack = [
  { name: 'Next.js', category: 'Frontend / SSR & SSG' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Redux Toolkit & Thunk', category: 'State Management' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'GraphQL', category: 'Data Fetching' },
  { name: 'Node.js', category: 'Backend Runtime' },
  { name: 'AWS', category: 'Cloud Deployment' },
  { name: 'MongoDB', category: 'NoSQL Database' },
  { name: 'Redis', category: 'Caching & Sessions' },
  { name: 'JWT & Cookies', category: 'Authentication' },
];

export default function Home() {
  return (
    <main className="bg-[#060606] text-[#F0EDE6] overflow-x-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="qc-grid absolute inset-0" />
        <div className="qc-orb-1" />
        <div className="qc-orb-2" />

        <div className="relative z-10 text-center max-w-5xl">
          <p
            className="qc-up text-[#C9A96E] tracking-[0.3em] uppercase text-xs sm:text-sm font-medium mb-8"
            style={{ animationDelay: '100ms' }}
          >
            The Future of Commerce
          </p>

          <h1 className="font-display" style={{ lineHeight: 0.88 }}>
            <span
              className="qc-up block tracking-[-0.03em] font-normal"
              style={{
                fontSize: 'clamp(3.5rem, 11vw, 11rem)',
                animationDelay: '250ms',
              }}
            >
              QUANTUM
            </span>

            <div
              className="qc-expand mx-auto my-3 md:my-5 h-px max-w-28 bg-linear-to-r from-transparent via-[#C9A96E] to-transparent"
              style={{ animationDelay: '500ms' }}
            />

            <span
              className="qc-up block tracking-[-0.03em] font-normal"
              style={{
                fontSize: 'clamp(3.5rem, 11vw, 11rem)',
                animationDelay: '400ms',
              }}
            >
              COMMERCE
            </span>
          </h1>

          <p
            className="qc-up mt-8 md:mt-12 text-[#8A8578] text-base md:text-lg tracking-wide max-w-md mx-auto"
            style={{ animationDelay: '650ms' }}
          >
            A high-performance e-commerce platform engineered for the modern
            web.
          </p>

          <div
            className="qc-up mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: '800ms' }}
          >
            <Link
              href="/products"
              className="px-8 py-3.5 bg-[#C9A96E] text-[#060606] font-medium tracking-wide text-sm uppercase hover:bg-[#E2D1A8] transition-colors duration-300"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="px-8 py-3.5 border border-[#2a2a2a] text-[#F0EDE6] font-medium tracking-wide text-sm uppercase hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all duration-300"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="qc-in absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animationDelay: '1200ms' }}
        >
          <div className="qc-scroll flex flex-col items-center gap-2 text-[#8A8578]">
            <span className="text-[10px] tracking-[0.25em] uppercase">
              Scroll
            </span>
            <svg
              width="14"
              height="20"
              viewBox="0 0 14 20"
              fill="none"
              className="text-[#8A8578]"
            >
              <path
                d="M7 3V17M7 17L2 12M7 17L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="px-6 py-24 md:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:mb-20">
            <span className="text-[#C9A96E] tracking-[0.3em] uppercase text-xs font-medium">
              Browse
            </span>
            <h2
              className="font-display mt-4 tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/products"
                className="qc-card group border border-[#1a1a1a] p-8 md:p-10 flex flex-col justify-between min-h-[180px]"
              >
                <div>
                  <h3
                    className="font-display tracking-[-0.01em]"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-[#8A8578] mt-2 text-sm">{cat.tagline}</p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs tracking-[0.2em] uppercase text-[#8A8578] group-hover:text-[#C9A96E] transition-colors duration-300">
                    Explore
                  </span>
                  <span className="qc-arrow text-[#8A8578] text-xl">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <div className="max-w-6xl mx-auto h-px bg-linear-to-r from-transparent via-[#C9A96E]/30 to-transparent" />

      {/* ═══ TECH STACK ═══ */}
      <section className="px-6 py-24 md:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:mb-20">
            <span className="text-[#C9A96E] tracking-[0.3em] uppercase text-xs font-medium">
              Under the Hood
            </span>
            <h2
              className="font-display mt-4 tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              System Architecture &amp; Technologies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="qc-card border border-[#1a1a1a] p-5 md:p-6 flex items-baseline justify-between gap-4"
              >
                <h3 className="text-[#C9A96E] font-medium tracking-tight">
                  {tech.name}
                </h3>
                <span className="text-xs text-[#8A8578] italic shrink-0">
                  {tech.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <div className="max-w-6xl mx-auto h-px bg-linear-to-r from-transparent via-[#C9A96E]/30 to-transparent" />

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative px-6 py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#060606] via-[#0d0b08] to-[#060606]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2
            className="font-display tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          >
            Begin Your Journey
          </h2>
          <p className="mt-6 text-[#8A8578] text-base md:text-lg max-w-lg mx-auto">
            Discover a curated selection of products designed for the
            discerning buyer.
          </p>
          <Link
            href="/products"
            className="inline-block mt-10 px-10 py-4 bg-[#C9A96E] text-[#060606] font-medium tracking-wide text-sm uppercase hover:bg-[#E2D1A8] transition-colors duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 py-12 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-display text-lg tracking-tight">
            Quantum Commerce
          </span>
          <span className="text-xs text-[#8A8578] tracking-wide">
            &copy; 2026 &mdash; Built with performance as the primary
            directive.
          </span>
        </div>
      </footer>
    </main>
  );
}
