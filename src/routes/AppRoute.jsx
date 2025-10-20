import { DataProvider } from "@/contexts/dataContext";
import MainLayout from "@/layouts/MainLayout";
import DataSheet from "@/pages/DataSheet";
import Home from "@/pages/Home";
import SlideRport from "@/pages/SlideRport";
import TemplateManager from "@/pages/TemplateManager";
import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/data-sheet",
        element: <DataSheet />,
      },
      {
        path: "/slide-report",
        element: <SlideRport />,
      },
    ],
  },
  {
    path: "/template-manager",
    element: <TemplateManager />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

function AppRoute() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}

export default AppRoute;
