import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

//layouts

//pages
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route element={<AuthOutlet fallbackPath="/" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
