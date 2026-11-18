
import { NavLink } from 'react-router-dom';

const links = [
  { path: '/rates', label: 'Курсы валют' },
  { path: '/converter', label: 'Конвертация' },
  { path: '/history', label: 'История' },
  { path: '/sync', label: 'Синхронизация' },
];

function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/rates" className="brand">
          <span className="brand-icon">₸</span>
          <span>KZ <strong>Exchange</strong></span>
        </NavLink>

        <nav className="site-navigation" aria-label="Главная навигация">
          {links.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navigation-link${isActive ? ' active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
