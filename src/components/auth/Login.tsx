import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUserValidation } from "../../validation/auth-validation";
import { Login as userLogin } from "../../service/auth-service";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatZodErrors } from "../../utils/zodError";

interface authProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({ setIsLogin }: authProps) {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const openRegister = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLogin(false);
  };

  const loginMutation = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      if (
        signIn({
          auth: {
            token: data?.data?.token,
            type: "Bearer",
          },
          userState: data?.data?.data,
        })
      ) {
        navigate("/dashboard");
        toast.success(`Welcome, ${data?.data?.data.username}!`);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          const formattedErrors = formatZodErrors(error.response?.data);
          setError("username", formattedErrors.username);
          setError("password", formattedErrors.password);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
        }
      }
    },
  });

  type loginUserType = z.infer<typeof loginUserValidation>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<loginUserType>({
    resolver: zodResolver(loginUserValidation),
  });
  const onSubmit: SubmitHandler<loginUserType> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto">
        <h3 className="mx-auto font-bold text-2xl mt-5">Login</h3>
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <label
              className={`input input-bordered flex items-center gap-2 ${
                errors.username?.message && "input-bordered input-error"
              }`}
            >
              <input
                type="text"
                placeholder="username"
                className="grow"
                disabled={loginMutation.isPending ? true : false}
                {...register("username")}
              />
            </label>
            <div className="label">
              <span className="label-text-alt text-red-500">{errors.username?.message}</span>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <label
              className={`input input-bordered flex items-center gap-2 ${
                errors.password?.message && "input-bordered input-error"
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="********"
                disabled={loginMutation.isPending ? true : false}
                {...register("password")}
              />
              <button onClick={togglePasswordVisibility}>{showPassword ? <IoIosEyeOff /> : <IoIosEye />}</button>
            </label>
            <div className="label">
              <span className="label-text-alt text-red-500">{errors.password?.message}</span>
            </div>
            <label className="label">
              <button className="label-text-alt link link-hover" onClick={openRegister}>
                Don't have account?
              </button>
            </label>
          </div>
          <div className="form-control mt-6">
            <button className={`btn btn-primary ${loginMutation.isPending && "btn-disabled"}`}>
              {loginMutation.isPending && <span className="loading loading-spinner"></span>}
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
