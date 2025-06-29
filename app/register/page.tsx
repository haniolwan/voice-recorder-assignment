"use client";
import Link from "next/link";
import { useState } from "react";
import Input from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { registerUserApiHandler } from "./utils/registerUserApiHandler";
import { useRouter } from "next/navigation";
import Button from "../components/Button";

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export const emptyUser: NewUser = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  type Errors = { [key in keyof typeof newUser]?: string };

  const [newUser, setNewUser] = useState<NewUser>(emptyUser);
  const [errors, setErrors] = useState<Errors>({});
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    const { name: newName, email: newEmail, password: newPassword } = newUser;

    if (!newName.trim()) newErrors.name = "Enter name";

    if (!newEmail.trim()) newErrors.email = "Enter a valid email";

    if (!newPassword) newErrors.password = "Enter a valid password";

    setErrors(prevErrs => ({ ...prevErrs, ...newErrors }));

    if (Object.keys(newErrors).length > 0) return;

    setLoadingSubmit(true);

    const response = await registerUserApiHandler(
      newName,
      newEmail,
      newPassword
    );
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
        <h1 className="text-3xl text-gray-900 font-semibold mb-8">Register</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 min-md:mt-5">
            <label className="text-sm-responsive font-semibold text-gray-700">
              Full name
            </label>
            <Input
              id="name"
              value={newUser.name}
              handleInputChange={e => handleInputChange("name", e.target.value)}
              error={errors.name}
              placeholder="Enter name"
              type="text"
              ariaLabel="Fullname"
            />
          </div>
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
          <Button
            type="submit"
            label={loadingSubmit ? <LoadingSpinner /> : "Sign up"}
          />
          <div className="flex text-sm justify-center">
            <p className="text-sm text-gray-600 mr-1 font-medium">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="text-sm text-primary-purple-700 font-medium"
            >
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
export default Register;
