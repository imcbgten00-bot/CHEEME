import React from 'react';
import { ModuleType } from '../types';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Palette, 
  Globe, 
  TrendingUp, 
  LineChart,
  Presentation,
} from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleType;
  setModule: (m: ModuleType) => void;
  hasIdea: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentModule, setModule, hasIdea }) => {
  
  const navItems = [
    { type: ModuleType.IDEA_ANALYZER, label: 'Idea Analyzer', icon: Lightbulb, alwaysEnabled: true },
    { type: ModuleType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, alwaysEnabled: false },
    { type: ModuleType.BRANDING, label: 'Branding', icon: Palette, alwaysEnabled: false },
    { type: ModuleType.WEBSITE_BUILDER, label: 'Website Builder', icon: Globe, alwaysEnabled: false },
    { type: ModuleType.STRATEGY, label: 'Strategy', icon: TrendingUp, alwaysEnabled: false },
    { type: ModuleType.SIMULATION, label: 'Simulation', icon: LineChart, alwaysEnabled: false },
    { type: ModuleType.PITCH_DECK, label: 'Pitch Deck', icon: Presentation, alwaysEnabled: false },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            B
          </div>
          Business OS
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Diamond Edition</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isEnabled = item.alwaysEnabled || hasIdea;
          const isActive = currentModule === item.type;
          const isPitchDeck = item.type === ModuleType.PITCH_DECK;
          
          return (
            <button
              key={item.type}
              onClick={() => isEnabled && setModule(item.type)}
              disabled={!isEnabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : isEnabled 
                    ? 'hover:bg-slate-800 hover:text-white' 
                    : 'opacity-40 cursor-not-allowed'
              } ${isPitchDeck && isEnabled ? 'ring-1 ring-sky-500/50' : ''}`}
            >
              <item.icon size={20} className={isPitchDeck ? 'text-sky-400' : ''} />
              <span className="font-medium">{item.label}</span>
              {isPitchDeck && isEnabled && (
                <span className="ml-auto w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
            DC
          </div>
          <div>
            <p className="text-sm font-medium text-white">Diamond Challenge</p>
            <p className="text-xs text-slate-500">Founder Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;