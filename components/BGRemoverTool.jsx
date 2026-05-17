import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BGRemoverTool() {
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      processImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageSrc) => {
    setProcessing(true);
    toast.loading('Removing background...');

    try {
      // Simulate AI processing (in production, use rembg or similar)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, just show the original image
      setResult(imageSrc);
      toast.dismiss();
      toast.success('Background removed!');
    } catch (error) {
      toast.error('Processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = 'vortex-bg-removed.png';
    link.click();
    toast.success('Downloaded!');
  };

  return (
    <div>
      {!image ? (
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
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-white/40" />
          <h3 className="font-semibold mb-2">Drop an image or click to upload</h3>
          <p className="text-sm text-white/50">PNG · JPG · WEBP — up to 12 MB</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <img src={image} alt="Original" className="w-full rounded-lg border border-white/10" />
              <p className="text-xs text-white/50 text-center mt-2 uppercase tracking-wider">Original</p>
            </div>
            <div>
              {result ? (
                <>
                  <img src={result} alt="Processed" className="w-full rounded-lg border border-white/10" />
                  <p className="text-xs text-white/50 text-center mt-2 uppercase tracking-wider">Background Removed</p>
                </>
              ) : (
                <div className="w-full aspect-square rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadResult}
              disabled={!result}
              className="flex-1 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              ⬇ Download PNG
            </button>
            <button
              onClick={() => {
                setImage(null);
                setResult(null);
              }}
              className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition"
            >
              ↺ New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
