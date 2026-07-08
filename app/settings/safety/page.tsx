"use client";

import { useRouter } from "next/navigation";

export default function SafetyPage() {
  const router = useRouter();

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
            Safety Center
          </h1>
        </div>

        <div
          style={{
            background: "#15151A",
            border: "1px solid #25252D",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Coming Soon
          </h2>

          <p style={{ color: "#AAA", lineHeight: 1.6 }}>
            This page will eventually contain:
          </p>

          <ul
            style={{
              color: "#AAA",
              lineHeight: 1.8,
            }}
          >
            <li>Report abusive posts</li>
            <li>Block users</li>
            <li>Community Guidelines</li>
            <li>Safety Resources</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
