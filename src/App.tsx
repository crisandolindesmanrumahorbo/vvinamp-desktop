import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./Homepage";

import ExternalPage from "./External";
import Product from "./Product";
import Login from "./Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/external",
    element: <ExternalPage />,
  },
  {
    path: "/products/:category/:productId",
    element: <Product />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
