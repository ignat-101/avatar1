import { useState, useEffect, useRef } from 'react';
import { Download, Share2, Palette, Settings2 } from 'lucide-react';
import { drawAvatar, themes } from './utils/drawAvatar';

function App() {
  const [domain, setDomain] = useState('7288.ton');
  const [themeIndex, setThemeIndex] = useState(0);
  const [glass, setGlass] = useState(true);
  const [logo, setLogo] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, 1200, 1200);
        
        // Draw avatar
        drawAvatar(ctx, 1200, 1200, {
          domain: domain.trim() || '7288.ton',
          theme: themeIndex,
          glass,
          logo
        });
      }
    }
  }, [domain, themeIndex, glass, logo]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${domain || '7288.ton'}_avatar.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col md:flex-row">
      {/* Sidebar Controls */}
      <div className="w-full md:w-96 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-8 bg-[#111113]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-xl">💎</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">TON Avatar</h1>
            <p className="text-sm text-gray-400">Generator & Bot Preview</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Domain Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={16} /> Domain Name
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. 7288.ton"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-gray-600"
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Palette size={16} /> Select Theme ({themes.length})
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setThemeIndex(idx)}
                  className={`px-3 py-2 text-sm rounded-lg border text-left transition-all ${
                    themeIndex === idx 
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Glassmorphism Effect</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative ${glass ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${glass ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={glass} onChange={(e) => setGlass(e.target.checked)} />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Show TON Logo</span>
              <div className={`w-11 h-6 rounded-full transition-colors relative ${logo ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${logo ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={logo} onChange={(e) => setLogo(e.target.checked)} />
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-4">
          <a
            href="https://github.com/ignat-101/avatar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> View on GitHub
          </a>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-black/40 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative flex flex-col items-center gap-8 max-w-[600px] w-full">
          {/* Canvas Container */}
          <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#1A1A1C]">
            <canvas
              ref={canvasRef}
              width={1200}
              height={1200}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
            >
              <Download size={20} /> Download HD
            </button>
            <button
              onClick={() => {
                setThemeIndex(Math.floor(Math.random() * themes.length));
              }}
              className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              <Share2 size={20} /> Randomize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;