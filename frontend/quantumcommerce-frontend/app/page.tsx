import React from 'react';

export default function Home() {
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
            Quantum Commerce
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light">
            A high-performance e-commerce platform built using the modern web stack.
          </p>
        </section>

        <hr className="border-slate-800" />

        {/* Tech Stack List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-l-4 border-blue-500 pl-4">
            System Architecture & Technologies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors group"
              >
                <h3 className="text-blue-400 font-bold group-hover:text-blue-300">
                  {tech.name}
                </h3>
                <p className="text-sm text-slate-500 italic">
                  {tech.category}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-12 text-center text-slate-600 text-sm">
          Built with performance as the primary directive.
        </footer>
      </div>
    </main>
  );
};