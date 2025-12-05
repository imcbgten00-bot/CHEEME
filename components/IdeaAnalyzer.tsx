import React, { useState } from 'react';
import { generateIdeaAnalysis } from '../services/geminiService';
import { BusinessState } from '../types';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface IdeaAnalyzerProps {
  onAnalysisComplete: (data: Partial<BusinessState>) => void;
}

const IdeaAnalyzer: React.FC<IdeaAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [inputIdea, setInputIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Partial<BusinessState> | null>(null);

  const handleAnalyze = async () => {
    if (!inputIdea.trim()) return;
    setLoading(true);
    try {
      const data = await generateIdeaAnalysis(inputIdea);
      const newState = {
        idea: inputIdea,
        name: data.name,
        description: data.description,
        swot: data.swot,
      };
      setResult(newState);
      onAnalysisComplete(newState);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Start with an Idea</h2>
        <p className="text-slate-600 text-lg">Tell us about your business concept, and our AI will build the foundation.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <textarea
          value={inputIdea}
          onChange={(e) => setInputIdea(e.target.value)}
          placeholder="e.g., A subscription service for organic dog treats..."
          className="w-full h-32 p-4 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !inputIdea.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : <LightbulbIcon />}
            {loading ? 'Analyzing...' : 'Analyze Idea'}
          </button>
        </div>
      </div>

      {result && result.swot && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <CheckCircle2 className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 text-lg">{result.name}</h3>
              <p className="text-indigo-700">{result.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SwotCard title="Strengths" items={result.swot.strengths} color="bg-emerald-50 border-emerald-200 text-emerald-800" />
            <SwotCard title="Weaknesses" items={result.swot.weaknesses} color="bg-rose-50 border-rose-200 text-rose-800" />
            <SwotCard title="Opportunities" items={result.swot.opportunities} color="bg-blue-50 border-blue-200 text-blue-800" />
            <SwotCard title="Threats" items={result.swot.threats} color="bg-amber-50 border-amber-200 text-amber-800" />
          </div>
        </div>
      )}
    </div>
  );
};

const LightbulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

const SwotCard = ({ title, items, color }: { title: string, items: string[], color: string }) => (
  <div className={`p-5 rounded-xl border ${color} h-full`}>
    <h4 className="font-bold mb-3 uppercase tracking-wider text-sm opacity-80">{title}</h4>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0"></span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default IdeaAnalyzer;