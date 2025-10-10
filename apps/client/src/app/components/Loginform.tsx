// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/graphql/auth.gql";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoginMutationResult } from "@/lib/types/graphql";
import { loginSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { setUser } = useAuth();
  
  const [login, { loading, error }] = useMutation<LoginMutationResult>(LOGIN_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (formData: LoginFormData) => {
    try {
      const { data } = await login({
        variables: {
          loginInput: {
            email: formData.email,
            password: formData.password
          }
        }
      });

      console.log("Login successful:", data);

      if (data?.login?.user) {
        setUser(data.login.user);
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      if (err.message.includes("Invalid credentials")) {
        setError("root", {
          type: "manual",
          message: "Invalid email or password"
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Login failed. Please try again."
        });
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

      
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            <p>{errors.root.message}</p>
          </div>
        </div>
      )}

      {error && !errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            <p>{error.message}</p>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;