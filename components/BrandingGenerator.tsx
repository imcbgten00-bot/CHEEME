import React, { useState } from 'react';
import { generateBranding, generateLogo } from '../services/geminiService';
import { BusinessState } from '../types';
import { Loader2, Palette, RefreshCw, Download } from 'lucide-react';

interface BrandingGeneratorProps {
  business: BusinessState;
  onUpdate: (data: Partial<BusinessState>) => void;
}

const BrandingGenerator: React.FC<BrandingGeneratorProps> = ({ business, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);

  const handleGenerateBranding = async () => {
    setLoading(true);
    try {
      const data = await generateBranding(business.name, business.idea);
      onUpdate({
        branding: {
          ...business.branding,
          slogan: data.slogan,
          colors: data.colors,
          logoUrl: business.branding?.logoUrl // Preserve logo if exists
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLogo = async () => {
    setLoadingLogo(true);
    try {
      const logoUrl = await generateLogo(business.name, business.idea);
      if (logoUrl) {
        onUpdate({
          branding: {
            slogan: business.branding?.slogan || '',
            colors: business.branding?.colors || [],
            logoUrl: logoUrl
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogo(false);
    }
  };

  const hasBranding = business.branding && business.branding.colors.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Brand Identity</h2>
          <p className="text-slate-500">Generate your visual identity and messaging.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateBranding}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            Generate Assets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80 flex flex-col items-center justify-center relative overflow-hidden group">
            {business.branding?.logoUrl ? (
              <img 
                src={business.branding.logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="text-center text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette size={32} />
                </div>
                <p>No logo generated yet</p>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button
                onClick={handleGenerateLogo}
                disabled={loadingLogo}
                className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2"
              >
                {loadingLogo ? <Loader2 className="animate-spin" size={16} /> : null}
                {business.branding?.logoUrl ? 'Regenerate Logo' : 'Generate Logo'}
              </button>
            </div>
          </div>
          <p className="text-sm text-center text-slate-500">AI-generated vector-style logo</p>
        </div>

        {/* Identity Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slogan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Slogan</h3>
            {hasBranding ? (
              <p className="text-2xl font-serif italic text-slate-800">"{business.branding?.slogan}"</p>
            ) : (
              <div className="h-8 bg-slate-100 rounded animate-pulse w-3/4"></div>
            )}
          </div>

          {/* Color Palette */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Color Palette</h3>
            <div className="grid grid-cols-3 gap-4 h-32">
              {hasBranding ? (
                business.branding?.colors.map((color, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm h-full" style={{ backgroundColor: color }}>
                    <div className="absolute inset-x-0 bottom-0 bg-black/20 backdrop-blur-sm p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-xs font-mono text-center">{color}</p>
                    </div>
                  </div>
                ))
              ) : (
                [1, 2, 3].map(i => <div key={i} className="bg-slate-100 rounded-xl animate-pulse h-full"></div>)
              )}
            </div>
          </div>

          {/* Typography Preview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Typography Preview</h3>
             <div className="space-y-2">
               <h1 className="text-4xl font-bold text-slate-900">Heading 1</h1>
               <h2 className="text-2xl font-semibold text-slate-800">Heading 2</h2>
               <p className="text-slate-600">Body text. The quick brown fox jumps over the lazy dog. A clear and legible font hierarchy is essential for modern business communication.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingGenerator;