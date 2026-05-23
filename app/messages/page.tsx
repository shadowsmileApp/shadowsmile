"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] =
    useState<string | null>(null);

  const [chatAccess, setChatAccess] =
    useState<"open" | "request">(
      "open"
    );

  const [messageText, setMessageText] =
    useState("");

const [searchTerm,
  setSearchTerm] =
useState("");

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

const chatContainerRef =
  useRef<HTMLDivElement | null>(
    null
  );

  const [messagesByChat,
  setMessagesByChat] =
useState<
  Record<
    string,
    {
      sender:
        | "me"
        | "them";
      text: string;
      time: string;
    }[]
  >
>({
  shadowfriend: [
    {
      sender:
        "them",
      text:
        "Hey 👋",
      time:
        "1:42 AM",
    },
    {
      sender:
        "them",
      text:
        "What's up?",
      time:
        "1:43 AM",
    },
  ],

  musicvibes: [
    {
      sender:
        "them",
      text:
        "That song was amazing",
      time:
        "11:12 PM",
    },
  ],

  nightowl: [
    {
      sender:
        "them",
      text:
        "still awake?",
      time:
        "2:05 AM",
    },
  ],

  gamerzone: [
    {
      sender:
        "them",
      text:
        "bro join the lobby",
      time:
        "8:14 PM",
    },
  ],

shadowcoder: [
  {
    sender: "them",
    text: "yo check the build",
    time: "6:14 PM",
  },
],

latevibes: [
  {
    sender: "them",
    text: "u still awake?",
    time: "2:58 AM",
  },
],

deepthoughts: [
  {
    sender: "them",
    text: "random question... what scares you most?",
    time: "12:18 AM",
  },
],

musicproducerx: [
  {
    sender: "them",
    text: "that mix was crazy",
    time: "10:42 PM",
  },
],

memelord9000: [
  {
    sender: "them",
    text: "bro 💀💀💀",
    time: "8:02 PM",
  },
],

verylongusernamethatshouldtestoverflow: [
  {
    sender: "them",
    text: "testing long username behavior",
    time: "4:22 PM",
  },
],

"👥 Night Squad": [
  {
    sender: "them",
    text: "who's awake rn",
    time: "1:16 AM",
  },
],

"👥 Music Lab": [
  {
    sender: "them",
    text: "new beat dropped",
    time: "7:44 PM",
  },
],

"🏠 Gaming Hub": [
  {
    sender: "them",
    text: "raid starts in 10",
    time: "9:15 PM",
  },
],

"🏠 Late Night Vibes": [
  {
    sender: "them",
    text: "music + chill",
    time: "11:49 PM",
  },
],

privateartist: [
  {
    sender: "them",
    text: "thanks for listening",
    time: "6:33 PM",
  },
],

nightshift: [
  {
    sender: "them",
    text: "work sucks tonight",
    time: "3:14 AM",
  },
],

storytime: [
  {
    sender: "them",
    text: "bro something wild happened",
    time: "5:51 PM",
  },
],

pixelghost: [
  {
    sender: "them",
    text: "wanna game later?",
    time: "7:31 PM",
  },
],

randomhuman: [
  {
    sender: "them",
    text: "hello lol",
    time: "9:02 AM",
  },
],
});

const [requestStatusByChat,
  setRequestStatusByChat] =
useState<
  Record<string, boolean>
>({
  musicvibes: false,
  privateartist: false,
  deepthoughts: false,
});

useEffect(() => {
  const savedMessages =
    localStorage.getItem(
      "shadowsmile_messages"
    );

  const savedRequests =
    localStorage.getItem(
      "shadowsmile_requests"
    );

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

  if (savedMessages) {
  const parsedMessages =
    JSON.parse(
      savedMessages
    );

  setMessagesByChat(
    (prev) => ({
      ...prev,
      ...parsedMessages,
    })
  );
}

  if (savedRequests) {
  setRequestStatusByChat(
    JSON.parse(
      savedRequests
    )
  );
}

if (savedActivity) {
  setChatActivity(
    JSON.parse(
      savedActivity
    )
  );
}

if (savedPinned) {
  setPinnedChats(
    JSON.parse(
      savedPinned
    )
  );
}

if (savedMuted) {
  setMutedChats(
    JSON.parse(
      savedMuted
    )
  );
}

if (savedArchived) {
  setArchivedChats(
    JSON.parse(
      savedArchived
    )
  );
}

if (!savedActivity) {
  const starterActivity:
    Record<
      string,
      number
    > = {};

  Object.keys(
    messagesByChat
  ).forEach(
    (
      chatName,
      index
    ) => {
      starterActivity[
        chatName
      ] =
        Date.now() -
        index * 1000;
    }
  );

  setChatActivity(
    starterActivity
  );
}

if (savedSelectedChat) {
  setSelectedChat(
    savedSelectedChat
  );

  const parsedRequests =
    savedRequests
      ? JSON.parse(
          savedRequests
        )
      : {};

  setChatAccess(
  parsedRequests[
    savedSelectedChat
  ] === false
    ? "request"
    : "open"
);
}
}, []);

useEffect(() => {
  if (
    chatContainerRef.current
  ) {
    chatContainerRef.current.scrollTop =
      chatContainerRef.current
        .scrollHeight;
  }
}, [
  messagesByChat,
  selectedChat,
]);

useEffect(() => {
  localStorage.setItem(
    "shadowsmile_messages",
    JSON.stringify(
      messagesByChat
    )
  );
}, [messagesByChat]);

useEffect(() => {
  localStorage.setItem(
    "shadowsmile_requests",
    JSON.stringify(
      requestStatusByChat
    )
  );
}, [requestStatusByChat]);

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
  if (selectedChat) {
    localStorage.setItem(
      "shadowsmile_selected_chat",
      selectedChat
    );
  }
}, [selectedChat]);

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
        {/* LEFT SIDE */}
<section
  style={{
    width: 340,
    borderRight:
      "1px solid #222",

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
          <input
  id="search-messages"
  name="searchMessages"
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(
      e.target.value
    )
  }
  placeholder="Search messages..."
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 16,
              border:
                "1px solid #222",
              background: "#111",
              color: "#fff",
              outline: "none",
              marginBottom: 20,
            }}
          />

<div
  style={{
    display: "flex",
    gap: 10,
    marginBottom: 16,
  }}
>
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
  }}
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

<button
  onClick={() => {
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
  }}
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
  {Object.keys(
  messagesByChat
)
.filter((chat) =>
  chat
    .toLowerCase()
    .includes(
      searchTerm.toLowerCase()
    )
)
.sort((a, b) => {

  const aPinned =
    pinnedChats.includes(a);

  const bPinned =
    pinnedChats.includes(b);

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
      chatActivity[b] ||
      0
    ) -
    (
      chatActivity[a] ||
      0
    )
  );
})
.map((chatName) => (
    <div
      key={chatName}
      onClick={() => {
        setSelectedChat(
          chatName
        );

        setChatAccess(
  requestStatusByChat[
    chatName
  ] === false
    ? "request"
    : "open"
);
      }}
      style={{
        background:
          "#111118",
        border:
          "1px solid #222",
        borderRadius: 20,
        padding: 14,
        cursor: "pointer",

position:
"relative",

overflow:
"visible",
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
    fontWeight: 700,

    whiteSpace:
      "nowrap",

    overflow:
      "hidden",

    textOverflow:
      "ellipsis",

    flex: 1,

    minWidth: 0,

    paddingRight: 10,
  }}
>
  {chatName.startsWith(
    "🏠"
  ) ||
  chatName.startsWith(
    "👥"
  )
    ? chatName
    : `@${chatName}`}
</div>

  <div
  style={{
    position:
      "relative",

    zIndex:
      100000,
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
    [chatName]:
      shouldOpenUp
        ? "up"
        : "down",
  })
);

setOpenMenu(
  openMenu ===
    chatName
      ? null
      : chatName
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

    {openMenu === chatName && (
  <div
    style={{
      position: "absolute",

top:
  menuDirection[
    chatName
  ] === "down"
    ? 28
    : "auto",

bottom:
  menuDirection[
    chatName
  ] === "up"
    ? 28
    : "auto",

right: 0,

transform:
  menuDirection[
    chatName
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
              (
                prev
              ) =>
                prev.includes(
                  chatName
                )
                  ? prev.filter(
                      (
                        c
                      ) =>
                        c !==
                        chatName
                    )
                  : [
                      ...prev,
                      chatName,
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
            chatName
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

            const updated =
              {
                ...messagesByChat,
              };

            delete updated[
              chatName
            ];

            setMessagesByChat(
              updated
            );

            setOpenMenu(
              null
            );

            if (
              selectedChat ===
              chatName
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
    chatName.startsWith("🏠") ||
    chatName.startsWith("👥")
      ? chatName
      : `@${chatName}`
  }?`
);

            if (
              !confirmed
            )
              return;

            const updated =
              {
                ...messagesByChat,
              };

            delete updated[
              chatName
            ];

            setMessagesByChat(
              updated
            );

            setPinnedChats(
              (prev) =>
                prev.filter(
                  (c) =>
                    c !==
                    chatName
                )
            );

            setOpenMenu(
              null
            );

            if (
              selectedChat ===
              chatName
            ) {
              setSelectedChat(
                null
              );
            }

            alert(
  `${
    chatName.startsWith("🏠") ||
    chatName.startsWith("👥")
      ? chatName
      : `@${chatName}`
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
    chatName.startsWith("🏠") ||
    chatName.startsWith("👥")
      ? chatName
      : `@${chatName}`
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
          color: "#888",
          fontSize: 14,
          whiteSpace:
            "nowrap",
          overflow:
            "hidden",
          textOverflow:
            "ellipsis",
        }}
      >
        {(
  messagesByChat[
    chatName
  ]?.slice(-1)[0]
    ?.text ||
  "No messages yet"
).slice(0, 42)}

        {(
  messagesByChat[
    chatName
  ]?.slice(-1)[0]
    ?.text || ""
).length > 42
          ? "..."
          : ""}
      </div>
    </div>
  ))}
</div>

</section>

{/* RIGHT SIDE */}
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
                justifyContent:
                  "center",
                alignItems:
                  "center",
                color: "#777",
                fontSize: 18,
              }}
            >
              Select a conversation
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div
                style={{
                  height: 72,
                  borderBottom:
                    "1px solid #222",
                  display: "flex",
                  alignItems:
                    "center",
                  padding:
                    "0 24px",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {
selectedChat?.startsWith(
  "🏠"
) ||
selectedChat?.startsWith(
  "👥"
)
  ? selectedChat
  : `@${selectedChat}`
}
              </div>

              {/* CHAT AREA */}
               <div
  ref={chatContainerRef}
  style={{
    flex: 1,
    padding: 24,
    overflowY: "auto",
    display: "flex",
    flexDirection:
      "column",
  }}
>
{selectedChat &&
requestStatusByChat[
  selectedChat
] === false && (
  <div
    style={{
      background:
        "#151520",
      border:
        "1px solid #222",
      borderRadius: 18,
      padding: 18,
      marginBottom: 18,
      color: "#aaa",
      textAlign:
        "center",
      lineHeight: 1.6,
    }}
  >
    <div
      style={{
        color:
          "#39FF88",
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      Message Request
    </div>

    This account is private.
    <br />
    You can send one
    request message.
    <br />
    The other person
    chooses whether
    to reply.
      </div>
    )}
                  <div
                    style={{
                      width:
                        "100%",
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 12,
                    }}
                  >
                    {selectedChat &&
  messagesByChat[
    selectedChat
  ]?.map(
                      (
                        message,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          style={{
                            alignSelf:
  message?.sender ===
  "me"
    ? "flex-end"
    : "flex-start",

background:
  message?.sender ===
  "me"
    ? "#39FF88"
    : "#181820",

color:
  message?.sender ===
  "me"
    ? "#000"
    : "#fff",

                            padding:
                              "12px 16px",

                            borderRadius:
                              18,

                            maxWidth:
                              320,
                          }}
                        >
                          {
                            typeof message ===
"string"
  ? message
  : message?.text
                          }
                        </div>
                      )
                )}
              </div>

</div>

              {/* INPUT */}
<div
  style={{
    borderTop:
      "1px solid #222",
    padding: 16,
paddingBottom: 20,
    display: "flex",
    gap: 12,
    background:
      "#0F0F14",
    flexShrink: 0,
    minHeight: 88,
  }}
>
                <input
  id="message-input"
  name="messageInput"
  value={messageText}

  disabled={
  selectedChat &&
  requestStatusByChat[
    selectedChat
  ] === false &&
  (
    messagesByChat[
      selectedChat
    ]?.filter(
      (m) =>
        m.sender ===
        "me"
    ).length || 0
  ) > 0
}

    onChange={(e) =>
    setMessageText(
      e.target.value
    )
  }

                  placeholder={
  selectedChat &&
  requestStatusByChat[
    selectedChat
  ] === false
    ? "Send message request..."
    : "Type a message..."
}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius:
                      18,
                    border:
                      "1px solid #222",
                    background:
                      "#111",
                    color:
                      "#fff",
                    outline:
                      "none",
                  }}
                />

                <button
                  onClick={() => {
  if (
    !messageText.trim()
  )
    return;

  // PRIVATE ACCOUNT REQUEST
if (
  chatAccess ===
    "request" &&
  selectedChat &&
  requestStatusByChat[
    selectedChat
  ] === false &&
  (
    messagesByChat[
      selectedChat
    ]?.filter(
      (m) =>
        m.sender ===
        "me"
    ).length || 0
  ) === 0
) {
  setRequestStatusByChat(
  (prev) => ({
    ...prev,
    [selectedChat!]:
      false,
  })
);

    setMessagesByChat(
  (prev) => ({
    ...prev,
    [selectedChat!]: [
  ...(prev[
    selectedChat!
  ] || []),

  {
    sender: "me",
    text:
      messageText,
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
    [selectedChat!]:
      Date.now(),
  })
);

    setMessageText("");

    return;
  }

  // NORMAL CHAT
  if (
    chatAccess ===
    "open"
  ) {
    setMessagesByChat(
  (prev) => ({
    ...prev,
    [selectedChat!]: [
  ...(prev[
    selectedChat!
  ] || []),

  {
    sender: "me",
    text:
      messageText,
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
    [selectedChat!]:
      Date.now(),
  })
);

    setMessageText("");
  }
}}
                  style={{
                    padding:
                      "12px 20px",
                    borderRadius:
                      18,
                    border:
                      "none",
                    background:
                      "#39FF88",
                    color:
                      "#000",
                    fontWeight: 700,
                    cursor:
                      "pointer",
                  }}
                >
                  {
  selectedChat &&
  requestStatusByChat[
    selectedChat
  ] === false
    ? "Request"
    : "Message"
}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
