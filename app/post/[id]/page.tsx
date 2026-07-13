"use client";

import React, { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { supabase } from "../../../lib/supabase-browser";
import { Heart, MessageSquare } from "lucide-react";

type Post = {
  id: string;
  user_id: string | null;

  shadow_text: string | null;
  smile_text: string | null;
  content: string | null;
  image_url?: string | null;

  post_type: string;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export default function PostPage() {
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");

  const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */

  useEffect(() => {
  async function loadUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(
        session?.user ?? null
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadUser();

  const {
    data: { subscription },
  } =
    supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

  return () => {
    subscription.unsubscribe();
  };
}, []);

const router = useRouter();

useEffect(() => {
  if (
    !loading &&
    !user
  ) {
    router.push("/signin");
  }
}, [
  loading,
  user,
  router,
]);

  /* ================= LOAD POST ================= */

  useEffect(() => {
    if (!id) return;

    async function loadPost() {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      setPost(data);
    }

    loadPost();
  }, [id]);

  /* ================= LOAD LIKES ================= */

  useEffect(() => {
    if (!id) return;

    async function loadLikes() {
      const { data } = await supabase
        .from("reactions")
        .select("id")
        .eq("post_id", id)
        .eq("type", "like");

      setLikeCount(data?.length || 0);
    }

    loadLikes();
  }, [id]);

  /* ================= LOAD COMMENTS ================= */

  useEffect(() => {
    if (!id) return;

    async function loadComments() {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      setComments(data || []);
    }

    loadComments();
  }, [id]);

  /* ================= LIKE POST ================= */

  async function likePost() {
    if (!user) return alert("Login required");

    await supabase.from("reactions").insert({
      post_id: id,
      user_id: user.id,
      type: "like",
    });

    setLikeCount((prev) => prev + 1);
  }

  /* ================= ADD COMMENT ================= */

  async function addComment() {
    if (!user) return alert("Login required");
    if (!commentText.trim()) return;

    const { error } = await supabase.from("comments").insert({
      post_id: id,
      user_id: user.id,
      content: commentText,
    });

    if (error) {
      console.error(error);
      return;
    }

    setComments((prev) => [
      {
        id: Math.random().toString(),
        post_id: id as string,
        user_id: user.id,
        content: commentText,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setCommentText("");
  }

  /* ================= UI ================= */

if (loading) {
  return (
    <div style={styles.page}>
      <p>Loading...</p>
    </div>
  );
}

if (!user) {
  return null;
}

  if (!post) {
    return (
      <div style={styles.page}>
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <main style={styles.page}>
      {/* POST CARD */}
      <div style={styles.card}>
        {post.post_type === "flip" ? (
  <>
    <p>
      <b>Veil:</b> {post.shadow_text}
    </p>

    <p>
      <b>Unveil:</b> {post.smile_text}
    </p>
  </>
) : (
  <p>{post.content}</p>
)}

{post.image_url && (
  <img
    src={post.image_url}
    alt="Post"
    style={{
      width: "100%",
      borderRadius: 16,
      marginTop: 16,
      marginBottom: 16,
      maxHeight: 500,
      objectFit: "cover",
    }}
  />
)}

        {/* ACTIONS */}
        <div style={styles.actions}>
          <button onClick={likePost} style={styles.btn}>
            <Heart size={14} /> {likeCount}
          </button>

          <button style={styles.btn}>
            <MessageSquare size={14} /> {comments.length}
          </button>
        </div>
      </div>

      {/* COMMENTS */}
      <section style={styles.commentBox}>
        <h3>Comments</h3>

        <div
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  }}
>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            style={styles.input}
          />

          <button onClick={addComment} style={styles.sendBtn}>
            Send
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          {comments.map((c) => (
            <div key={c.id} style={styles.comment}>
              {c.content}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0A0A0F",
    color: "#fff",
    padding: 20,
    fontFamily: "system-ui",
  },

  card: {
    background: "#111",
    padding: 15,
    borderRadius: 12,
    border: "1px solid #222",
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  btn: {
    display: "flex",
    gap: 5,
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 8,
    background: "#1a1a1a",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  commentBox: {
    marginTop: 20,
  },

  input: {
    flex: 1,
    minWidth: 220,
    boxSizing: "border-box",
    padding: 10,
    borderRadius: 8,
    background: "#111",
    border: "1px solid #222",
    color: "#fff",
  },

  sendBtn: {
    padding: "10px 14px",
    borderRadius: 8,
    background: "#39FF88",
    border: "none",
    cursor: "pointer",
  },

  comment: {
    marginTop: 10,
    padding: 10,
    background: "#111",
    borderRadius: 8,
    border: "1px solid #222",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },
};
