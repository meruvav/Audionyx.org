import { Outlet } from 'react-router-dom';
import MarketingNav from '../components/MarketingNav';
import ThemeModeSelect from '../components/ThemeModeSelect';
import VisitorCount from '../components/VisitorCount';

export default function MarketingLayout({ status }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div>
          <h1>Audionyx</h1>
          <p className="site-tagline">Simple online tone tools, hearing checks, and practical frequency pages.</p>
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
      <VisitorCount />
    </div>
  );
}
