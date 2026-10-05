import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import RootLayout from "./layouts/RootLayout/RootLayout.jsx";
import ClientError from "./layouts/ClientError/ClientError.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import StartGame from "./components/StartGame/StartGame.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    ErrorBoundary: ClientError,
    children: [
      { index: true, element: <App /> },
      {
        path: "levels/:levelId",
        element: <StartGame />,
      },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
