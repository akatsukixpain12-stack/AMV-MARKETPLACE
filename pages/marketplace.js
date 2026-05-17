import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { search, getGigs } from '../lib/api';
import { Search, Star, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'amv', label: 'AMV' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'motion', label: 'Motion' },
];

export default function Marketplace() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        q: q.trim(),
        category,
        sort,
        min_price: minPrice || 0,
        max_price: maxPrice || 100000,
        min_rating: minRating || 0,
        per_page: 24,
      };
      const hasAdvanced = q.trim() || minPrice || maxPrice || minRating || sort !== 'relevance';
      const res = hasAdvanced ? await search(params) : await getGigs({ category, per_page: 24 });
      const list = res.data.results || res.data.gigs || [];
      setResults(list);
      setTotal(res.data.total ?? list.length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [q, category, sort, minPrice, maxPrice, minRating]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <>
      <Head>
        <title>Marketplace - VORTEX</title>
      </Head>
      <Navbar />

      <main className="pt-24 pb-16 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Browse</p>
          <h1 className="text-display text-5xl md:text-7xl mb-8">MARKETPLACE</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search AMV, gaming edits, motion graphics, editors..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#131313] border border-white/10 focus:border-purple-500/50 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  category === c.id ? 'bg-white text-black font-semibold' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="bg-[#131313] border border-white/10 rounded-xl p-6 mb-8 grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Min price (₹)</label>
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black border border-white/10" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Max price (₹)</label>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black border border-white/10" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Min rating</label>
                <input type="number" min="0" max="5" step="0.1" value={minRating} onChange={(e) => setMinRating(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black border border-white/10" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Sort by</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black border border-white/10">
                  <option value="relevance">Relevance</option>
                  <option value="rating">Top rated</option>
                  <option value="orders">Most orders</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                </select>
              </div>
            </div>
          )}

          <p className="text-sm text-white/50 mb-6">{total} gigs found</p>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 text-white/50">
              <X className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No gigs match your search. Try different keywords.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((gig) => (
                <Link key={gig.id} href={`/gig/${gig.id}`} className="group">
                  <div className="bg-[#131313] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all">
                    <div className="h-44 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                      {gig.thumbnail && <img src={gig.thumbnail} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase text-purple-400">{gig.category}</span>
                        {gig.relevance != null && (
                          <span className="text-xs text-white/30 ml-auto">match {gig.relevance}</span>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition line-clamp-2">{gig.title}</h3>
                      <p className="text-sm text-white/50 line-clamp-2 mb-3">{gig.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-display text-2xl">₹{gig.price}</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {gig.rating}
                        </div>
                      </div>
                      <p className="text-xs text-white/40 mt-2">by {gig.seller?.username}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
