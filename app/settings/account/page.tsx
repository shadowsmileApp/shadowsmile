"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase-browser";

export default function AccountSettingsPage() {
const router = useRouter();
const [email, setEmail] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [birthday, setBirthday] = useState("");
const [saving, setSaving] = useState(false);
const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

setFirstName(data?.first_name ?? "");
setLastName(data?.last_name ?? "");
setPhoneNumber(data?.phone_number ?? "");
setBirthday(data?.date_of_birth ?? "");
    }

    loadAccount();
  }, []);
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
  Account Settings
</h1>
</div>

<p
  style={{
    color: "#A8A8B3",
    marginTop: 0,
    marginBottom: 24,
  }}
>
  Manage your account information.
</p>

        <div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  }}
>

<h2
  style={{
    margin: 0,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 700,
  }}
>
  Personal Information
</h2>

  <div>
  <strong>Email:</strong>
  <input
    value={email}
    readOnly
    style={{
      width: "100%",
      marginTop: 6,
      padding: "12px 14px",
fontSize: 16,
boxSizing: "border-box",
      borderRadius: 8,
      border: "1px solid #333",
      background: "#111116",
      color: "#888",
      cursor: "not-allowed",
    }}
  />
</div>

  <div>
  <strong>First name:</strong>
  <input
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    style={{
      width: "100%",
      marginTop: 6,
      padding: "12px 14px",
fontSize: 16,
boxSizing: "border-box",
      borderRadius: 8,
      border: "1px solid #333",
      background: "#1A1A1F",
      color: "#fff",
    }}
  />
</div>

  <div>
  <strong>Last name:</strong>
  <input
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    style={{
      width: "100%",
      marginTop: 6,
      padding: "12px 14px",
fontSize: 16,
boxSizing: "border-box",
      borderRadius: 8,
      border: "1px solid #333",
      background: "#1A1A1F",
      color: "#fff",
    }}
  />
</div>

  <div>
  <strong>Phone:</strong>
  <input
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    style={{
      width: "100%",
      marginTop: 6,
      padding: "12px 14px",
fontSize: 16,
boxSizing: "border-box",
      borderRadius: 8,
      border: "1px solid #333",
      background: "#1A1A1F",
      color: "#fff",
    }}
  />
</div>

  <div>
  <strong>Birthday:</strong>
  <input
    type="date"
    value={birthday ?? ""}
    onChange={(e) => setBirthday(e.target.value)}
    style={{
      width: "100%",
      marginTop: 6,
      padding: "12px 14px",
fontSize: 16,
boxSizing: "border-box",
      borderRadius: 8,
      border: "1px solid #333",
      background: "#1A1A1F",
      color: "#fff",
    }}
  />
</div>

<button
  disabled={saving}
  onClick={async () => {
  setSaving(true);
  setSaveMessage("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setSaving(false);
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      date_of_birth: birthday,
    })
    .eq("id", user.id);

  setSaving(false);

  if (error) {
    setSaveMessage("Failed to save changes.");
    return;
  }

  setSaveMessage("Changes saved successfully.");
}}
  style={{
    marginTop: 16,
    height: 52,
width: "100%",
fontSize: 16,
    borderRadius: 12,
    border: "none",
    background: saving ? "#555" : "#2E7D32",
    color: "#fff",
    fontWeight: 700,
    cursor: saving ? "not-allowed" : "pointer",
    opacity: saving ? 0.75 : 1,
  }}
>
  {saving ? "Saving..." : "Save Changes"}
</button>

{saveMessage && (
  <p
    style={{
      marginTop: 12,
      color: saveMessage.startsWith("Failed")
        ? "#FF6B6B"
        : "#41D17D",
      fontWeight: 600,
    }}
  >
    {saveMessage}
  </p>
)}

</div>
      </div>
    </main>
  );
}
