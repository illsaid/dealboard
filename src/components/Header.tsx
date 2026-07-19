import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Brief' },
    { path: '/deals', label: 'Deal Board' },
    { path: '/buyers', label: 'Buyers' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-50 border-b border-ink-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="text-xl font-extrabold tracking-tight text-ink-900 font-display">THE PICKUP</span>
            <span className="hidden lg:inline text-xs text-ink-500 font-medium">
              The scoreboard for who's buying entertainment now.
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive(item.path)
                    ? 'text-inkred'
                    : 'text-ink-700 hover:text-inkred'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/subscribe"
              className="ml-2 px-4 py-2 text-sm font-bold uppercase tracking-wide bg-ink-900 text-cream-50 hover:bg-inkred transition-colors"
            >
              Subscribe
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-ink-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ink-300 bg-cream-50">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive(item.path)
                    ? 'text-inkred'
                    : 'text-ink-700 hover:text-inkred'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/subscribe"
              onClick={() => setMobileOpen(false)}
              className="inline-block mt-2 px-4 py-2 text-sm font-bold uppercase tracking-wide bg-ink-900 text-cream-50"
            >
              Subscribe
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
