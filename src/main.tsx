import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Bani as BaniType, fetchBanis } from "./utils";
import Bani from "./Bani";
import App from "./App";
import { registerSW } from 'virtual:pwa-register'

function Main() {
  const routes = new Array(500).fill(0).map((ele, i) => i)


const updateSW = registerSW({
  onNeedRefresh() {
    alert('ready to download')
  },
  onOfflineReady() {
    alert('ready to use offline')
  },
})

updateSW()


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

