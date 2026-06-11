"use client";

import { useState } from "react";

export default function PrivacySettingsPage() {
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
        <h1>Privacy Settings</h1>

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
