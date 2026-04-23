import { NavLink } from 'react-router-dom';
import { marketingRoutes } from '../constants/site';

export default function MarketingNav() {
  return (
    <nav className="marketing-nav" aria-label="Primary">
      {marketingRoutes.map((route) => (
        <NavLink
          key={route.path}
          className={({ isActive }) => `marketing-link${isActive ? ' active' : ''}`}
          to={route.path}
        >
          {route.label}
        </NavLink>
      ))}
    </nav>
  );
}
