import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Bani as BaniType } from "./utils";
import Bani from "./Bani";
import App from "./App";
import { registerSW } from 'virtual:pwa-register'
import { Button, ButtonGroup, Checkbox, Switch, Typography } from "@mui/joy";


function Main() {
  const routes = new Array(500).fill(0).map((ele, i) => i)

  const updateSW = registerSW({
    onOfflineReady() {
      alert('You can now download this App.')
    },
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

