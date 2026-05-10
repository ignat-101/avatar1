const { createCanvas } = require('canvas');

const themes = [
  { name: 'TON Blue', bg: ['#0088CC', '#005588'] },
  { name: 'Dark Mesh', bg: ['#121212', '#2a2a35'] },
  { name: 'Neon Cyber', bg: ['#0d0221', '#26004c', '#ff0055'] },
  { name: 'Holographic', bg: ['#e0c3fc', '#8ec5fc'] },
  { name: 'Deep Space', bg: ['#000000', '#130f40'] },
  { name: 'Minimal Light', bg: ['#fdfbfb', '#ebedee'] },
  { name: 'Matrix Web3', bg: ['#000000', '#0f3e0f'] },
  { name: 'Molten Gold', bg: ['#ffb347', '#ffcc33'] }
];

function generateAvatarBuffer(domain, themeIndex, glass, logo) {
  const width = 1200;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const t = themes[themeIndex] || themes[0];
  
  // 1. Draw Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (t.bg.length === 2) {
    gradient.addColorStop(0, t.bg[0]);
    gradient.addColorStop(1, t.bg[1]);
  } else if (t.bg.length === 3) {
    gradient.addColorStop(0, t.bg[0]);
    gradient.addColorStop(0.5, t.bg[1]);
    gradient.addColorStop(1, t.bg[2]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, width * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.9, width * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = t.name === 'Minimal Light' ? '#000000' : '#ffffff';
  ctx.fill();
  ctx.globalAlpha = 1.0;

  const cx = width / 2;
  const cy = height / 2;

  // 2. Draw Glassmorphism Card
  if (glass) {
    const cardWidth = width * 0.8;
    const cardHeight = height * 0.45;
    const rx = cx - cardWidth / 2;
    const ry = cy - cardHeight / 2;
    const radius = 40;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(rx, ry, cardWidth, cardHeight, radius);
    } else {
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + cardWidth - radius, ry);
      ctx.quadraticCurveTo(rx + cardWidth, ry, rx + cardWidth, ry + radius);
      ctx.lineTo(rx + cardWidth, ry + cardHeight - radius);
      ctx.quadraticCurveTo(rx + cardWidth, ry + cardHeight, rx + cardWidth - radius, ry + cardHeight);
      ctx.lineTo(rx + radius, ry + cardHeight);
      ctx.quadraticCurveTo(rx, ry + cardHeight, rx, ry + cardHeight - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    }
    
    const cardGradient = ctx.createLinearGradient(rx, ry, rx, ry + cardHeight);
    if (t.name === 'Minimal Light') {
      cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      cardGradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
    } else {
      cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      cardGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    }
    
    ctx.fillStyle = cardGradient;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.lineWidth = 2;
    ctx.strokeStyle = t.name === 'Minimal Light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
    ctx.stroke();
    ctx.restore();
  }

  // 3. Draw Logo
  let textY = cy;
  if (logo) {
    const logoSize = glass ? 60 : 80;
    const logoY = cy - (glass ? 50 : 60);
    textY = cy + (glass ? 40 : 50);

    ctx.save();
    ctx.translate(cx, logoY);
    ctx.beginPath();
    ctx.moveTo(0, -logoSize/2);
    ctx.lineTo(logoSize/2, -logoSize/6);
    ctx.lineTo(0, logoSize/2);
    ctx.lineTo(-logoSize/2, -logoSize/6);
    ctx.closePath();
    ctx.fillStyle = t.name === 'Minimal Light' ? '#0088CC' : '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }

  // 4. Draw Domain Text
  let fontSize = glass ? 80 : 100;
  if (domain.length > 12) {
      fontSize = fontSize * (12 / domain.length);
  }
  
  ctx.font = "bold " + fontSize + "px sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  
  ctx.fillStyle = t.name === 'Minimal Light' ? '#333333' : '#FFFFFF';
  ctx.fillText(domain, cx, textY);
  
  return canvas.toBuffer('image/png');
}

module.exports = {
  generateAvatarBuffer,
  themes
};