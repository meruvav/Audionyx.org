import { NavLink } from 'react-router-dom';
import { marketingRoutes } from '../constants/site';

export default function MarketingNav() {
  const primaryRoutes = marketingRoutes.filter((route) => !['/motion-trace', '/right-angle-growth'].includes(route.path));

  return (
    <nav className="marketing-nav" aria-label="Primary">
      {primaryRoutes.map((route) => (
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
