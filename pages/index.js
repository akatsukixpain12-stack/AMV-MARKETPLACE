import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { getGigs } from '../lib/api';
import { ArrowRight, Shield, Zap, TrendingUp, Star } from 'lucide-react';

export default function Home() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    getGigs({ per_page: 6 })
      .then((res) => setGigs(res.data.gigs))
      .catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <title>VORTEX - AI Marketplace for Video Editors</title>
        <meta name="description" content="Buy & sell AMVs, anime edits, montages with AI protection" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 mb-8 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs uppercase tracking-wider">AI-Powered Marketplace</span>
          </div>

          <h1 className="text-display text-6xl md:text-8xl lg:text-9xl leading-none mb-6">
            THE EDIT<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              MARKETPLACE
            </span><br />
            FOR CREATORS
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Buy & sell AMVs, anime edits, montages, and motion graphics. Real AI tools built in. Zero scams.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/marketplace" className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:scale-105 transition flex items-center gap-2">
              Explore Marketplace
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/ai-tools" className="px-8 py-4 rounded-xl border border-white/20 text-lg hover:bg-white/5 transition">
              Try AI Tools
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 pt-12 border-t border-white/10">
            <div>
              <div className="text-display text-5xl mb-2">4.2K+</div>
              <div className="text-sm text-white/50 uppercase tracking-wider">Active Editors</div>
            </div>
            <div>
              <div className="text-display text-5xl mb-2">$0</div>
              <div className="text-sm text-white/50 uppercase tracking-wider">Escrow Risk</div>
            </div>
            <div>
              <div className="text-display text-5xl mb-2">98%</div>
              <div className="text-sm text-white/50 uppercase tracking-wider">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Ticker */}
      <div className="border-y border-white/10 bg-[#0f0f0f] py-4 overflow-hidden">
        <div className="flex gap-12 animate-scroll whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12">
              <span className="text-sm text-white/50 uppercase tracking-widest">AMV Edits</span>
              <span className="text-white/20">✦</span>
              <span className="text-sm text-white/50 uppercase tracking-widest">Gaming Montages</span>
              <span className="text-white/20">✦</span>
              <span className="text-sm text-white/50 uppercase tracking-widest">TikTok Reels</span>
              <span className="text-white/20">✦</span>
              <span className="text-sm text-white/50 uppercase tracking-widest">Motion Graphics</span>
              <span className="text-white/20">✦</span>
              <span className="text-sm text-white/50 uppercase tracking-widest">Green Screen</span>
              <span className="text-white/20">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Gigs */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Marketplace</p>
              <h2 className="text-display text-5xl md:text-6xl">TOP GIGS</h2>
            </div>
            <Link href="/marketplace" className="text-sm hover:text-white/60 transition flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <Link key={gig.id} href={`/gig/${gig.id}`} className="group">
                <div className="bg-[#131313] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-2 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    {gig.thumbnail ? (
                      <img src={gig.thumbnail} alt={gig.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-display text-6xl text-white/10">{gig.category.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <img 
                        src={gig.seller.profile_image || '/default-avatar.png'} 
                        alt={gig.seller.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-white/60">{gig.seller.username}</span>
                      <div className="ml-auto flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{gig.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition">{gig.title}</h3>
                    <p className="text-sm text-white/50 mb-4 line-clamp-2">{gig.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-display text-3xl">₹{gig.price}</span>
                      <button className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-24 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Built-In AI Tools</p>
          <h2 className="text-display text-5xl md:text-6xl mb-4">EDIT SMARTER</h2>
          <p className="text-white/60 max-w-xl mb-12">
            Real tools running live in your browser. No installs, no servers, no waiting.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#131313] border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-white/20 transition">
              <div className="absolute top-0 right-0 text-display text-9xl text-white/5">01</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl">
                  ✂️
                </div>
                <h3 className="text-xl font-semibold mb-3">Background Remover</h3>
                <p className="text-white/60 text-sm mb-6">
                  Remove any background from a photo instantly using ML segmentation. Export as transparent PNG.
                </p>
                <Link href="/ai-tools/background-remover" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
                  Open Tool
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-[#131313] border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-white/20 transition">
              <div className="absolute top-0 right-0 text-display text-9xl text-white/5">02</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl">
                  🎬
                </div>
                <h3 className="text-xl font-semibold mb-3">Green Screen Tool</h3>
                <p className="text-white/60 text-sm mb-6">
                  Upload chroma-key image, dial in color, tolerance and edge feathering. Export clean PNG.
                </p>
                <Link href="/ai-tools/green-screen" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
                  Open Tool
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-[#131313] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-display text-9xl text-white/5">03</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl">
                  🛡️
                </div>
                <h3 className="text-xl font-semibold mb-3">Stolen Edit Detector</h3>
                <p className="text-white/60 text-sm mb-6">
                  AI content fingerprinting scans the archive to flag plagiarism before listing goes live.
                </p>
                <button className="px-6 py-3 rounded-lg bg-white/5 text-white/40 border border-white/10 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>

            <div className="bg-[#131313] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-display text-9xl text-white/5">04</div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl">
                  📊
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Scorer</h3>
                <p className="text-white/60 text-sm mb-6">
                  Analyze bitrate, resolution, frame consistency. Get quality score before submitting.
                </p>
                <button className="px-6 py-3 rounded-lg bg-white/5 text-white/40 border border-white/10 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protection Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Protection</p>
              <h2 className="text-display text-6xl md:text-7xl mb-6">
                ZERO<br />SCAM<br />POLICY
              </h2>
              <p className="text-white/60 text-lg">
                Every transaction escrowed. Every editor AI-scored. Buyers and sellers always protected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: 'Stolen Edit Detection', desc: 'Fingerprint matching flags plagiarised work' },
                { icon: Shield, title: 'Escrow Payments', desc: 'Funds held until buyer confirms delivery' },
                { icon: Zap, title: 'Quality Gate', desc: 'Auto export analysis blocks low-quality work' },
                { icon: TrendingUp, title: 'AI Trust Score', desc: 'Editors scored on history and reviews' },
              ].map((item, i) => (
                <div key={i} className="bg-[#131313] border border-white/10 rounded-xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold mb-2 text-sm">{item.title}</h4>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-display text-6xl md:text-8xl mb-6">
            BUILD YOUR<br />CREATOR EMPIRE
          </h2>
          <p className="text-black/60 text-lg max-w-xl mx-auto mb-10">
            The most loyal audience in creative media is waiting. Focus on the craft. Vortex handles everything else.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 rounded-xl bg-black text-white font-semibold text-lg hover:bg-gray-800 transition">
              Start Selling Free →
            </Link>
            <Link href="/pricing" className="px-8 py-4 rounded-xl border border-black/20 text-lg hover:bg-black/5 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-display text-3xl mb-4">VORTEX</div>
              <p className="text-sm text-white/50">
                The AI marketplace built for the next generation of video editors and creators.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Platform</h4>
              <div className="space-y-2">
                <Link href="/marketplace" className="block text-sm text-white/60 hover:text-white transition">Marketplace</Link>
                <Link href="/ai-tools" className="block text-sm text-white/60 hover:text-white transition">AI Tools</Link>
                <Link href="/pricing" className="block text-sm text-white/60 hover:text-white transition">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Editors</h4>
              <div className="space-y-2">
                <Link href="/signup" className="block text-sm text-white/60 hover:text-white transition">Start Selling</Link>
                <Link href="/dashboard" className="block text-sm text-white/60 hover:text-white transition">Dashboard</Link>
                <Link href="/wallet" className="block text-sm text-white/60 hover:text-white transition">Payouts</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-white/60 hover:text-white transition">About</Link>
                <Link href="/contact" className="block text-sm text-white/60 hover:text-white transition">Contact</Link>
                <a href={process.env.NEXT_PUBLIC_DONATE_UPI} target="_blank" rel="noopener noreferrer" className="block text-sm text-pink-400 hover:text-pink-300 transition">
                  Donate ❤️
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-wrap justify-between items-center gap-4 text-sm text-white/30">
            <p>VORTEX © 2026 — All rights reserved.</p>
            <p>Privacy · Terms · Cookies</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </>
  );
}
