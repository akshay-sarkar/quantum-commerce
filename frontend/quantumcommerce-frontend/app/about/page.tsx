import Link from 'next/link';

const techStack = [
  { name: 'Next.js', category: 'Frontend / SSR & SSG' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'GraphQL', category: 'API Layer' },
  { name: 'Node.js', category: 'Backend Runtime' },
  { name: 'MongoDB', category: 'NoSQL Database' },
  { name: 'Docker', category: 'Containerization' },
  { name: 'AWS EC2', category: 'Cloud Deployment' },
  { name: 'GitHub Actions', category: 'CI/CD Pipeline' },
  { name: 'Vercel', category: 'Frontend Hosting' },
];

const architecture = [
  {
    label: 'API',
    detail: 'GraphQL via Apollo Server, deployed on AWS EC2 inside Docker',
  },
  {
    label: 'Frontend',
    detail: 'Next.js App Router with SSR/SSG, auto-deployed on Vercel',
  },
  {
    label: 'Database',
    detail: 'MongoDB Atlas with Mongoose ODM',
  },
  {
    label: 'CI/CD',
    detail:
      'GitHub Actions auto-builds Docker images, pushes to Docker Hub, and deploys to EC2 via SSH',
  },
];

const specialties = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Docker',
  'AWS',
];

const authorLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/akshay-sarkar',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/akshaysarkaruta/',
  },
  {
    label: 'Portfolio',
    href: 'https://akshay-sarkar.github.io/akshaysarkar/',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-qc-bg text-qc-text overflow-x-hidden transition-colors duration-300">
      {/* ═══ HERO / INTRO ═══ */}
      <section className="relative px-6 py-24 md:py-36 overflow-hidden">
        <div className="qc-grid absolute inset-0" />
        <div className="qc-orb-1 opacity-40" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <span
              className="qc-up text-qc-accent tracking-[0.3em] uppercase text-xs font-medium"
              style={{ animationDelay: '100ms' }}
            >
              About
            </span>
            <h1
              className="qc-up font-display mt-4 tracking-[-0.02em]"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                animationDelay: '250ms',
              }}
            >
              Quantum Commerce
            </h1>
            <p
              className="qc-up mt-6 text-qc-muted text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ animationDelay: '400ms' }}
            >
              A full-stack e-commerce platform engineered from the ground up to
              demonstrate modern web development and DevOps practices.
              From a GraphQL API running in Docker on AWS to a server-rendered
              Next.js frontend on Vercel &mdash; every layer is built with
              performance as the primary directive.
            </p>
            <p
              className="qc-up mt-4 text-qc-muted text-sm leading-relaxed max-w-2xl"
              style={{ animationDelay: '550ms' }}
            >
              This project serves as a portfolio piece showcasing end-to-end
              ownership: architecture design, authentication, CI/CD pipelines,
              containerized deployments, and a cohesive design system with
              dark/light theming.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <div className="max-w-6xl mx-auto h-px bg-linear-to-r from-transparent via-qc-accent-faint to-transparent" />

      {/* ═══ TECH STACK ═══ */}
      <section className="px-6 py-24 md:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:mb-20">
            <span className="text-qc-accent tracking-[0.3em] uppercase text-xs font-medium">
              The Stack
            </span>
            <h2
              className="font-display mt-4 tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              Built With
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="qc-card border border-qc-border p-5 md:p-6 flex items-baseline justify-between gap-4"
              >
                <h3 className="text-qc-accent font-medium tracking-tight">
                  {tech.name}
                </h3>
                <span className="text-xs text-qc-muted italic shrink-0">
                  {tech.category}
                </span>
              </div>
            ))}
          </div>

          {/* Architecture highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {architecture.map((item) => (
              <div key={item.label}>
                <h3 className="text-sm font-medium text-qc-text tracking-wide uppercase">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm text-qc-muted leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <div className="max-w-6xl mx-auto h-px bg-linear-to-r from-transparent via-qc-accent-faint to-transparent" />

      {/* ═══ AUTHOR ═══ */}
      <section className="px-6 py-24 md:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 md:mb-20">
            <span className="text-qc-accent tracking-[0.3em] uppercase text-xs font-medium">
              The Builder
            </span>
            <h2
              className="font-display mt-4 tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              Akshay Sarkar
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-qc-muted text-base md:text-lg leading-relaxed">
              A builder of things, with a little help from AI. With 12+ years
              of experience in the digital realm, Akshay has had his hands in
              web, cloud, and full-stack technologies &mdash; specializing in
              JavaScript and modern tooling.
            </p>
            <p className="mt-4 text-qc-muted text-sm">
              Based in Irving, Texas.
            </p>

            {/* Specialties */}
            <div className="mt-8 flex flex-wrap gap-3">
              {specialties.map((skill) => (
                <span
                  key={skill}
                  className="border border-qc-border text-qc-muted text-xs tracking-wide uppercase px-3 py-1.5"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="mt-10 flex flex-wrap gap-8">
              {authorLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-qc-accent hover:text-qc-accent-hover transition-colors duration-300 flex items-center gap-2"
                >
                  {link.label}
                  <span className="text-xs">&rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
