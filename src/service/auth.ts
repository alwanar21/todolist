import { PublicInstance } from "../utils/axios";

type Login = {
  username: string;
  password: string;
};

type Register = {
  username: string;
  password: string;
  confirmPassword: string;
};

const Login = async (data: Login) => {
  const result = await PublicInstance("/api/login", {
    data,
    method: "post",
  });

  return result;
};
const Register = async (data: Register) => {
  const result = await PublicInstance("/api/register", {
    data,
    method: "post",
  });
  return result;
};

export { Login, Register };
