import Head from 'next/head';
import Navbar from '../components/Navbar';
import { Shield, Search, Wallet, Wand2 } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Find an editor', desc: 'Search marketplace with filters, ratings, and relevance ranking.' },
  { icon: Shield, title: 'Pay with escrow', desc: 'Money is held until you approve the delivery — zero scam policy.' },
  { icon: Wand2, title: 'Use AI tools', desc: 'Background remover, green screen, and stolen edit detector on app.py.' },
  { icon: Wallet, title: 'Withdraw earnings', desc: 'Sellers withdraw real balance to UPI or bank after orders complete.' },
];

export default function HowItWorks() {
  return (
    <>
      <Head><title>How It Works - VORTEX</title></Head>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-display text-5xl mb-12">HOW IT WORKS</h1>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Step {i + 1}</p>
                  <h2 className="text-xl font-semibold mb-1">{s.title}</h2>
                  <p className="text-white/60">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
