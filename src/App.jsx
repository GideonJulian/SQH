import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Layouts from "./Layouts/Layouts";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
const App = () => {
  const route = createBrowserRouter([
    {
      path: "/checkout",
      element: <Checkout />,
    },
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedAdminRoute>
          <Admin />
        </ProtectedAdminRoute>
      ),
    },
    {
      path: "/",
      element: <Layouts />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/shop",
          element: <Shop />,
        },
        {
          path: "/product/:productId",
          element: <ProductDetail />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
      ],
    },
  ]);

  return (
    <CartProvider>
      <RouterProvider router={route} />
    </CartProvider>
  );
};

export default App;
