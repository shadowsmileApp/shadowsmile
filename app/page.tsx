"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Command,
  Heart,
  Share2,
  Sparkles,
  LogIn,
} from "lucide-react";

import { supabase } from "../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import PostCard from "../components/PostCard";
import { getPosts } from "../lib/posts";

/* ================= TYPES ================= */

type Post = {
  id: string;

  // Internal creator link
  user_id: string | null;

  // BlackMaltra privacy
  is_anonymous?: boolean | null;

  shadow_text: string | null;
  smile_text: string | null;
  content: string | null;
  media_url?: string | null;
  media_type?: "image" | "video" | null;

  post_type: string;
  created_at: string;

  like_count?: number;

  profiles?: {
    handle?: string | null;
    is_private?: boolean | null;
  } | null;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;

  profiles?: {
    handle: string | null;
  } | null;
};

/* ================= CONSTANTS ================= */

const DEV_ROLES = [
  "admin",
  "founder",
  "developer",
];

/* ================= COMPONENT ================= */

export default function Page() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [role, setRole] = useState("");

  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Comment[]>([]);

  /* ================= USER ================= */

  async function loadUser() {
  try {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const currentUser =
      session?.user ?? null;

    setUser(currentUser);

    if (currentUser?.id) {
      const {
        data: profile,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq(
          "id",
          currentUser.id
        )
        .maybeSingle();

      setRole(
        profile?.role || ""
      );
    } else {
      setRole("");
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  /* ================= POSTS ================= */

  async function loadPosts() {
  try {
    const data = await getPosts();

    setPosts(data);
  } catch (error) {
    console.error(error);
  }
}

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

useEffect(() => {
  if (!loading && !user) {
    router.push("/signin");
  }
}, [loading, user, router]);

  useEffect(() => {
  async function fetchData() {
    await loadPosts();
    await loadComments();
  }

  fetchData();
}, [user]);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();

  window.addEventListener(
    "resize",
    checkMobile
  );

  return () =>
    window.removeEventListener(
      "resize",
      checkMobile
    );
}, []);

  /* ================= LIKE ================= */

  async function likePost(postId: string) {
  if (!user) {
    router.push("/signin");
    return;
  }

  const { data: existingLike, error: likeCheckError } =
    await supabase
      .from("reactions")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .eq("type", "like")
      .maybeSingle();

console.log(
  "EXISTING LIKE CHECK:",
  existingLike,
  likeCheckError
);

  if (existingLike) {
  const { data: deletedLike, error } = await supabase
    .from("reactions")
    .delete()
    .eq("id", existingLike.id)
    .select();

  console.log(
    "DELETE RESULT:",
    deletedLike,
    error
  );

  if (error) {
    console.error(
      "LIKE DELETE ERROR:",
      error
    );
    return;
  }

} else {

  const { error } =
    await supabase
      .from("reactions")
      .insert({
        post_id: postId,
        user_id: user.id,
        type: "like",
      });

  if (error) {
    console.error(
      "LIKE INSERT ERROR:",
      error
    );
    return;
  }
}

await loadPosts();
}

  /* ================= LOAD COMMENTS ================= */

async function loadComments() {
  const { data: commentsData, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.log(
      "COMMENT LOAD ERROR:",
      error
    );

    alert(
      JSON.stringify(error, null, 2)
    );

    return;
  }

const userIds = [
  ...new Set(
    (commentsData || []).map(
      (comment) => comment.user_id
    )
  ),
];

const {
  data: profiles,
  error: profileError,
} = await supabase
  .from("profiles")
  .select(`
    id,
    handle,
    avatar_url
  `)
  .in("id", userIds);

if (profileError) {
  console.error(profileError);
}

  const profileMap = Object.fromEntries(
  (profiles || []).map((profile) => [
    profile.id,
    profile,
  ])
);

const mergedComments = (commentsData || []).map(
  (comment) => ({
    ...comment,
    profiles:
      profileMap[comment.user_id] || null,
  })
);

setComments(mergedComments);
}

  /* ================= COMMENT ================= */

  async function addComment(postId: string) {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (
  !commentTexts[
    postId
  ]?.trim()
)
  return;

    const { error } =
  await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      content:
        commentTexts[
          postId
        ],
    });

if (error) {
  console.error(error);
  return;
}

loadPosts();
loadComments();

    setCommentTexts((prev) => ({
  ...prev,
  [postId]: "",
}));
    setOpenComments(null);
  }

  /* ================= SHARE ================= */

  async function sharePost(postId: string) {
    const link = `${window.location.origin}/post/${postId}`;

    try {
      await navigator.clipboard.writeText(link);
      console.log("Link copied");
    } catch {
      prompt("Copy this link:", link);
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
  return (
    <div style={styles.loading}>
      Loading BlackMaltra...
    </div>
  );
}

if (!user) {
  return null;
}

  /* ================= UI ================= */

  return (
    <main style={styles.app}>
      {/* HEADER */}
      <header
  style={{
    ...styles.header,
    flexDirection: isMobile
      ? "column"
      : "row",
    gap: isMobile ? 12 : 0,
  }}
>
        <div style={styles.left}>
          <div style={styles.logo}>
            <Command size={16} />
          </div>

          <h1 style={styles.title}>
            BlackMaltra
          </h1>
        </div>

        <div style={styles.right}>
          {!user && (
  <button
    style={styles.market}
    onClick={() => router.push("/signin")}
  >
    <LogIn size={14} />
    Sign In
  </button>
)}

          <button
            style={styles.market}
            onClick={() => router.push("/marketplace")}
          >
            Marketplace
          </button>

{DEV_ROLES.includes(role) && (
    <button
      style={styles.market}
      onClick={() => router.push("/dev")}
    >
      Dev
    </button>
  )}

        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.badge}>
          <Sparkles size={12} />
          Platform Core
        </div>

        <h2
  style={{
    ...styles.heroTitle,
    fontSize: isMobile ? 26 : 34,
  }}
>
          Welcome to BlackMaltra
        </h2>

        <p style={styles.heroText}>
          A safe social space for honesty, support, healing, and connection.
        </p>

        {!user && (
          <button
            style={styles.enterBtn}
            onClick={() => router.push("/signin")}
          >
            Enter the Light
          </button>
        )}

      </section>

      {/* FEED */}
      <section
  style={{
    ...styles.feed,
    padding: isMobile ? 12 : 16,
  }}
>
  {posts.length === 0 && (
    <div
      style={{
        textAlign: "center",
        color: "#888",
        padding: 30,
      }}
    >
      No posts yet.
      <br />
      Be the first to share.
    </div>
  )}

  {posts.map((p) => (
  <PostCard
  key={p.id}
  post={p}
  showHandle={true}
  isMobile={isMobile}
  openComments={openComments}
  setOpenComments={setOpenComments}
  commentTexts={commentTexts}
  comments={comments}
  setCommentTexts={setCommentTexts}
  likePost={likePost}
  addComment={addComment}
  sharePost={sharePost}
/>
        ))}
      </section>

    </main>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0A0A0F,#0E0E14)",
    color: "#EAEAF0",
    fontFamily: "system-ui",
    paddingBottom: 120,
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    borderBottom: "1px solid #222",
    alignItems: "center",
  },

  left: { display: "flex", gap: 10, alignItems: "center" },
  right: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" },

  logo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  title: { fontSize: 18, fontWeight: 800 },

  market: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #39FF88",
    color: "#39FF88",
    background: "transparent",
    display: "flex",
    gap: 6,
    alignItems: "center",
  },

  hero: {
    padding: "20px 20px 10px",
    textAlign: "center",
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: 900,
  },

  heroText: {
    color: "#aaa",
    marginTop: 10,
  },

  badge: {
    display: "inline-flex",
    gap: 6,
    marginBottom: 10,
    border: "1px solid #333",
    padding: "4px 10px",
    borderRadius: 999,
  },

  enterBtn: {
    marginTop: 20,
    padding: "12px 24px",
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg,#7B2FFF,#39FF88)",
    color: "#fff",
    fontWeight: 700,
  },

  profileLink: {
    color: "#39FF88",
    textDecoration: "none",
    fontSize: 12,
    marginBottom: 10,
    display: "inline-block",
  },

  feed: {
    maxWidth: 900,
    width: "100%",
    margin: "0 auto",
    padding: 16,
  },

  card: {
    background:
      "linear-gradient(180deg,#111,#0D0D12)",
    border: "1px solid #222",
    padding: 18,
    borderRadius: 22,
    marginBottom: 14,
    transition: "all .2s ease",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  actionBtn: {
    display: "flex",
    gap: 5,
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 8,
    background: "#1a1a1a",
  },

  commentBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  commentInput: {
    boxSizing: "border-box",
    flex: 1,
    padding: 8,
    borderRadius: 8,
    background: "#111",
    border: "1px solid #222",
    color: "#fff",
  },

  commentBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#39FF88",
    border: "none",
  },
};
