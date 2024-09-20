import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { registerUserValidation } from "../../validation/authValidation";
import { useMutation } from "@tanstack/react-query";
import { Register as userRegister } from "../../service/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatJoiErrors } from "../../utils/joi";

interface authProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Register({ setIsLogin }: authProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConfirmPasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const openLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLogin(true);
  };

  const handlePreventAction = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const mutation = useMutation({
    mutationFn: userRegister,
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      setIsLogin(true);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          const formattedErrors = formatJoiErrors(error.response?.data);
          setError("username", formattedErrors.username);
          setError("password", formattedErrors.password);
          setError("confirmPassword", formattedErrors.confirmPassword);
        } else {
          const errorMessage = error.response?.data?.message || "An unknown error occurred";
          toast.error(errorMessage);
        }
      } else {
        console.log(error.message);
      }
    },
  });

  type registerUserType = z.infer<typeof registerUserValidation>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<registerUserType>({
    resolver: zodResolver(registerUserValidation),
  });
  const onSubmit: SubmitHandler<registerUserType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto">
        <h3 className="mx-auto font-bold text-2xl mt-5">Register</h3>
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="username"
              className={`input input-bordered ${
                errors.password?.message && "input-bordered input-error"
              }`}
              disabled={mutation.isPending ? true : false}
              {...register("username")}
              required
            />
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
                onCopy={handlePreventAction}
                onCut={handlePreventAction}
                onPaste={handlePreventAction}
                className="grow"
                placeholder="password"
                disabled={mutation.isPending ? true : false}
                {...register("password")}
              />
              <button onClick={togglePasswordVisibility}>
                {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </button>
            </label>
            <div className="label">
              <span className="label-text-alt text-red-500">{errors.password?.message}</span>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirmation Password</span>
            </label>
            <label
              className={`input input-bordered flex items-center gap-2 ${
                errors.confirmPassword?.message && "input-bordered input-error"
              }`}
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="grow"
                placeholder="confirmation password"
                disabled={mutation.isPending ? true : false}
                {...register("confirmPassword")}
              />
              <button onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </button>
            </label>
            <div className="label">
              <span className="label-text-alt text-red-500">{errors.confirmPassword?.message}</span>
            </div>
            <label className="label">
              <button className="label-text-alt link link-hover" onClick={openLogin}>
                Already have an account?
              </button>
            </label>
          </div>
          <div className="form-control mt-6">
            <button className={`btn btn-primary ${mutation.isPending && "btn-disabled"}`}>
              {mutation.isPending && <span className="loading loading-spinner"></span>}
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
