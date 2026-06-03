const SUPABASE_URL = "https://orutbpgdryesattdpxrv.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydXRicGdkcnllc2F0dGRweHJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM0MzM1OCwiZXhwIjoyMDkyOTE5MzU4fQ.ll353KL8OmmI3RfBCqDK1HVRySLp3SdedOEGupXbvtY";

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
