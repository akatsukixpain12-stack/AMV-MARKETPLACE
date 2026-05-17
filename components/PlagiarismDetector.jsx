import { useState, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { detectPlagiarism } from '../lib/api';
import toast from 'react-hot-toast';

export default function PlagiarismDetector() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setChecking(true);
    toast.loading('Scanning for plagiarism...');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await detectPlagiarism(formData);
      setResult(res.data);
      toast.dismiss();
      
      if (res.data.is_plagiarized) {
        toast.error('Plagiarism detected!');
      } else {
        toast.success('Content is original!');
      }
    } catch (error) {
      toast.error('Detection failed');
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      {!result ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={checking}
          />
          {checking ? (
            <>
              <div className="animate-spin w-12 h-12 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Scanning database...</h3>
              <p className="text-sm text-white/50">Checking against 10,000+ edits</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-white/40" />
              <h3 className="font-semibold mb-2">Upload image to check for plagiarism</h3>
              <p className="text-sm text-white/50">PNG · JPG · WEBP — up to 12 MB</p>
            </>
          )}
        </div>
      ) : (
        <div>
          {result.is_plagiarized ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-500 mb-2">Plagiarism Detected</h3>
              <p className="text-white/70 mb-6">
                This content matches an existing edit with {(result.confidence * 100).toFixed(0)}% confidence
              </p>
              
              {result.original_gig && (
                <div className="bg-black/30 rounded-lg p-4 text-left">
                  <p className="text-sm text-white/50 mb-1">Original Edit:</p>
                  <p className="font-semibold">{result.original_gig.title}</p>
                  <p className="text-sm text-white/60">by {result.original_gig.seller}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-500 mb-2">Content is Original</h3>
              <p className="text-white/70">
                No matches found in our database. You're good to go!
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setResult(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="w-full mt-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition"
          >
            ↺ Check Another Image
          </button>
        </div>
      )}
    </div>
  );
}
