import { z } from "zod";
import { PublicInstance } from "./service";
import { loginUserValidation, registerUserValidation } from "../validation/auth-validation";

type LoginType = z.infer<typeof loginUserValidation>;
type RegisterType = z.infer<typeof registerUserValidation>;

const Login = async (data: LoginType) => {
  const result = await PublicInstance("/api/login", {
    data,
    method: "post",
  });

  return result;
};
const Register = async (data: RegisterType) => {
  const result = await PublicInstance("/api/register", {
    data,
    method: "post",
  });
  return result;
};

export { Login, Register };
