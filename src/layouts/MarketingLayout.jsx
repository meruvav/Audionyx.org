import { Outlet } from 'react-router-dom';
import MarketingNav from '../components/MarketingNav';
import ThemeModeSelect from '../components/ThemeModeSelect';
import VisitorCount from '../components/VisitorCount';

export default function MarketingLayout({ status }) {
  return (
    <div className="site-shell">
      <aside className="site-sidebar">
        <MarketingNav />
        <div className="sidebar-meta">
          <div className="status status-pill">{status}</div>
          <ThemeModeSelect />
          <VisitorCount />
        </div>
      </aside>
      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}
