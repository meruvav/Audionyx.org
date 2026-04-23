import { NavLink, useLocation } from 'react-router-dom';

const primaryLinks = [
  { href: '/#home', label: 'Home', matchHash: '#home' },
  { href: '/#features', label: 'Features', matchHash: '#features' },
  { href: '/#faq', label: 'How to use / FAQs', matchHash: '#faq' },
  { href: '/#install', label: 'Install', matchHash: '#install' },
  { href: '/#contact', label: 'Contact Us', matchHash: '#contact' },
];

const utilityRoutes = [
  { path: '/tools', label: 'Tool Dashboard' },
  { path: '/tone-generator', label: 'Tone Generator' },
  { path: '/hearing-test', label: 'Hearing Test' },
  { path: '/frequency-guide', label: 'Frequency Guide' },
];

export default function MarketingNav() {
  const location = useLocation();
  const currentHash = location.hash || '#home';

  return (
    <nav className="marketing-nav" aria-label="Primary">
      <a className="brand-lockup" href="/#home" aria-label="Audionyx home">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-wave brand-wave-a" />
          <span className="brand-wave brand-wave-b" />
          <span className="brand-wave brand-wave-c" />
        </div>
        <div className="brand-copy">
          <strong>Audionyx</strong>
          <span>Audio tools, laid out clearly.</span>
        </div>
      </a>

      <div className="nav-group">
        {primaryLinks.map((link) => {
          const isActive = location.pathname === '/' && currentHash === link.matchHash;

          return (
            <a
              key={link.href}
              className={`marketing-link${isActive ? ' active' : ''}`}
              href={link.href}
            >
              {link.label}
            </a>
          );
        })}
      </div>

      <div className="nav-secondary">
        <p>Open tools</p>
        {utilityRoutes.map((route) => (
          <NavLink
            key={route.path}
            className={({ isActive }) => `utility-link${isActive ? ' active' : ''}`}
            to={route.path}
          >
            {route.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
