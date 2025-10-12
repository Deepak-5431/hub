// components/LoginForm.tsx
"use client";

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

      if (data?.login?.user) {
        setUser(data.login.user);
        window.location.href = "/dashboard";
      }
    } catch (err:unknown) {
     console.log("error is",err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#040714] via-[#071032] to-[#0b0830]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.06)_0%,transparent_30%)]" />

      <div className="relative w-full max-w-md mx-auto px-4">
        <div className="bg-gradient-to-br from-[#071029] via-[#08122a] to-[#0d0720] border border-white/6 rounded-2xl p-6 shadow-2xl ring-1 ring-cyan-600/8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl text-cyan-400 animate-bounce">⚡</div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">Welcome back</h2>
              <p className="text-sm text-slate-400">Sign in to continue </p>
            </div>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@neo.dev"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0f1a] border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-slate-100 shadow-sm placeholder-slate-500 transition"
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0f1a] border border-transparent focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 text-slate-100 shadow-sm placeholder-slate-500 transition"
              />
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <div className="rounded-md bg-rose-900/20 p-3 text-sm text-rose-200">
                {errors.root.message}
              </div>
            )}

            {error && !errors.root && (
              <div className="rounded-md bg-rose-900/20 p-3 text-sm text-rose-200">
                {error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold text-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 hover:scale-[1.02] transform transition disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(59,130,246,0.12)]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-400">
            Dont have an account? <a href="/register" className="text-cyan-300 font-medium hover:underline">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}


export default LoginForm;