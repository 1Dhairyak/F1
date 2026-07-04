import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="vg-app">
      <div className="vg-ambient">
        <span className="glow-1" />
        <span className="glow-2" />
      </div>

      <header className="vg-nav vg-enter">
        <Link to="/" className="vg-nav-brand" onClick={closeMenu}>F1 Intelligence</Link>

        <nav className="vg-nav-links">
          <Link to="/" className={isActive("/") ? "active" : ""}>Dashboard</Link>
          <Link to="/compare" className={isActive("/compare") ? "active" : ""}>Compare</Link>
        </nav>

        <button
          type="button"
          className={`vg-nav-toggle${menuOpen ? " open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {menuOpen && (
        <div className="vg-nav-mobile vg-enter" role="navigation">
          <Link to="/" className={isActive("/") ? "active" : ""} onClick={closeMenu}>Dashboard</Link>
          <Link to="/compare" className={isActive("/compare") ? "active" : ""} onClick={closeMenu}>Compare Drivers</Link>
        </div>
      )}

      {children}

      <footer className="vg-footer">
        © 2025 F1 Intelligence · Crystalline Precision Engineering
      </footer>
    </div>
  );
}
