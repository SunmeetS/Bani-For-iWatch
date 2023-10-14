import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Banis from "./Banis";
import { Bani as BaniType, fetchBanis } from "./utils";
import Bani from "./Bani";

function App() {
  const [banis, setBanis] = React.useState<Array<BaniType>>([]);

  React.useEffect(() => {
    fetchBanis().then((res) => setBanis([...res]));
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Banis />
    },
    ...banis.map((bani) => ({
      path: `/${bani.ID}`,
      element: <Bani id={bani.ID} />
    }))
  ]);
  console.log(router)

  return (
    <RouterProvider router={router} />
  );
}

const rootElement = document.getElementById("root");

createRoot(rootElement).render(<App />);

