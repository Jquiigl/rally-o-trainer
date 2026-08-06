import { Link } from 'react-router-dom';

export function AppFooter() {
  return <footer className="app-footer">
    <p>© 2026 José María Quirós Iglesias. Desarrollo independiente. Todos los derechos reservados sobre los elementos originales de la aplicación.</p>
    <Link to="/authorship">Autoría y propiedad intelectual</Link>
  </footer>;
}
