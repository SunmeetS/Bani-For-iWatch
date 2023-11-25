import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { registerSW } from 'virtual:pwa-register'


function Main() {
  const updateSW = registerSW({
    onOfflineReady() {},
  })

  updateSW()


  const router = createBrowserRouter([
    {
      path: "*",
      element: <App />
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(<Main />);

