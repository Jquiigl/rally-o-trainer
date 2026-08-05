import { NavLink, Outlet } from 'react-router-dom';

const items = [
  { to: '/', icon: '⌂', label: 'Inicio' },
  { to: '/train', icon: '▶', label: 'Entrenar' },
  { to: '/signals', icon: '▤', label: 'Señales' },
  { to: '/progress', icon: '↗', label: 'Progreso' }
];

export function AppShell() {
  return <div className="app-shell">
    <header className="topbar">
      <NavLink to="/" className="brand" aria-label="Rally O Trainer, inicio">
        <img src="./brand-symbol.svg" alt="" />
        <span>Rally O Trainer</span>
      </NavLink>
      <NavLink to="/dogs" className="icon-button" aria-label="Perros y configuración">●</NavLink>
    </header>
    <main className="page"><Outlet /></main>
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'}>
        <span aria-hidden="true">{item.icon}</span><small>{item.label}</small>
      </NavLink>)}
    </nav>
  </div>;
}
