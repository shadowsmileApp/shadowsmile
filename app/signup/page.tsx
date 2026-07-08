"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const mode = "signup";

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

const [showPassword, setShowPassword] =
  useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);

  const [loading, setLoading] =
    useState(false);

const [errorMessage, setErrorMessage] =
  useState("");

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
      setErrorMessage("");

      // Signup validation
      if (
        mode === "signup" &&
        !/^[a-zA-Z0-9_]{3,20}$/.test(
          handle.trim()
        )
      ) {
        setErrorMessage(
          "Username must be 3–20 characters and only contain letters, numbers, or underscores."
        );
        return;
      }

      if (mode === "signup") {

if (password !== confirmPassword) {
  setErrorMessage(
    "Passwords do not match."
  );
  return;
}

  const dobParts =
  dateOfBirth.split("/");

if (dobParts.length !== 3) {
  setErrorMessage(
    "Date of birth must be in MM/DD/YYYY format."
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
  setErrorMessage(
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
  setErrorMessage(
    "You must be at least 13 years old."
  );
  return;
}

if (
  !firstName.trim() ||
  !lastName.trim() ||
  !dateOfBirth
) {
  setErrorMessage(
    "Please complete all required fields."
  );
  return;
}

if (
  phoneNumber &&
  !/^[0-9()+ -]+$/.test(phoneNumber)
) {
  setErrorMessage(
    "Please enter a valid phone number."
  );
  return;
}

if (!email && !phoneNumber) {
  setErrorMessage(
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
  setErrorMessage(
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
  setErrorMessage(error.message);
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

  setErrorMessage(
    "Your account was created, but your profile couldn't be completed automatically. Please sign in and try again."
  );
  return;
}

        router.push("/onboarding");
return;
}

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
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] px-4 py-8 sm:px-6">

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

<form
  onSubmit={(e) => {
    e.preventDefault();
    submit();
  }}
>

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
        <div className="relative mb-2">

  <input
    id="password"
    name="password"
    autoComplete="new-password"
    placeholder="Password"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    className="w-full p-3 pr-16 rounded-xl bg-white/10 border border-white/10 text-white outline-none"
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(!showPassword)
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-400 hover:text-emerald-300"
  >
    {showPassword ? "Hide" : "Show"}
  </button>

</div>

{mode === "signup" && (

  <div className="relative mb-3">

    <input
      placeholder="Confirm Password"
      type={
        showConfirmPassword
          ? "text"
          : "password"
      }
      value={confirmPassword}
      onChange={(e) =>
        setConfirmPassword(
          e.target.value
        )
      }
      className="w-full p-3 pr-16 rounded-xl bg-white/10 border border-white/10 text-white outline-none"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(
          !showConfirmPassword
        )
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-400 hover:text-emerald-300"
    >
      {showConfirmPassword
        ? "Hide"
        : "Show"}
    </button>

  </div>

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

{errorMessage && (
<div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
⚠ {errorMessage}
</div>
)}

        {/* Submit */}
        <button
          type="submit"
          disabled={
  loading ||
  !password ||
  (
      !handle ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !confirmPassword ||
      (!email && !phoneNumber)
    )
}
          className="w-full py-3 bg-white text-black font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Creating Account..."
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
          type="button"
          onClick={signInWithGoogle}
          className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:opacity-90 transition"
         >
          Continue with Google
        </button>

{/* Already have an account */}
<div className="mt-6 text-center">
  <span className="text-gray-400 text-sm">
    Already have an account?{" "}
  </span>

  <button
    type="button"
    onClick={() => router.push("/signin")}
    className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
  >
    Sign In
  </button>
</div>

       </form>
      </div>
    </main>
  );
}
