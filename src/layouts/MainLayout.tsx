import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Favorites from "../pages/Favorites";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Upload from "../pages/Upload";
import Orders from "../pages/Orders";
import MyProducts from "../pages/MyProducts";
import AuthPage from "../pages/Auth/AuthPage";
import ProductDetails from "../pages/ProductDetails";

export default function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/anunciar"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meus-anuncios"
            element={
              <ProtectedRoute>
                <MyProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}