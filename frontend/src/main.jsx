import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import DomesticResultsPage from "./pages/DomesticResultsPage";
import OverseasResultsPage from "./pages/OverseasResultsPage";
import AccommodationDetailPage from "./pages/Accommodation-DetailPage";
import { HeaderProvider } from "./contexts/HeaderContext";

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
      { path: "/login", element: <Login /> },
      { path: "/oauth/callback", element: <OAuthCallback /> },
      { path: "/domestic", element: <DomesticResultsPage /> },
      { path: "/overseas", element: <OverseasResultsPage /> },
      { path: "/domestic/:id", element: <AccommodationDetailPage /> },
      { path: "/overseas/:id", element: <AccommodationDetailPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <HeaderProvider>
    <RouterProvider router={router} />
  </HeaderProvider>
);
