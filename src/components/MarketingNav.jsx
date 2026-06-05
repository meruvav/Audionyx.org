import { NavLink, useLocation } from 'react-router-dom';
import { marketingNavGroups } from '../constants/site';

export default function MarketingNav() {
  const location = useLocation();

  return (
    <nav className="marketing-nav" aria-label="Primary">
      {marketingNavGroups.map((item) => {
        if (item.path) {
          return (
            <NavLink
              key={item.path}
              className={({ isActive }) => `marketing-link${isActive ? ' active' : ''}`}
              to={item.path}
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          );
        }

        const isGroupActive = item.links.some((route) => route.path === location.pathname);

        return (
          <div className="marketing-group" key={item.label}>
            <button type="button" className={`marketing-group-trigger${isGroupActive ? ' active' : ''}`}>
              {item.label}
            </button>
            <div className="marketing-subnav">
              {item.links.map((route) => (
                <NavLink
                  key={route.path}
                  className={({ isActive }) => `marketing-subnav-link${isActive ? ' active' : ''}`}
                  to={route.path}
                >
                  {route.label}
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
