export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <div className="max-w-md mx-auto px-6 py-10">

        {/* Progress */}
        <div className="mb-10">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/5 bg-emerald-400" />
          </div>

          <p className="text-sm text-gray-400 mt-2">
            Step 1 of 5
          </p>
        </div>

        {/* Welcome */}
        <h1 className="text-3xl font-bold mb-4">
          Welcome to ShadowSmile
        </h1>

        <p className="text-gray-400 mb-10">
          Let's personalize your experience.
        </p>

        {/* Placeholder */}
        <div className="space-y-3">
          <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            Looking for support
          </button>

          <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            Looking for connection
          </button>

          <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            Looking for inspiration
          </button>

          <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            Looking to help others
          </button>

          <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            Just exploring
          </button>
        </div>

        {/* Continue */}
        <button
          className="
            w-full
            mt-10
            py-4
            rounded-2xl
            bg-emerald-400
            text-black
            font-bold
          "
        >
          Continue
        </button>

      </div>
    </main>
  );
}
