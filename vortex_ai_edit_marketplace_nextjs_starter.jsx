export default function VortexApp() {
  const gigs = [
    {
      name: "Anime Velocity",
      title: "JJK AMV Ultra Edit",
      price: "$25",
      rating: "4.9",
    },
    {
      name: "MotionX",
      title: "Roblox Montage Edit",
      price: "$18",
      rating: "5.0",
    },
    {
      name: "FrameLord",
      title: "TikTok Viral Edit",
      price: "$40",
      rating: "4.8",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-800 backdrop-blur-xl sticky top-0 bg-black/80 z-50">
        <h1 className="text-3xl font-black tracking-wider">
          VORTEX
        </h1>

        <div className="flex gap-4">
          <button className="px-5 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-all">
            Login
          </button>

          <button className="px-5 py-2 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all">
            Start Selling
          </button>
        </div>
      </header>

      <section className="relative px-8 py-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-700/20 via-black to-black blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black leading-none">
            THE AI MARKETPLACE
            <br />
            FOR EDITORS
          </h2>

          <p className="text-zinc-400 mt-8 text-xl max-w-2xl mx-auto">
            Buy and sell AMVs, reels, anime edits, motion graphics and gaming montages with AI scam protection.
          </p>

          <div className="flex flex-wrap gap-5 justify-center mt-10">
            <button className="px-8 py-4 rounded-2xl bg-white text-black text-lg font-bold hover:scale-105 transition-all">
              Explore Editors
            </button>

            <button className="px-8 py-4 rounded-2xl border border-zinc-700 text-lg hover:bg-zinc-900 transition-all">
              Upload Portfolio
            </button>
          </div>
        </div>
      </section>

      <section className="px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {gigs.map((gig, index) => (
            <div
              key={index}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:-translate-y-2 hover:border-purple-500 transition-all duration-300"
            >
              <div className="h-52 bg-gradient-to-br from-purple-600 to-blue-600" />

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xl">{gig.title}</h3>
                  <span className="text-yellow-400">★ {gig.rating}</span>
                </div>

                <p className="text-zinc-500 text-sm mb-5">
                  By {gig.name}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black">
                    {gig.price}
                  </span>

                  <button className="px-5 py-2 rounded-xl bg-white text-black font-bold hover:scale-105 transition-all">
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-4xl font-black mb-6">
              AI PROTECTION
            </h2>

            <div className="space-y-5 text-zinc-300">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                ✔ Detects stolen edits
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                ✔ Auto export quality checking
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                ✔ Scam protection escrow system
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                ✔ AI trust score for editors
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-700 to-blue-700 rounded-3xl p-8 flex flex-col justify-center">
            <h2 className="text-5xl font-black leading-tight">
              BUILD THE NEXT
              <br />
              CREATOR EMPIRE
            </h2>

            <p className="mt-6 text-lg text-white/80">
              Focus on creators. Scale globally. Small niche. Massive loyalty.
            </p>

            <button className="mt-10 px-8 py-4 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-all w-fit">
              Launch Now
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-10 text-center text-zinc-500">
        VORTEX © 2026
      </footer>
    </div>
  );
}
