import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../lib/store';
import { requestWithdrawal, getWithdrawalHistory, getCurrentUser } from '../lib/api';
import toast from 'react-hot-toast';
import { Wallet, ArrowDownToLine } from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    getWithdrawalHistory().then((res) => setHistory(res.data.withdrawals)).catch(console.error);
    getCurrentUser().then((res) => updateUser(res.data)).catch(console.error);
  }, [isAuthenticated, router, updateUser]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num < 10) {
      toast.error('Minimum withdrawal is ₹10');
      return;
    }
    if (num > (user?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    if (method === 'upi' && !upiId.trim()) {
      toast.error('Enter your UPI ID');
      return;
    }
    setLoading(true);
    try {
      await requestWithdrawal({
        amount: num,
        method,
        upi_id: upiId,
        bank_details: method === 'bank_transfer' ? { bankName, accountNo, ifsc } : {},
      });
      toast.success('Withdrawal request submitted — real payout to your account');
      const me = await getCurrentUser();
      updateUser(me.data);
      const hist = await getWithdrawalHistory();
      setHistory(hist.data.withdrawals);
      setAmount('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Head><title>Wallet - VORTEX</title></Head>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-display text-5xl mb-2">WALLET</h1>
          <p className="text-white/60 mb-8">Real withdrawals to UPI or bank — balance from completed escrow orders</p>

          <div className="bg-[#131313] border border-white/10 rounded-2xl p-8 mb-8">
            <Wallet className="w-10 h-10 text-green-400 mb-4" />
            <p className="text-sm text-white/50">Available balance</p>
            <p className="text-display text-5xl mb-2">₹{user?.balance?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-white/40">Earned after buyers release escrow (90% after 10% platform fee)</p>
          </div>

          <form onSubmit={handleWithdraw} className="bg-[#131313] border border-white/10 rounded-2xl p-8 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <ArrowDownToLine className="w-5 h-5" /> Request withdrawal
            </h2>

            <div>
              <label className="text-sm text-white/60 block mb-1">Amount (₹)</label>
              <input
                type="number"
                min="10"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-white/10"
              />
            </div>

            <div>
              <label className="text-sm text-white/60 block mb-1">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black border border-white/10">
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank transfer</option>
              </select>
            </div>

            {method === 'upi' ? (
              <div>
                <label className="text-sm text-white/60 block mb-1">Your UPI ID</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@upi"
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/10"
                />
              </div>
            ) : (
              <>
                <input type="text" placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black border border-white/10" required />
                <input type="text" placeholder="Account number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black border border-white/10" required />
                <input type="text" placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black border border-white/10" required />
              </>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-white text-black font-semibold disabled:opacity-50">
              {loading ? 'Submitting...' : 'Withdraw'}
            </button>
          </form>

          <div className="mt-10">
            <h3 className="font-semibold mb-4">Withdrawal history</h3>
            {history.length === 0 ? (
              <p className="text-white/50 text-sm">No withdrawals yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((w) => (
                  <div key={w.id} className="flex justify-between bg-[#131313] border border-white/10 rounded-lg px-4 py-3 text-sm">
                    <span>₹{w.amount} · {w.method}</span>
                    <span className={w.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>{w.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
