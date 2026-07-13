"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase-browser";

export default function CreatePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [mode, setMode] = useState<"structured" | "normal">("structured");

  const [veil, setVeil] = useState("");
  const [unveil, setUnveil] = useState("");
  const [text, setText] = useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const galleryInputRef = useRef<HTMLInputElement>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [isAnonymous, setIsAnonymous] =
    useState(false);

  const [loadingUser, setLoadingUser] = useState(true);

  const [posting, setPosting] = useState(false);

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
      setLoadingUser(false);
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
    !loadingUser &&
    !user
  ) {
    router.push("/signin");
  }
}, [
  loadingUser,
  user,
  router,
]);

  /* ================= CREATE POST ================= */

  async function createPost() {
    try {

    if (!user) {
      alert("You must be logged in");
      return;
    }

    if (mode === "structured" && (!veil || !unveil)) {
      alert("Please complete both your Veil and Unveil.");
      return;
    }

if (
  mode === "normal" &&
  !text.trim() &&
  !image
) {
  alert("Write something or select an image.");
  return;
}

    setPosting(true);

let imageUrl: string | null = null;

if (image) {
  const fileName =
    `${user.id}/${Date.now()}-${image.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from("posts")
      .upload(fileName, image);

  if (uploadError) {
    console.error(uploadError);
    alert("Image upload failed");
    setPosting(false);
    return;
  }

  const { data } =
    supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

  imageUrl = data.publicUrl;
}

const payload =
      mode === "structured"
        ? {
  user_id: user.id,
  post_type: "flip",
  shadow_text: veil,
  smile_text: unveil,
  content: null,
  image_url: imageUrl,
  is_anonymous: isAnonymous,
}
        : {
            user_id: user.id,
            post_type: "normal",
            content: text,
            shadow_text: null,
            smile_text: null,
            image_url: imageUrl,
            is_anonymous: isAnonymous,
          };

    const { error } = await supabase.from("posts").insert(payload);

if (error) {
  setPosting(false);
  console.error(error);
  alert("Failed to create post");
  return;
}

setPosting(false);

    // reset fields
    setVeil("");
    setUnveil("");
    setText("");
    setIsAnonymous(false);
    setImage(null);
    setImagePreview("");

    // go back to feed
router.push("/");

  } catch (error) {
    console.error(error);
    alert("Something went wrong while creating your post.");
  } finally {
    setPosting(false);
  }
}

  /* ================= UI ================= */

if (loadingUser) {
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
    Share your Veil.
    <br />
    Unveil what keeps you going.
  </h2>

  <p style={styles.heroText}>
    Honest moments. Real growth. Enter As You Are.
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
          Veil / Unveil
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
  <div key="structured">

    <label
      style={{
        display: "block",
        marginBottom: 18,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        Veil
      </div>

      <div
        style={{
          color: "#8D8D98",
          fontSize: 13,
          marginTop: 4,
          marginBottom: 10,
        }}
      >
        What's something that's got you down?
      </div>

      <input
        value={veil}
        onChange={(e) => setVeil(e.target.value)}
        placeholder="Share your thoughts..."
        style={styles.input}
      />
    </label>

    <label
      style={{
        display: "block",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        Unveil
      </div>

      <div
        style={{
          color: "#8D8D98",
          fontSize: 13,
          marginTop: 4,
          marginBottom: 10,
        }}
      >
        What's helping you through it?
      </div>

      <input
        value={unveil}
        onChange={(e) => setUnveil(e.target.value)}
        placeholder="Share what's helping..."
        style={styles.input}
      />
    </label>

  </div>
) : (
          <div key="normal">
  <textarea
    placeholder="Write something..."
    value={text ?? ""}
    onChange={(e) => setText(e.target.value)}
    style={styles.textarea}
  />

  <div
  style={{
    display: "flex",
    gap: 12,
    marginTop: 14,
  }}
>
  <button
    type="button"
    style={styles.mediaButton}
    onClick={() => cameraInputRef.current?.click()}
  >
    📷 Camera
  </button>

  <button
    type="button"
    style={styles.mediaButton}
    onClick={() => galleryInputRef.current?.click()}
  >
    🖼️ Gallery
  </button>
</div>

<input
  ref={cameraInputRef}
  type="file"
  accept="image/*,video/*"
  capture="environment"
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }}
/>

<input
  ref={galleryInputRef}
  type="file"
  accept="image/*,video/*"
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }}
/>

  {imagePreview && (
    <img
      src={imagePreview}
      alt="Preview"
      style={styles.previewImage}
    />
  )}
</div>
        )}

        {/* Anonymous Toggle */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
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

        <button onClick={createPost} style={styles.postButton}>
          {posting ? "Posting..." : "Post"}
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
  width: "100%",
  maxWidth: 700,
  margin: "0 auto 40px",
  padding: 20,
  borderRadius: 22,
  background: "linear-gradient(180deg,#111,#0D0D12)",
  border: "1px solid #222",
  boxSizing: "border-box",

  display: "flex",
  flexDirection: "column",
  gap: 18,
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
  minHeight: 180,
  padding: 16,
  borderRadius: 16,
  background: "#111",
  border: "1px solid #222",
  color: "#fff",
  outline: "none",
  fontSize: 16,
  lineHeight: 1.5,
  resize: "vertical",
},

fileInput: {
  width: "100%",
  marginTop: 14,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #222",
  background: "#111",
  color: "#aaa",
  cursor: "pointer",
  boxSizing: "border-box",
},

mediaButton: {
  flex: 1,
  padding: "14px",
  borderRadius: 12,
  border: "1px solid #222",
  background: "#111",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
},

previewImage: {
  width: "100%",
  marginTop: 14,
  borderRadius: 16,
  objectFit: "cover",
  maxHeight: 450,
  border: "1px solid #222",
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
