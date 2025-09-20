import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import ResultsPage from "./pages/ResultsPage";
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

      // ResultsPage를 재사용
      {
        path: "/domestic",
        element: <ResultsPage type="domestic" title="국내 숙소" />,
      },
      {
        path: "/overseas",
        element: <ResultsPage type="overseas" title="해외 숙소" />,
      },

      // 상세 페이지
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
