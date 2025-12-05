import React, { useState } from 'react';
import { generatePitchDeck } from '../services/geminiService';
import { BusinessState } from '../types';
import { Loader2, Presentation, ChevronLeft, ChevronRight, Gem } from 'lucide-react';

interface PitchDeckGeneratorProps {
  business: BusinessState;
  onUpdate: (data: Partial<BusinessState>) => void;
}

const PitchDeckGenerator: React.FC<PitchDeckGeneratorProps> = ({ business, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const deck = await generatePitchDeck(business.name, business.idea, business.strategy);
      onUpdate({ pitchDeck: deck });
      setCurrentSlide(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (business.pitchDeck && currentSlide < business.pitchDeck.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Default color if branding isn't ready
  const primaryColor = business.branding?.colors[0] || '#4f46e5';
  const secondaryColor = business.branding?.colors[1] || '#818cf8';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gem className="text-sky-500" /> Diamond Pitch Deck
          </h2>
          <p className="text-slate-500">AI-generated slide deck tailored for the Diamond Challenge competition.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Presentation size={18} />}
          {business.pitchDeck ? 'Regenerate Deck' : 'Generate Pitch Deck'}
        </button>
      </div>

      <div className="relative bg-slate-200 rounded-xl p-8 md:p-12 shadow-inner min-h-[500px] flex items-center justify-center">
        {loading ? (
          <div className="text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-sky-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 font-medium animate-pulse">Designing your slides...</p>
          </div>
        ) : business.pitchDeck ? (
          <div className="w-full max-w-4xl">
            {/* Slide Container - 16:9 Aspect Ratio */}
            <div className="aspect-video bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col relative animate-fade-in">
              
              {/* Slide Header */}
              <div className="h-4 w-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}></div>
              
              {/* Slide Content */}
              <div className="flex-1 p-12 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-4xl font-bold text-slate-900 leading-tight">
                    {business.pitchDeck[currentSlide].title}
                  </h3>
                  {business.branding?.logoUrl ? (
                    <img src={business.branding.logoUrl} alt="logo" className="h-12 w-auto object-contain opacity-80" />
                  ) : (
                    <div className="text-sm font-bold opacity-30 uppercase tracking-widest">{business.name}</div>
                  )}
                </div>
                
                <div className="flex-1 text-slate-700 text-xl leading-relaxed whitespace-pre-wrap">
                  {business.pitchDeck[currentSlide].content}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between text-sm text-slate-400">
                  <span>Diamond Challenge Entry</span>
                  <span>{currentSlide + 1} / {business.pitchDeck.length}</span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-8 flex justify-between items-center">
               <button 
                 onClick={prevSlide}
                 disabled={currentSlide === 0}
                 className="p-3 rounded-full hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
               >
                 <ChevronLeft size={24} />
               </button>
               
               <div className="flex gap-2">
                 {business.pitchDeck.map((_, idx) => (
                   <div 
                     key={idx} 
                     className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-sky-600 w-6' : 'bg-slate-300'}`}
                   />
                 ))}
               </div>

               <button 
                 onClick={nextSlide}
                 disabled={currentSlide === business.pitchDeck.length - 1}
                 className="p-3 rounded-full hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
               >
                 <ChevronRight size={24} />
               </button>
            </div>

            {/* Speaker Notes */}
            <div className="mt-8 bg-white/50 border border-white p-6 rounded-lg backdrop-blur-sm">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Speaker Notes (AI Suggested)</h4>
              <p className="text-slate-700 italic">"{business.pitchDeck[currentSlide].notes}"</p>
            </div>

          </div>
        ) : (
          <div className="text-center max-w-md">
            <Presentation size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Pitch Deck Created</h3>
            <p className="text-slate-500">Generate a competition-ready slide deck based on your business data to present to the judges.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchDeckGenerator;