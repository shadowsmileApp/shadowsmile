"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ProfileSettingsPage() {
const [displayName, setDisplayName] =
  useState("");

const [bio, setBio] =
  useState("");

const [avatarFile, setAvatarFile] =
  useState<File | null>(null);

const [saving, setSaving] =
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
          "display_name,bio"
        )
        .eq("id", user.id)
        .single();

    if (!data) return;

    setDisplayName(
      data.display_name || ""
    );

    setBio(
      data.bio || ""
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

    const updateData: any = {
      display_name: displayName,
      bio,
    };

    if (avatarUrl) {
      updateData.avatar_url =
        avatarUrl;
    }

    const { error } =
      await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

    if (error) {
      console.error(error);
      alert(
        "Failed to save profile."
      );
      return;
    }

    alert(
      "Profile updated successfully."
    );
  } finally {
    setSaving(false);
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
        <h1>Profile Settings</h1>

        <div
          style={{
            background: "#15151A",
            border: "1px solid #25252D",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <label>Avatar</label>

          <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setAvatarFile(
      e.target.files?.[0] || null
    )
  }
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
          <label>Display Name</label>

          <input
            type="text"
  value={displayName}
  onChange={(e) =>
    setDisplayName(
      e.target.value
    )
  }
            placeholder="Display Name"
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
  disabled={saving}
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
  {saving
    ? "Saving..."
    : "Save Changes"}
</button>
      </div>
    </main>
  );
}
