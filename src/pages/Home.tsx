import { useEffect, useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

export default function Home() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left flex-1">
            <h1 className="text-5xl font-bold">todolist app</h1>
            <p className="py-6 max-w-xl px-auto">
              Stay organized, boost productivity, and accomplish more with ease—your tasks,
              simplified.
            </p>
          </div>
          <div className="flex-1">
            {isLogin ? <Login setIsLogin={setIsLogin} /> : <Register setIsLogin={setIsLogin} />}
          </div>
        </div>
      </div>
    </>
  );
}
