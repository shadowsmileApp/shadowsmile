"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
const router = useRouter();

const [userId, setUserId] = useState("");

useEffect(() => {
  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);
    }
  }

  loadUser();
}, []);

async function handleLogout() {
  await supabase.auth.signOut({
    scope: "global",
  });

  window.location.replace("/signin");
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
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  }}
>
  <button
    onClick={() => {
      if (userId) {
        router.push(`/profile/${userId}`);
      }
    }}
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
    Settings
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
      <button
  onClick={() => router.push("/settings/profile")}
  style={{
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
  }}
>
  <span>Profile</span>
  <span>›</span>
</button>
    </div>

    <div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 16,
  }}
>
  <button
    onClick={() => router.push("/settings/account")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
    }}
  >
    <span>Account</span>
    <span>›</span>
  </button>
</div>

<div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 16,
  }}
>
      <button
onClick={() => router.push("/settings/privacy")}
  style={{
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
  }}
>
  <span>Privacy</span>
  <span>›</span>
</button>
    </div>

<h2
  style={{
    margin: "8px 0 0 4px",
    fontSize: 18,
    fontWeight: 800,
    color: "#FFFFFF",
  }}
>
  Personalization
</h2>

<div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    overflow: "hidden",
  }}
>

  <button
    onClick={() => router.push("/settings/notifications")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Notifications</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/appearance")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Appearance</span>
    <span>›</span>
  </button>

</div>

<h2
  style={{
    margin: "8px 0 0 4px",
    fontSize: 18,
    fontWeight: 800,
    color: "#FFFFFF",
  }}
>
  Safety & Privacy
</h2>

<div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    overflow: "hidden",
  }}
>

  <button
    onClick={() => router.push("/settings/blocked-users")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Blocked Users</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/message-requests")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Message Requests</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/sensitive-content")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Sensitive Content</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/quiet-hours")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Quiet Hours</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/download-data")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Download My Data</span>
    <span>›</span>
  </button>

</div>

<h2
  style={{
    margin: "8px 0 0 4px",
    fontSize: 18,
    fontWeight: 800,
    color: "#FFFFFF",
  }}
>
  Legal & Safety
</h2>

<div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    overflow: "hidden",
  }}
>
  <button
    onClick={() => router.push("/settings/safety")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Safety Center</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/privacy-policy")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Privacy Policy</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/terms")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Terms of Service</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/community")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Community Guidelines</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/about")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>About ShadowSmile</span>
    <span>›</span>
  </button>
</div>

<h2
  style={{
    margin: "8px 0 0 4px",
    fontSize: 18,
    fontWeight: 800,
    color: "#FFFFFF",
  }}
>
  Support
</h2>

<div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    overflow: "hidden",
  }}
>

  <button
    onClick={() => router.push("/settings/contact-support")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Contact Support</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/report-bug")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid #25252D",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Report a Bug</span>
    <span>›</span>
  </button>

  <button
    onClick={() => router.push("/settings/feedback")}
    style={{
      width: "100%",
      background: "transparent",
      border: "none",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 18,
      fontWeight: 700,
      padding: 16,
    }}
  >
    <span>Send Feedback</span>
    <span>›</span>
  </button>

</div>

      <div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 16,
  }}
>
  <button
  onClick={handleLogout}
  style={{
      width: "100%",
      height: 48,
      borderRadius: 12,
      border: "1px solid #333",
      background: "#1A1A1F",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Sign Out
  </button>
</div>

<div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 16,
  }}
>
  <h2>Danger Zone</h2>

<button
  onClick={async () => {
  const confirmed = window.confirm(
    "This permanently deletes your Shadow Smile account and cannot be undone."
  );

  if (!confirmed) return;

  const response = await fetch("/api/delete-account", {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.error ?? "Failed to delete account.");
    return;
  }

  await supabase.auth.signOut({
    scope: "global",
  });

  window.location.replace("/signin");
}}
  style={{
      width: "100%",
      height: 48,
      borderRadius: 12,
      border: "none",
      background: "#C62828",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Delete Account
  </button>
</div>
</div>
</main>
);
}
