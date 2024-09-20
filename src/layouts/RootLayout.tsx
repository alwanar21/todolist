import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

export default function RootLayout() {
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated) {
    return <Dashboard />;
  } else {
    return <Home />;
  }
}
