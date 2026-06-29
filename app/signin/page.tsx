"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const [mode, setMode] =
    useState<"signin" | "signup">("signin");

  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [handle, setHandle] =
    useState("");

  const [firstName, setFirstName] =
  useState("");

const [lastName, setLastName] =
  useState("");

const [dateOfBirth, setDateOfBirth] =
  useState("");

const [phoneNumber, setPhoneNumber] =
  useState("");

const [confirmPassword, setConfirmPassword] =
  useState("");

  const [loading, setLoading] =
    useState(false);

  // Redirect if already logged in
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (session) {
        const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return;
}

const { data: profile } =
  await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

if (
  profile?.onboarding_complete
) {
  router.push("/");
} else {
  router.push("/onboarding");
}
      }
    }

    checkUser();
  }, [router]);

  // Google Sign In
  async function signInWithGoogle() {
    const { error } =
      await supabase.auth.signInWithOAuth(
        {
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        }
      );

    if (error) {
      alert(error.message);
    }
  }

  async function submit() {
    try {
      setLoading(true);

      // Signup validation
      if (
        mode === "signup" &&
        !/^[a-zA-Z0-9_]{3,20}$/.test(
          handle.trim()
        )
      ) {
        alert(
          "Handle must be 3–20 characters and only use letters, numbers, or underscores."
        );
        return;
      }

      if (mode === "signup") {

if (password !== confirmPassword) {
  alert("Passwords do not match.");
  return;
}

  const dobParts =
  dateOfBirth.split("/");

if (dobParts.length !== 3) {
  alert(
    "Use MM/DD/YYYY format."
  );
  return;
}

const birthDate =
  new Date(
    Number(dobParts[2]),
    Number(dobParts[0]) - 1,
    Number(dobParts[1])
  );

if (
  isNaN(birthDate.getTime())
) {
  alert(
    "Please enter a valid date."
  );
  return;
}

const today = new Date();

let age =
  today.getFullYear() -
  birthDate.getFullYear();

const monthDiff =
  today.getMonth() -
  birthDate.getMonth();

if (
  monthDiff < 0 ||
  (
    monthDiff === 0 &&
    today.getDate() <
      birthDate.getDate()
  )
) {
  age--;
}

if (age < 13) {
  alert(
    "You must be at least 13 years old."
  );
  return;
}

if (
  !firstName.trim() ||
  !lastName.trim() ||
  !dateOfBirth
) {
  alert(
    "Please complete all required fields."
  );
  return;
}

if (
  phoneNumber &&
  !/^[0-9()+ -]+$/.test(phoneNumber)
) {
  alert(
    "Please enter a valid phone number."
  );
  return;
}

if (!email && !phoneNumber) {
  alert(
    "Please enter an email address or phone number."
  );
  return;
}

const trimmedHandle =
    handle.trim().toLowerCase();

  const {
    data: existingHandle,
  } = await supabase
    .from("profiles")
    .select("id")
    .eq("handle", trimmedHandle)
    .maybeSingle();

  if (existingHandle) {
    alert(
      "This username is already taken."
    );
    return;
  }

        const {
          data,
          error,
        } = await supabase.auth.signUp({
            email,
            password,
            options: {
  data: {
  handle: handle.trim().toLowerCase(),

  first_name: firstName.trim(),

  last_name: lastName.trim(),

  date_of_birth: birthDate
      .toISOString()
      .split("T")[0],

    phone_number:
      phoneNumber.trim() || null,
  },
},
          });

        if (error) {
          alert(error.message);
          return;
        }

        if (data.user) {
  const profilePayload = {
  id: data.user.id,

  handle: handle.trim().toLowerCase(),

  display_name:
    `${firstName.trim()} ${lastName.trim()}`,

  first_name:
    firstName.trim(),

  last_name:
    lastName.trim(),

  date_of_birth:
    birthDate
      .toISOString()
      .split("T")[0],

  phone_number:
    phoneNumber.trim() || null,

  bio: "",

  role: "user",
};

  // First attempt
  let { error: profileError } =
    await supabase
      .from("profiles")
      .update(profilePayload)
.eq("id", data.user.id);

  // Quiet repair attempt
  if (profileError) {
    console.warn(
      "Profile update failed, retrying...",
      profileError
    );

    // Small pause
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    // Second attempt
    const retry =
      await supabase
        .from("profiles")
        .update(profilePayload)
.eq("id", data.user.id);

    profileError = retry.error;
  }

  // Final failure
  if (profileError) {
    console.error(profileError);

    alert(
      "Account created, but profile setup needs a quick refresh. Try signing in."
    );
  }
}


        router.push("/onboarding");
return;

      } else {
        const {
  data,
  error,
} = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  alert(error.message);
  return;
}

const currentUser = data.user;

if (!currentUser) {
  return;
}

const { data: profile } =
  await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", currentUser.id)
    .maybeSingle();

if (profile?.onboarding_complete) {
  router.push("/");
} else {
  router.push("/onboarding");
}
      }
    } catch (err) {
      console.error(err);
      alert(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage:
            "url('/Shadowsmile.png')",
          filter:
            "brightness(0.8) contrast(1.1)",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[400px] p-10 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Shadow{" "}
            <span className="text-emerald-400">
              Smile
            </span>
          </h1>

          <p className="text-gray-400 text-sm mt-3 italic">
  Enter As You Are.
</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() =>
              setMode("signin")
            }
            className={`flex-1 py-2 rounded-xl transition ${
              mode === "signin"
                ? "bg-emerald-400 text-black font-bold"
                : "bg-white/10 text-white"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() =>
              setMode("signup")
            }
            className={`flex-1 py-2 rounded-xl transition ${
              mode === "signup"
                ? "bg-emerald-400 text-black font-bold"
                : "bg-white/10 text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Handle for signup */}
        {mode === "signup" && (
  <>
    <input
      placeholder="First Name"
      value={firstName}
      onChange={(e) =>
        setFirstName(e.target.value)
      }
      className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-3 outline-none"
    />

    <input
      placeholder="Last Name"
      value={lastName}
      onChange={(e) =>
        setLastName(e.target.value)
      }
      className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-3 outline-none"
    />

    <input
  placeholder="Date of Birth (MM/DD/YYYY)"
  value={dateOfBirth}
  onChange={(e) =>
    setDateOfBirth(e.target.value)
  }
  className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-3 outline-none"
/>

    <input
      placeholder="Phone Number (optional)"
      value={phoneNumber}
      onChange={(e) =>
        setPhoneNumber(e.target.value)
      }
      className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-3 outline-none"
    />

    <input
      id="handle"
      name="handle"
      autoComplete="username"
      placeholder="Choose a username"
      value={handle}
      onChange={(e) =>
        setHandle(e.target.value)
      }
      className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-3 outline-none"
    />
  </>
)}

        {/* Email */}
        <input
          id="email"
          name="email"
          autoComplete="email"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-3 outline-none"
        />

        {/* Password */}
        <input
          id="password"
          name="password"
          autoComplete={
            mode === "signin"
              ? "current-password"
              : "new-password"
          }
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-2 outline-none"
        />

{mode === "signup" && (
  <input
    placeholder="Confirm Password"
    type="password"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(
        e.target.value
      )
    }
    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white mb-3 outline-none"
  />
)}

        {/* Forgot Password */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={async () => {
              if (!email) {
                alert(
                  "Enter your email first."
                );
                return;
              }

              const { error } =
                await supabase.auth.resetPasswordForEmail(
                  email,
                  {
                    redirectTo:
                      `${window.location.origin}/reset-password`,
                  }
                );

              if (error) {
                alert(
                  error.message
                );
              } else {
                alert(
                  "Password reset email sent."
                );
              }
            }}
            className="text-sm text-emerald-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={
  loading ||
  !password ||
  (
    mode === "signup" &&
    (
      !handle ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !confirmPassword ||
      (!email && !phoneNumber)
    )
  )
}
          className="w-full py-3 bg-white text-black font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Loading..."
            : mode === "signin"
            ? "Enter As You Are"
            : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-gray-400 text-sm">
            or
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Google Button */}
        <button
          onClick={
            signInWithGoogle
          }
          className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:opacity-90 transition"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
