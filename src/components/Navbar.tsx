import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
//import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MercadoTCG
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
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
            Carrinho ({cartItems.length})
          </NavLink>
        </nav>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Olá, {user?.name}</span>
              <button type="button" className="navbar-button" onClick={logout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/auth" className="navbar-button">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}