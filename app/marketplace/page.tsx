"use client";

export default function MarketplacePage() {
  const sections = [
    {
      title: "Profile Themes",
      description:
        "Customize how your profile looks.",
      available: true,
    },
    {
      title: "Support Creators",
      description:
        "Help creators and projects grow.",
      available: true,
    },
    {
      title: "Profile Frames",
      description:
        "Decorate your profile with frames.",
      available: false,
    },
    {
      title: "Digital Packs",
      description:
        "Unlock future cosmetic content.",
      available: false,
    },
    {
      title: "Stickers",
      description:
        "Express yourself with sticker packs.",
      available: false,
    },
    {
      title: "Communities",
      description:
        "Discover and join communities.",
      available: false,
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#0A0A0F,#0E0E14)",
        color: "#fff",
        padding: 16,
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Marketplace
        </h1>

        <p
          style={{
            color: "#888",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Marketplace is currently in
          early access. Future items may
          include creator tools, profile
          customization, digital goods,
          and community features.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {sections.map((section) => (
            <div
              key={section.title}
              style={{
                background: "#111118",
                border:
                  "1px solid #222",
                borderRadius: 20,
                padding: 20,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                {section.title}
              </h2>

              <p
                style={{
                  color: "#888",
                  marginBottom: 16,
                }}
              >
                {section.description}
              </p>

              {section.available ? (
                <button
                  style={{
                    padding:
                      "12px 18px",
                    borderRadius: 12,
                    border: "none",
                    background:
                      "#39FF88",
                    color: "#000",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
              ) : (
                <div
                  style={{
                    color: "#777",
                    fontSize: 14,
                  }}
                >
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
