"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ShieldAlert,
  Command,
  Heart,
  Share2,
  Sparkles,
  LogIn,
  LogOut,
} from "lucide-react";

import { supabase } from "../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Post = {
  id: string;

  // Internal creator link
  user_id: string | null;

  // ShadowSmile privacy
  is_anonymous?: boolean | null;

  shadow_text: string | null;
  smile_text: string | null;
  content: string | null;

  post_type: string;
  created_at: string;

  like_count?: number;

  profiles?: {
    handle?: string | null;
    is_private?: boolean | null;
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

  const [mode, setMode] = useState<"structured" | "normal">("structured");

  const [shadow, setShadow] = useState("");
  const [smile, setSmile] = useState("");
  const [text, setText] = useState("");

  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  const [isAnonymous, setIsAnonymous] =
    useState(false);

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
    const {
  data: postsData,
  error: postError,
} = await supabase
  .from("posts")
  .select(`
  *,
  profiles(handle, is_private)
`)
  .order("created_at", {
    ascending: false,
  });

    if (postError) {
      console.error(
        "Post error:",
        postError
      );
      return;
    }

    const { data: reactionsData } = await supabase
      .from("reactions")
      .select("post_id, type");

    const formatted = (postsData || []).map((post: Post) => {
      const likes =
        reactionsData?.filter(
          (r) => r.post_id === post.id && r.type === "like"
        ).length || 0;

      return {
        ...post,
        like_count: likes,
      };
    });

    setPosts(formatted);
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
  loadPosts();
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

  /* ================= CREATE POST ================= */

  async function createPost() {
    if (!user) {
      router.push("/signin");
      return;
    }


  // Prevent empty posts
  if (
    mode === "structured" &&
    !shadow.trim() &&
    !smile.trim()
  ) {
    return;
  }

  if (
    mode === "normal" &&
    !text.trim()
  ) {
    return;
  }

    const payload =
  mode === "structured"
    ? {
        user_id: user.id,
        post_type: "flip",
        shadow_text: shadow,
        smile_text: smile,
        content: null,

        // ShadowSmile privacy
        is_anonymous: isAnonymous,
      }
    : {
        user_id: user.id,
        post_type: "normal",
        content: text,
        shadow_text: null,
        smile_text: null,

        // ShadowSmile privacy
        is_anonymous: isAnonymous,
      };

    const { error } = await supabase.from("posts").insert(payload);

    if (error) {
      console.error(error);
      return;
    }

    setShadow("");
    setSmile("");
    setText("");
    setIsAnonymous(false);

    loadPosts();
  }

  /* ================= LIKE ================= */

  async function likePost(postId: string) {
  if (!user) {
    router.push("/signin");
    return;
  }

  const { data: existingLike } =
    await supabase
      .from("reactions")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .eq("type", "like")
      .maybeSingle();

  if (existingLike) {
    await supabase
      .from("reactions")
      .delete()
      .eq("id", existingLike.id);
  } else {
    await supabase
      .from("reactions")
      .insert({
        post_id: postId,
        user_id: user.id,
        type: "like",
      });
  }

  loadPosts();
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

  /* ================= SIGN OUT ================= */

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    window.location.reload();
  }

  /* ================= LOADING ================= */

  if (loading) {
  return (
    <div style={styles.loading}>
      Loading ShadowSmile...
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
            Shadow<span style={{ color: "#39FF88" }}>Smile</span>
          </h1>
        </div>

        <div style={styles.right}>
          {!user ? (
            <button
              style={styles.market}
              onClick={() => router.push("/signin")}
            >
              <LogIn size={14} />
              Sign In
            </button>
          ) : (
            <button
              style={styles.market}
              onClick={handleLogout}
            >
              <LogOut size={14} />
              Sign Out
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

          <button style={styles.shield}>
            <ShieldAlert size={18} />
          </button>
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
          Express the Shadow.
          <br />
          Share the Smile.
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

        <div style={styles.toggleRow}>
          <button
            onClick={() => setMode("structured")}
            style={{
              ...styles.toggleBtn,
              background:
                mode === "structured"
                  ? "linear-gradient(135deg,#7B2FFF,#8F3FFF)"
                  : "transparent",
              border:
                mode === "structured"
                  ? "1px solid #7B2FFF"
                  : "1px solid #333",
              boxShadow:
                mode === "structured"
                  ? "0 0 20px rgba(123,47,255,.35)"
                  : "none",
            }}
          >
            Shadow / Smile
          </button>

          <button
            onClick={() => setMode("normal")}
            style={{
              ...styles.toggleBtn,
              background:
                mode === "normal"
                  ? "#141414"
                  : "transparent",
              border:
                mode === "normal"
                  ? "1px solid #444"
                  : "1px solid #333",
              color: "#EAEAF0",
            }}
          >
            Normal
          </button>
        </div>
      </section>

      {/* CREATE POST */}
      {user && (
        <section
  style={{
    ...styles.createBox,
    margin: isMobile
      ? "0 12px 24px"
      : "0 auto 24px",
    padding: isMobile ? 16 : 20,
  }}
>
          {mode === "structured" ? (
            <>
              <input
                placeholder="Shadow thought..."
                value={shadow}
                onChange={(e) => setShadow(e.target.value)}
                style={{
  ...styles.input,
  padding: isMobile ? 12 : 16,
}}
              />

              <input
                placeholder="What helped?"
                value={smile}
                onChange={(e) => setSmile(e.target.value)}
                style={{
  ...styles.input,
  padding: isMobile ? 12 : 16,
}}
              />
            </>
          ) : (
            <textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{
  ...styles.input,
  padding: isMobile ? 12 : 16,
}}
            />
          )}

          <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  }}
>
  <input
    type="checkbox"
    checked={isAnonymous}
    onChange={(e) =>
      setIsAnonymous(e.target.checked)
    }
  />

  <span
    style={{
      color: "#aaa",
      fontSize: 14,
    }}
  >
    Post anonymously
  </span>
</div>

          <button onClick={createPost} style={styles.postBtn}>
            Post
          </button>
        </section>
      )}

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
  <div
    key={p.id}
    style={{
  ...styles.card,
  padding: isMobile ? 14 : 18,
}}
  >
         {!p.is_anonymous &&
  p.user_id && (
    p.profiles?.is_private ? (
      <span style={styles.profileLink}>
        Private Profile
      </span>
    ) : (
      <Link
        href={`/profile/${p.user_id}`}
        style={styles.profileLink}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {p.profiles?.handle
          ? `@${p.profiles.handle}`
          : "View Profile"}
      </Link>
    )
)}

            <div
  onClick={() =>
    router.push(`/post/${p.id}`)
  }
  style={{
    cursor: "pointer",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {p.post_type === "flip" ? (
    <>
      <p>
        <b>Shadow:</b> {p.shadow_text}
      </p>

      <p style={{ color: "#39FF88" }}>
        <b>Smile:</b> {p.smile_text}
      </p>
    </>
  ) : (
    <p>{p.content}</p>
  )}
</div>

              <div
                style={styles.actions}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  style={styles.actionBtn}
                  onClick={() => likePost(p.id)}
                >
                  <Heart size={14} /> {p.like_count || 0}
                </button>

                <button
                  style={styles.actionBtn}
                  onClick={() =>
                    setOpenComments(
                      openComments === p.id ? null : p.id
                    )
                  }
                >
                  <MessageSquare size={14} /> Comment
                </button>

                <button
                  style={styles.actionBtn}
                  onClick={() => sharePost(p.id)}
                >
                  <Share2 size={14} /> Share
                </button>
              </div>

              {openComments === p.id && (
                <div style={styles.commentBox}>
                  <input
                    value={
  commentTexts[
    p.id
  ] || ""
}
                    onChange={(e) =>
  setCommentTexts(
    (prev) => ({
      ...prev,
      [p.id]:
        e.target.value,
    })
  )
}
                    placeholder="Write comment..."
                    style={styles.commentInput}
                  />

                  <button
                    onClick={() => addComment(p.id)}
                    style={styles.commentBtn}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
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

  shield: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "1px solid #333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

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

  toggleRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  toggleBtn: {
    padding: "10px 18px",
    borderRadius: 16,
    border: "1px solid #333",
    background: "transparent",
    color: "#EAEAF0",
    fontSize: 15,
    fontWeight: 500,
    minWidth: 120,
  },

  createBox: {
    maxWidth: 620,
    margin: "0 auto 24px",
    padding: 20,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 24,
    backdropFilter: "blur(18px)",
    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 16,
    marginBottom: 12,
    borderRadius: 18,
    background: "#0E0E14",
    border: "1px solid #23232D",
    color: "#fff",
    fontSize: 15,
  },

  postBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(135deg,#7B2FFF,#39FF88)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    boxShadow:
      "0 8px 24px rgba(123,47,255,.25)",
  },

  feed: {
    maxWidth: 600,
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
