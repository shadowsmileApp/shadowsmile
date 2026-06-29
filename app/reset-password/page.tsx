"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase-browser";
import { useRouter } from "next/navigation";

/**
 * SHADOWSMILE AUTH PHILOSOPHY
 *
 * Password recovery should feel calm,
 * safe, and low-pressure.
 *
 * Avoid fear language,
 * urgency tactics,
 * or stressful UX.
 */

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function updatePassword() {
    try {
      setLoading(true);

if (password.length < 8) {
  alert(
    "Password must be at least 8 characters."
  );
  return;
}

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Password updated successfully."
      );

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl">

        <h1 className="text-3xl font-bold text-white mb-2">
  Return As You Are
</h1>

        <p className="text-gray-400 mb-6">
  Create a new password to continue safely.
</p>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-5 outline-none"
        />

        <button
          onClick={updatePassword}
          disabled={
            loading || !password
          }
          className="w-full py-3 bg-emerald-400 text-black font-bold rounded-xl disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Continue"}
        </button>
      </div>
    </main>
  );
}
