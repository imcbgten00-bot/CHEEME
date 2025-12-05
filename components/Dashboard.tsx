import React from 'react';
import { BusinessState, ModuleType } from '../types';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface DashboardProps {
  business: BusinessState;
  setModule: (m: ModuleType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ business, setModule }) => {
  
  const progressSteps = [
    { label: 'Idea Analyzed', done: !!business.name, module: ModuleType.IDEA_ANALYZER },
    { label: 'Brand Identity', done: !!business.branding?.slogan, module: ModuleType.BRANDING },
    { label: 'Website Built', done: !!business.websiteCode, module: ModuleType.WEBSITE_BUILDER },
    { label: 'Strategy Defined', done: !!business.strategy, module: ModuleType.STRATEGY },
    { label: 'Simulation Run', done: !!business.simulationData, module: ModuleType.SIMULATION },
    { label: 'Pitch Deck Ready', done: !!business.pitchDeck, module: ModuleType.PITCH_DECK },
  ];

  const completedCount = progressSteps.filter(s => s.done).length;
  const progressPercent = (completedCount / progressSteps.length) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-900/20">
        <h1 className="text-3xl font-bold mb-2">Welcome, Founder.</h1>
        <p className="opacity-90 text-lg mb-6">Let's build {business.name || 'your next venture'} for the Diamond Challenge.</p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Venture Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Action Plan</h2>
          <div className="space-y-4">
            {progressSteps.map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => setModule(step.module)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  step.done 
                    ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' 
                    : 'bg-white border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {step.done ? (
                    <CheckCircle className="text-emerald-500" size={20} />
                  ) : (
                    <Circle className="text-slate-300" size={20} />
                  )}
                  <span className={step.done ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                    {step.label}
                  </span>
                </div>
                <ArrowRight size={16} className={`text-slate-400 ${step.done ? 'opacity-0' : 'opacity-100'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           {/* Quick Stats if available */}
           {business.simulationData && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h2 className="text-lg font-bold text-slate-900 mb-2">Projected Annual Revenue</h2>
               <p className="text-3xl font-bold text-emerald-600">
                 ${business.simulationData.reduce((a, b) => a + b.revenue, 0).toLocaleString()}
               </p>
               <p className="text-sm text-slate-500 mt-1">Based on simulation data</p>
             </div>
           )}

           {/* Brand Preview Small */}
           {business.branding && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  {business.branding.logoUrl ? (
                    <img src={business.branding.logoUrl} alt="logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="w-4 h-4 rounded-full" style={{backgroundColor: business.branding.colors[0]}}></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{business.name}</h3>
                  <p className="text-sm text-slate-500 italic">"{business.branding.slogan}"</p>
                </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;