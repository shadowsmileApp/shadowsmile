"use client";

import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { deletePost } from "../lib/posts";

type PostMenuProps = {
  postId: string;
  ownedByUser: boolean;
  isProfilePage?: boolean;
  onPostDeleted?: (postId: string) => void;
};

export default function PostMenu({
  postId,
  ownedByUser,
  isProfilePage = false,
  onPostDeleted,
}: PostMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "transparent",
    border: "none",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 100,
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        style={{
          background: "rgba(0,0,0,.55)",
          border: "none",
          borderRadius: 999,
          width: 34,
          height: 34,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <MoreVertical size={18} />
      </button>

      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 40,
            right: 0,
            width: 190,
            background: "#17171C",
            border: "1px solid #2B2B33",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,.45)",
          }}
        >
          {ownedByUser ? (
            <>
              {isProfilePage && (
                <button style={menuButtonStyle}>
                  📌 Pin to the top
                </button>
              )}

              <button style={menuButtonStyle}>
                ✏️ Edit Post
              </button>

              <button
  style={menuButtonStyle}
  onClick={async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    try {
  await deletePost(postId);
  onPostDeleted?.(postId);
  setMenuOpen(false);
} catch (error) {
      console.error(error);
      alert("Failed to delete post.");
    }
  }}
>
  🗑️ Delete Post
</button>
            </>
          ) : (
            <>
              <button style={menuButtonStyle}>
                🚩 Report Post
              </button>

              <button style={menuButtonStyle}>
                ➖ Unfollow User
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
