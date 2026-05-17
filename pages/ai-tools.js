import { useState } from 'react';
import { Scissors, Film, Shield, BarChart } from 'lucide-react';
import BGRemoverTool from '../components/BGRemoverTool';
import GreenScreenTool from '../components/GreenScreenTool';
import PlagiarismDetector from '../components/PlagiarismDetector';

export default function AITools() {
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 'bg-remover',
      icon: Scissors,
      title: 'Background Remover',
      description: 'Remove any background from a photo instantly using ML segmentation running entirely in your browser.',
      available: true,
      component: BGRemoverTool,
    },
    {
      id: 'green-screen',
      icon: Film,
      title: 'Green / Blue Screen',
      description: 'Upload a chroma-key image, dial in the exact color, tolerance and edge feathering.',
      available: true,
      component: GreenScreenTool,
    },
    {
      id: 'plagiarism',
      icon: Shield,
      title: 'Stolen Edit Detector',
      description: 'AI content fingerprinting scans the Vortex archive to flag plagiarism before your listing goes live.',
      available: true,
      component: PlagiarismDetector,
    },
    {
      id: 'quality',
      icon: BarChart,
      title: 'Export Quality Scorer',
      description: 'Analyze bitrate, resolution, frame consistency and audio sync. Get a quality score before submitting.',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs text-white/50 uppercase tracking-widest mb-3">Built-In AI Tools</div>
          <h1 className="text-display text-6xl md:text-8xl mb-4">EDIT SMARTER</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Real tools running live in your browser. No installs, no servers, no waiting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div key={tool.id} className="bg-card border border-white/10 rounded-2xl p-8 relative overflow-hidden hover:border-white/20 transition">
                <div className="absolute top-0 right-4 text-display text-8xl text-white/5 pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{tool.title}</h3>
                <p className="text-sm text-white/60 mb-6">{tool.description}</p>

                {tool.available ? (
                  <button
                    onClick={() => setActiveTool(tool)}
                    className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
                  >
                    Open Tool →
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-3 rounded-lg bg-surface border border-white/10 text-white/40 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool Modal */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="bg-surface border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-display text-4xl mb-2">{activeTool.title}</h2>
                <p className="text-sm text-white/60">Runs 100% in your browser · Zero upload · Free forever</p>
              </div>
              <button
                onClick={() => setActiveTool(null)}
                className="w-10 h-10 rounded-full border border-white/20 hover:bg-white/5 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {activeTool.component && <activeTool.component />}
          </div>
        </div>
      )}
    </div>
  );
}
