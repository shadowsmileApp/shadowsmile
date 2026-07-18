"use client";

  import React, {
    useEffect,
    useState,
  } from "react";

  import Image from "next/image";

  import PostCard from "../../../components/PostCard";

  import {
    useParams,
    useRouter,
  } from "next/navigation";

  import { supabase }
    from "../../../lib/supabase-browser";

import { User }
  from "@supabase/supabase-js";

  import {
    Heart,
    MessageSquare,
    Settings,
  } from "lucide-react";

type Post = {
  id: string;
  user_id: string;
  post_type: string;
  shadow_text: string | null;
  smile_text: string | null;
  content: string | null;
  media_url?: string | null;

  media_type?: "image" | "video" | null;
  created_at: string;
};

type Profile = {
  id: string;
  handle: string | null;
  display_name: string | null;

  first_name: string | null;
  last_name: string | null;

  bio: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : params.id?.[0];

  const router = useRouter();

  const [currentUser, setCurrentUser] =
  useState<User | null>(null);

const [profile, setProfile] =
  useState<Profile | null>(null);

const [posts, setPosts] =
  useState<Post[]>([]);

const [loading, setLoading] =
  useState(true);

const [profileLoading, setProfileLoading] =
  useState(true);

const [isMobile, setIsMobile] =
  useState(false);

const [bioExpanded, setBioExpanded] =
  useState(false);

const [editName, setEditName] =
  useState("");

const [editBio, setEditBio] =
  useState("");

const [saving, setSaving] =
  useState(false);

const [avatarFile, setAvatarFile] =
  useState<File | null>(null);

const [openComments, setOpenComments] =
  useState<string | null>(null);

const [commentTexts, setCommentTexts] =
  useState<Record<string, string>>({});

const [comments, setComments] =
  useState<any[]>([]);

/* ================= FOLLOW SYSTEM ================= */

const [isFollowing, setIsFollowing] =
  useState<boolean | null>(null);

const [followLoading, setFollowLoading] =
  useState(false);

  const [stats, setStats] = useState({
    postCount: 0,
    likesReceived: 0,
  });

const [socialStats, setSocialStats] =
  useState({
    followers: 0,
    following: 0,
  });

  /* ================= LOAD USER ================= */

useEffect(() => {
  async function loadUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setCurrentUser(
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
  const checkMobile = () => {
    setIsMobile(
      window.innerWidth < 768
    );
  };

  checkMobile();

  window.addEventListener(
    "resize",
    checkMobile
  );

  return () => {
    window.removeEventListener(
      "resize",
      checkMobile
    );
  };
}, []);

useEffect(() => {
  if (
    !loading &&
    !currentUser
  ) {
    router.push("/signin");
  }
}, [
  loading,
  currentUser,
  router,
]);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
  async function loadProfile() {
    if (!id) return;

    setProfileLoading(true);
    setIsFollowing(null);

    const { data, error } =
      await supabase
        .from("profiles")
        .select(`
  id,
  handle,
  display_name,
  first_name,
  last_name,
  bio,
  avatar_url,
  role,
  created_at
`)
        .eq("id", id)
        .maybeSingle();
    if (error) {
      console.error(error);
      return;
    }

    if (!data) {
      setProfileLoading(false);
      router.replace("/search");
      return;
    }

    setProfile(data);

    setEditName(
      data?.display_name || ""
    );

    setEditBio(
      data?.bio || ""
    );

/* LOAD FOLLOW STATS */

const [
  followersResult,
  followingResult,
] = await Promise.all([
  supabase
    .from("followers")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("following_id", id),

  supabase
    .from("followers")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("follower_id", id),
]);

if (followersResult.error) {
  console.error(
    "Followers count error",
    followersResult.error
  );
}

if (followingResult.error) {
  console.error(
    "Following count error",
    followingResult.error
  );
}

setSocialStats({
  followers:
    followersResult.error
      ? 0
      : followersResult.count || 0,

  following:
    followingResult.error
      ? 0
      : followingResult.count || 0,
});

setProfileLoading(false);

  }

  loadProfile();
}, [id]);

/* ================= CHECK FOLLOW STATUS ================= */

useEffect(() => {
  async function checkFollowStatus() {
    if (
      !currentUser?.id ||
      !profile?.id ||
      currentUser.id === profile.id
    ) {
      return;
    }

    const { data, error } =
      await supabase
        .from("followers")
        .select("id")
        .eq(
          "follower_id",
          currentUser.id
        )
        .eq(
          "following_id",
          profile.id
        )
        .maybeSingle();

    if (error) {
  console.log(
    "FOLLOW ERROR:",
    JSON.stringify(error, null, 2)
  );
  alert(
    JSON.stringify(error, null, 2)
  );
  return;
}

    setIsFollowing(!!data);
  }

  checkFollowStatus();
}, [
  currentUser,
  profile,
]);

/* ================= LIKE ================= */

async function likePost(postId: string) {
  if (!currentUser) {
    router.push("/signin");
    return;
  }

  const { data: existingLike } =
    await supabase
      .from("reactions")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", currentUser.id)
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
        user_id: currentUser.id,
        type: "like",
      });
  }

await loadPosts();
}

/* ================= LOAD COMMENTS ================= */

async function loadComments(postIds: string[]) {
  if (!id) return;

    const { data: commentsData, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (
          id,
          handle,
          avatar_url
        )
      `)
      .in("post_id", postIds)
      .order("created_at", {
        ascending: true,
      });

  if (error) {
    console.error(error);
    return;
  }

  setComments(
  (commentsData || []).map((comment) => ({
    ...comment,
    profiles: comment.profiles ?? {
      id: comment.user_id,
      handle: "unknown",
      avatar_url: null,
    },
  }))
);
}

/* ================= COMMENT ================= */

async function addComment(postId: string) {
  if (!currentUser) {
    router.push("/signin");
    return;
  }

  if (!commentTexts[postId]?.trim()) {
    return;
  }

  const { error } =
    await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: currentUser.id,
        content: commentTexts[postId],
      });

  if (error) {
    console.error(error);
    return;
  }

  setCommentTexts((prev) => ({
  ...prev,
  [postId]: "",
}));

await loadComments(
  posts.map((p) => p.id)
);

setOpenComments(null);
}


/* ================= SHARE ================= */

async function sharePost(postId: string) {
  const link =
    `${window.location.origin}/post/${postId}`;

  try {
    await navigator.clipboard.writeText(link);
    console.log("Link copied");
  } catch {
    prompt("Copy this link:", link);
  }
}


/* ================= LOAD POSTS ================= */

  async function loadPosts() {
    try {
      if (!id) return;

    const { data, error } =
      await supabase
        .from("posts")
        .select("*")
        .eq("user_id", id)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(error);
      return;
    }

      const postsData = data || [];

const postIds =
  postsData.map((p) => p.id);

const { data: reactionsData } =
  await supabase
    .from("reactions")
    .select("post_id, type");

/* Format posts with shared data (future lib/posts.ts) */

const postsWithLikes =
  postsData.map((post) => {
    const likes =
      reactionsData?.filter(
        (r) =>
          r.post_id === post.id &&
          r.type === "like"
      ).length || 0;

    return {
      ...post,
      like_count: likes,
    };
  });

setPosts(postsWithLikes);

      await loadComments(postIds);

      let likesReceived = 0;

      if (postIds.length > 0) {
        const { data: reactions } =
          await supabase
            .from("reactions")
            .select("post_id, type")
            .in("post_id", postIds);

        likesReceived =
          reactions?.filter(
            (r) => r.type === "like"
          ).length || 0;
      }

            setStats({
        postCount: postsData.length,
        likesReceived,
      });

    } catch (error) {
      console.error(error);
    }
  }

useEffect(() => {
   void loadPosts();
  }, [id]);

/* ================= FOLLOW SYSTEM ================= */

async function toggleFollow() {

  console.log(
    "TOGGLE FOLLOW CLICKED"

  );

  if (
    !currentUser?.id ||
    !profile?.id
  ) return;

  // prevent self-follow
  if (
    currentUser.id === profile.id
  ) return;

  // prevent spam clicking
  if (followLoading) return;

  try {
    setFollowLoading(true);

    if (isFollowing) {

      const { error } =
        await supabase
          .from("followers")
          .delete()
          .eq(
            "follower_id",
            currentUser.id
          )
          .eq(
            "following_id",
            profile.id
          );

      if (error) {
  console.log(
    "FOLLOW ERROR:",
    JSON.stringify(error, null, 2)
  );
  alert(
    JSON.stringify(error, null, 2)
  );
  return;
}

      setIsFollowing(false);

setSocialStats((prev) => ({
  ...prev,
  followers:
    Math.max(
      0,
      prev.followers - 1
    ),
}));

    } else {

      const { error } =
        await supabase
          .from("followers")
          .insert({
            follower_id:
              currentUser.id,

            following_id:
              profile.id,
          });

      if (error) {
  console.log(
    "FOLLOW INSERT ERROR:",
    JSON.stringify(error, null, 2)
  );

  alert(
    JSON.stringify(error, null, 2)
  );

  return;
}

      setIsFollowing(true);

setSocialStats((prev) => ({
  ...prev,
  followers:
    prev.followers + 1,
}));

    }

  } finally {
    setFollowLoading(false);
  }
}

  /* ================= HANDLE ================= */

const displayName =
  `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
  profile?.display_name?.trim() ||
  "BlackMaltra Member";

const profileBio =
  profile?.bio?.trim()
    ? profile.bio
    : "No bio yet.";

  const displayHandle =
    profile?.handle?.trim()
      ? `@${profile.handle}`
      : `@member${profile?.id?.slice(0, 4) || "0000"}`;

  const isOwnProfile = currentUser?.id === profile?.id;

  /* ================= LOADING ================= */

if (
  loading ||
  profileLoading ||
  !currentUser ||
  !profile
) {
  return (
    <div style={styles.loading}>
      Loading profile...
    </div>
  );
}

  /* ================= UI ================= */

  return (
    <main
  style={{
  ...styles.page,
  paddingTop: isMobile ? 12 : 20,
  paddingLeft: isMobile ? 12 : 20,
  paddingRight: isMobile ? 12 : 20,
  paddingBottom: 120,
}}
>

      {/* PROFILE HEADER V2 */}
<section
  style={{
    ...styles.profileCard,
    padding: isMobile ? 16 : 28,
  }}
>
{isMobile ? (
<>
  <div
    style={{
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
    }}
  >

    {/* Avatar */}

    <div
      style={{
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        background:
          "linear-gradient(135deg,#7B2FFF,#39FF88)",
      }}
    >
      {profile?.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt="avatar"
          fill
          unoptimized
          priority
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 28,
          }}
        >
          {displayName
  .charAt(0)
  .toUpperCase()}
        </div>
      )}
    </div>

    {/* Right Side */}

    <div
      style={{
        flex: 1,
      }}
    >

      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        {displayName}
      </h1>

      <div
        style={{
          color: "#888",
          marginTop: 4,
          fontSize: 15,
        }}
      >
        {displayHandle}
      </div>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 12,
  }}
>

  <button
onClick={() =>
  alert("Followers list coming soon")
}
    style={{
      background: "none",
      border: "none",
      color: "#fff",
      padding: 0,
      cursor: "pointer",
    }}
  >
    <div
      style={{
        fontWeight: 800,
        fontSize: 20,
      }}
    >
      {socialStats.followers}
    </div>

    <div
      style={{
        fontSize: 12,
        color: "#888",
      }}
    >
      Veils
    </div>
  </button>

  <button
  onClick={() =>
    alert("Posts are below")
  }
  style={{
    background: "none",
    border: "none",
    color: "#fff",
    padding: 0,
    cursor: "pointer",
  }}
>
  <div
    style={{
      fontWeight: 800,
      fontSize: 20,
      textAlign: "center",
    }}
  >
    {stats.postCount}
  </div>

  <div
    style={{
      fontSize: 12,
      color: "#888",
    }}
  >
    Posts
  </div>
</button>

  <button
  onClick={() =>
    alert("Following list coming soon")
  }
  style={{
    background: "none",
    border: "none",
    color: "#fff",
    padding: 0,
    cursor: "pointer",
  }}
>
  <div
    style={{
      fontWeight: 800,
      fontSize: 20,
    }}
  >
    {socialStats.following}
  </div>

  <div
    style={{
      fontSize: 12,
      color: "#888",
    }}
  >
    Unveils
  </div>
</button>

</div>

    </div>

  </div>

{/* MOBILE BIO */}

<div
  style={{
    marginTop: 16,
    border: "1px solid #25252D",
    borderRadius: 16,
    padding: 14,
    background: "#15151A",
  }}
>
  <p
    style={{
      margin: 0,
      color: "#C9C9D1",
      lineHeight: 1.6,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp:
        !bioExpanded ? 3 : "unset",
      overflow: "hidden",
    }}
  >
    {profileBio}
  </p>

  {profileBio.length > 120 && (
    <button
      style={styles.bioExpandBtn}
      onClick={() =>
        setBioExpanded(!bioExpanded)
      }
    >
      {bioExpanded
        ? "Show Less"
        : "Read More"}
    </button>
  )}
</div>

    {!isOwnProfile && isFollowing !== null &&  (
  <div style={styles.mobileActionButtons}>
    <button
      style={{
        ...styles.followBtn,
        background: isFollowing
          ? "#1C1C24"
          : "linear-gradient(135deg,#7B2FFF,#9B5DFF)",
        border: isFollowing
          ? "1px solid #333"
          : "none",
      }}
      onClick={toggleFollow}
      disabled={followLoading}
    >
      {followLoading
        ? "Loading..."
        : isFollowing
        ? "Following"
        : "Follow"}
    </button>

    <button
  type="button"
  style={styles.messageBtn}
      onClick={() =>
  router.push(`/messages?user=${profile.id}`)
}
    >
      Message User
        </button>
  </div>
)}

<div
  style={{
    color: "#888",
    marginTop: 16,
    fontSize: 13,
    textAlign: "center",
  }}
>
  BlackMaltra member since{" "}
  {profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "Unknown"}
</div>

<div style={styles.mobileMetaRow}>
  {["admin", "founder"].includes(profile?.role || "") && (
    <div style={styles.mobileMetaItem}>
      Founder
    </div>
  )}

  {isOwnProfile && (
    <button
      style={styles.mobileSettingsBtn}
      onClick={() => router.push("/settings")}
    >
      <Settings size={18} />
    </button>
  )}
</div>

</>
) : (
  <div
  style={{
    ...styles.profileGrid,
    gridTemplateColumns: "190px 1fr",
  }}
>
    
    {/* LEFT SIDE — AVATAR */}
    <div
  style={{
    ...styles.avatarColumn,
       width : "auto",
  }}
>
      <div
  style={{
    ...styles.avatarLarge,
    width: 170,
    height: 170,
    fontSize: 48,
  }}
>
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt="avatar"
            fill
            unoptimized
            priority
            style={styles.avatarImage}
          />
        ) : (
          displayName.charAt(0).toUpperCase()
        )}
      </div>

{isOwnProfile && (
  <button
    style={styles.settingsBtn}
    onClick={() => router.push("/settings")}
  >
    <Settings size={16} />
    Settings
  </button>
)}


{!isOwnProfile && isFollowing !== null ? (
  <>
    <button
      style={{
        ...styles.followBtn,
        background: isFollowing
          ? "#1C1C24"
          : "linear-gradient(135deg,#7B2FFF,#9B5DFF)",
        border: isFollowing
          ? "1px solid #333"
          : "none",
      }}
      onClick={toggleFollow}
      disabled={followLoading}
    >
      {followLoading
        ? "Loading..."
        : isFollowing
        ? "Following"
        : "Follow"}
    </button>

    <button
  type="button"
  style={styles.messageBtn}
      onClick={() =>
  router.push(`/messages?user=${profile.id}`)
}
    >
      Message User
    </button>
  </>
) : 
null}
    </div>

    {/* RIGHT SIDE */}
    <div
  style={{
    ...styles.profileContent,
    textAlign: "left",
  }}
>
      
      {/* NAME AREA */}
      <div>
        <div
  style={{
    ...styles.identityRow,
    justifyContent: "flex-start",
  }}
>
          <h1 style={styles.displayName}>
            {displayName}
          </h1>

          {["admin", "founder"].includes(
  profile?.role || ""
) && (
  <div style={styles.founderBadge}>
    Founder
  </div>
)}
        </div>

        <h2 style={styles.handle}>
          {displayHandle}
        </h2>

        <p
  style={{
    ...styles.memberSince,
    textAlign: "left",
  }}
>
          BlackMaltra member since{" "}
          {profile?.created_at
            ? new Date(
                profile.created_at
              ).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>

      {/* COUNTERS */}
      <div
  style={{
    ...styles.counterBar,
    gridTemplateColumns:
      "repeat(3,1fr)",
  }}
>
  <button
type="button"
  style={styles.counterCard}
  onClick={() =>
    alert("Followers list coming soon")
  }
>
    <span style={styles.counterNumber}>
      {socialStats.followers}
    </span>

    <span style={styles.counterLabel}>
      Veils
    </span>
  </button>

  <button
type="button"
  style={styles.counterCard}
  onClick={() =>
    alert("Posts are below")
  }
>
  <span style={styles.counterNumber}>
    {stats.postCount}
  </span>

  <span style={styles.counterLabel}>
    Posts
  </span>
</button>

  <button
type="button"
  style={styles.counterCard}
  onClick={() =>
    alert("Following list coming soon")
  }
>
  <span style={styles.counterNumber}>
    {socialStats.following}
  </span>

  <span style={styles.counterLabel}>
    Unveils
  </span>
</button>
</div>

      {/* BIO */}
  <div style={styles.bioCard}>
  <p
  style={{
    ...styles.bio,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: !bioExpanded ? 3 : "unset",
    overflow: "hidden",
  }}
>
  {profileBio}
</p>

    {profileBio.length > 120 && (
      <button
        style={styles.bioExpandBtn}
        onClick={() =>
          setBioExpanded(!bioExpanded)
        }
      >
        {bioExpanded
          ? "Show Less"
          : "Read More"}
      </button>
    )}
  </div>

      {/* EDIT PROFILE */}
      {false && isOwnProfile && (
  <button
    style={{
      ...styles.editButton,
      width: "auto",
    }}
    onClick={() =>
      router.push("/settings/profile")
    }
  >
    Edit Profile
  </button>
)}

    </div>
  </div>
)}
</section>

      {/* POSTS */}
      <section style={styles.feed}>
        <h2 style={styles.sectionTitle}>
          Posts
        </h2>

        {posts.length === 0 ? (
          <p style={styles.emptyText}>
            No posts yet.
          </p>
        ) : (
          posts.map((p) => (
           <PostCard
             key={p.id}
             post={p}
             showHandle={false}
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
         ))
       )}
     </section>
   </main>
 );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg,#0A0A0F,#0E0E14)",
  color: "#EAEAF0",

  paddingTop: 20,
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 120,

  fontFamily: "system-ui",
},

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0A0A0F",
    color: "#fff",
  },

  header: {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: 20,
},

  settingsBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 700,
  },

  profileCard: {
  marginBottom: 24,
  background: "#111",
  border: "1px solid #222",
  borderRadius: 28,
  padding: 28,
},

profileGrid: {
  display: "grid",
  gridTemplateColumns: "190px 1fr",
  gap: 28,
  alignItems: "start",
},

avatarColumn: {
  display: "flex",
  flexDirection: "column",
  gap: 18,
  alignItems: "center",
},

avatarLarge: {
  position: "relative",
  overflow: "hidden",
  width: 170,
  height: 170,
  borderRadius: 24,
  background:
    "linear-gradient(135deg,#7B2FFF,#39FF88)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 48,
  fontWeight: 900,
  border: "1px solid rgba(123,47,255,.25)",
},

followBtn: {
  width: "100%",
  background:
    "linear-gradient(135deg,#7B2FFF,#9B5DFF)",
  border: "none",
  color: "#fff",
  padding: "14px 18px",
  borderRadius: 16,
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 16,
},

messageBtn: {
  width: "100%",
  background: "#15151A",
  border: "1px solid #333",
  color: "#fff",
  padding: "14px 18px",
  borderRadius: 16,
  cursor: "pointer",
  fontWeight: 700,
},

profileContent: {
  display: "flex",
  flexDirection: "column",
  gap: 20,
},

identityRow: {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
},

founderBadge: {
  padding: "8px 14px",
  borderRadius: 14,
  background: "rgba(123,47,255,.12)",
  border: "1px solid rgba(123,47,255,.3)",
  color: "#B88CFF",
  fontWeight: 700,
  fontSize: 13,
},

counterBar: {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 12,
},

counterCard: {
  background: "#15151A",
  border: "1px solid #25252D",
  borderRadius: 18,
  padding: "18px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
},

counterNumber: {
  fontSize: 30,
  fontWeight: 800,
  lineHeight: 1,
},

counterLabel: {
  fontSize: 14,
  color: "#888",
  marginTop: 4,
},

bioCard: {
  background: "#15151A",
  border: "1px solid #25252D",
  borderRadius: 20,
  padding: 18,
},

avatarImage: {
  objectFit: "cover",
},

  handle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#888",
  },

displayName: {
  fontSize: 28,
  fontWeight: 800,
  marginBottom: 6,
},

bio: {
  color: "#C9C9D1",
  lineHeight: 1.7,
  margin: 0,
  overflowWrap: "anywhere",
},

bioExpandBtn: {
  background: "transparent",
  border: "none",
  color: "#7B2FFF",
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 8,
  padding: 0,
},

  memberSince: {
  color: "#888",
  marginTop: 8,
},

editButton: {
  marginTop: 18,
  background:
    "linear-gradient(135deg,#7B2FFF,#39FF88)",
  border: "none",
  color: "#0A0A0F",
  padding: "12px 18px",
  borderRadius: 14,
  fontWeight: 800,
  cursor: "pointer",
},

editBox: {
  marginTop: 24,
  display: "flex",
  flexDirection: "column",
  gap: 12,
},

input: {
  background: "#111",
  border: "1px solid #222",
  borderRadius: 14,
  padding: 14,
  color: "#fff",
  fontSize: 16,
},

textarea: {
  background: "#111",
  border: "1px solid #222",
  borderRadius: 14,
  padding: 14,
  color: "#fff",
  minHeight: 120,
  resize: "none" as const,
  fontSize: 16,
},

editActions: {
  display: "flex",
  gap: 12,
},

cancelButton: {
  flex: 1,
  background: "#222",
  border: "none",
  color: "#fff",
  padding: 14,
  borderRadius: 14,
  cursor: "pointer",
},

saveButton: {
  flex: 1,
  background:
    "linear-gradient(135deg,#7B2FFF,#39FF88)",
  border: "none",
  color: "#0A0A0F",
  padding: 14,
  borderRadius: 14,
  fontWeight: 800,
  cursor: "pointer",
},

  feed: {
    marginTop: 20,
  },

  sectionTitle: {
    marginBottom: 16,
  },

  emptyText: {
    color: "#777",
  },

  card: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },

mobileMetaRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 12,
  paddingTop: 12,
  borderTop: "1px solid #25252D",
},

mobileMetaItem: {
  fontSize: 12,
  color: "#888",
},

mobileSettingsBtn: {
  background: "transparent",
  border: "none",
  color: "#999",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

mobileActionButtons: {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 16,
},

  actionBtn: {
    background: "#1A1A1A",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: 10,
    padding: 8,
  },

  uploadLabel: {
    background:
      "linear-gradient(135deg,#7B2FFF,#39FF88)",
    color: "#0A0A0F",
    padding: 14,
    borderRadius: 14,
    fontWeight: 800,
    textAlign: "center",
    cursor: "pointer",
  },

  hiddenInput: {
    display: "none",
  },

};
