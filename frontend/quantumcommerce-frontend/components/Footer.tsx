const Footer = () => {
    return (
      <footer className="px-6 py-12 border-t border-qc-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-display text-lg tracking-tight">
            Quantum Commerce
          </span>
          <span className="text-xs text-qc-muted tracking-wide">
            &copy; 2026 &mdash; Built with performance as the primary
            directive.
          </span>
        </div>
      </footer>
    );
};

export default Footer;