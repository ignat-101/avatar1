import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, Palette, Settings, Terminal, CheckCircle2, Copy } from 'lucide-react';
import clsx from 'clsx';
import botFixCode from './botFixCode.txt?raw';
import readmeCode from './readmeCode.txt?raw';

const SIZE = 1024;

const themes = [
  { id: 'ton-blue', name: '💎 TON Blue', bg1: '#3b82f6', bg2: '#4f46e5', textColor: '#ffffff', glassColor: 'rgba(255,255,255,0.12)' },
  { id: 'dark-mesh', name: '🌑 Dark Mesh', bg1: '#0f172a', bg2: '#27272a', textColor: '#ffffff', glassColor: 'rgba(255,255,255,0.06)' },
  { id: 'neon-cyber', name: '💜 Neon Cyber', bg1: '#c026d3', bg2: '#4c1d95', textColor: '#fdf4ff', glassColor: 'rgba(192,38,211,0.12)' },
  { id: 'holographic', name: '🌈 Holographic', bg1: '#f9a8d4', bg2: '#818cf8', textColor: '#1e1b4b', glassColor: 'rgba(255,255,255,0.35)' },
  { id: 'deep-space', name: '🚀 Deep Space', bg1: '#020617', bg2: '#1e1b4b', textColor: '#f3e8ff', glassColor: 'rgba(88,28,135,0.22)' },
  { id: 'minimal-light', name: '⬜ Minimal Light', bg1: '#f4f4f5', bg2: '#d4d4d8', textColor: '#18181b', glassColor: 'rgba(255,255,255,0.65)' },
  { id: 'matrix-web3', name: '🟢 Matrix Web3', bg1: '#022c22', bg2: '#064e3b', textColor: '#34d399', glassColor: 'rgba(6,78,59,0.22)' },
  { id: 'molten-gold', name: '🥇 Molten Gold', bg1: '#f59e0b', bg2: '#ea580c', textColor: '#451a03', glassColor: 'rgba(255,255,255,0.22)' },
];

function drawTonLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  const hw = r * 0.55;
  const topY = cy - r * 0.35;
  const botY = cy + r * 0.48;
  const midY = cy + r * 0.10;

  ctx.beginPath();
  ctx.moveTo(cx - hw, topY);
  ctx.lineTo(cx + hw, topY);
  ctx.lineTo(cx, botY);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.lineTo(cx, midY);
  ctx.stroke();
  ctx.restore();
}

function generateCanvas(ctx: CanvasRenderingContext2D, options: any) {
  const { name = 'my.ton', themeId = 'ton-blue', glassmorphism = true, showLogo = true, rounded = 'circle' } = options;
  const theme = themes.find(t => t.id === themeId) || themes[0];
  
  ctx.clearRect(0, 0, SIZE, SIZE);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, theme.bg1);
  grad.addColorStop(1, theme.bg2);

  const br = rounded === 'circle' ? SIZE / 2 : rounded === 'rounded' ? SIZE * 0.18 : 0;

  // Solid background to prevent black background issues on Telegram when exported to JPEG
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.beginPath();
  if (br > 0) {
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, SIZE, SIZE, br);
    } else {
      ctx.arc(SIZE/2, SIZE/2, SIZE/2, 0, Math.PI * 2);
    }
  } else {
    ctx.rect(0, 0, SIZE, SIZE);
  }
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Glows and Texture overlay
  ctx.save();
  ctx.beginPath();
  if (br > 0 && ctx.roundRect) {
    ctx.roundRect(0, 0, SIZE, SIZE, br);
  } else {
    ctx.rect(0, 0, SIZE, SIZE);
  }
  ctx.clip();

  const glowGrad1 = ctx.createRadialGradient(SIZE * 0.8, SIZE * 0.1, 0, SIZE * 0.8, SIZE * 0.1, SIZE * 0.5);
  glowGrad1.addColorStop(0, 'rgba(255,255,255,0.15)');
  glowGrad1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glowGrad1;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const glowGrad2 = ctx.createRadialGradient(SIZE * 0.1, SIZE * 0.9, 0, SIZE * 0.1, SIZE * 0.9, SIZE * 0.6);
  glowGrad2.addColorStop(0, 'rgba(0,0,0,0.18)');
  glowGrad2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGrad2;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.restore();

  // Glassmorphism card
  const cardSize = SIZE * 0.6;
  const cardX = (SIZE - cardSize) / 2;
  const cardY = (SIZE - cardSize) / 2;
  const cardR = SIZE * 0.08;

  if (glassmorphism) {
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cardX, cardY, cardSize, cardSize, cardR);
    } else {
      ctx.rect(cardX, cardY, cardSize, cardSize);
    }
    ctx.fillStyle = theme.glassColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // TON Logo
  if (showLogo) {
    const logoCX = SIZE / 2;
    const logoCY = cardY + cardSize * 0.22;
    const logoR = cardSize * 0.13;
    drawTonLogo(ctx, logoCX, logoCY, logoR, theme.textColor);
  }

  // Initials
  const initials = name.replace(/\.ton$/i, '').substring(0, 2).toUpperCase() || 'TN';
  const fontSize = initials.length > 1 ? SIZE * 0.26 : SIZE * 0.32;
  ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  ctx.fillStyle = theme.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillText(initials, SIZE / 2, SIZE / 2 + SIZE * 0.02);
  
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Display Name
  const displayName = name || 'TON Domain';
  const nameFontSize = SIZE * 0.048;
  ctx.font = `600 ${nameFontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  ctx.fillStyle = theme.textColor;
  ctx.globalAlpha = 0.8;
  ctx.fillText(displayName.toUpperCase(), SIZE / 2, cardY + cardSize - SIZE * 0.065);
  ctx.globalAlpha = 1;
}

export default function App() {
  const [name, setName] = useState('ignat.ton');
  const [themeId, setThemeId] = useState('ton-blue');
  const [glassmorphism, setGlassmorphism] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [rounded, setRounded] = useState('circle');
  const [tab, setTab] = useState<'app' | 'bot'>('app');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    generateCanvas(ctx, { name, themeId, glassmorphism, showLogo, rounded });
  }, [name, themeId, glassmorphism, showLogo, rounded]);

  const downloadAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${name}-avatar.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-blue-500/30">
      <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <Palette className="w-6 h-6 text-blue-400" />
            </div>
            <span className="font-bold text-lg hidden sm:block tracking-tight text-white">TON Avatar</span>
          </div>
          <div className="flex bg-neutral-800/80 rounded-xl p-1 border border-neutral-700/50">
            <button
              onClick={() => setTab('app')}
              className={clsx('px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300', tab === 'app' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50')}
            >
              Web Generator
            </button>
            <button
              onClick={() => setTab('bot')}
              className={clsx('px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2', tab === 'bot' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50')}
            >
              <Terminal className="w-4 h-4" />
              Bot Code Fix
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {tab === 'app' ? (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6 bg-neutral-950/80 p-6 rounded-3xl border border-neutral-800 shadow-2xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-neutral-400" /> Options
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Name / Domain</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="my.ton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setThemeId(theme.id)}
                        className={clsx(
                          'px-3 py-2.5 text-sm rounded-xl border text-left truncate transition-all duration-300 font-medium',
                          themeId === theme.id 
                            ? 'border-blue-500/50 bg-blue-500/10 text-white shadow-inner' 
                            : 'border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/50 text-neutral-400'
                        )}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Shape</label>
                  <div className="flex bg-neutral-900 rounded-xl p-1 border border-neutral-800">
                    {['circle', 'rounded', 'square'].map(shape => (
                      <button
                        key={shape}
                        onClick={() => setRounded(shape)}
                        className={clsx(
                          'flex-1 px-3 py-2 rounded-lg text-sm capitalize font-medium transition-all duration-300',
                          rounded === shape ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/50' : 'text-neutral-500 hover:text-white'
                        )}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-1 border-t border-neutral-800/50">
                  <div className="flex items-center justify-between py-2 rounded-lg group">
                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Glassmorphism</span>
                    <button 
                      onClick={() => setGlassmorphism(!glassmorphism)}
                      className={clsx('w-11 h-6 rounded-full transition-colors relative border border-transparent', glassmorphism ? 'bg-blue-600' : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700')}
                    >
                      <span className={clsx('absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm', glassmorphism ? 'left-6' : 'left-1')} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-2 rounded-lg group">
                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Show Logo</span>
                    <button 
                      onClick={() => setShowLogo(!showLogo)}
                      className={clsx('w-11 h-6 rounded-full transition-colors relative border border-transparent', showLogo ? 'bg-blue-600' : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700')}
                    >
                      <span className={clsx('absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm', showLogo ? 'left-6' : 'left-1')} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadAvatar}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                Download High-Res
              </button>
            </div>

            <div className="lg:col-span-8 flex flex-col items-center justify-center bg-neutral-950/40 rounded-3xl border border-neutral-800/50 p-8 min-h-[500px] shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 50%)' }} />
              <div className="relative group z-10">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <canvas 
                  ref={canvasRef} 
                  width={SIZE} 
                  height={SIZE} 
                  className="w-full max-w-[400px] aspect-square shadow-2xl rounded-2xl bg-neutral-900 border border-neutral-800/50 transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl pointer-events-none">
                  <span className="bg-neutral-900/90 text-white px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-md border border-neutral-700/50">
                    <RefreshCw className="w-4 h-4 animate-spin-slow" /> Live Preview
                  </span>
                </div>
              </div>
              <p className="mt-8 text-neutral-500 text-sm flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Generated dynamically at 1024×1024
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Terminal className="w-32 h-32 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-blue-400" /> Bot Issues Resolved
              </h2>
              <p className="text-neutral-400 mb-6 max-w-2xl leading-relaxed">
                The original Telegram bot code on your GitHub had critical issues preventing avatars from rendering and causing crashes. Replace the files in your repo with the code below.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-lg">●</span> Black Avatars Fixed
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Telegram automatically converts PNGs with transparency to JPEGs, stripping transparency to solid black. Added a solid white background layer and forced <code className="bg-neutral-800 text-blue-300 px-1 py-0.5 rounded text-xs">image/jpeg</code> export.
                  </p>
                </div>
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-lg">●</span> Missing Logic Added
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    The <code className="bg-neutral-800 text-blue-300 px-1 py-0.5 rounded text-xs">settingsKeyboard</code> and <code className="bg-neutral-800 text-blue-300 px-1 py-0.5 rounded text-xs">sendAvatar</code> functions were missing, crashing the bot on interactions. They are now fully implemented and integrated.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-t-2xl border border-neutral-800 border-b-0">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold text-white">bot/index.js</h3>
                  </div>
                  <button onClick={() => copyToClipboard(botFixCode)} className="text-sm font-medium flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" /> Copy Full Code
                  </button>
                </div>
                <div className="bg-[#0d1117] rounded-b-2xl border border-neutral-800 border-t-0 overflow-hidden shadow-xl">
                  <pre className="p-6 text-sm text-neutral-300 overflow-x-auto h-[600px] font-mono leading-relaxed custom-scrollbar">
                    <code>{botFixCode}</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-t-2xl border border-neutral-800 border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-neutral-400 rounded-sm flex items-center justify-center text-neutral-900 text-xs font-bold">MD</div>
                    <h3 className="text-lg font-semibold text-white">bot/README.md</h3>
                  </div>
                  <button onClick={() => copyToClipboard(readmeCode)} className="text-sm font-medium flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" /> Copy MD
                  </button>
                </div>
                <div className="bg-[#0d1117] rounded-b-2xl border border-neutral-800 border-t-0 overflow-hidden shadow-xl">
                  <pre className="p-6 text-sm text-neutral-300 overflow-x-auto h-[600px] font-mono leading-relaxed custom-scrollbar">
                    <code>{readmeCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}} />
    </div>
  );
}
