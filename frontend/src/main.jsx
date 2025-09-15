import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import DomesticResultsPage from "./pages/DomesticResultsPage";
import OverseasResultsPage from "./pages/OverseasResultsPage";

import "./styles/globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/Login", element: <Login /> },
      { path: "/oauth/callback", element: <OAuthCallback /> },
      { path: "/domestic", element: <DomesticResultsPage /> },
      { path: "/overseas", element: <OverseasResultsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
