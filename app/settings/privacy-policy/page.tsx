"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        color: "#fff",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            marginBottom: 20,
            background: "#15151A",
            border: "1px solid #25252D",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          Privacy Policy
        </h1>

        <p>
          This Privacy Policy explains how BlackMaltra collects,
          uses, stores, and protects your information while using
          the platform.
        </p>

        <p style={{ marginTop: 20 }}>
          <strong>Effective Date:</strong> July 4th, 2026
        </p>

        <hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 20,
  }}
>
  1. Information We Collect
</h2>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 24,
  }}
>
  BlackMaltra collects only the information necessary to provide and improve
  the platform.
  <br />
  <br />
  Depending on how you use the app, we may collect:
</p>

<ul
  style={{
    paddingLeft: 0,
    listStyle: "none",
    fontSize: 18,
    lineHeight: 2,
    marginBottom: 24,
  }}
>
  <li>- Account information (username, email address, encrypted password credentials)</li>

  <li>- Profile information (display name, bio, profile picture, pronouns, links, and other optional profile details)</li>

  <li>- Posts, comments, reactions, messages, and uploaded media</li>

  <li>- Device information such as browser type, operating system, and device identifiers</li>

  <li>- Usage information including app activity, crash reports, and feature usage</li>

  <li>- IP address and approximate location for security, fraud prevention, and abuse detection</li>
</ul>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginTop: 10,
  }}
>
  You choose what information you share publicly through your profile and posts.
</p>

<hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 20,
  }}
>
  2. How We Use Your Information
</h2>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 24,
  }}
>
  BlackMaltra uses collected information to operate, maintain, improve, and
  protect the platform.
  <br />
  <br />
  We use your information to:
</p>

<ul
  style={{
    paddingLeft: 0,
    listStyle: "none",
    fontSize: 18,
    lineHeight: 2,
    marginBottom: 24,
  }}
>
  <li>- Create and manage your account.</li>

  <li>- Display your profile and the content you choose to share.</li>

  <li>- Deliver direct messages, comments, reactions, and other social features.</li>

  <li>- Protect users from spam, fraud, impersonation, harassment, and other abusive behavior.</li>

  <li>- Respond to bug reports, support requests, and account recovery requests.</li>

  <li>- Improve app performance, reliability, accessibility, and user experience.</li>

  <li>- Comply with applicable laws, legal obligations, and platform requirements.</li>
</ul>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
  }}
>
BlackMaltra does not sell your personal information to third parties.
</p>

<hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 20,
  }}
>
3. Third-Party Services & Data Sharing
</h2>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 24,
  }}
>
BlackMaltra uses trusted third-party service providers to operate the platform.
  <br />
  <br />
These providers only receive the information necessary to perform their services and are required to protect your data.
</p>

<ul
  style={{
    paddingLeft: 0,
    listStyle: "none",
    fontSize: 18,
    lineHeight: 2,
    marginBottom: 24,
  }}
>
  <li>
    - <strong>Supabase</strong> — Provides authentication, secure database
    storage, file storage, and real-time features.
  </li>

  <li>
    - <strong>Hosting Provider</strong> — BlackMaltra may use secure cloud
    hosting services to deliver the application.
  </li>
</ul>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 18,
  }}
>
BlackMaltra does not sell, rent, or trade your personal information.
</p>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
  }}
>
We may disclose information when required by law, to comply with legal obligations, to protect the safety of our users, or to investigate fraud, abuse, or violations of our Terms of Service.
</p>

<hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 20,
  }}
>
4. Children's Privacy
</h2>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 24,
  }}
>
BlackMaltra is intended only for individuals who are at least 13 years old.
  <br />
  <br />
Users under the age of 13 may not create an account or use the platform.
</p>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 24,
  }}
>
If we discover that a child under the age of 13 has created an account or provided personal information, we will remove the account and delete the associated information as quickly as reasonably possible.
</p>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
  }}
>
Parents or legal guardians who believe their child has provided information to BlackMaltra may contact us to request its removal.
</p>

<hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 20,
  }}
>
5. Your Rights & Account Deletion
</h2>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
    marginBottom: 24,
  }}
>
BlackMaltra believes you should have control over your personal information.
  <br />
  <br />
Depending on your location and applicable laws, you may have the right to:
</p>

<ul
  style={{
    paddingLeft: 0,
    listStyle: "none",
    fontSize: 18,
    lineHeight: 2,
    marginBottom: 24,
  }}
>
  <li>- Access the personal information associated with your account.</li>

  <li>- Update or correct your information.</li>

  <li>- Request deletion of your account and associated personal information.</li>

  <li>- Request a copy of the information associated with your account, where required by law.</li>
</ul>

<p
  style={{
    fontSize: 18,
    lineHeight: 1.8,
  }}
>
BlackMaltra includes a built-in account deletion feature located in <strong>Settings → Danger Zone → Delete Account</strong>.
  <br />
  <br />
Deleting your account permanently removes your account and associated personal information from our systems, except where information must be retained to comply with legal obligations, resolve disputes, prevent fraud, or enforce our policies.
</p>

<hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 24,
  }}
>
  6. Data Retention & Security
</h2>

<p style={{ marginBottom: 24 }}>
  BlackMaltra retains personal information only for as long as necessary to provide the platform, maintain account functionality, comply with legal obligations, resolve disputes, prevent fraud, and enforce our policies.
</p>

<p style={{ marginBottom: 24 }}>
  If you permanently delete your account, we will remove your personal information from our active systems within a reasonable period of time, except where retention is required by law or for legitimate security purposes.
</p>

<p style={{ marginBottom: 24 }}>
  To help protect your information, BlackMaltra uses industry-standard security measures including encrypted connections, secure authentication, access controls, and infrastructure designed to prevent unauthorized access, disclosure, alteration, or destruction.
</p>

<p>
  While we work hard to keep your information secure, no internet service or electronic storage system can ever be guaranteed to be 100% secure.
</p>

<hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 24,
  }}
>
  7. Changes to This Privacy Policy
</h2>

<p style={{ marginBottom: 24 }}>
  BlackMaltra may update this Privacy Policy from time to time to reflect improvements to the platform, legal requirements, or changes to our services.
</p>

<p>
  Whenever significant changes are made, we will update the Effective Date displayed at the top of this Privacy Policy. Continued use of BlackMaltra after those changes become effective constitutes acceptance of the updated Privacy Policy.
</p>

<hr style={{ margin: "30px 0", borderColor: "#25252D" }} />

<h2
  style={{
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 24,
  }}
>
  8. Contact Us
</h2>

<p style={{ marginBottom: 24 }}>
  If you have questions about this Privacy Policy, your personal information,
  or your privacy rights, you may contact the BlackMaltra team through our
  official support channels as they become available.
</p>

<p style={{ marginBottom: 24 }}>
  As BlackMaltra continues to grow, additional contact information—including a
  dedicated support email, official website, and help center—will be provided
  within the application and on our official website.
</p>

<p>
  We are committed to responding to privacy-related requests in a timely,
  transparent, and respectful manner.
</p>

      </div>
    </main>
  );
}
