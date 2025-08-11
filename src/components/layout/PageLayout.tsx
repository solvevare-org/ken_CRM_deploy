import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  onBack 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {showBackButton && (
            <div className="mb-8 animate-slide-right">
              <Button
                variant="glass"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2 !px-4 !py-2"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
            </div>
          )}
          
          {title && (
            <div className="text-center mb-12 animate-slide-up">
              <h1 className="text-5xl md:text-6xl font-black mb-6 holographic leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl text-white/80 font-medium leading-relaxed max-w-lg mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl animate-scale-in">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {children}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}