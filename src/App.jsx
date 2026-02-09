import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useContext } from "react";
import Layout from "./components/Layout/Layout";
import Products from "./components/Products/Products";
import Cart from "./components/Cart/Cart";
import Brands from "./components/Brands/Brands";
import Categories from "./components/Categories/Categories";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Notfound from "./components/Notfound/Notfound";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import ProtectedRoutes from "./components/ProtectedRoutes/Protectedroutes";
import ProtectedAuth from "./components/ProtectedAuth/ProtectedAuth";
import { TokenContext } from "./components/Context/TokenContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import BrandDetails from "./components/brandDetails/brandDetails";
import AllOrders from "./components/AllOrders/AllOrders";
import CheckOut from "./components/CheckOut/CheckOut";
import "./App.css";
import { Toaster } from "react-hot-toast";
function App() {
  const { token } = useContext(TokenContext);
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          ),
        },
        {
          path: "brandsDetails/:id",
          element: (
            <ProtectedRoutes>
              <BrandDetails />
            </ProtectedRoutes>
          ),
        },
        {
          path: "AllOrders",
          element: (
            <ProtectedRoutes>
              <AllOrders />
            </ProtectedRoutes>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoutes>
              <CheckOut />
            </ProtectedRoutes>
          ),
        },
        { path: "products", element: <Products /> },
        {
          path: "cart",
          element: (
            <ProtectedRoutes>
              <Cart />
            </ProtectedRoutes>
          ),
        },
        {
          path: "brands",
          element: (
            <ProtectedRoutes>
              <Brands />
            </ProtectedRoutes>
          ),
        },
        {
          path: "ProductDetails/:id/:categoryName",
          element: (
            <ProtectedRoutes>
              <ProductDetails />
            </ProtectedRoutes>
          ),
        },
        { path: "categories", element: <Categories /> },
        {
          path: "login",
          element: (
            <ProtectedAuth>
              <Login />
            </ProtectedAuth>
          ),
        },
        {
          path: "register",
          element: (
            <ProtectedAuth>
              <Register />
            </ProtectedAuth>
          ),
        },
        { path: "about", element: <About /> },
        { path: "*", element: <Notfound /> },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
