"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase-browser";

import MessageBubble from "./components/MessageBubble";
import MessageInput from "./components/MessageInput";

import {
  sendMessage,
  getConversation,
} from "./lib/messages";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] =
    useState<string | null>(null);

  const [messageText, setMessageText] =
    useState("");

const [conversation, setConversation] =
useState<any[]>([]);

const [conversations, setConversations] =
useState<
{
  id: string;
  display_name: string;
  handle: string;
  avatar_url: string | null;
}[]
>([]);

const [conversationPreviews,
setConversationPreviews] =
useState<
Record<
string,
{
body:string;
time:string;
}
>
>({});

const [chatDisplayName, setChatDisplayName] =
  useState("");

const [
isMobile, setIsMobile] =
  useState(false);

const [searchTerm,
  setSearchTerm] =
useState("");

const [searchResults,
  setSearchResults] =
useState<any[]>([]);

const [searchLoading,
  setSearchLoading] =
useState(false);

const [showGlobalSearch,
  setShowGlobalSearch] =
useState(false);

useEffect(() => {
  async function searchProfiles() {
    const search =
      searchTerm.trim();

    if (search.length < 2) {
      setSearchResults([]);
      setShowGlobalSearch(false);
      return;
    }

    setSearchLoading(true);

    const { data, error } =
      await supabase
        .from("profiles")
        .select(
          "id, display_name, handle, avatar_url"
        )
        .or(
          `display_name.ilike.%${search}%,handle.ilike.%${search}%`
        )
        .limit(10);

    if (error) {
      console.error(
        "Profile search error:",
        error
      );
      setSearchLoading(false);
      return;
    }

    setSearchResults(
      data || []
    );

    setShowGlobalSearch(
      true
    );

    setSearchLoading(false);
  }

  searchProfiles();
}, [searchTerm]);

const [openMenu,
  setOpenMenu] =
useState<
  string | null
>(null);

const [menuDirection,
  setMenuDirection] =
useState<
  Record<string, "up" | "down">
>({});

const [chatActivity,
  setChatActivity] =
useState<
  Record<string, number>
>({});

const [pinnedChats,
  setPinnedChats] =
useState<string[]>(
  []
);

const router = useRouter();

const searchParams =
  useSearchParams();

const userParam =
  searchParams.get("user");

const [user, setUser] =
  useState<User | null>(null);

const [loading, setLoading] =
  useState(true);

const [mutedChats,
  setMutedChats] =
useState<string[]>(
  []
);

const [archivedChats,
  setArchivedChats] =
useState<string[]>(
  []
);

const [unreadChats,
  setUnreadChats] =
useState<Record<string, number>>({});

const chatContainerRef =
  useRef<HTMLDivElement | null>(
    null
  );

const shouldAutoScrollRef =
  useRef(true);

const initialLoadDoneRef =
  useRef(false);

const [showScrollBottom,
  setShowScrollBottom] =
useState(false);

useEffect(() => {
  async function loadUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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

  return () =>
    window.removeEventListener(
      "resize",
      checkMobile
    );
}, []);

useEffect(() => {
  if (!isMobile) {
    document.body.classList.remove(
      "messages-chat-open"
    );
    return;
  }

  if (selectedChat) {
    document.body.classList.add(
      "messages-chat-open"
    );
  } else {
    document.body.classList.remove(
      "messages-chat-open"
    );
  }

  return () => {
    document.body.classList.remove(
      "messages-chat-open"
    );
  };
}, [selectedChat, isMobile]);

useEffect(() => {

  const savedSelectedChat =
    localStorage.getItem(
      "shadowsmile_selected_chat"
    );

  const savedActivity =
    localStorage.getItem(
      "shadowsmile_chat_activity"
    );

  const savedPinned =
    localStorage.getItem(
      "shadowsmile_pinned_chats"
    );

  const savedMuted =
    localStorage.getItem(
      "shadowsmile_muted_chats"
    );

  const savedArchived =
    localStorage.getItem(
      "shadowsmile_archived_chats"
    );

  const savedUnread =
    localStorage.getItem(
      "shadowsmile_unread_chats"
    );

  // Fake messages disabled for DM migration

  // DM request system disabled for now

  // LOAD ACTIVITY
  if (savedActivity) {
    setChatActivity(
      JSON.parse(
        savedActivity
      )
    );
  }

  // LOAD PINNED
  if (savedPinned) {
    setPinnedChats(
      JSON.parse(
        savedPinned
      )
    );
  }

  // LOAD MUTED
  if (savedMuted) {
    setMutedChats(
      JSON.parse(
        savedMuted
      )
    );
  }

  // LOAD ARCHIVED
  if (savedArchived) {
    setArchivedChats(
      JSON.parse(
        savedArchived
      )
    );
  }

  // LOAD UNREAD
  if (savedUnread) {
    setUnreadChats(
      JSON.parse(
        savedUnread
      )
    );
  }

    shouldAutoScrollRef.current =
      true;

    initialLoadDoneRef.current =
      false;

        requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (
          chatContainerRef.current
        ) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current
              .scrollHeight;
        }
      });
    });
}, []);

useEffect(() => {
if (!selectedChat) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const container =
        chatContainerRef.current;

      if (!container) return;

      container.scrollTop =
        container.scrollHeight;

      shouldAutoScrollRef.current =
        true;
    });
  });
}, [selectedChat]);

useEffect(() => {
  const container =
    chatContainerRef.current;

  if (
    !container ||
    !shouldAutoScrollRef.current
  )
    return;

  requestAnimationFrame(() => {
    container.scrollTo({
top: container.scrollHeight,
behavior: "smooth",
  });
});
}, [conversation]);

useEffect(() => {
  // DM request system disabled for now
}, []);

useEffect(() => {
  localStorage.setItem(
    "shadowsmile_chat_activity",
    JSON.stringify(
      chatActivity
    )
  );
}, [chatActivity]);

useEffect(() => {
  localStorage.setItem(
    "shadowsmile_pinned_chats",
    JSON.stringify(
      pinnedChats
    )
  );
}, [pinnedChats]);

useEffect(() => {
  localStorage.setItem(
    "shadowsmile_muted_chats",
    JSON.stringify(
      mutedChats
    )
  );
}, [mutedChats]);

useEffect(() => {
  localStorage.setItem(
    "shadowsmile_archived_chats",
    JSON.stringify(
      archivedChats
    )
  );
}, [archivedChats]);

useEffect(() => {
  localStorage.setItem(
    "shadowsmile_unread_chats",
    JSON.stringify(
      unreadChats
    )
  );
}, [unreadChats]);

useEffect(() => {
  if (!loading && !user) {
    router.push("/signin");
  }
}, [loading, user, router]);

useEffect(() => {
  if (typeof window !== "undefined") {
    window.history.scrollRestoration =
      "manual";
  }
}, []);

useEffect(() => {
  if (selectedChat) {
    localStorage.setItem(
      
"shadowsmile_selected_chat",
      selectedChat
    );
  } else {
    localStorage.removeItem(
      "shadowsmile_selected_chat"
    );
  }
}, [selectedChat]);

useEffect(() => {
  // disabled for now
}, []);

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function loadConversation(
  otherUserId: string
) {
  if (!UUID_REGEX.test(otherUserId)) {
  console.log(
    "Skipping non-UUID chat:",
    otherUserId
  );
  return;
}

if (!user) return;

  console.log("Current user:", user.id);
  console.log("Other user:", otherUserId);

  const { data, error } =
    await getConversation(
      user.id,
      otherUserId
    );

  if (error) {
    console.error(error);
    return;
  }

  setConversation(data || []);
}

async function loadConversationPreview(
  otherUserId: string
) {
  if (!user) return;

  const { data, error } =
    await supabase
      .from("direct_messages")
      .select(
        "body, created_at"
      )
      .or(
  `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
)
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(1);

  if (error) {
  console.error(
    "Preview query error:",
    error
  );
  return;
}

if (!data || data.length === 0) {
  return;
}

  setConversationPreviews(
    (prev) => ({
      ...prev,

      [otherUserId]: {
        body: data[0].body,

        time:
          new Date(
            data[0].created_at
          ).toLocaleTimeString(
            [],
            {
              hour:
                "numeric",
              minute:
                "2-digit",
            }
          ),
      },
    })
  );
}

useEffect(() => {
  if (!selectedChat || !user) return;

  loadConversation(selectedChat);
}, [selectedChat, user]);

useEffect(() => {
  if (!selectedChat || !user) return;

  async function refreshSidebar() {
    await Promise.all(
      conversations.map((chat) =>
        loadConversationPreview(chat.id)
      )
    );
  }

  const channel = supabase
    .channel("messages-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "direct_messages",
      },
      async (payload) => {
        console.log("Realtime message received", payload);

        const msg = payload.new as any;

        if (
          msg.sender_id !== user.id &&
          msg.receiver_id !== user.id
        ) {
          return;
        }

        await loadConversation(selectedChat);
        await refreshSidebar();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedChat, user, conversations]);

useEffect(() => {
  if (!user) return;

  conversations.forEach(
    (chat) => {
      loadConversationPreview(
        chat.id
      );
    }
  );
}, [conversations, user]);

useEffect(() => {
  async function loadConversations() {
    if (!user) return;

    const { data, error } =
  await supabase
    .from("direct_messages")
    .select(
      "sender_id, receiver_id"
    )
    .or(
      `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
    );

    if (error) {
      console.error(
        "Conversation load error:",
        error
      );
      return;
    }

    const otherUserIds =
      Array.from(
        new Set(
          (data || [])
            .map((message) => {
              if (
                message.sender_id ===
                user.id
              ) {
                return message.receiver_id;
              }

              if (
                message.receiver_id ===
                user.id
              ) {
                return message.sender_id;
              }

              return null;
            })
            .filter(Boolean)
        )
      );

    if (
      otherUserIds.length === 0
    ) {
      return;
    }

    const {
      data: profiles,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, display_name, handle, avatar_url"
      )
      .in(
        "id",
        otherUserIds
      );

    if (profileError) {
      console.error(
        profileError
      );
      return;
    }

    setConversations(
  (profiles || []).map(
    (profile) => ({
  id: profile.id,
  display_name:
    profile.display_name ||
    "Unknown User",

  handle:
    profile.handle || "",

  avatar_url:
    profile.avatar_url,
})
  )
);
  }

  loadConversations();
}, [user]);

const selectedChatProfile =
  conversations.find(
    (chat) => chat.id === selectedChat
  );

useEffect(() => {
  if (!selectedChatProfile) {
    setChatDisplayName("");
    return;
  }

  setChatDisplayName(
    selectedChatProfile.display_name
  );
}, [selectedChatProfile]);

useEffect(() => {
  if (!userParam) return;

  setSelectedChat(userParam);

async function loadProfilePreview() {
  const { data } = await supabase
    .from("profiles")
    .select("display_name, handle, avatar_url")
    .eq("id", userParam)
    .maybeSingle();

  if (!data) return;

  setConversations((prev) => {
  const existing = prev.find(
    (chat) => chat.id === userParam
  );

  if (existing) {
    return prev.map((chat) =>
      chat.id === userParam
        ? {
            ...chat,
            display_name:
              data.display_name || "Unknown User",
            handle:
              data.handle || "",
            avatar_url:
              data.avatar_url,
          }
        : chat
    );
  }

  return [
    ...prev,
    {
      id: userParam,
      display_name:
        data.display_name || "Unknown User",
      handle:
        data.handle || "",
      avatar_url:
        data.avatar_url,
    },
  ];
});
}

  setConversations((prev) => {
  const alreadyExists = prev.some(
    (conversation) => conversation.id === userParam
  );

  if (alreadyExists) {
    return prev;
  }

  return [
  ...prev,
  {
    id: userParam,
    display_name: "Loading...",
    handle: "",
    avatar_url: null,
  },
];
});
loadProfilePreview();
}, [userParam]);

const handleSendMessage = async () => {
  if (
    !messageText.trim() ||
    !selectedChat ||
    !user
  ) return;

  await sendMessage(
    user.id,
    selectedChat,
    messageText
  );

  await loadConversation(
    selectedChat
  );

  await loadConversationPreview(
    selectedChat
  );

  setMessageText("");
};

if (loading) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0A0A0F",
        color: "#fff",
      }}
    >
      Loading...
    </div>
  );
}

if (!user) {
  return null;
}

  return (
    <main
  style={{
    height:
      "calc(100vh - 95px)",
    background:
      "linear-gradient(180deg,#0A0A0F,#0E0E14)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",

    overflow: "hidden",
  }}
>
      {/* HEADER */}
      {!isMobile && (
      <header
        style={{
          height: 72,
          borderBottom:
            "1px solid #222",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          padding: "0 20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Messages
          </h1>

          <p
            style={{
              margin: 0,
              color: "#888",
              fontSize: 13,
            }}
          >
            Your conversations
          </p>
        </div>

        <button
          style={{
            background:
              "transparent",
            border:
              "1px solid #333",
            color: "#fff",
            borderRadius: 12,
            padding:
              "10px 16px",
            cursor: "pointer",
          }}
        >
          Settings
        </button>
      </header>
      )}

      {/* BODY */}
<div
  style={{
    flex: 1,
    display: "flex",

    minHeight: 0,

    position:
      "relative",

    overflowX:
      "clip",

    overflowY:
      "hidden",
  }}
>
        {(!isMobile || !selectedChat) && (
<section
  style={{
    width:
      isMobile
        ? "100%"
        : "clamp(320px, 30vw, 380px)",
    
    borderRight:
  isMobile
    ? "none"
    : "1px solid #222",

    padding: 20,

    flexShrink: 0,

    position:
      "relative",

    overflow:
      "visible",

    display:
      "flex",

    flexDirection:
      "column",

    minHeight: 0,
  }}
>

{isMobile && (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    }}
  >
    <h2
      style={{
        margin: 0,
        fontSize: 24,
        fontWeight: 800,
      }}
    >
      Messages
    </h2>

    <button
      style={{
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: 22,
        cursor: "pointer",
      }}
    >
      ⚙️
    </button>
  </div>
)}

          <div
  style={{
    marginBottom: 20,
    width: "100%",
    position: "relative",
  }}
>
  <input
    id="search-messages"
    name="searchMessages"
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(
        e.target.value
      )
    }
    placeholder="Search people, groups, servers..."
    style={{
      width: "100%",
      padding: 14,
      borderRadius: 16,
      border: "1px solid #222",
      background: "#111",
      color: "#fff",
      outline: "none",
      boxSizing: "border-box",
    }}
  />
{showGlobalSearch &&
  searchTerm.trim().length >= 2 && (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 20,
        right: 20,
        background: "#16161F",
        border: "1px solid #222",
        borderRadius: 16,
        maxHeight: 320,
        overflowY: "auto",
        zIndex: 9999,
      }}
    >
      {searchLoading ? (
        <div
          style={{
            padding: 16,
            color: "#888",
          }}
        >
          Searching...
        </div>
      ) : (
        searchResults.map(
          (profile) => (
            <div
              key={profile.id}
              onClick={() => {
                setSelectedChat(
                  profile.id
                );

                setSearchTerm("");

                setShowGlobalSearch(
                  false
                );
              }}
              style={{
                padding: 14,
                borderBottom:
                  "1px solid #222",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                }}
              >
                {
                  profile.display_name
                }
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize: 13,
                }}
              >
                @
                {profile.handle}
              </div>
            </div>
          )
        )
      )}
    </div>
)}

</div>

<div
  style={{
    display: "flex",
    gap: 10,
    marginBottom: 16,
  }}
>
{/*
  <button
  onClick={() => {
    const name =
      prompt(
        "Group chat name?"
      );

    if (!name) return;

    const groupName =
      `👥 ${name}`;

    setMessagesByChat(
      (prev) => ({
        ...prev,
        [groupName]: [
          {
            sender:
              "them",
            text:
              `Welcome to ${name}`,
            time:
              new Date()
                .toLocaleTimeString(
                  [],
                  {
                    hour:
                      "numeric",
                    minute:
                      "2-digit",
                  }
                ),
          },
        ],
      })
    );

    setChatActivity(
      (prev) => ({
        ...prev,
        [groupName]:
          Date.now(),
      })
    );
  }
  style={{
    flex: 1,
    padding: 14,
    borderRadius: 18,
    border:
      "1px solid #222",
    background:
      "#151520",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  + Group Chat
</button>
*/}

{/*
<button
  onClick={() => {}
    const name =
      prompt(
        "Server name?"
      );

    if (!name) return;

    const serverName =
      `🏠 ${name}`;

    setMessagesByChat(
      (prev) => ({
        ...prev,
        [serverName]: [
          {
            sender:
              "them",
            text:
              `Welcome to ${name} server`,
            time:
              new Date()
                .toLocaleTimeString(
                  [],
                  {
                    hour:
                      "numeric",
                    minute:
                      "2-digit",
                  }
                ),
          },
        ],
      })
    );

    setChatActivity(
      (prev) => ({
        ...prev,
        [serverName]:
          Date.now(),
      })
    );
  }
  style={{
    flex: 1,
    padding: 14,
    borderRadius: 18,
    border:
      "1px solid #222",
    background:
      "#151520",
    color: "#39FF88",
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  + Server
</button>
*/}
</div>

          {/* MESSAGE REQUESTS */}
          <div
            style={{
              background:
                "#121218",
              border:
                "1px solid #222",
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color:
                  "#39FF88",
                marginBottom: 4,
              }}
            >
              Message Requests
            </div>

            <div
              style={{
                color: "#888",
                fontSize: 14,
    }}
  >
    No requests
  </div>
</div>

          {/* CONVERSATIONS */}
<div
  style={{
    display: "flex",
    flexDirection:
      "column",

    gap: 12,

    flex: 1,

    overflowY:
      "auto",

    overflowX:
      "visible",

    paddingRight: 6,

    minHeight: 0,
  }}
>
  {conversations
.filter((chat) => {
  const search =
    searchTerm
      .toLowerCase()
      .trim();

  if (!search)
    return true;

  return (
    (chat.display_name || "")
      .toLowerCase()
      .includes(search) ||

    (chat.handle || "")
      .toLowerCase()
      .includes(search) ||

    (`@${chat.handle || ""}`)
      .toLowerCase()
      .includes(search)
  );
})
.sort((a, b) => {

  const aPinned =
    pinnedChats.includes(a.id);

  const bPinned =
    pinnedChats.includes(b.id);

  if (
    aPinned &&
    !bPinned
  )
    return -1;

  if (
    !aPinned &&
    bPinned
  )
    return 1;

  return (
    (
      chatActivity[b.id] ||
      0
    ) -
    (
      chatActivity[a.id] ||
      0
    )
  );
})
.map((chatName) => (
    <div
      key={chatName.id}
      onClick={() => {
        setSelectedChat(
          chatName.id
        );

setUnreadChats(
  (prev) => ({
    ...prev,
    [chatName.id]: 0,
  })
);

      }}
      style={{
  background:
    selectedChat === chatName.id
      ? "linear-gradient(180deg,#181827,#12121d)"
      : "#111118",

  border:
    selectedChat === chatName.id
      ? "1px solid #39FF88"
      : "1px solid #222",

  boxShadow:
    selectedChat === chatName.id
      ? "0 0 0 1px rgba(57,255,136,.15)"
      : "none",

  borderRadius: 20,
  padding: 14,
  cursor: "pointer",

  position: "relative",
  overflow: "visible",

  transition:
    "all .18s ease",
}}
    >
      <div
  style={{
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom: 6,
  }}
>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  }}
>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      router.push(`/profile/${chatName.id}`);
    }}
    style={{
      width: 48,
      height: 48,
      borderRadius: "50%",
      overflow: "hidden",
      border: "1px solid #2A2A35",
      background: "#1A1A22",
      padding: 0,
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {chatName.avatar_url ? (
      <img
        src={chatName.avatar_url}
        alt={chatName.display_name}
        style={{
          width: "100%",
          height: "100%",
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
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {chatName.display_name.charAt(0).toUpperCase()}
      </div>
    )}
  </button>

  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      router.push(`/profile/${chatName.id}`);
    }}
    style={{
      fontWeight: 700,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flex: 1,
      minWidth: 0,
      background: "none",
      border: "none",
      color: "#fff",
      textAlign: "left",
      cursor: "pointer",
      fontSize: "inherit",
      padding: 0,
    }}
  >
    {chatName.display_name}
  </button>
</div>

  <div
  style={{
    position: "relative",
    zIndex: 100000,
  }}
>
    <button
      onClick={(e) => {
        e.stopPropagation();

        const rect =
(
  e.currentTarget as HTMLElement
).getBoundingClientRect();

const menuHeight = 220;

const spaceBelow =
  window.innerHeight -
  rect.bottom;

const shouldOpenUp =
  spaceBelow <
  menuHeight;

setMenuDirection(
  (prev) => ({
    ...prev,
    [chatName.id]:
      shouldOpenUp
        ? "up"
        : "down",
  })
);

setOpenMenu(
  openMenu === chatName.id
      ? null
      : chatName.id
);
      }}
      style={{
        background:
          "transparent",
        border:
          "none",
        color:
          "#777",
        cursor:
          "pointer",
        fontSize: 18,
      }}
    >
      ⋮
    </button>

    {openMenu === chatName.id && (
  <div
    style={{
      position: "absolute",

top:
  menuDirection[
    chatName.id
  ] === "down"
    ? 28
    : "auto",

bottom:
  menuDirection[
    chatName.id
  ] === "up"
    ? 28
    : "auto",

right: 0,

transform:
  menuDirection[
    chatName.id
  ] === "up"
    ? "translateY(-8px)"
    : "translateY(8px)",

      background:
        "#16161F",
      border:
        "1px solid #222",
      borderRadius: 14,
      width: 180,
      zIndex: 999999,
      overflow:
        "visible",
      boxShadow:
        "0 10px 30px rgba(0,0,0,.45)",
    }}
  >

        {/* PIN */}
        <button
          onClick={(
            e
          ) => {
            e.stopPropagation();

            setPinnedChats(
  (prev) =>
    prev.includes(chatName.id)
      ? prev.filter(
          (c) =>
            c !== chatName.id
        )
      : [
          ...prev,
          chatName.id,
        ]
);

            setOpenMenu(
              null
            );
          }}
          style={{
            width:
              "100%",
            padding:
              14,
            background:
              "transparent",
            border:
              "none",
            color:
              "#fff",
            textAlign:
              "left",
            cursor:
              "pointer",
          }}
        >
          {pinnedChats.includes(
            chatName.id
          )
            ? "📌 Unpin"
            : "📌 Pin"}
        </button>

        {/* DELETE */}
        <button
          onClick={(
            e
          ) => {
            e.stopPropagation();

            setOpenMenu(
              null
            );

            if (
              selectedChat ===
              chatName.id
            ) {
              setSelectedChat(
                null
              );
            }
          }}
          style={{
            width:
              "100%",
            padding:
              14,
            background:
              "transparent",
            border:
              "none",
            color:
              "#ff5a5a",
            textAlign:
              "left",
            cursor:
              "pointer",
          }}
        >
          🗑 Delete
        </button>

        {/* BLOCK */}
        <button
          onClick={(
            e
          ) => {
            e.stopPropagation();

            const confirmed =
  confirm(
`Block ${
  chatName.display_name.startsWith("🏠") ||
  chatName.display_name.startsWith("👥")
    ? chatName.display_name
    : `@${chatName.display_name}`
}?`
);

            if (
              !confirmed
            )
              return;

            setPinnedChats(
              (prev) =>
                prev.filter(
                  (c) =>
                    c !==
                    chatName.id
                )
            );

            setOpenMenu(
              null
            );

            if (
  selectedChat ===
  chatName.id
) {
  setSelectedChat(
    null
  );
}

            alert(
`${
  chatName.display_name.startsWith("🏠") ||
  chatName.display_name.startsWith("👥")
    ? chatName.display_name
    : `@${chatName.display_name}`
} blocked`
);
          }}
          style={{
            width:
              "100%",
            padding:
              14,
            background:
              "transparent",
            border:
              "none",
            color:
              "#ff7a7a",
            textAlign:
              "left",
            cursor:
              "pointer",
          }}
        >
          🚫 Block
        </button>

        {/* REPORT */}
        <button
          onClick={(
            e
          ) => {
            e.stopPropagation();

            alert(
  `🚩 Reported ${
    chatName.display_name.startsWith("🏠") ||
    chatName.display_name.startsWith("👥")
      ? chatName
      : `@${chatName.display_name}`
  }`
);

            setOpenMenu(
              null
            );
          }}
          style={{
            width:
              "100%",
            padding:
              14,
            background:
              "transparent",
            border:
              "none",
            color:
              "#ffaa55",
            textAlign:
              "left",
            cursor:
              "pointer",
          }}
        >
          🚩 Report
        </button>
      </div>
    )}
  </div>
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4,
  }}
>
  {/* preview text */}
  <div
    style={{
      color: "#888",
      fontSize: 14,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flex: 1,
    }}
  >
    {conversationPreviews[
  chatName.id
]?.body || "No messages yet"}
  </div>

  {/* right side */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexShrink: 0,
    }}
  >
    {/* unread indicator */}
    {selectedChat !==
  chatName.id &&
  unreadChats[
    chatName.id
  ] > 0 && (
    <div
      style={{
        minWidth: 18,
        height: 18,
        borderRadius: 999,
        background:
          "#39FF88",
        color: "#000",
        fontSize: 11,
        fontWeight: 800,
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        padding:
          "0 6px",
      }}
    >
      {
        unreadChats[
          chatName.id
        ]
      }
    </div>
)}

    <div
      style={{
        color: "#666",
        fontSize: 11,
      }}
    >
      --
    </div>
  </div>
      </div>
    </div>
  ))}
</div>

</section>
)}

{(!isMobile || selectedChat) && (
<section
  style={{
    flex: 1,
    display: "flex",
    flexDirection:
      "column",
    background:
      "#0F0F14",

    overflow:
      "visible",

    position:
      "relative",
  }}
>
          {!selectedChat ? (
            <div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    padding: 40,
  }}
>
  <div
    style={{
      width: 90,
      height: 90,
      borderRadius: "50%",
      background:
        "linear-gradient(145deg,#151520,#0D0D14)",
      border:
        "1px solid #222",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 38,
      marginBottom: 24,
      boxShadow:
        "0 12px 30px rgba(0,0,0,.35)",
    }}
  >
    💬
  </div>

  <h2
    style={{
      fontSize: 28,
      fontWeight: 800,
      marginBottom: 12,
      color: "#fff",
    }}
  >
    Your conversations live here
  </h2>

  <p
    style={{
      maxWidth: 420,
      lineHeight: 1.7,
      color: "#8A8A94",
      fontSize: 16,
    }}
  >
    Sometimes all it takes is one
    message to make someone feel
    seen.
    <br />
    Start a conversation when
    you're ready.
  </p>
</div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div
  style={{
  height: 72,
  borderBottom: "1px solid #222",
  display: "flex",
  alignItems: "center",
  padding: "0 24px",
  fontWeight: 700,
  fontSize: 18,
  gap: 12,
  overflow: "hidden",
}}
>
  {isMobile && (
    <button
      onClick={() =>
        setSelectedChat(null)
      }
      style={{
        background: "none",
        border: "none",
        color: "#39FF88",
        fontSize: 20,
        cursor: "pointer",
      }}
    >
      ←
    </button>
  )}

  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  }}
>
  <button
    type="button"
    onClick={() =>
      router.push(`/profile/${selectedChat}`)
    }
    style={{
      width: 42,
      height: 42,
      borderRadius: "50%",
      overflow: "hidden",
      border: "1px solid #2A2A35",
      background: "#1A1A22",
      padding: 0,
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {selectedChatProfile?.avatar_url ? (
      <img
        src={selectedChatProfile.avatar_url}
        alt={selectedChatProfile.display_name}
        style={{
          width: "100%",
          height: "100%",
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
          color: "#fff",
          fontWeight: 700,
        }}
      >
        {chatDisplayName
          ?.charAt(0)
          .toUpperCase()}
      </div>
    )}
  </button>

  <button
    type="button"
    onClick={() =>
      router.push(`/profile/${selectedChat}`)
    }
    style={{
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      background: "none",
      border: "none",
      color: "#fff",
      textAlign: "left",
      fontSize: 18,
      fontWeight: 700,
      cursor: "pointer",
      padding: 0,
    }}
  >
    {chatDisplayName}
  </button>
</div>
</div>

              {/* CHAT AREA */}
<div
  ref={chatContainerRef}
  onScroll={() => {
    if (!chatContainerRef.current) return;

    const container = chatContainerRef.current;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    shouldAutoScrollRef.current =
      distanceFromBottom < 120;

    setShowScrollBottom(
      distanceFromBottom > 300
    );
  }}
  style={{
    flex: 1,
    padding: 24,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  }}
>

<div
  style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}
>
  {conversation.map(
  (message, index) => (
    <MessageBubble
      key={index}
      sender={
        message.sender_id ===
        user?.id
          ? "me"
          : "them"
      }
      text={message.body}
      time={
        new Date(
          message.created_at
        ).toLocaleTimeString(
          [],
          {
            hour: "numeric",
            minute: "2-digit",
          }
        )
      }
    />
    )
)}
</div>

</div>

{showScrollBottom && (
  <button
    onClick={() => {
      if (
        chatContainerRef.current
      ) {
        chatContainerRef.current.scrollTo({
          top:
            chatContainerRef.current
              .scrollHeight,
          behavior:
            "smooth",
        });

        shouldAutoScrollRef.current =
          true;

setShowScrollBottom(false);
      }
    }}
    style={{
      position: "absolute",
      bottom: 110,
      right: 24,

      width: 52,
      height: 52,

      borderRadius: "50%",

      border:
        "1px solid #2A2A35",

      background:
        "#181820",

      color: "#39FF88",

      fontSize: 22,

      cursor: "pointer",

      zIndex: 1000,

      boxShadow:
        "0 10px 30px rgba(0,0,0,.45)",
    }}
  >
    ↓
  </button>
)}

              {/* INPUT */}
<MessageInput
  selectedChat={
    selectedChat
  }
  messageText={
    messageText
  }
  setMessageText={
    setMessageText
  }
  onSend={
    handleSendMessage
  }
/>
            </>
          )}
        </section>
      )}

      </div>
    </main>
  );
}
