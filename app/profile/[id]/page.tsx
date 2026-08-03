"use client";

  import React, {
    useEffect,
    useState,
  } from "react";

  import Image from "next/image";

  import PostCard from "../../../components/PostCard";

  import PostMenu from "../../../components/PostMenu";

  import {
    useParams,
    useRouter,
  } from "next/navigation";

  import { supabase }
    from "../../../lib/supabase-browser";

import { User }
  from "@supabase/supabase-js";

import { styles } from "./styles";

  import {
  sharePost,
  toggleLike,
  addComment,
  getPosts,
} from "../../../lib/posts";

import {
  loadComments,
} from "./posts";

  import {
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

const [activeTab, setActiveTab] =
  useState<"media" | "posts" | "likes">("media");

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

const [showFollowers, setShowFollowers] =
  useState(false);

const [showFollowing, setShowFollowing] =
  useState(false);

const [followersList, setFollowersList] =
  useState<any[]>([]);

const [followingList, setFollowingList] =
  useState<any[]>([]);

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

/* ================= COMMENT ================= */

async function handleAddComment(postId: string) {
  if (!currentUser) {
    router.push("/signin");
    return;
  }

  const content = commentTexts[postId]?.trim();

  if (!content) {
    return;
  }

  try {
  await addComment(
    postId,
    currentUser.id,
    content
  );
} catch (error) {
  console.error(error);
  return;
}

  setCommentTexts((prev) => ({
    ...prev,
    [postId]: "",
  }));

  const updatedComments =
  await loadComments(
    posts.map((p) => p.id)
  );

setComments(updatedComments);

setOpenComments(null);
}

/* ================= LOAD POSTS ================= */

  async function reloadPosts() {
  try {
    if (!id) return;

    const result = await getPosts(id);

    setPosts(result);

const updatedComments =
  await loadComments(
    result.map((p) => p.id)
  );

setComments(updatedComments);

setStats({
  postCount: result.length,
  likesReceived: result.reduce(
    (total, post) => total + (post.like_count || 0),
    0
  ),
});

  } catch (error) {
    console.error(error);
  }
}

useEffect(() => {
   void reloadPosts();
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

  const mediaPosts = posts.filter(
    (post) => post.media_url
  );

  const textPosts = posts.filter(
    (post) => !post.media_url
  );

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

      {/* PROFILE TABS */}

<div style={styles.profileTabs}>
  <button
    type="button"
    onClick={() => setActiveTab("media")}
    style={{
      ...styles.profileTab,
      ...(activeTab === "media"
        ? styles.profileTabActive
        : {}),
    }}
  >
    Media
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("posts")}
    style={{
      ...styles.profileTab,
      ...(activeTab === "posts"
        ? styles.profileTabActive
        : {}),
    }}
  >
    Posts
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("likes")}
    style={{
      ...styles.profileTab,
      ...(activeTab === "likes"
        ? styles.profileTabActive
        : {}),
    }}
  >
    Likes
  </button>
</div>

{/* POSTS */}

<section style={styles.feed}>

  {activeTab === "media" && (
  mediaPosts.length === 0 ? (
    <p style={styles.emptyText}>
      No photos or videos yet.
    </p>
  ) : (
    <div style={styles.mediaGrid}>
      {mediaPosts.map((p) => (
        <div
          key={p.id}
          style={{
            ...styles.mediaTile,
            position: "relative",
          }}
          onClick={() =>
            router.push(`/post/${p.id}`)
          }
         >

           <PostMenu
             ownedByUser={currentUser?.id === p.user_id}
             isProfilePage
           />

          {p.media_type === "video" ? (
            <video
              src={p.media_url || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Image
              src={p.media_url || ""}
              alt="media"
              fill
              unoptimized
              style={styles.mediaImage}
            />
          )}

          {p.media_type === "video" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: "#fff",
                background:
                  "rgba(0,0,0,.25)",
              }}
            >
              ▶
            </div>
          )}
        </div>
      ))}
    </div>
  )
)}

  {activeTab === "posts" && (
    textPosts.length === 0 ? (
      <p style={styles.emptyText}>
        No text posts yet.
      </p>
    ) : (
      textPosts.map((p) => (
        <PostCard
          key={p.id}
          post={p}
          ownedByUser={currentUser?.id === p.user_id}
          isProfilePage={true}
          showHandle={false}
          isMobile={isMobile}
          openComments={openComments}
          setOpenComments={setOpenComments}
          commentTexts={commentTexts}
          comments={comments}
          setCommentTexts={setCommentTexts}

likePost={async (postId) => {
  alert("Profile page likePost");

  await toggleLike(
    postId,
    currentUser.id
  );

  await reloadPosts();
}}

          addComment={handleAddComment}
          sharePost={sharePost}
        />
      ))
    )
  )}

  {activeTab === "likes" && (
    <p style={styles.emptyText}>
      Likes tab coming soon.
    </p>
  )}

</section>
   </main>
 );
}
