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
<section style={styles.hero}>
  <div style={styles.badge}>
    Platform Core
  </div>

  <h2 style={styles.heroTitle}>
    Express the Shadow.
    <br />
    Share the Smile.
  </h2>

  <p style={styles.heroText}>
    A safe social space for honesty, support, healing, and connection.
  </p>
</section>

      {/* INPUTS */}
      <div style={styles.createBox}>

      {/* MODE SWITCH */}
      <div style={styles.modeButtons}>
        <button
          onClick={() => setMode("structured")}
          style={{
            ...styles.modeButton,
            background: mode === "structured" ? "#7B2FFF" : "#111",
          }}
        >
          Shadow / Smile
        </button>

        <button
          onClick={() => setMode("normal")}
          style={{
            ...styles.modeButton,
            background: mode === "normal" ? "#39FF88" : "#111",
            color: mode === "normal" ? "#000" : "#fff",
          }}
        >
          Normal
        </button>
      </div>

        {mode === "structured" ? (
          <>
            <input
              placeholder="What's weighing on you?"
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
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
          />
        )}

        {/* BUTTON */}
{mode === "structured" && (
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
)}

        <button onClick={createPost} style={styles.postButton}>
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

hero: {
  padding: "20px 20px 30px",
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

  modeButtons: {
  display: "flex",
  gap: 10,
  marginBottom: 16,
},

  modeButton: {
  flex: 1,
  padding: "12px",
  borderRadius: 12,
  border: "1px solid #333",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  transition: "all .2s ease",
},

  createBox: {
  maxWidth: 600,
  margin: "0 auto 40px",
  padding: 18,
  borderRadius: 22,
  background: "linear-gradient(180deg,#111,#0D0D12)",
  border: "1px solid #222",
},

  input: {
  width: "100%",
  boxSizing: "border-box",
  padding: 14,
  marginBottom: 12,
  borderRadius: 12,
  background: "#111",
  border: "1px solid #222",
  color: "#fff",
  outline: "none",
  fontSize: 15,
},

  textarea: {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 140,
  padding: 14,
  borderRadius: 12,
  background: "#111",
  border: "1px solid #222",
  color: "#fff",
  outline: "none",
  fontSize: 15,
  resize: "vertical",
},

  postButton: {
  width: "100%",
  marginTop: 16,
  padding: 14,
  borderRadius: 14,
  background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
  color: "#fff",
  fontWeight: 800,
  fontSize: 15,
  border: "none",
  cursor: "pointer",
  transition: "all .2s ease",
},
};
