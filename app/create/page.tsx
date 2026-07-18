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

  const [facingMode, setFacingMode] =
    useState<"user" | "environment">(
      "environment"
    );

  const [isAnonymous, setIsAnonymous] =
    useState(false);

  const [loadingUser, setLoadingUser] = useState(true);

  const [posting, setPosting] = useState(false);

  const [isRecording, setIsRecording] =
    useState(false);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

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

async function openCamera() {

  streamRef.current
    ?.getTracks()
    .forEach((track) => track.stop());

  try {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: facingMode,
          },
        },
        audio: true,
      });

        streamRef.current = stream;

    setCameraOpen(true);

  } catch (error: any) {
  console.error(error);

  if (error.name === "NotAllowedError") {
    alert(
      "Camera and microphone permissions were denied."
    );
  } else if (error.name === "NotFoundError") {
    alert(
      "No camera or microphone was found."
    );
  } else {
    alert(
      "Unable to access your camera and microphone."
    );
  }
}
}

async function toggleRecording() {
  if (!streamRef.current) {
    return;
  }

  if (isRecording) {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    return;
  }

  const chunks: Blob[] = [];

  const recorder =
  new MediaRecorder(
    streamRef.current
  );

  mediaRecorderRef.current = recorder;

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, {
      type: "video/webm",
    });

    const file = new File(
      [blob],
      "camera-video.webm",
      {
        type: "video/webm",
      }
    );

    setImage(file);

    setImagePreview(
      URL.createObjectURL(blob)
    );

    console.log(
      "Video captured"
    );
  };

  recorder.start();

  setIsRecording(true);
}

async function capturePhoto() {

  if (
    !videoRef.current ||
    !streamRef.current
  ) {
    return;
  }

  const video =
    videoRef.current;


  const canvas =
    document.createElement("canvas");


  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;


  const context =
    canvas.getContext("2d");


  if (!context) {
    return;
  }


  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );


  canvas.toBlob((blob) => {

    if (!blob) {
      return;
    }


    const file =
      new File(
        [blob],
        "camera-photo.jpg",
        {
          type: "image/jpeg",
        }
      );


    setImage(file);

    setImagePreview(
      URL.createObjectURL(blob)
    );


    console.log(
      "Photo captured"
    );


  }, "image/jpeg");

}

async function switchCamera() {

  streamRef.current
    ?.getTracks()
    .forEach((track) => {
      track.stop();
    });


  const newMode =
    facingMode === "environment"
      ? "user"
      : "environment";


  setFacingMode(newMode);


  try {

    const stream =
  await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {
        ideal: newMode,
      },
    },
    audio: true,
  });

    streamRef.current = stream;


    if (videoRef.current) {
      videoRef.current.srcObject =
        stream;
    }


  } catch (error) {

    console.error(error);

    alert(
      "Unable to switch camera."
    );

  }

}

useEffect(() => {
  if (
    !cameraOpen ||
    !videoRef.current ||
    !streamRef.current
  ) {
    return;
  }

  const video = videoRef.current;

  video.srcObject = streamRef.current;

  video.play().catch(console.error);

}, [cameraOpen]);

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
  const safeName = image.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  const fileName =
    `${user.id}/${Date.now()}-${safeName}`;

  const { error: uploadError } =
    await supabase.storage
      .from("posts")
      .upload(
        fileName,
        image,
        {
          contentType: image.type,
        }
      );

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
        media_url: imageUrl,
        media_type: image?.type.startsWith("video")
          ? "video"
          : image
          ? "image"
          : null,
        is_anonymous: isAnonymous,
      }
    : {
        user_id: user.id,
        post_type: "normal",
        content: text,
        shadow_text: null,
        smile_text: null,
        media_url: imageUrl,
        media_type: image?.type.startsWith("video")
          ? "video"
          : image
          ? "image"
          : null,
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
    onClick={openCamera}
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
  image?.type.startsWith("video") ? (
    <video
      src={imagePreview}
      controls
      style={styles.previewImage}
    />
  ) : (
    <img
      src={imagePreview}
      alt="Preview"
      style={styles.previewImage}
    />
  )
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

{cameraOpen && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "#000",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
    }}
  >

<div
  style={{
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    zIndex: 10001,
  }}
>

  {/* RECORD */}
  <button
    type="button"
    onClick={toggleRecording}
    style={styles.recordButton}
  >
    <div
      style={{
        width: isRecording ? 28 : 34,
        height: isRecording ? 28 : 34,
        borderRadius: isRecording ? 6 : "50%",
        background: "#ff0000",
      }}
    />
  </button>


  {/* PHOTO */}
  <button
    type="button"
    onClick={capturePhoto}
    style={styles.captureButton}
  >
    <div
      style={{
        width: 55,
        height: 55,
        borderRadius: "50%",
        background: "#fff",
      }}
    />
  </button>


  {/* SWITCH CAMERA */}
  <button
    type="button"
    onClick={switchCamera}
    style={styles.recordButton}
  >
    🔄
  </button>

</div>

{/* CLOSE TOP RIGHT */}
<button
  type="button"
  onClick={() => {
  if (isRecording) {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  streamRef.current?.getTracks().forEach((track) => track.stop());

  streamRef.current = null;

  setCameraOpen(false);
}}
  style={styles.closeCameraButton}
>
  ✕
</button>

    <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>

  </div>
)}

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

closeCameraButton: {
  position: "absolute",
  top: 20,
  right: 20,
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.65)",
  color: "#fff",
  fontSize: 24,
  fontWeight: 700,
  cursor: "pointer",
  zIndex: 10001,
},

cameraControls: {
  position: "absolute",
  bottom: 30,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 35,
  zIndex: 10000,
},

recordButton: {
  width: 82,
  height: 82,
  borderRadius: "50%",
  border: "4px solid white",
  background: "rgba(0,0,0,.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
},

captureButton: {
  width: 96,
  height: 96,
  borderRadius: "50%",
  border: "5px solid white",
  background: "rgba(0,0,0,.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
},

recordIcon: {
  width: 26,
  height: 26,
  borderRadius: "50%",
  background: "#ff2d2d",
},

stopIcon: {
  width: 24,
  height: 24,
  borderRadius: 6,
  background: "#ff2d2d",
},
};
