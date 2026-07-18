"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";

type PostCardProps = {
  post: any;

  showHandle?: boolean;

  isMobile?: boolean;

  openComments: string | null;

  setOpenComments: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  commentTexts: Record<string, string>;

  comments: any[];

  setCommentTexts: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;

  likePost: (postId: string) => Promise<void>;

  addComment: (postId: string) => void;

  sharePost: (postId: string) => void;
};
export default function PostCard({
  post,
  showHandle = true,
  isMobile = false,
  openComments,
  setOpenComments,
  commentTexts,
  comments,
  setCommentTexts,
  likePost,
  addComment,
  sharePost,
}: PostCardProps) {

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(
    post.liked_by_user || false
  );

  useEffect(() => {
    setLiked(
      post.liked_by_user || false
    );
  }, [
    post.liked_by_user
  ]);

  return (
  <>

  <div
    style={{
      background:
        "linear-gradient(180deg,#111,#0D0D12)",
      border: "1px solid #222",
      borderRadius: 22,
      padding: isMobile ? 14 : 18,
      marginBottom: 14,
    }}
  >
    {showHandle &&
      !post.is_anonymous &&
      post.user_id && (
        post.profiles?.is_private ? (
          <span
            style={{
              color: "#39FF88",
              fontSize: 12,
              marginBottom: 10,
              display: "inline-block",
            }}
          >
            Private Profile
          </span>
        ) : (
          <Link
            href={`/profile/${post.user_id}`}
            style={{
              color: "#39FF88",
              textDecoration: "none",
              fontSize: 12,
              marginBottom: 10,
              display: "inline-block",
            }}
          >
            {post.profiles?.handle
              ? `@${post.profiles.handle}`
              : "View Profile"}
          </Link>
        )
      )}

    <div
      onClick={() => setExpanded(true)}
      style={{
        cursor: "pointer",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
     >
      {post.post_type === "flip" ? (
        <>
          <p>
            <b>Veil:</b> {post.shadow_text}
          </p>

          <p
            style={{
              color: "#39FF88",
            }}
          >
            <b>Unveil:</b> {post.smile_text}
          </p>
        </>
      ) : (
        <p>{post.content}</p>
      )}

      {post.media_url && post.media_type === "image" && (
  <img
    src={post.media_url}
    alt="Post"
    style={{
      width: "100%",
      marginTop: 14,
      borderRadius: 14,
      maxHeight: 450,
      objectFit: "cover",
    }}
  />
)}

{post.media_url && post.media_type === "video" && (
  <video
    src={post.media_url}
    controls
    playsInline
    style={{
      width: "100%",
      marginTop: 14,
      borderRadius: 14,
      maxHeight: 450,
      objectFit: "cover",
    }}
  />
)}
    </div>

<div
  onClick={(e) => e.stopPropagation()}
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  }}
>
  <button
    style={{
      display: "flex",
      gap: 5,
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 8,
      background: "#1a1a1a",
    }}
    onClick={async () => {
      await likePost(post.id);
    }}
  >
    <Heart 
      size={14}
      fill={liked ? "#39FF88" : "none"}
    />

    {post.like_count || 0}
  </button>

  <button
    style={{
      display: "flex",
      gap: 5,
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 8,
      background: "#1a1a1a",
    }}
    onClick={() =>
      setOpenComments(
        openComments === post.id
          ? null
          : post.id
      )
    }
  >
    <MessageSquare size={14} />
    Comment
  </button>

  <button
    style={{
      display: "flex",
      gap: 5,
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 8,
      background: "#1a1a1a",
    }}
    onClick={() => sharePost(post.id)}
  >
    <Share2 size={14} />
    Share
  </button>
</div>

{openComments === post.id && (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 10,
    }}
  >
    <input
      value={commentTexts[post.id] ?? ""}
      onChange={(e) =>
        setCommentTexts((prev) => ({
          ...prev,
          [post.id]: e.target.value,
        }))
      }
      placeholder="Write comment..."
      style={{
        boxSizing: "border-box",
        flex: 1,
        padding: 8,
        borderRadius: 8,
        background: "#111",
        border: "1px solid #222",
        color: "#fff",
      }}
    />

    <button
      onClick={() => addComment(post.id)}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        background: "#39FF88",
        border: "none",
      }}
    >
      Send
    </button>
  </div>
)}
  </div>

{expanded && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: 900,
        height: "90vh",
        background: "#111",
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    padding: 16,
    borderBottom: "1px solid #222",
  }}
>
  <button
    onClick={() => setExpanded(false)}
    style={{
      background: "transparent",
      border: "none",
      color: "#fff",
      fontSize: 28,
      cursor: "pointer",
    }}
  >
    ✕
  </button>
</div>

<div
  style={{
    padding: 24,
    borderBottom: "1px solid #222",
  }}
>
  {post.post_type === "flip" ? (
    <>
      <p>
        <b>Veil:</b> {post.shadow_text}
      </p>

      <p
        style={{
          color: "#39FF88",
        }}
      >
        <b>Unveil:</b> {post.smile_text}
      </p>
    </>
  ) : (
    <p>{post.content}</p>
  )}

  {post.media_url && post.media_type === "image" && (
  <img
    src={post.media_url}
    alt="Post"
    style={{
      width: "100%",
      marginTop: 14,
      borderRadius: 14,
      maxHeight: 600,
      objectFit: "contain",
    }}
  />
)}

{post.media_url && post.media_type === "video" && (
  <video
    src={post.media_url}
    controls
    playsInline
    style={{
      width: "100%",
      marginTop: 14,
      borderRadius: 14,
      maxHeight: 600,
      objectFit: "contain",
    }}
  />
)}
</div>

<div
  style={{
    flex: 1,
    overflowY: "auto",
    padding: 20,
  }}
>
  {comments.filter(
  (comment) => comment.post_id === post.id
).length === 0 ? (
  <div
    style={{
      color: "#888",
      textAlign: "center",
      marginTop: 40,
    }}
  >
    No comments yet. Be the first.
  </div>
) : (
  comments
    .filter(
      (comment) => comment.post_id === post.id
    )
    .map((comment) => (
      <div
        key={comment.id}
        style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: "1px solid #222",
        }}
      >
<div
  onClick={() => {
    router.push(`/profile/${comment.user_id}`);
  }}
  style={{
    color: "#39FF88",
    fontWeight: 700,
    marginBottom: 6,
    cursor: "pointer",
  }}
>
  {comment.profiles?.handle
    ? `@${comment.profiles.handle}`
    : "@unknown"}
</div>

        <div>
          {comment.content}
        </div>
      </div>
    ))
)}
</div>

<div
  style={{
    borderTop: "1px solid #222",
    padding: 16,
    display: "flex",
    gap: 10,
  }}
>
  <input
    value={commentTexts[post.id] || ""}
    onChange={(e) =>
      setCommentTexts((prev) => ({
        ...prev,
        [post.id]: e.target.value,
      }))
    }
    placeholder="Write a comment..."
    style={{
      flex: 1,
      padding: 12,
      borderRadius: 10,
      background: "#1A1A1A",
      border: "1px solid #333",
      color: "#fff",
    }}
  />

  <button
    onClick={() => addComment(post.id)}
    style={{
      padding: "12px 18px",
      borderRadius: 10,
      border: "none",
      background: "#39FF88",
      fontWeight: 700,
    }}
  >
    Post
  </button>
</div>

</div>

</div>
)}

</>
);
}
