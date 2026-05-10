import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeDef } from '../themes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AvatarProps {
  name: string;
  theme: ThemeDef;
  glassmorphism: boolean;
  showLogo: boolean;
  rounded: number;
}

// The TON logo from the photo: circle outline with outlined diamond/arrow shape inside
export const TonLogoOutlined = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer circle */}
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" fill="none" />
    {/* Inner TON diamond/arrow shape - outlined */}
    <path
      d="M33 32 H67 C69.5 32 71 34.5 69.5 36.5 L53 62 C51.5 64.5 48.5 64.5 47 62 L30.5 36.5 C29 34.5 30.5 32 33 32 Z"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinejoin="round"
      fill="none"
    />
    <line x1="50" y1="32" x2="50" y2="56" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const AvatarPreview = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, theme, glassmorphism, showLogo, rounded }, ref) => {
    const initials = name
      .replace(/\.ton$/i, '')
      .substring(0, 2)
      .toUpperCase() || 'TN';

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden w-full aspect-square shadow-2xl flex items-center justify-center transition-all duration-500 ease-out',
          theme.background
        )}
        style={{ borderRadius: `${rounded}%` }}
      >
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Geometric glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-black/10 blur-3xl" />
        </div>

        {/* Main Content */}
        <div
          className={cn(
            'relative z-10 w-3/5 h-3/5 flex flex-col items-center justify-center p-8 transition-all duration-500',
            glassmorphism
              ? cn('backdrop-blur-xl border shadow-xl rounded-3xl', theme.glass)
              : 'bg-transparent',
            theme.text
          )}
        >
          {showLogo && (
            <div className="absolute top-6">
              <TonLogoOutlined className="w-12 h-12 opacity-90 drop-shadow-md" />
            </div>
          )}

          <div className="flex-1 flex items-center justify-center">
            <span
              className={cn(
                'font-bold tracking-tighter drop-shadow-lg transition-all duration-300',
                name.length > 8 ? 'text-5xl md:text-7xl' : 'text-7xl md:text-9xl'
              )}
              style={{ textShadow: '0px 4px 20px rgba(0,0,0,0.15)' }}
            >
              {initials}
            </span>
          </div>

          <div className="absolute bottom-6 font-semibold tracking-wide text-sm md:text-lg opacity-80 uppercase">
            {name || 'TON Domain'}
          </div>
        </div>
      </div>
    );
  }
);

AvatarPreview.displayName = 'AvatarPreview';
