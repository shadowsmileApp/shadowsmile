"use client";

import React, {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase-browser";

export default function CreatePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [mode, setMode] = useState<"structured" | "normal">("structured");

  const [shadow, setShadow] = useState("");
  const [smile, setSmile] = useState("");
  const [text, setText] = useState("");

const [isAnonymous, setIsAnonymous] =
  useState(false);

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

  /* ================= CREATE POST ================= */

  async function createPost() {
    if (!user) {
      alert("You must be logged in");
      return;
    }

    if (mode === "structured" && (!shadow || !smile)) {
      alert("Fill both Shadow and Smile");
      return;
    }

    if (mode === "normal" && !text) {
      alert("Write something first");
      return;
    }

    setLoading(true);

    const payload =
      mode === "structured"
        ? {
  user_id: user.id,
  post_type: "flip",
  shadow_text: shadow,
  smile_text: smile,
  content: null,
  is_anonymous: isAnonymous,
}
        : {
            user_id: user.id,
            post_type: "normal",
            content: text,
            shadow_text: null,
            smile_text: null,
            is_anonymous: isAnonymous,
          };

    const { error } = await supabase.from("posts").insert(payload);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to create post");
      return;
    }

    // reset fields
    setShadow("");
    setSmile("");
    setText("");
    setIsAnonymous(false);

    // go back to feed
    router.push("/");
  }

  /* ================= UI ================= */

if (loading) {
  return (
    <div style={styles.page}>
      <p>Loading...</p>
    </div>
  );
}

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Create Post</h1>

      {/* MODE SWITCH */}
      <div style={styles.toggleRow}>
        <button
          onClick={() => setMode("structured")}
          style={{
            ...styles.toggleBtn,
            background: mode === "structured" ? "#7B2FFF" : "#111",
          }}
        >
          Shadow / Smile
        </button>

        <button
          onClick={() => setMode("normal")}
          style={{
            ...styles.toggleBtn,
            background: mode === "normal" ? "#39FF88" : "#111",
            color: mode === "normal" ? "#000" : "#fff",
          }}
        >
          Normal
        </button>
      </div>

      {/* INPUTS */}
      <div style={styles.box}>
        {mode === "structured" ? (
          <>
            <input
              placeholder="Shadow thought..."
              value={shadow}
              onChange={(e) => setShadow(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="What helped?"
              value={smile}
              onChange={(e) => setSmile(e.target.value)}
              style={styles.input}
            />
          </>
        ) : (
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
          />
        )}

        {/* BUTTON */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
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
        <button onClick={createPost} style={styles.button}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
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

  title: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 20,
  },

  toggleRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },

  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #333",
    color: "#fff",
    cursor: "pointer",
  },

  box: {
    maxWidth: 500,
    margin: "0 auto",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    background: "#111",
    border: "1px solid #222",
    color: "#fff",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 120,
    padding: 12,
    borderRadius: 10,
    background: "#111",
    border: "1px solid #222",
    color: "#fff",
  },

  button: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
    fontWeight: 800,
    border: "none",
    cursor: "pointer",
  },
};
