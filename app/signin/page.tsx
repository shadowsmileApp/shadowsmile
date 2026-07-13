"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.onboarding_complete) {
        router.push("/");
      } else {
        router.push("/onboarding");
      }
    }

    checkUser();
  }, [router]);

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  async function submit() {
    try {
  setLoading(true);
  setErrorMessage("");
  setSuccessMessage("");

  const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
  setErrorMessage(error.message);
  return;
}

      const currentUser = data.user;

      if (!currentUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profile?.onboarding_complete) {
        router.push("/");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
  console.error(err);
  setErrorMessage("Something went wrong.");
} finally {
      setLoading(false);
    }
  }

  return (
  <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] px-4 py-8 sm:px-6">

      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: "url('/BlackMaltra.png')",
          filter: "brightness(0.8) contrast(1.1)",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/50 backdrop-blur-3xl shadow-2xl p-6 sm:p-8 md:p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
  Black{" "}
  <span className="text-emerald-400">
    Maltra
  </span>
</h1>

          <p className="mt-3 text-sm text-gray-400 italic px-2">
            Enter As You Are.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
         >

        <input
          id="email"
          name="email"
          autoComplete="email"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder:text-gray-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 mb-3"
        />

        <div className="relative mb-2">
  <input
    id="password"
    name="password"
    autoComplete="current-password"
    placeholder="Password"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 pr-16 text-base text-white placeholder:text-gray-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-400 hover:text-emerald-300"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

                <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={async () => {
              setErrorMessage("");
              setSuccessMessage("");

              if (!email) {
                 setErrorMessage("Enter your email address first.");
                 return;
                }

              const { error } =
                await supabase.auth.resetPasswordForEmail(
                  email,
                  {
                    redirectTo: `${window.location.origin}/reset-password`,
                  }
                );

              if (error) {
                setErrorMessage(error.message);
              } else {
               setSuccessMessage(
                 "Password reset email sent. Check your inbox."
               );
              }
            }}
            className="text-sm text-emerald-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

       {errorMessage && (
         <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
           ⚠ {errorMessage}
         </div>
       )}

       {successMessage && (
         <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
           ✓ {successMessage}
         </div>
       )}

        <button
          type="submit"
          disabled={
            loading ||
            !email ||
            !password
          }
          className="w-full rounded-xl bg-white py-3.5 text-base font-bold text-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : "Enter As You Are"}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-gray-400 text-sm">
            or
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button
  type="button"
  onClick={signInWithGoogle}
  className="w-full rounded-xl bg-emerald-500 py-3.5 text-base font-bold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.98]"
>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="mt-6 w-full text-center text-sm text-gray-400 transition hover:text-white"
        >
          Don't have an account?{" "}
          <span className="text-emerald-400">
            Create one
          </span>
        </button>

        </form>

      </div>
    </main>
  );
}
