"use client";

import React from "react";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">

      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: "url('/Shadowsmile.png')",
          filter: "brightness(0.8) contrast(1.1)",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] p-10 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">
            Shadow <span className="text-emerald-400">Smile</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3 italic">
            "Express the Shadow. Share the Smile."
          </p>
        </div>

        <button className="w-full py-3 bg-white text-black font-bold rounded-xl">
          Enter the Light
        </button>

      </div>
    </main>
  );
}
