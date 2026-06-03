type MessageInputProps = {
  selectedChat: string | null;

  requestStatusByChat:
    Record<string, boolean>;

  messagesByChat: Record<
    string,
    {
      sender:
        | "me"
        | "them";

      text: string;

      time: string;

      status?: string;
    }[]
  >;

  chatAccess:
    | "open"
    | "request";

  messageText: string;

  setMessageText:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  onSend: () => void;
};

export default function MessageInput({
  selectedChat,
  requestStatusByChat,
  messagesByChat,
  chatAccess,
  messageText,
  setMessageText,
  onSend,
}: MessageInputProps) {
  return (
    <div
      style={{
        borderTop:
          "1px solid #222",

        padding: 16,

        paddingBottom: 20,

        width: "100%",
        overflow: "hidden",

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
          minWidth: 0,
          padding: 14,
          borderRadius: 18,
          border:
            "1px solid #222",
          background: "#111",
          color: "#fff",
          outline: "none",
        }}
      />

      <button
        onClick={onSend}
        style={{
          padding:
            "12px 20px",

          borderRadius: 18,

          border: "none",

          background:
            "#39FF88",

          color: "#000",

          fontWeight: 700,

          cursor: "pointer",
        }}
      >
        {selectedChat &&
        requestStatusByChat[
          selectedChat
        ] === false
          ? "Request"
          : "Message"}
      </button>
    </div>
  );
}
