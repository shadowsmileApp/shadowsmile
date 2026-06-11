"use client";

export default function SettingsPage() {
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
<h1
style={{
margin: 0,
fontSize: 28,
fontWeight: 800,
}}
>
Settings </h1>

    <div
      style={{
        background: "#15151A",
        border: "1px solid #25252D",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <button
  onClick={() =>
    window.location.href =
      "/settings/profile"
  }
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
onClick={() =>
  window.location.href =
    "/settings/account"
}
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
onClick={() =>
  window.location.href =
    "/settings/privacy"
}
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

      <div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 16,
  }}
>
  <button
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
