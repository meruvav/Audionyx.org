import { Outlet } from 'react-router-dom';
import MarketingNav from '../components/MarketingNav';
import ThemeModeSelect from '../components/ThemeModeSelect';
import VisitorCount from '../components/VisitorCount';

export default function MarketingLayout({ status }) {
  return (
    <div className="site-shell">
      <header className="site-header marketing-header">
        <div className="brand-lockup">
          <p className="brand-mark">Audionyx</p>
          <div>
            <h1>Audionyx</h1>
            <p className="site-tagline">Simple online tone tools, hearing checks, frequency guides, and interactive utility pages.</p>
          </div>
        </div>
        <MarketingNav />
        <div className="header-controls header-controls-inline">
          <ThemeModeSelect />
          <div className="status">{status}</div>
        </div>
      </header>
      <main className="page-frame">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <p className="footer-label">Audionyx</p>
            <p className="footer-copy">
              Practical sound tools and experiments designed with a cleaner product-marketing structure.
            </p>
          </div>
          <div>
            <p className="footer-label">Explore</p>
            <p className="footer-copy">Hearing tests, tone generation, sleep frequencies, calculators, and interactive demos.</p>
          </div>
          <div>
            <p className="footer-label">Support</p>
            <p className="footer-copy">Need help or want to support the project? Visit the support page for details.</p>
          </div>
        </div>
        <VisitorCount />
      </footer>
    </div>
  );
}
