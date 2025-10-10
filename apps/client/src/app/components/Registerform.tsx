// components/RegisterForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { REGISTER_MUTATION } from "@/graphql/auth.gql";
import { useAuth } from "@/lib/hooks/useAuth";
import { RegisterMutationResult } from "@/lib/types/graphql";
import { registerSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { setUser } = useAuth();
  
  const [register, { loading, error }] = useMutation<RegisterMutationResult>(REGISTER_MUTATION);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      const { data } = await register({
        variables: {
          registerInput: {
            email: formData.email,
            password: formData.password,
            name: formData.name || undefined,
           // username: formData.username || undefined,
          }
        }
      });

      console.log("Registration successful:", data);

      if (data?.register?.user) {
        setUser(data.register.user);
        window.location.href = "/login";
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.message.includes("already exists")) {
        setError("email", {
          type: "manual",
          message: "User with this email already exists"
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Registration failed. Please try again."
        });
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md shadow-sm space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...registerField("name")}
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...registerField("email")}
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...registerField("password")}
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Create a password (min. 6 characters)"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...registerField("confirmPassword")}
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Root Error Message */}
      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            <p>{errors.root.message}</p>
          </div>
        </div>
      )}

      {/* GraphQL Error Message */}
      {error && !errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            <p>{error.message}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;