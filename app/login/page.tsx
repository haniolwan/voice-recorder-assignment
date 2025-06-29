"use client";
import Link from "next/link";
import { useState } from "react";
import Input from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { loginUserApiHandler } from "./utils/loginUserApiHandler";
import { useRouter } from "next/navigation";

export type User = {
  id?: string | number;
  name?: string;
  email: string;
  password: string;
};

export const emptyUser: User = {
  email: "",
  password: "",
};

const Login = () => {
  const [newUser, setNewUser] = useState<User>(emptyUser);
  const [errors, setErrors] = useState<Errors>({});
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  type Errors = { [key in keyof typeof newUser]?: string };

  const handleInputChange = (
    field: keyof typeof newUser,
    value: string | number
  ) => {
    setNewUser(prev => ({ ...prev, [field]: value }));

    setErrors(prevErrors => {
      const { [field]: removedError, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const onCloseEmptyStates = () => {
    setNewUser(emptyUser);
    setErrors({});
    setLoadingSubmit(false);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    const { email: newEmail, password: newPassword } = newUser;

    if (!newEmail.trim()) newErrors.email = "Enter a valid email";

    if (!newPassword) newErrors.password = "Enter a valid password";

    setErrors(prevErrs => ({ ...prevErrs, ...newErrors }));

    if (Object.keys(newErrors).length > 0) return;

    setLoadingSubmit(true);
    const response = await loginUserApiHandler(newEmail, newPassword);
    if (response.success) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      router.push("/");
      onCloseEmptyStates();
    } else {
      setErrors(prev => ({
        ...prev,
        email: response.message || "Registration failed",
      }));
    }
    setLoadingSubmit(false);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <h1 className="text-3xl text-gray-900 font-semibold mb-8">Login</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 min-md:mt-5">
            <label className="text-sm-responsive font-semibold text-gray-700">
              Email address
            </label>
            <Input
              id="email"
              value={newUser.email}
              handleInputChange={e =>
                handleInputChange("email", e.target.value)
              }
              error={errors.email}
              placeholder="Enter email address"
              type="email"
              autoComplete="off"
              ariaLabel="Email address"
            />
          </div>
          <div className="mt-4 min-md:mt-5">
            <label className="text-sm-responsive font-semibold text-gray-700">
              Password
            </label>
            <Input
              id="password"
              value={newUser.password}
              handleInputChange={e =>
                handleInputChange("password", e.target.value)
              }
              error={errors.password}
              placeholder="Enter password"
              type="password"
              autoComplete="off"
              ariaLabel="Password"
            />
          </div>
          <Link
            href="/forgot-password"
            className="text-primary-purple-700 text-sm font-semibold mb-6 block"
          >
            Forgot Password?
          </Link>
          <button
            className="flex items-center justify-center font-semibold w-full h-[44px] px-[18px] py-[10px] gap-2 rounded-lg mb-6 text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-800"
            type="submit"
          >
            {loadingSubmit ? <LoadingSpinner /> : "Sign in"}
          </button>
          <div className="flex text-sm justify-center">
            <p className="text-sm text-gray-600 mr-1 font-medium">
              Don't have an account?
            </p>
            <Link
              href="/register"
              className="text-sm text-primary-purple-700 font-medium"
            >
              Get started now
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
export default Login;
