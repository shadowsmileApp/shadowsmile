const SUPABASE_URL = "https://orutbpgdryesattdpxrv.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const userId = "3885727f-095e-466e-9de6-27e384712b14";

async function setAdmin() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
    {
      method: "PATCH",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        role: "admin",
      }),
    }
  );

  const data = await res.json();

  console.log("RESULT:", data);
}

setAdmin();
