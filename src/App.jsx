import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Layouts from "./Layouts/Layouts";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import AdminLogin from "./pages/AdminLogin";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/CartContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLayout from "./Layouts/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ProductListing from "./pages/Admin/ProductListing";
import ProductEdit from "./pages/Admin/ProductEdit";
import ProductUpload from "./pages/Admin/ProductUpload";
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
          <AdminLayout />
        </ProtectedAdminRoute>
      ),
      children: [
        {
          index: true,

          element: <ProductListing />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: 'upload',
          element: <ProductUpload />
        },
        {
          path: 'edit/:id',
          element: <ProductEdit />
        }
      ],
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
