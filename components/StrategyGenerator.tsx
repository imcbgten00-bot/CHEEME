import React, { useState, useEffect } from 'react';
import { generateStrategy } from '../services/geminiService';
import { BusinessState } from '../types';
import { Loader2, Zap, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StrategyGeneratorProps {
  business: BusinessState;
  onUpdate: (data: Partial<BusinessState>) => void;
}

const StrategyGenerator: React.FC<StrategyGeneratorProps> = ({ business, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!business.strategy && business.name && !loading) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const strategy = await generateStrategy(business.name, business.idea);
      onUpdate({ strategy });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Go-To-Market Strategy</h2>
          <p className="text-slate-500">AI-generated executable plan for your launch.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
          Regenerate Strategy
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
             <p className="text-slate-500">Formulating strategy...</p>
          </div>
        ) : business.strategy ? (
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-indigo-700">
            <ReactMarkdown>{business.strategy}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">
            <p>No strategy generated yet. Click the button to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyGenerator;