import { useState, useEffect, useRef } from 'react';
import { Download, Palette, Type, Settings, Image as ImageIcon, Circle, Square } from 'lucide-react';

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

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [name, setName] = useState('my.ton');
  const [themeId, setThemeId] = useState('ton-blue');
  const [glassmorphism, setGlassmorphism] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [rounded, setRounded] = useState<'circle' | 'rounded' | 'square'>('circle');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 1024;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const theme = themes.find(t => t.id === themeId) || themes[0];

    // White background to avoid black background issues in Telegram when saved with transparency
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SIZE, SIZE);

    const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    grad.addColorStop(0, theme.bg1);
    grad.addColorStop(1, theme.bg2);

    const br = rounded === 'circle' ? SIZE / 2 : rounded === 'rounded' ? SIZE * 0.18 : 0;
    
    // Draw base shape
    ctx.beginPath();
    if (br > 0) {
      ctx.roundRect(0, 0, SIZE, SIZE, br);
    } else {
      ctx.rect(0, 0, SIZE, SIZE);
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Clip for inner elements
    ctx.save();
    ctx.beginPath();
    if (br > 0) {
      ctx.roundRect(0, 0, SIZE, SIZE, br);
    } else {
      ctx.rect(0, 0, SIZE, SIZE);
    }
    ctx.clip();
    
    // Ambient glows
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

    const cardSize = SIZE * 0.6;
    const cardX = (SIZE - cardSize) / 2;
    const cardY = (SIZE - cardSize) / 2;
    const cardR = SIZE * 0.08;

    if (glassmorphism) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardSize, cardSize, cardR);
      ctx.fillStyle = theme.glassColor;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    if (showLogo) {
      const logoCX = SIZE / 2;
      const logoCY = cardY + cardSize * 0.22;
      const logoR = cardSize * 0.13;
      drawTonLogo(ctx, logoCX, logoCY, logoR, theme.textColor);
    }

    const initials = name.replace(/\.ton$/i, '').substring(0, 2).toUpperCase() || 'TN';
    const fontSize = initials.length > 1 ? SIZE * 0.26 : SIZE * 0.32;
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillText(initials, SIZE / 2, SIZE / 2 + SIZE * 0.02);
    
    // Reset shadow for next texts
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const displayName = name || 'TON Domain';
    const nameFontSize = SIZE * 0.048;
    ctx.font = `600 ${nameFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.8;
    ctx.fillText(displayName.toUpperCase(), SIZE / 2, cardY + cardSize - SIZE * 0.065);
    ctx.globalAlpha = 1;

  }, [name, themeId, glassmorphism, showLogo, rounded]);

  const downloadAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save as JPEG to fix the black background issue in Telegram when transparent
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `avatar-${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent inline-flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-blue-400" />
            TON Avatar Generator
          </h1>
          <p className="text-neutral-400 mt-2">
            Create stunning, customized avatars with solid backgrounds (Fixes Telegram black background bug).
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-indigo-400" />
                Text Settings
              </h2>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="my.ton"
                  maxLength={15}
                />
              </div>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-400" />
                Theme Selection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className={`flex items-center px-4 py-3 rounded-xl border text-left transition-all ${
                      themeId === theme.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-neutral-700 bg-neutral-900 hover:border-neutral-500'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full mr-3 shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${theme.bg1}, ${theme.bg2})` }}
                    />
                    <span className="font-medium text-sm">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-400" />
                Shape & Features
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-3">Avatar Shape</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setRounded('circle')}
                      className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                        rounded === 'circle' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      <Circle className="w-6 h-6" />
                      <span className="text-sm">Circle</span>
                    </button>
                    <button
                      onClick={() => setRounded('rounded')}
                      className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                        rounded === 'rounded' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      <Square className="w-6 h-6" style={{ borderRadius: '4px' }} />
                      <span className="text-sm">Rounded</span>
                    </button>
                    <button
                      onClick={() => setRounded('square')}
                      className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                        rounded === 'square' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      <Square className="w-6 h-6" />
                      <span className="text-sm">Square</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-700">
                  <div>
                    <h3 className="font-medium">Glassmorphism Card</h3>
                    <p className="text-sm text-neutral-400">Add a frosted glass effect</p>
                  </div>
                  <button 
                    onClick={() => setGlassmorphism(!glassmorphism)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${glassmorphism ? 'bg-blue-500' : 'bg-neutral-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${glassmorphism ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-700">
                  <div>
                    <h3 className="font-medium">TON Logo</h3>
                    <p className="text-sm text-neutral-400">Show logo at the top</p>
                  </div>
                  <button 
                    onClick={() => setShowLogo(!showLogo)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showLogo ? 'bg-blue-500' : 'bg-neutral-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showLogo ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 bg-neutral-800 border border-neutral-700 rounded-3xl p-6 flex flex-col items-center shadow-2xl">
              <h2 className="text-lg font-semibold mb-6 text-neutral-300 w-full text-center border-b border-neutral-700 pb-4">
                Live Preview
              </h2>
              
              <div className={`relative w-64 h-64 md:w-80 md:h-80 shadow-2xl transition-all duration-300 ${
                rounded === 'circle' ? 'rounded-full' : rounded === 'rounded' ? 'rounded-3xl' : 'rounded-none'
              } overflow-hidden bg-white flex items-center justify-center`}>
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="w-full mt-8">
                <button
                  onClick={downloadAvatar}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Download className="w-5 h-5" />
                  Download Avatar (JPEG)
                </button>
                <p className="text-xs text-center text-neutral-500 mt-4 px-4">
                  Image is saved as JPEG with a solid white background to prevent black backgrounds in Telegram.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
