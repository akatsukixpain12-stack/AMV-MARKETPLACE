import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { createGig } from '../lib/api';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';

export default function CreateGig() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'amv',
    price: '',
    delivery_days: '3',
    thumbnail: '',
    video_url: '',
    tags: '',
  });

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGig({
        ...form,
        price: parseFloat(form.price),
        delivery_days: parseInt(form.delivery_days, 10),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      toast.success('Gig listed!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Create Gig - VORTEX</title></Head>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
          <h1 className="text-display text-4xl mb-6">CREATE GIG</h1>
          {['title', 'description', 'thumbnail', 'video_url'].map((field) => (
            <div key={field}>
              <label className="text-sm capitalize">{field.replace('_', ' ')}</label>
              {field === 'description' ? (
                <textarea
                  required={field !== 'thumbnail' && field !== 'video_url'}
                  rows={5}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#131313] border border-white/10 mt-1"
                />
              ) : (
                <input
                  required={field === 'title' || field === 'description'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#131313] border border-white/10 mt-1"
                />
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#131313] border border-white/10 mt-1">
                <option value="amv">AMV</option>
                <option value="gaming">Gaming</option>
                <option value="tiktok">TikTok</option>
                <option value="motion">Motion</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Price (₹)</label>
              <input type="number" required min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#131313] border border-white/10 mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-[#131313] border border-white/10 mt-1" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-white text-black font-semibold">
            {loading ? 'Publishing...' : 'Publish gig'}
          </button>
        </form>
      </main>
    </>
  );
}
