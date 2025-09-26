import { createRoot } from "react-dom/client";
import "./index.css";
import { Root } from "./Root.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./pages/Landingpage.tsx";
import { Providers } from "./providers"; // Import Providers
import { MarketFullPage } from "./pages/MarketFullPage.tsx";

const partnerId = "8a222988-f7f8-42d3-9b39-543d93d6fb16";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/home",
    element: <Root />,
  },
  {
    // New dynamic route for the full-page view
    path: "/market/:marketId",
    element: <MarketFullPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <Providers partnerId={partnerId}>
    <RouterProvider router={router} />
  </Providers>
);

// @ts-expect-error This is a workaround to fix the issue with BigInt values not being serialized correctly
BigInt.prototype.toJSON = function () {
  return this.toString();
};
