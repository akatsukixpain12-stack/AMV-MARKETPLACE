import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../lib/store';
import { getMyOrders } from '../lib/api';
import { useState } from 'react';
import { Wallet, Package, PlusCircle, Wand2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    Promise.all([
      getMyOrders('buyer'),
      getMyOrders('seller'),
    ]).then(([buyer, seller]) => {
      setOrders([...buyer.data.orders, ...seller.data.orders].slice(0, 5));
    }).catch(console.error);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Head><title>Dashboard - VORTEX</title></Head>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-display text-5xl mb-2">DASHBOARD</h1>
          <p className="text-white/60 mb-10">Welcome back, {user?.full_name || user?.username}</p>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="bg-[#131313] border border-white/10 rounded-xl p-6">
              <Wallet className="w-8 h-8 text-green-400 mb-3" />
              <p className="text-sm text-white/50">Balance</p>
              <p className="text-display text-4xl">₹{user?.balance?.toFixed(2) || '0.00'}</p>
              <Link href="/wallet" className="text-sm text-purple-400 mt-2 inline-block">Withdraw →</Link>
            </div>
            <div className="bg-[#131313] border border-white/10 rounded-xl p-6">
              <Package className="w-8 h-8 text-purple-400 mb-3" />
              <p className="text-sm text-white/50">Trust score</p>
              <p className="text-display text-4xl">{user?.trust_score || 5}</p>
            </div>
            <div className="bg-[#131313] border border-white/10 rounded-xl p-6">
              <Wand2 className="w-8 h-8 text-pink-400 mb-3" />
              <p className="text-sm text-white/50">AI tools</p>
              <Link href="/ai-tools" className="text-sm text-purple-400 mt-2 inline-block">Open tools →</Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/create-gig" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold">
              <PlusCircle className="w-5 h-5" /> Create gig
            </Link>
            <Link href="/orders" className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5">Orders</Link>
            <Link href="/marketplace" className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5">Browse marketplace</Link>
          </div>

          <h2 className="text-xl font-semibold mb-4">Recent orders</h2>
          {orders.length === 0 ? (
            <p className="text-white/50">No orders yet. <Link href="/marketplace" className="text-purple-400">Find a gig</Link></p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="bg-[#131313] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{o.gig_title}</p>
                    <p className="text-sm text-white/50">{o.status} · escrow: {o.escrow_status}</p>
                  </div>
                  <span className="text-display text-xl">₹{o.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
