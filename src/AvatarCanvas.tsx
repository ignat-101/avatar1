import { useEffect, useRef } from 'react';
import { drawAvatar, AvatarOptions } from './avatar-renderer';

interface Props extends AvatarOptions {
  className?: string;
}

export function AvatarCanvas({ name, theme, glass, logo, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use a high resolution internal canvas for crispness, scale it down via CSS
    const size = 1200; 
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawAvatar(ctx, size, size, { name, theme, glass, logo });
  }, [name, theme, glass, logo]);

  return (
    <div className={className}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10"
        style={{ display: 'block' }}
      />
    </div>
  );
}
