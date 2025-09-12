import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
