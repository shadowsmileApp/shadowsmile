"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase-browser";

export default function ProfileSettingsPage() {

const router = useRouter();

const [firstName, setFirstName] =
  useState("");

const [lastName, setLastName] =
  useState("");

const [username, setUsername] =
  useState("");

const [bio, setBio] =
  useState("");

const [avatarFile, setAvatarFile] =
  useState<File | null>(null);

const [avatarUrl, setAvatarUrl] =
  useState("");

const [saving, setSaving] =
  useState(false);

const [usernameError, setUsernameError] =
  useState("");

const [checkingUsername, setCheckingUsername] =
  useState(false);

useEffect(() => {
  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
  await supabase
    .from("profiles")
    .select(
  "first_name,last_name,handle,bio,avatar_url"
)
    .eq("id", user.id)
    .single();

    if (!data) return;

setFirstName(
  data.first_name || ""
);

setLastName(
  data.last_name || ""
);

setUsername(
  data.handle || ""
);

setBio(
  data.bio || ""
);
  
setAvatarUrl(
  data.avatar_url || ""
);

}

  loadProfile();
}, []);
async function saveProfile() {
  try {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

setCheckingUsername(true);

const { data: existingUser } =
  await supabase
    .from("profiles")
    .select("id")
    .eq("handle", username)
    .neq("id", user.id)
    .maybeSingle();

setCheckingUsername(false);

if (existingUser) {
  setUsernameError(
    "That username is already taken."
  );
  return;
}

    let avatarUrl = null;
    
if (avatarFile) {
  const fileName =
    `${user.id}/avatar-${Date.now()}`;

    const { error: uploadError } =
      await supabase.storage
        .from("avatars")
                  .upload(
            fileName,
            avatarFile,
            {
              upsert: true,
            }
          );

      if (uploadError) {
        console.error(uploadError);
      } else {
        const {
          data: publicUrlData,
        } = supabase.storage
          .from("avatars")
          .getPublicUrl(
            fileName
          );

        avatarUrl =
          publicUrlData.publicUrl;
      }
    }
if (username.length < 3) {
  setUsernameError(
    "Username must be at least 3 characters."
  );
  return;
}

if (username.length > 20) {
  setUsernameError(
    "Username cannot exceed 20 characters."
  );
  return;
}
    const updateData: any = {
  first_name: firstName,
  last_name: lastName,
  handle: username,
  bio,
};

    if (avatarUrl) {
  updateData.avatar_url = avatarUrl;
}

const { error } = await supabase
  .from("profiles")
  .update(updateData)
  .eq("id", user.id);

if (error) {
  console.error(error);
  alert("Failed to save profile.");
  return;
}

if (avatarUrl) {
  setAvatarUrl(avatarUrl);
}

alert("Profile updated successfully.");

  } finally {
  setSaving(false);
  setCheckingUsername(false);
}
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
    Profile Settings
  </h1>
</div>

        <div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  }}
>
  {avatarFile || avatarUrl ? (
  <img
    src={
      avatarFile
        ? URL.createObjectURL(avatarFile)
        : avatarUrl
    }
    alt="Profile"
    style={{
      width: 120,
      height: 120,
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #333",
    }}
  />
) : (
  <div
    style={{
      width: 120,
      height: 120,
      borderRadius: "50%",
      background: "#25252D",
      border: "3px solid #333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 42,
      fontWeight: 700,
      color: "#888",
      userSelect: "none",
    }}
  >
    {firstName
      ? firstName.charAt(0).toUpperCase()
      : "?"}
  </div>
)}

  <label
    style={{
      cursor: "pointer",
      background: "#4F46E5",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: 10,
      fontWeight: 600,
    }}
  >
    Change Photo

    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) =>
        setAvatarFile(
          e.target.files?.[0] || null
        )
      }
    />
  </label>
</div>

        <div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 16,
  }}
>
  <label>First Name</label>

  <input
    type="text"
    value={firstName}
    onChange={(e) =>
      setFirstName(e.target.value)
    }
    placeholder="First Name"
    style={{
      width: "100%",
      marginTop: 8,
      marginBottom: 16,
      padding: 12,
      borderRadius: 12,
      border: "1px solid #333",
      background: "#1A1A1F",
      color: "#fff",
    }}
  />

  <label>Last Name</label>

  <input
    type="text"
    value={lastName}
    onChange={(e) =>
      setLastName(e.target.value)
    }
    placeholder="Last Name"
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

<div
  style={{
    background: "#15151A",
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 16,
  }}
>
  <label>Username</label>

  <input
  type="text"
  value={username}
  onChange={(e) => {
    const cleaned = e.target.value
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/[^a-z0-9_]/g, "");

    setUsername(cleaned);
    setUsernameError("");
  }}
  placeholder="Username"
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

{usernameError && (
  <p
    style={{
      color: "#EF4444",
      marginTop: 8,
      fontSize: 14,
    }}
  >
    {usernameError}
  </p>
)}
</div>

        <div
          style={{
            background: "#15151A",
            border: "1px solid #25252D",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <label>Bio</label>

          <textarea
  value={bio}
  onChange={(e) =>
    setBio(
      e.target.value
    )
  }
            placeholder="Tell people about yourself"
            style={{
              width: "100%",
              minHeight: 120,
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
  onClick={saveProfile}
  disabled={saving || checkingUsername}
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
  {checkingUsername
  ? "Checking username..."
  : saving
  ? "Saving..."
  : "Save Changes"}
</button>
      </div>
    </main>
  );
}
