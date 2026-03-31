import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          MercadoTCG
        </Link>

        <nav className="navbar__nav">
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

        <div className="navbar__auth">
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