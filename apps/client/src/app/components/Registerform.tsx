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
          }
        }
      });

      if (data?.register?.user) {
        setUser(data.register.user);
        window.location.href = "/login";
      }
    } catch (err:unknown) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#030417] via-[#061022] to-[#08010f] relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <svg className="w-full h-full opacity-10" viewBox="0 0 600 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Radial neon glows */}
      <div className="absolute -z-10 inset-0">
        <div className="absolute -left-40 -top-24 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl animate-pulse" />
        <div className="absolute -right-28 -bottom-20 w-80 h-80 rounded-full bg-purple-600/8 blur-3xl animate-pulse delay-1500" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-8 w-2 h-2 bg-cyan-300 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-24 right-28 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-50 animate-pulse" />
        <div className="absolute bottom-32 left-1/2 w-1.5 h-1.5 bg-white/30 rounded-full opacity-40 animate-pulse" />
      </div>

      {/* Card (kept existing card styles) */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="bg-gradient-to-br from-[#071029] via-[#08122a] to-[#0d0720] border border-white/6 rounded-2xl p-6 shadow-2xl ring-1 ring-cyan-600/8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl transform-gpu text-cyan-400 animate-bounce">⚡</div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">Create your account</h2>
            </div>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Full Name</label>
              <input
                id="name"
                type="text"
                {...registerField("name")}
                placeholder="Kohana Sakura"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0f1a] border border-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-slate-100 shadow-sm placeholder-slate-500 transition"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <input
                id="email"
                type="email"
                {...registerField("email")}
                placeholder="you@neo.dev"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0f1a] border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-slate-100 shadow-sm placeholder-slate-500 transition"
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                id="password"
                type="password"
                {...registerField("password")}
                placeholder="Create a secure password"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0f1a] border border-transparent focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 text-slate-100 shadow-sm placeholder-slate-500 transition"
              />
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...registerField("confirmPassword")}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-lg bg-[#0b0f1a] border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-300/20 text-slate-100 shadow-sm placeholder-slate-500 transition"
              />
              {errors.confirmPassword && <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword.message}</p>}
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
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-400">
            Already have an account? <a href="/login" className="text-cyan-300 font-medium hover:underline">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;