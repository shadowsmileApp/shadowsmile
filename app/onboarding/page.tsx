"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function OnboardingPage() {
const router = useRouter();
useEffect(() => {
  async function checkOnboarding() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signin");
      return;
    }

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .maybeSingle();

    if (profile?.onboarding_complete) {
      router.push("/");
    }
  }

  checkOnboarding();
}, [router]);
  const [answers, setAnswers] = useState({
  reason: "",
  vibe: "",
  postingStyle: "",
  interests: "",
  privacy: "",
});

const [step, setStep] =
  useState(1);

const vibes = [
  "Calm",
  "Friendly",
  "Supportive",
  "Fun",
  "Mixed",
];

const postingStyles = [
  "Text Posts",
  "Images",
  "Both",
];

const interests = [
  "Gaming",
  "Music",
  "Mental Health",
  "Art",
  "Everything",
];

const privacyOptions = [
  "Public",
  "Friends Only",
  "Private",
];

  const reasons = [
    "Looking for support",
    "Looking for connection",
    "Looking for inspiration",
    "Looking to help others",
    "Just exploring",
  ];
  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <div className="max-w-md mx-auto px-6 py-10">

        {/* Progress */}
        <div className="mb-10">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
  className="h-full bg-emerald-400"
  style={{
    width: `${step * 20}%`,
  }}
/>
          </div>

          <p className="text-sm text-gray-400 mt-2">
  Step {step} of 5
</p>
        </div>

{step > 1 && (
  <button
    onClick={() => setStep(step - 1)}
    className="mb-6 text-emerald-400"
  >
    ← Back
  </button>
)}

        {/* Welcome */}
        <h1 className="text-3xl font-bold mb-4">
  {step === 1 &&
    "Why are you here?"}

  {step === 2 &&
    "How should ShadowSmile feel?"}

  {step === 3 &&
    "What posts do you enjoy?"}

  {step === 4 &&
    "Which communities interest you?"}

  {step === 5 &&
    "Privacy preference"}
</h1>

        <p className="text-gray-400 mb-10">
  Help us personalize your experience.
</p>

        {/* Placeholder */}
        <div className="space-y-3">
  {
(step === 1
  ? reasons
  : step === 2
  ? vibes
  : step === 3
  ? postingStyles
  : step === 4
  ? interests
  : privacyOptions
).map((option) => (
    <button
      key={option}
      onClick={() =>
  setAnswers((prev) => ({
    ...prev,
    [step === 1
  ? "reason"
  : step === 2
  ? "vibe"
  : step === 3
  ? "postingStyle"
  : step === 4
  ? "interests"
  : "privacy"]: option,
  }))
}
      className={`w-full p-4 rounded-2xl text-left transition ${
        (
step === 1
  ? answers.reason
  : step === 2
  ? answers.vibe
  : step === 3
  ? answers.postingStyle
  : step === 4
  ? answers.interests
  : answers.privacy
) === option
          ? "bg-emerald-400 text-black font-bold"
          : "bg-white/5 border border-white/10 text-white"
      }`}
    >
      {option}
    </button>
  ))}
</div>

        {/* Continue */}
        <button
  disabled={
  !(
    step === 1
      ? answers.reason
      : step === 2
      ? answers.vibe
      : step === 3
      ? answers.postingStyle
      : step === 4
      ? answers.interests
      : answers.privacy
  )
}
  onClick={async () => {
  if (step < 5) {
    setStep(step + 1);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  console.log("Saving onboarding for user:", user.id);

const { data, error } = await supabase
  .from("profiles")
  .update({
    reason: answers.reason,
    vibe: answers.vibe,
    posting_style: answers.postingStyle,
    interests: answers.interests,
    privacy_preference: answers.privacy,
    onboarding_complete: true,
  })
  .eq("id", user.id)
  .select();

console.log("Update result:", data);
console.log("Update error:", error);

  if (error) {
    console.error(error);
    alert(
      "Failed to save onboarding."
    );
    return;
  }

  router.push("/");
}}
  className="
    w-full
    mt-10
    py-4
    rounded-2xl
    bg-emerald-400
    text-black
    font-bold
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  {step < 5 ? "Continue" : "Finish"}
</button>

      </div>
    </main>
  );
}
