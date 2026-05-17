import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../lib/store';
import { getMyOrders, completeOrder, deliverOrder, disputeEscrow } from '../lib/api';
import toast from 'react-hot-toast';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Orders() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState('buyer');
  const [orders, setOrders] = useState([]);
  const [deliveryUrl, setDeliveryUrl] = useState({});

  const load = () => {
    getMyOrders(tab).then((res) => setOrders(res.data.orders)).catch(console.error);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    load();
  }, [isAuthenticated, tab, router]);

  const handleComplete = async (id) => {
    try {
      await completeOrder(id);
      toast.success('Escrow released to seller');
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed');
    }
  };

  const handleDeliver = async (id) => {
    const url = deliveryUrl[id];
    if (!url) {
      toast.error('Enter delivery file URL');
      return;
    }
    try {
      await deliverOrder(id, { file_url: url });
      toast.success('Delivered to buyer');
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed');
    }
  };

  const handleDispute = async (id) => {
    const reason = prompt('Why are you opening a dispute?');
    if (!reason) return;
    try {
      await disputeEscrow(id, { reason });
      toast.success('Dispute opened — escrow held');
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Head><title>Orders - VORTEX</title></Head>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-display text-5xl mb-8">ORDERS</h1>

          <div className="flex gap-2 mb-8">
            {['buyer', 'seller'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-white text-black' : 'border border-white/10'}`}
              >
                As {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-[#131313] border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{o.gig_title}</h3>
                    <p className="text-sm text-white/50">
                      {o.status} · <Shield className="w-3 h-3 inline text-green-400" /> escrow: {o.escrow_status}
                    </p>
                  </div>
                  <span className="text-display text-2xl">₹{o.amount}</span>
                </div>

                {tab === 'seller' && o.status === 'in_progress' && (
                  <div className="flex gap-2 mt-4">
                    <input
                      type="url"
                      placeholder="Delivery file URL"
                      value={deliveryUrl[o.id] || ''}
                      onChange={(e) => setDeliveryUrl({ ...deliveryUrl, [o.id]: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-sm"
                    />
                    <button type="button" onClick={() => handleDeliver(o.id)} className="px-4 py-2 rounded-lg bg-purple-600 text-sm font-semibold">
                      Deliver
                    </button>
                  </div>
                )}

                {tab === 'buyer' && o.status === 'in_progress' && o.escrow_status === 'held' && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button type="button" onClick={() => handleComplete(o.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" /> Approve & release escrow
                    </button>
                    <button type="button" onClick={() => handleDispute(o.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" /> Dispute
                    </button>
                  </div>
                )}
              </div>
            ))}
            {orders.length === 0 && <p className="text-white/50">No orders yet.</p>}
          </div>
        </div>
      </main>
    </>
  );
}
