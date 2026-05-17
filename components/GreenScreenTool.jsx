import { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GreenScreenTool() {
  const [image, setImage] = useState(null);
  const [keyColor, setKeyColor] = useState('#00b140');
  const [tolerance, setTolerance] = useState(60);
  const [feather, setFeather] = useState(6);
  const [bgMode, setBgMode] = useState('transparent');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        processChromaKey(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processChromaKey = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const keyRGB = hexToRgb(keyColor);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const distance = Math.sqrt(
        Math.pow(r - keyRGB.r, 2) +
        Math.pow(g - keyRGB.g, 2) +
        Math.pow(b - keyRGB.b, 2)
      );
      
      if (distance < tolerance) {
        data[i + 3] = 0; // Make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 177, b: 64 };
  };

  useEffect(() => {
    if (image) {
      processChromaKey(image);
    }
  }, [keyColor, tolerance, feather, image]);

  const downloadResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vortex-chroma-key.png';
      link.click();
      toast.success('Downloaded!');
    });
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
          <h3 className="font-semibold mb-2">Drop your green / blue screen image</h3>
          <p className="text-sm text-white/50">PNG · JPG · WEBP — up to 12 MB</p>
        </div>
      ) : (
        <div>
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg border border-white/10 mb-6"
            style={{
              background: bgMode === 'checker' 
                ? 'repeating-conic-gradient(#808080 0% 25%, #404040 0% 50%) 50% / 20px 20px'
                : bgMode === 'transparent' ? 'transparent' : bgMode
            }}
          />

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/50 uppercase tracking-wider w-24">Key Color</span>
              <input
                type="color"
                value={keyColor}
                onChange={(e) => setKeyColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer"
              />
              <div className="flex gap-2">
                {['#00b140', '#0047ab', '#be0000'].map(color => (
                  <button
                    key={color}
                    onClick={() => setKeyColor(color)}
                    className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-white transition"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-white/50 uppercase tracking-wider w-24">Tolerance</span>
              <input
                type="range"
                min="5"
                max="130"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-white/60 w-12">{tolerance}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-white/50 uppercase tracking-wider w-24">Preview BG</span>
              <div className="flex gap-2">
                {[
                  { value: 'transparent', label: 'Transparent' },
                  { value: 'black', label: 'Black' },
                  { value: 'white', label: 'White' },
                  { value: 'checker', label: 'Checker' },
                ].map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => setBgMode(mode.value)}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      bgMode === mode.value
                        ? 'bg-white text-black'
                        : 'border border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadResult}
              className="flex-1 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              ⬇ Download PNG
            </button>
            <button
              onClick={() => setImage(null)}
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
