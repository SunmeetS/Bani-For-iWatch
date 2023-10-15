import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Bani as BaniType, fetchBanis } from "./utils";
import Bani from "./Bani";
import App from "./App";

function Main() {
  const routes = new Array(500).fill(0).map((ele, i) => i)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    ...routes.map((bani) => ({
      path: `/${bani}`,
      element: <Bani id={bani} />
    }))
  ]);

  return (
    <RouterProvider router={router} />
  );
}

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(<Main />);

