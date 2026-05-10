import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, RefreshCw, Layers, Box, Dices } from 'lucide-react';
import { motion } from 'framer-motion';

import { themes } from './themes';
import { AvatarPreview, cn } from './components/AvatarPreview';

export default function App() {
  const [name, setName] = useState('ignat.ton');
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id);
  const [glassmorphism, setGlassmorphism] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [rounded, setRounded] = useState(16); // 0 to 50
  
  const [isDownloading, setIsDownloading] = useState(false);
  
  const avatarRef = useRef<HTMLDivElement>(null);

  const activeTheme = themes.find((t) => t.id === activeThemeId) || themes[0];

  const handleDownload = useCallback(() => {
    if (avatarRef.current === null) return;
    setIsDownloading(true);

    toPng(avatarRef.current, { cacheBust: true, pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${name || 'avatar'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error generating image', err);
      })
      .finally(() => {
        setIsDownloading(false);
      });
  }, [avatarRef, name]);

  const handleRandomize = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setActiveThemeId(randomTheme.id);
    setGlassmorphism(Math.random() > 0.3);
    setShowLogo(Math.random() > 0.3);
    setRounded(Math.random() > 0.5 ? 16 : Math.random() > 0.5 ? 50 : 0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-950 selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-10">
        
        {/* Left: Sticky Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 w-full max-w-[500px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full relative group"
          >
            {/* Glow behind avatar */}
            <div className={cn("absolute -inset-2 rounded-[2rem] opacity-20 blur-2xl transition-all duration-1000", activeTheme.background)}></div>
            
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-3xl">
              <AvatarPreview 
                ref={avatarRef}
                name={name}
                theme={activeTheme}
                glassmorphism={glassmorphism}
                showLogo={showLogo}
                rounded={rounded}
              />
            </div>
          </motion.div>
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-7 flex flex-col gap-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
                <Layers className="w-10 h-10 text-indigo-400" />
                Avatar Studio
              </h1>
              <a 
                href="https://github.com/ignat-101/avatar" 
                target="_blank" 
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors border border-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Original Bot
              </a>
            </div>
            <p className="text-zinc-400 text-lg">
              Craft stunning, minimalistic avatars for your Web3 identity.
            </p>
          </motion.div>

          {/* Controls Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl flex flex-col gap-8"
          >
            
            {/* Input */}
            <div className="space-y-3">
              <label className="text-sm font-semibold tracking-wide text-zinc-300 uppercase">
                Identity Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium placeholder:text-zinc-600"
                  placeholder="e.g. vitalik.ton"
                  maxLength={16}
                />
                {name && (
                  <button 
                    onClick={() => setName('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Themes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 uppercase">
                  Select Theme
                </label>
                <button 
                  onClick={handleRandomize}
                  className="text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-zinc-300 transition-colors flex items-center gap-1.5"
                >
                  <Dices className="w-3 h-3" />
                  Randomize All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {themes.map((theme) => {
                  const isActive = activeThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setActiveThemeId(theme.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300",
                        isActive 
                          ? "bg-zinc-800/50 border-white/30 shadow-lg scale-105" 
                          : "bg-black/20 border-white/5 hover:bg-zinc-800/30 hover:border-white/10 opacity-70 hover:opacity-100 grayscale-[0.3]"
                      )}
                    >
                      <div className={cn("w-full h-10 rounded-xl mb-2 shadow-inner", theme.background)}></div>
                      <span className="text-xs font-medium text-zinc-300 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-1">
                        {theme.name.replace(/^[^\s]+\s/, '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              
              {/* Glass Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-200">Glassmorphism</h3>
                    <p className="text-xs text-zinc-500">Frosted inner card effect</p>
                  </div>
                </div>
                <button 
                  onClick={() => setGlassmorphism(!glassmorphism)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    glassmorphism ? "bg-indigo-500" : "bg-zinc-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    glassmorphism ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* Logo Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <svg width="20" height="20" viewBox="0 0 100 100" fill="none" className="w-5 h-5">
                      <path d="M49.9999 0C22.3857 0 0 22.3857 0 49.9999C0 77.6142 22.3857 100 49.9999 100C77.6142 100 100 77.6142 100 49.9999C100 22.3857 77.6142 0 49.9999 0ZM72.9378 30.6214C74.3218 30.6214 75.524 31.626 75.8236 32.9934L76.1018 34.252C76.121 34.3392 76.1307 34.4285 76.1307 34.5186C76.1307 35.1614 75.7865 35.7538 75.2217 36.0825L51.9892 49.5937L70.6124 72.1585C71.3093 73.0031 70.8166 74.2755 69.7229 74.4561L68.8055 74.6074C68.4239 74.6704 68.0315 74.5779 67.723 74.3486L49.9999 61.1668L32.2768 74.3486C31.9684 74.5779 31.5759 74.6704 31.1943 74.6074L30.2769 74.4561C29.1832 74.2755 28.6905 73.0031 29.3874 72.1585L48.0107 49.5937L24.7781 36.0825C24.2134 35.7538 23.8692 35.1614 23.8692 34.5186C23.8692 34.4285 23.8788 34.3392 23.898 34.252L24.1762 32.9934C24.4758 31.626 25.678 30.6214 27.0621 30.6214H72.9378Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-200">TON Logo</h3>
                    <p className="text-xs text-zinc-500">Show crypto icon</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowLogo(!showLogo)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    showLogo ? "bg-emerald-500" : "bg-zinc-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    showLogo ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

            </div>

            {/* Shape Slider (Bonus feature to make it awesome) */}
            <div className="pt-2">
              <div className="flex justify-between text-sm font-semibold tracking-wide text-zinc-300 uppercase mb-4">
                <span>Avatar Shape</span>
                <span className="text-zinc-500">{rounded === 50 ? 'Circle' : rounded === 0 ? 'Square' : 'Squircle'}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={rounded} 
                onChange={(e) => setRounded(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/5 flex gap-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-lg py-4 px-6 rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isDownloading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Download className="w-6 h-6" />
                )}
                {isDownloading ? 'Processing...' : 'Download PNG'}
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}