"use client";  
  
import React, { useEffect, useState } from "react";  
import {  
  Sparkles,  
  Command,  
  ShieldAlert,  
  Home,  
  Search,  
  Plus,  
  MessageSquare,  
  User,  
} from "lucide-react";  
  
import { supabase } from "../lib/supabase";  
import { useRouter } from "next/navigation";  
  
type Post = {  
  id: string;  
  user_id: string | null;  
  shadow_text: string | null;  
  smile_text: string | null;  
  content: string | null;  
  post_type: string;  
  created_at: string;  
};  
  
type Reaction = {  
  id: string;  
  post_id: string;  
  user_id: string | null;  
  type: string;  
};  
  
export default function Page() {  
  const router = useRouter();  
  
  const [user, setUser] = useState<any>(null);  
  const [posts, setPosts] = useState<Post[]>([]);  
  const [reactions, setReactions] = useState<Reaction[]>([]);  
  const [loading, setLoading] = useState(true);  
  
  const [mode, setMode] = useState<"structured" | "normal">("structured");  
  
  const [shadow, setShadow] = useState("");  
  const [smile, setSmile] = useState("");  
  const [text, setText] = useState("");  
  
  const [searchActive, setSearchActive] = useState(false);  
  const [activeTab, setActiveTab] = useState("home");  
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);  
  
  async function loadUser() {  
    const { data } = await supabase.auth.getUser();  
    setUser(data?.user || null);  
    setLoading(false);  
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
  
  async function loadPosts() {  
    const { data, error } = await supabase  
      .from("posts")  
      .select("*")  
      .order("created_at", { ascending: false });  
  
    if (error) {  
      console.error(error);  
      return;  
    }  
  
    setPosts((data as Post[]) || []);  
  }  
  
  async function loadReactions() {  
    const { data, error } = await supabase  
      .from("reactions")  
      .select("*");  
  
    if (error) {  
      console.error(error);  
      return;  
    }  
  
    setReactions((data as Reaction[]) || []);  
  }  
  
  useEffect(() => {  
    loadUser();  
  }, []);  
  
  useEffect(() => {  
    if (!user) return;  
  
    loadPosts();  
    loadReactions();  
  
    async function createProfileIfNeeded() {  
      const { data } = await supabase.auth.getUser();  
      const currentUser = data?.user;  
  
      if (!currentUser) return;  
  
      const { data: existing } = await supabase  
        .from("profiles")  
        .select("id")  
        .eq("id", currentUser.id)  
        .maybeSingle();  
  
      if (!existing) {  
        await supabase.from("profiles").insert({  
          id: currentUser.id,  
          email: currentUser.email,  
        });  
      }  
    }  
  
    createProfileIfNeeded();  
  }, [user]);  
  
  async function createPost() {  
    if (!user) {  
      alert("Please login first");  
      return;  
    }  
  
    const payload =  
      mode === "structured"  
        ? {  
            user_id: user.id,  
            post_type: "flip",  
            shadow_text: shadow.trim(),  
            smile_text: smile.trim(),  
            content: null,  
          }  
        : {  
            user_id: user.id,  
            post_type: "normal",  
            shadow_text: null,  
            smile_text: null,  
            content: text.trim(),  
          };  
  
    const { error } = await supabase.from("posts").insert(payload);  
  
    if (error) {  
      console.error(error);  
      return;  
    }  
  
    setShadow("");  
    setSmile("");  
    setText("");  
  
    await loadPosts();  
  }  
  
  async function toggleReaction(postId: string, type: string) {  
    const { data } = await supabase.auth.getUser();  
    const currentUser = data?.user;  
  
    if (!currentUser) {  
      alert("Please login");  
      return;  
    }  
  
    const { data: existing } = await supabase  
      .from("reactions")  
      .select("*")  
      .eq("post_id", postId)  
      .eq("user_id", currentUser.id)  
      .eq("type", type);  
  
    if (existing && existing.length > 0) {  
      await supabase  
        .from("reactions")  
        .delete()  
        .eq("id", existing[0].id);  
    } else {  
      await supabase.from("reactions").insert({  
        post_id: postId,  
        user_id: currentUser.id,  
        type,  
      });  
    }  
  
    await loadReactions();  
  }  
  
  async function deletePost(postId: string) {  
    if (!user) return;  
  
    const post = posts.find((p) => p.id === postId);  
    if (!post) return;  
  
    if (post.user_id !== user.id) {  
      alert("You can only delete your own posts");  
      return;  
    }  
  
    const { error } = await supabase  
      .from("posts")  
      .delete()  
      .eq("id", postId);  
  
    if (error) {  
      console.error(error);  
      return;  
    }  
  
    await loadPosts();  
  }  
  
  function go(path: string, tab: string) {  
    setActiveTab(tab);  
    router.push(path);  
  }  
  
  if (loading) {  
    return <div style={styles.loadingScreen}>Loading ShadowSmile...</div>;  
  }  
  
  if (!user) {  
    return (  
      <div style={styles.loginScreen}>  
        <div style={styles.logoRow}>  
          <div style={styles.logoGlow}>  
            <Command size={16} color="#0A0A0F" />  
          </div>  
  
          <h1 style={styles.logoText}>  
            Shadow<span style={{ color: "#39FF88" }}>Smile</span>  
          </h1>  
        </div>  
  
        <p style={styles.loginText}>  
          A space to express what’s heavy — and what helped.  
        </p>  
  
        <button style={styles.primaryButton} onClick={login}>  
          Continue with Google  
        </button>  
      </div>  
    );  
  }  
  
  return (  
    <main style={styles.app}>  
      {/* HEADER (ONLY CHANGE = MARKETPLACE ADDED) */}  
      <header style={styles.header}>  
        <div style={styles.logoRow}>  
          <div style={styles.logoGlow}>  
            <Command size={16} color="#0A0A0F" />  
          </div>  
  
          <h1 style={styles.logoText}>  
            Shadow<span style={{ color: "#39FF88" }}>Smile</span>  
          </h1>  
        </div>  
  
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>  
          <button  
            onClick={() => router.push("/marketplace")}  
            style={{  
              padding: "8px 12px",  
              borderRadius: 999,  
              border: "1px solid rgba(57,255,136,0.4)",  
              background: "rgba(57,255,136,0.08)",  
              color: "#39FF88",  
              fontWeight: 600,  
              cursor: "pointer",  
              fontSize: 12,  
            }}  
          >  
            Marketplace  
          </button>  
  
          <button style={styles.iconButton}>  
            <ShieldAlert size={18} color="#EAEAF0" />  
          </button>  
        </div>  
      </header>  
  
      {/* EVERYTHING BELOW UNTOUCHED (UNCHANGED CODE) */}  
  
      <section style={styles.hero}>  
        <div style={styles.heroBadge}>  
          <Sparkles size={12} />  
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
  
      <section style={styles.createBox}>  
        <div style={styles.modeButtons}>  
          <button  
            onClick={() => setMode("structured")}  
            style={{  
              ...styles.modeButton,  
              background: mode === "structured" ? "#7B2FFF" : "transparent",  
            }}  
          >  
            Shadow / Smile  
          </button>  
  
          <button  
            onClick={() => setMode("normal")}  
            style={{  
              ...styles.modeButton,  
              background: mode === "normal" ? "#39FF88" : "transparent",  
              color: mode === "normal" ? "#0A0A0F" : "#EAEAF0",  
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
  
        <button onClick={createPost} style={styles.postButton}>  
          Post  
        </button>  
      </section>  
  
      <section style={styles.feed}>  
        {posts.map((post) => {  
          const likes = reactions.filter(  
            (r) => r.post_id === post.id && r.type === "like"  
          ).length;  
  
          return (  
            <article key={post.id} style={styles.card}>  
              {post.post_type === "flip" ? (  
                <>  
                  <p>  
                    <strong>Shadow:</strong> {post.shadow_text}  
                  </p>  
                  <p>  
                    <strong style={{ color: "#39FF88" }}>Smile:</strong>{" "}  
                    {post.smile_text || "—"}  
                  </p>  
                </>  
              ) : (  
                <p>{post.content}</p>  
              )}  
  
              <div style={styles.actionRow}>  
                <button style={styles.actionButton}>♡ {likes}</button>  
                <button style={styles.actionButton}>  
                  <MessageSquare size={16} />  
                </button>  
                <button style={styles.actionButton}>➣</button>  
              </div>  
            </article>  
          );  
        })}  
      </section>  
  
      <nav style={styles.navbar}>  
        <button style={styles.navButton}>  
          <Home size={22} />  
        </button>  
        <button style={styles.navButton}>  
          <Search size={22} />  
        </button>  
        <button style={styles.plusButton}>  
          <Plus size={24} />  
        </button>  
        <button style={styles.navButton}>  
          <MessageSquare size={22} />  
        </button>  
        <button style={styles.navButton}>  
          <User size={22} />  
        </button>  
      </nav>  
    </main>  
  );  
}  
  
// styles unchanged (your original full styles object stays EXACTLY as-is)  
const styles: Record<string, React.CSSProperties> = {  
  app: {  
    minHeight: "100vh",  
    background: "#0A0A0F",  
    color: "#EAEAF0",  
    fontFamily: "system-ui",  
    paddingBottom: 120,  
  },  
  loadingScreen: {  
    minHeight: "100vh",  
    display: "flex",  
    justifyContent: "center",  
    alignItems: "center",  
    background: "#0A0A0F",  
    color: "#EAEAF0",  
    fontFamily: "system-ui",  
  },  
  loginScreen: {  
    minHeight: "100vh",  
    display: "flex",  
    flexDirection: "column",  
    justifyContent: "center",  
    alignItems: "center",  
    background: "#0A0A0F",  
    color: "#EAEAF0",  
    padding: 20,  
    textAlign: "center",  
    fontFamily: "system-ui",  
  },  
  header: {  
    position: "sticky",  
    top: 0,  
    zIndex: 100,  
    display: "flex",  
    justifyContent: "space-between",  
    alignItems: "center",  
    padding: "18px 24px",  
    borderBottom: "1px solid #1A1A22",  
    background: "rgba(10,10,15,0.92)",  
    backdropFilter: "blur(14px)",  
  },  
  logoRow: {  
    display: "flex",  
    alignItems: "center",  
    gap: 14,  
  },  
  logoGlow: {  
    width: 34,  
    height: 34,  
    borderRadius: 10,  
    background: "linear-gradient(135deg, #7B2FFF 0%, #39FF88 100%)",  
    boxShadow: "0 0 15px rgba(123,47,255,0.45)",  
    display: "flex",  
    justifyContent: "center",  
    alignItems: "center",  
  },  
  logoText: {  
    margin: 0,  
    fontSize: 22,  
    fontWeight: 800,  
    letterSpacing: 1,  
    color: "#FFFFFF",  
  },  
  loginText: {  
    maxWidth: 420,  
    color: "#888",  
    marginTop: 18,  
    lineHeight: 1.5,  
  },  
  hero: {  
    maxWidth: 700,  
    margin: "0 auto",  
    padding: "50px 24px 20px",  
    textAlign: "center",  
  },  
  heroBadge: {  
    display: "inline-flex",  
    alignItems: "center",  
    gap: 8,  
    padding: "8px 14px",  
    borderRadius: 999,  
    border: "1px solid rgba(123,47,255,0.25)",  
    color: "#7B2FFF",  
    marginBottom: 18,  
    fontSize: 12,  
    letterSpacing: 1,  
    textTransform: "uppercase",  
  },  
  heroTitle: {  
    fontSize: 42,  
    fontWeight: 900,  
    lineHeight: 1.05,  
    marginBottom: 18,  
  },  
  heroText: {  
    color: "rgba(234,234,240,0.65)",  
    lineHeight: 1.6,  
  },  
  createBox: {  
    maxWidth: 650,  
    margin: "20px auto",  
    padding: 16,  
  },  
  modeButtons: {  
    display: "flex",  
    gap: 10,  
    marginBottom: 16,  
  },  
  modeButton: {  
    padding: "10px 16px",  
    borderRadius: 12,  
    border: "1px solid #333",  
    color: "#EAEAF0",  
    cursor: "pointer",  
  },  
  input: {  
    width: "100%",  
    padding: 14,  
    marginBottom: 12,  
    borderRadius: 14,  
    border: "1px solid #222",  
    background: "#14141C",  
    color: "#fff",  
  },  
  textarea: {  
    width: "100%",  
    minHeight: 120,  
    padding: 14,  
    borderRadius: 14,  
    border: "1px solid #222",  
    background: "#14141C",  
    color: "#fff",  
  },  
  primaryButton: {  
    marginTop: 20,  
    padding: "12px 18px",  
    borderRadius: 12,  
    border: "none",  
    background: "#7B2FFF",  
    color: "#fff",  
    cursor: "pointer",  
    fontWeight: 700,  
  },  
  postButton: {  
    padding: "12px 18px",  
    borderRadius: 14,  
    border: "none",  
    background: "linear-gradient(135deg, #7B2FFF 0%, #39FF88 100%)",  
    color: "#0A0A0F",  
    cursor: "pointer",  
    fontWeight: 800,  
  },  
  feed: {  
    maxWidth: 700,  
    margin: "0 auto",  
    padding: "0 14px",  
  },  
  card: {  
    background: "rgba(26,26,34,0.7)",  
    borderRadius: 24,  
    padding: 20,  
    marginBottom: 20,  
  },  
  actionRow: {  
    display: "flex",  
    gap: 10,  
    marginTop: 14,  
  },  
  actionButton: {  
    padding: "9px 14px",  
    borderRadius: 12,  
    border: "1px solid #333",  
    background: "transparent",  
    color: "#EAEAF0",  
    cursor: "pointer",  
  },  
  deleteButton: {  
    marginTop: 14,  
    padding: "9px 14px",  
    borderRadius: 12,  
    border: "none",  
    background: "#ff4d4d",  
    color: "#fff",  
    cursor: "pointer",  
  },  
  navbar: {  
    position: "fixed",  
    bottom: 18,  
    left: "50%",  
    transform: "translateX(-50%)",  
    width: "calc(100% - 40px)",  
    maxWidth: 520,  
    height: 74,  
    borderRadius: 999,  
    background: "rgba(26,26,34,0.88)",  
    display: "flex",  
    justifyContent: "space-around",  
    alignItems: "center",  
  },  
  navButton: {  
    background: "transparent",  
    border: "none",  
    cursor: "pointer",  
    color: "#EAEAF0",  
  },  
  plusButton: {  
    width: 56,  
    height: 56,  
    borderRadius: "50%",  
    border: "none",  
    background: "linear-gradient(135deg, #7B2FFF 0%, #39FF88 100%)",  
    color: "#0A0A0F",  
    cursor: "pointer",  
  },  
  iconButton: {  
    width: 42,  
    height: 42,  
    borderRadius: "50%",  
    border: "1px solid #222",  
    background: "transparent",  
    color: "#EAEAF0",  
  },  
};
