"use client";

import PostMenu from "./PostMenu";
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

  ownedByUser: boolean;

  isProfilePage?: boolean;

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
  
  onPostDeleted: (postId: string) => void;
};
export default function PostCard({
  post,
  ownedByUser = false,
  isProfilePage = false,
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
  onPostDeleted,
}: PostCardProps) {

  const router = useRouter();

  const [expanded, setExpanded] = useState(false);

  const [mediaIndex, setMediaIndex] = useState(0);

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
      position: "relative",
      background:
        "linear-gradient(180deg,#111,#0D0D12)",
      border: "1px solid #222",
      borderRadius: 22,
      padding: isMobile ? 14 : 18,
      marginBottom: 14,
    }}
  >

    <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  }}
>
  <div>
    {showHandle &&
      !post.is_anonymous &&
      post.user_id &&
      (post.profiles?.is_private ? (
        <span
          style={{
            color: "#39FF88",
            fontSize: 12,
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
            display: "inline-block",
          }}
        >
          {post.profiles?.handle
            ? `@${post.profiles.handle}`
            : "View Profile"}
        </Link>
      ))}
  </div>

  <PostMenu
  postId={post.id}
  ownedByUser={ownedByUser}
  isProfilePage={isProfilePage}
  onPostDeleted={onPostDeleted}
/>
</div>

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

      {post.post_media?.length > 0 ? (
  <div
    style={{
      position: "relative",
      width: "100%",
      marginTop: 14,
      overflow: "hidden",
      borderRadius: 14,
      background: "#000",
    }}
  >
    <div
      style={{
        display: "flex",
        width: "100%",
        transform: `translateX(-${mediaIndex * 100}%)`,
        transition: "transform 180ms ease",
      }}
    >
      {post.post_media
        .slice()
        .sort(
          (a: any, b: any) =>
            a.media_order - b.media_order
        )
        .map((media: any) => (
          <div
            key={media.id}
            style={{
              flex: "0 0 100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
            }}
          >
            {media.media_type === "video" ? (
              <video
                src={media.media_url}
                controls
                playsInline
                preload="metadata"
                style={{
                  display: "block",
                  width: "100%",
                  maxHeight: 600,
                  objectFit: "contain",
                  background: "#000",
                }}
              />
            ) : (
              <img
                src={media.media_url}
                alt="Post media"
                style={{
                  display: "block",
                  width: "100%",
                  maxHeight: 600,
                  objectFit: "contain",
                  background: "#000",
                }}
              />
            )}
          </div>
        ))}
    </div>

    {post.post_media.length > 1 && (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            setMediaIndex((current) =>
              current === 0
                ? post.post_media.length - 1
                : current - 1
            );
          }}
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ‹
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            setMediaIndex((current) =>
              current === post.post_media.length - 1
                ? 0
                : current + 1
            );
          }}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ›
        </button>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
            zIndex: 2,
          }}
        >
          {post.post_media.map(
            (media: any, index: number) => (
              <button
                key={media.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaIndex(index);
                }}
                style={{
                  width: 7,
                  height: 7,
                  padding: 0,
                  borderRadius: "50%",
                  border: "none",
                  background:
                    index === mediaIndex
                      ? "#fff"
                      : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                }}
              />
            )
          )}
        </div>
      </>
    )}
  </div>
) : (
  post.media_url &&
  post.media_type && (
    <div
      style={{
        width: "100%",
        marginTop: 14,
        overflow: "hidden",
        borderRadius: 14,
        background: "#000",
      }}
    >
      {post.media_type === "video" ? (
        <video
          src={post.media_url}
          controls
          playsInline
          preload="metadata"
          style={{
            display: "block",
            width: "100%",
            maxHeight: 600,
            objectFit: "contain",
            background: "#000",
          }}
        />
      ) : (
        <img
          src={post.media_url}
          alt="Post media"
          style={{
            display: "block",
            width: "100%",
            maxHeight: 600,
            objectFit: "contain",
            background: "#000",
          }}
        />
      )}
    </div>
  )
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
  width: "100%",
  height: "100%",
  background: "#000",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}}
    >

<button
  onClick={() => setExpanded(false)}
  style={{
    position: "absolute",
    top: 18,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.65)",
    border: "none",
    color: "#fff",
    fontSize: 28,
    cursor: "pointer",
    zIndex: 10,
  }}
>
  ✕
</button>

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

  {(post.post_media?.length > 0 ||
  (post.media_url && post.media_type)) && (
  <div
    style={{
      position: "relative",
      marginTop: 14,
      width: "100%",
      height: "70vh",
      overflow: "hidden",
      borderRadius: 14,
      background: "#000",
    }}
  >
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        transform: `translateX(-${mediaIndex * 100}%)`,
        transition: "transform 180ms ease",
      }}
    >
      {post.post_media
        .slice()
        .sort(
          (a: any, b: any) =>
            a.media_order - b.media_order
        )
        .map((media: any) => (
          <div
            key={media.id}
            style={{
              flex: "0 0 100%",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
            }}
          >
            {media.media_type === "video" ? (
              <video
                src={media.media_url}
                controls
                playsInline
                preload="metadata"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#000",
                }}
              />
            ) : (
              <img
                src={media.media_url}
                alt="Post media"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#000",
                }}
              />
            )}
          </div>
        ))}
    </div>

    {post.post_media.length > 1 && (
      <>
        <button
          type="button"
          onClick={() => {
            setMediaIndex((current) =>
              current === 0
                ? post.post_media.length - 1
                : current - 1
            );
          }}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            fontSize: 30,
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => {
            setMediaIndex((current) =>
              current === post.post_media.length - 1
                ? 0
                : current + 1
            );
          }}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            fontSize: 30,
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          ›
        </button>

        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 7,
            zIndex: 2,
          }}
        >
          {post.post_media.map(
            (media: any, index: number) => (
              <button
                key={media.id}
                type="button"
                onClick={() => {
                  setMediaIndex(index);
                }}
                style={{
                  width: 8,
                  height: 8,
                  padding: 0,
                  borderRadius: "50%",
                  border: "none",
                  background:
                    index === mediaIndex
                      ? "#fff"
                      : "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                }}
              />
            )
          )}
        </div>
      </>
    )}
  </div>
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
