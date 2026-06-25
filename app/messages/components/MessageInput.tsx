type MessageInputProps = {
  selectedChat: string | null;

  messageText: string;

  setMessageText:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  onSend: () => void;
};

export default function MessageInput({
  selectedChat,
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
        disabled={false}
        onChange={(e) =>
          setMessageText(
            e.target.value
          )
        }
        placeholder="Type a message..."
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
    flexShrink: 0,
    padding: "12px 20px",
    borderRadius: 18,
    border: "none",
    background: "#39FF88",
    color: "#000",
    fontWeight: 700,
    cursor: "pointer",
  }}
>
        Message
      </button>
    </div>
  );
}
