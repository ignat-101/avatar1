export type Theme = 'midnight' | 'opal' | 'nordic' | 'sunset' | 'ton-clean';

export interface AvatarOptions {
  name: string;
  theme: Theme;
  glass: boolean;
  logo: boolean;
}

const themeColors: Record<Theme, { bg1: string; bg2: string; text: string; glass: string; glassBorder: string; accent?: string }> = {
  'midnight': {
    bg1: '#0f172a',
    bg2: '#020617',
    text: '#f8fafc',
    glass: 'rgba(255, 255, 255, 0.03)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    accent: '#38bdf8'
  },
  'opal': {
    bg1: '#fdfbfb',
    bg2: '#ebedee',
    text: '#0f172a',
    glass: 'rgba(255, 255, 255, 0.4)',
    glassBorder: 'rgba(0, 0, 0, 0.05)',
    accent: '#0f172a'
  },
  'nordic': {
    bg1: '#e0c3fc',
    bg2: '#8ec5fc',
    text: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.2)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    accent: '#ffffff'
  },
  'sunset': {
    bg1: '#ffecd2',
    bg2: '#fcb69f',
    text: '#43210b',
    glass: 'rgba(255, 255, 255, 0.3)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    accent: '#43210b'
  },
  'ton-clean': {
    bg1: '#0088cc',
    bg2: '#0055aa',
    text: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.15)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    accent: '#ffffff'
  }
};

export function drawAvatar(ctx: CanvasRenderingContext2D, width: number, height: number, options: AvatarOptions) {
  const { name, theme, glass, logo } = options;
  const colors = themeColors[theme];

  // 1. Background Gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.bg1);
  gradient.addColorStop(1, colors.bg2);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Modern minimalist abstract shapes (subtle glows)
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.15, width * 0.5, 0, Math.PI * 2);
  const glow = ctx.createRadialGradient(width * 0.85, height * 0.15, 0, width * 0.85, height * 0.15, width * 0.5);
  glow.addColorStop(0, colors.glass);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width * 0.15, height * 0.85, width * 0.6, 0, Math.PI * 2);
  const glow2 = ctx.createRadialGradient(width * 0.15, height * 0.85, 0, width * 0.15, height * 0.85, width * 0.6);
  glow2.addColorStop(0, colors.glass);
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fill();

  // 2. Glassmorphism Card (Optional)
  let contentCenterY = height / 2;
  
  if (glass) {
    const cardWidth = width * 0.8;
    const cardHeight = height * 0.5;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    const radius = 40;

    // Draw card background
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, radius);
    ctx.fillStyle = colors.glass;
    ctx.fill();

    // Draw card border
    ctx.lineWidth = 2;
    ctx.strokeStyle = colors.glassBorder;
    ctx.stroke();
  }

  // 3. Typography
  let fontSize = width * 0.12;
  if (name.length > 10) {
    fontSize = width * 0.09;
  }
  if (name.length > 15) {
    fontSize = width * 0.07;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.font = "bold " + fontSize + "px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillStyle = colors.text;

  let mainText = name;
  let subText = '';
  
  if (name.toLowerCase().endsWith('.ton')) {
    mainText = name.substring(0, name.length - 4);
    subText = '.TON';
  }

  if (subText) {
    ctx.fillText(mainText, width / 2, contentCenterY - (logo ? 20 : 0));
    
    ctx.font = "600 " + (fontSize * 0.5) + "px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    
    ctx.globalAlpha = 0.6;
    ctx.fillText(subText, width / 2, contentCenterY + fontSize * 0.8 - (logo ? 20 : 0));
    ctx.globalAlpha = 1.0;
  } else {
    ctx.fillText(name, width / 2, contentCenterY - (logo ? 10 : 0));
  }

  // 4. TON Logo
  if (logo) {
    const logoSize = width * 0.1;
    const logoX = width / 2;
    const logoY = contentCenterY + (subText ? fontSize * 1.6 : fontSize * 1.2);

    ctx.save();
    ctx.translate(logoX, logoY);
    
    ctx.beginPath();
    ctx.moveTo(0, -logoSize/2);
    ctx.lineTo(logoSize/2, 0);
    ctx.lineTo(0, logoSize/2);
    ctx.lineTo(-logoSize/2, 0);
    ctx.closePath();
    
    ctx.fillStyle = colors.accent || colors.text;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -logoSize/4);
    ctx.lineTo(logoSize/4, 0);
    ctx.lineTo(0, logoSize/4);
    ctx.lineTo(-logoSize/4, 0);
    ctx.closePath();
    ctx.fillStyle = colors.bg1;
    ctx.fill();
    
    ctx.restore();
  }
}
