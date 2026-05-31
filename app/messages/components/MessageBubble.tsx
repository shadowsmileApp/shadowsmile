type MessageBubbleProps = {
  sender: "me" | "them";
  text: string;
  time: string;
  status?: string;
};

export default function MessageBubble({
  sender,
  text,
  time,
  status,
}: MessageBubbleProps) {
  return (
    <div
      style={{
        alignSelf:
          sender === "me"
            ? "flex-end"
            : "flex-start",

        background:
          sender === "me"
            ? "#39FF88"
            : "#181820",

        color:
          sender === "me"
            ? "#000"
            : "#fff",

        padding: "12px 16px",

        borderRadius: 18,

        maxWidth: 320,
      }}
    >
      <div>
        <div>{text}</div>

        <div
          style={{
            fontSize: 11,
            marginTop: 6,
            opacity: 0.7,
          }}
        >
          {sender === "me"
            ? `${time} • ${
                status || "Sent"
              }`
            : time}
        </div>
      </div>
    </div>
  );
}
