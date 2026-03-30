import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          MercadoTCG
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>

          <NavLink
            to="/favoritos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Favoritos
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/anunciar"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Anunciar
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to="/meus-anuncios"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Meus anúncios
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to="/pedidos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Pedidos
            </NavLink>
          )}

          <NavLink
            to="/carrinho"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Carrinho ({totalItems})
          </NavLink>
        </nav>

        <div className="navbar-user">
          {isAuthenticated ? (
            <>
              <span>Olá, {user?.name}</span>
              <button type="button" onClick={logout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/auth">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}