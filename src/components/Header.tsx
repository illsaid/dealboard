import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Deal Board' },
    { path: '/buyers', label: 'Buyers' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-100/95 backdrop-blur-sm border-b border-ink-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="text-lg font-bold tracking-tight text-ink-900">THE PICKUP</span>
            <span className="hidden sm:inline text-xs text-ink-400 font-medium">The scoreboard for who's buying entertainment now.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive(item.path)
                    ? 'text-burgundy-700 bg-burgundy-50'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/subscribe"
              className="ml-3 px-4 py-1.5 text-sm font-semibold bg-ink-900 text-cream-50 rounded hover:bg-ink-800 transition-colors"
            >
              Subscribe
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-ink-600 hover:text-ink-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ink-100 bg-cream-50">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded transition-colors ${
                  isActive(item.path)
                    ? 'text-burgundy-700 bg-burgundy-50'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/subscribe"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-burgundy-700"
            >
              Subscribe
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
