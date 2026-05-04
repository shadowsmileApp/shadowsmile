"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Post = {
  id: string;
  user_id: string | null;
  shadow_text: string | null;
  smile_text: string | null;
  content: string | null;
  post_type: string;
  status: string;
  created_at: string;
};

type Reaction = {
  id: string;
  post_id: string;
  user_id: string | null;
  type: string;
};

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [user, setUser] = useState<any>(null);

  const [mode, setMode] = useState<"structured" | "normal">("structured");

  const [shadow, setShadow] = useState("");
  const [smile, setSmile] = useState("");
  const [text, setText] = useState("");

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data?.user || null);
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ LOAD ERROR:", error);
      return;
    }

    setPosts((data as Post[]) || []);
  }

  async function loadReactions() {
    const { data, error } = await supabase
      .from("reactions")
      .select("*");

    if (error) {
      console.error("❌ REACTIONS LOAD ERROR:", error);
      return;
    }

    setReactions((data as Reaction[]) || []);
  }

  useEffect(() => {
    loadUser();
    loadPosts();
    loadReactions();

    // ✅ SAFE PROFILE CREATION (does NOT break anything)
    const createProfileIfNeeded = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) return;

      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
        });
      }
    };

    createProfileIfNeeded();
  }, []);

  async function createPost() {
    const { error } = await supabase.from("posts").insert({
      user_id: null,
      post_type: mode === "structured" ? "flip" : "normal",
      shadow_text: mode === "structured" ? shadow.trim() : null,
      smile_text: mode === "structured" ? smile.trim() : null,
      status: "flipped",
      content: mode === "normal" ? text.trim() : null,
    });

    if (error) {
      console.error("❌ INSERT ERROR:", error);
      return;
    }

    setShadow("");
    setSmile("");
    setText("");

    await loadPosts();
  }

  // ✅ KEEP YOUR WORKING TOGGLE (UNCHANGED)
  async function toggleReaction(postId: string, type: string) {
    const { data: session } = await supabase.auth.getUser();
    const currentUser = session?.user;

    if (!currentUser) {
      alert("Please log in first");
      return;
    }

    const { data: existing, error: findError } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", currentUser.id)
      .eq("type", type);

    if (findError) {
      console.error("❌ FIND ERROR:", findError);
      return;
    }

    if (existing && existing.length > 0) {
      const { error: deleteError } = await supabase
        .from("reactions")
        .delete()
        .eq("id", existing[0].id);

      if (deleteError) {
        console.error("❌ DELETE ERROR:", deleteError);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("reactions").insert({
        post_id: postId,
        user_id: currentUser.id,
        type,
      });

      if (insertError) {
        console.error("❌ INSERT ERROR:", insertError);
        return;
      }
    }

    await loadReactions();
  }

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto", fontFamily: "system-ui, Arial" }}>
      <h1>ShadowSmile</h1>

      <div style={{ marginBottom: 10 }}>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Login with Google</button>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setMode("structured")}>Shadow / Smile</button>
        <button onClick={() => setMode("normal")} style={{ marginLeft: 10 }}>
          Normal
        </button>
      </div>

      <div style={{ marginTop: 15 }}>
        {mode === "structured" ? (
          <>
            <input
              placeholder="What's been weighing on you?"
              value={shadow}
              onChange={(e) => setShadow(e.target.value)}
              style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
            />

            <input
              placeholder="What helped, even a little?"
              value={smile}
              onChange={(e) => setSmile(e.target.value)}
              style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
            />
          </>
        ) : (
          <input
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
          />
        )}

        <button onClick={createPost} style={{ marginTop: 10 }}>
          Post
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => {
            const postReactions = reactions.filter((r) => r.post_id === post.id);

            return (
              <div
                key={post.id}
                style={{
                  border: "1px solid #333",
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 8,
                }}
              >
                {post.post_type === "flip" ? (
                  <>
                    <p><strong>Shadow:</strong> {post.shadow_text}</p>
                    <p><strong>Smile:</strong> {post.smile_text || "—"}</p>
                  </>
                ) : (
                  <p>{post.content}</p>
                )}

                <div style={{ marginTop: 10 }}>
                  <button onClick={() => toggleReaction(post.id, "heard")}>
                    ❤️ Heard ({postReactions.filter(r => r.type === "heard").length})
                  </button>

                  <button onClick={() => toggleReaction(post.id, "felt_this")} style={{ marginLeft: 8 }}>
                    💭 Felt ({postReactions.filter(r => r.type === "felt_this").length})
                  </button>

                  <button onClick={() => toggleReaction(post.id, "helped")} style={{ marginLeft: 8 }}>
                    🌱 Helped ({postReactions.filter(r => r.type === "helped").length})
                  </button>
                </div>

                <small style={{ color: "#777" }}>
                  {new Date(post.created_at).toLocaleString()}
                </small>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
