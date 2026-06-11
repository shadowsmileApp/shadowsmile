"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AccountSettingsPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email || "");
    }

    loadUser();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        color: "#fff",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1>Account Settings</h1>

        <div
          style={{
            background: "#15151A",
            border: "1px solid #25252D",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <label>Email</label>

          <input
            value={email}
            disabled
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #333",
              background: "#1A1A1F",
              color: "#fff",
            }}
          />
        </div>

        <button
          onClick={signOut}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "#4F46E5",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
