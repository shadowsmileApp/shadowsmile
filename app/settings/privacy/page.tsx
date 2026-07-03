"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivacySettingsPage() {

const router = useRouter();

  const [privateProfile, setPrivateProfile] =
    useState(false);

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
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  }}
>
  <button
    onClick={() => router.push("/settings")}
    style={{
      width: 42,
      height: 42,
      borderRadius: 12,
      border: "1px solid #25252D",
      background: "#15151A",
      color: "#fff",
      cursor: "pointer",
      fontSize: 20,
      fontWeight: 700,
      flexShrink: 0,
    }}
  >
    ←
  </button>

  <h1
    style={{
      margin: 0,
      fontSize: 28,
      fontWeight: 800,
    }}
  >
    Privacy Settings
  </h1>
</div>

        <div
          style={{
            background: "#15151A",
            border: "1px solid #25252D",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Private Profile

            <input
              type="checkbox"
              checked={privateProfile}
              onChange={() =>
                setPrivateProfile(
                  !privateProfile
                )
              }
            />
          </label>
        </div>
      </div>
    </main>
  );
}
