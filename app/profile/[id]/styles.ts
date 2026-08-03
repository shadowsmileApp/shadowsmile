import React from "react";

export const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0A0A0F,#0E0E14)",
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
    background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 48,
    fontWeight: 900,
    border: "1px solid rgba(123,47,255,.25)",
  },

  followBtn: {
    width: "100%",
    background: "linear-gradient(135deg,#7B2FFF,#9B5DFF)",
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
    background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
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
    background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
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
    background: "linear-gradient(135deg,#7B2FFF,#39FF88)",
    color: "#0A0A0F",
    padding: 14,
    borderRadius: 14,
    fontWeight: 800,
    textAlign: "center",
    cursor: "pointer",
  },

  profileTabs: {
    display: "flex",
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },

  profileTab: {
    flex: 1,
    background: "#15151A",
    border: "1px solid #25252D",
    color: "#999",
    borderRadius: 14,
    padding: "14px 0",
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.2s",
  },

  profileTabActive: {
    background: "linear-gradient(135deg,#7B2FFF,#9B5DFF)",
    border: "none",
    color: "#fff",
  },

  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
    gap: 16,
  },

  mediaTile: {
    position: "relative",
    aspectRatio: "1 / 1",
    borderRadius: 18,
    overflow: "hidden",
    cursor: "pointer",
    background: "#15151A",
    border: "1px solid #25252D",
  },

  mediaImage: {
    objectFit: "cover",
  },

  mediaOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    opacity: 0,
    transition: "opacity .2s",
  },

  hiddenInput: {
    display: "none",
  },
};
