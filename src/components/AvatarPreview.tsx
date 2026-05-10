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

export const AvatarPreview = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, theme, glassmorphism, showLogo, rounded }, ref) => {
    // Generate initials
    const initials = name
      .replace(/\.ton$/, '')
      .substring(0, 2)
      .toUpperCase() || 'TN';

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden w-full aspect-square shadow-2xl flex items-center justify-center transition-all duration-500 ease-out",
          theme.background
        )}
        style={{ borderRadius: `${rounded}%` }}
      >
        {/* Subtle background noise/texture for that premium feel */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Minimal Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff'/%3E%3C/svg%3E")` }}>
        </div>

        {/* Optional Geometric Ornaments based on theme id (just for that awesome abstract look) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-black/10 blur-3xl"></div>
        </div>

        {/* Main Content Area */}
        <div 
          className={cn(
            "relative z-10 w-3/5 h-3/5 flex flex-col items-center justify-center p-8 transition-all duration-500",
            glassmorphism ? cn("backdrop-blur-xl border shadow-xl rounded-3xl", theme.glass) : "bg-transparent",
            theme.text
          )}
        >
          {showLogo && (
            <div className="absolute top-6">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-90 drop-shadow-md">
                <path d="M49.9999 0C22.3857 0 0 22.3857 0 49.9999C0 77.6142 22.3857 100 49.9999 100C77.6142 100 100 77.6142 100 49.9999C100 22.3857 77.6142 0 49.9999 0ZM72.9378 30.6214C74.3218 30.6214 75.524 31.626 75.8236 32.9934L76.1018 34.252C76.121 34.3392 76.1307 34.4285 76.1307 34.5186C76.1307 35.1614 75.7865 35.7538 75.2217 36.0825L51.9892 49.5937L70.6124 72.1585C71.3093 73.0031 70.8166 74.2755 69.7229 74.4561L68.8055 74.6074C68.4239 74.6704 68.0315 74.5779 67.723 74.3486L49.9999 61.1668L32.2768 74.3486C31.9684 74.5779 31.5759 74.6704 31.1943 74.6074L30.2769 74.4561C29.1832 74.2755 28.6905 73.0031 29.3874 72.1585L48.0107 49.5937L24.7781 36.0825C24.2134 35.7538 23.8692 35.1614 23.8692 34.5186C23.8692 34.4285 23.8788 34.3392 23.898 34.252L24.1762 32.9934C24.4758 31.626 25.678 30.6214 27.0621 30.6214H72.9378Z" fill="currentColor"/>
              </svg>
            </div>
          )}
          
          <div className="flex-1 flex items-center justify-center">
            <span className={cn(
              "font-bold tracking-tighter drop-shadow-lg transition-all duration-300",
              name.length > 8 ? "text-5xl md:text-7xl" : "text-7xl md:text-9xl"
            )}
            style={{ textShadow: "0px 4px 20px rgba(0,0,0,0.15)" }}>
              {initials}
            </span>
          </div>

          <div className="absolute bottom-6 font-semibold tracking-wide text-sm md:text-lg opacity-80 uppercase">
            {name || "TON Domain"}
          </div>
        </div>
      </div>
    );
  }
);
AvatarPreview.displayName = 'AvatarPreview';