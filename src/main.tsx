import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./utils/route";
import AuthProvider from "react-auth-kit/AuthProvider";
import store from "./utils/reactAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./utils/query";
import "./index.css";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider store={store}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
