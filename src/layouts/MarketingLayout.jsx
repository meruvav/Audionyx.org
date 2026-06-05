import { Outlet } from 'react-router-dom';
import MarketingNav from '../components/MarketingNav';
import ThemeModeSelect from '../components/ThemeModeSelect';
import VisitorCount from '../components/VisitorCount';

export default function MarketingLayout({ status }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div>
          <h1>AUDIONYX LABS</h1>
          <p className="site-tagline">Free hearing tests, tone generators, and audio frequency tools.</p>
        </div>
        <div className="header-controls">
          <ThemeModeSelect />
          <div className="status">{status}</div>
        </div>
      </header>
      <MarketingNav />
      <main className="page-frame">
        <Outlet />
      </main>
      <footer className="site-footer">
        <strong>Audionyx Labs</strong>
        <span>Measure. Hear. Understand.</span>
      </footer>
      <VisitorCount />
    </div>
  );
}
