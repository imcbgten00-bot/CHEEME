import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import IdeaAnalyzer from './components/IdeaAnalyzer';
import Dashboard from './components/Dashboard';
import BrandingGenerator from './components/BrandingGenerator';
import WebsiteBuilder from './components/WebsiteBuilder';
import StrategyGenerator from './components/StrategyGenerator';
import SimulationEngine from './components/SimulationEngine';
import PitchDeckGenerator from './components/PitchDeckGenerator';
import { BusinessState, ModuleType } from './types';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.IDEA_ANALYZER);
  
  const [business, setBusiness] = useState<BusinessState>({
    idea: '',
    name: '',
    description: '',
    swot: null,
    branding: null,
    websiteCode: null,
    strategy: null,
    simulationData: null,
    pitchDeck: null
  });

  const handleUpdateBusiness = (data: Partial<BusinessState>) => {
    setBusiness(prev => ({ ...prev, ...data }));
    // Auto-navigate logic
    if (data.name && currentModule === ModuleType.IDEA_ANALYZER) {
      setCurrentModule(ModuleType.DASHBOARD);
    }
  };

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.IDEA_ANALYZER:
        return <IdeaAnalyzer onAnalysisComplete={handleUpdateBusiness} />;
      case ModuleType.DASHBOARD:
        return <Dashboard business={business} setModule={setCurrentModule} />;
      case ModuleType.BRANDING:
        return <BrandingGenerator business={business} onUpdate={handleUpdateBusiness} />;
      case ModuleType.WEBSITE_BUILDER:
        return <WebsiteBuilder business={business} onUpdate={handleUpdateBusiness} />;
      case ModuleType.STRATEGY:
        return <StrategyGenerator business={business} onUpdate={handleUpdateBusiness} />;
      case ModuleType.SIMULATION:
        return <SimulationEngine business={business} onUpdate={handleUpdateBusiness} />;
      case ModuleType.PITCH_DECK:
        return <PitchDeckGenerator business={business} onUpdate={handleUpdateBusiness} />;
      default:
        return <Dashboard business={business} setModule={setCurrentModule} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentModule={currentModule} 
        setModule={setCurrentModule} 
        hasIdea={!!business.name} 
      />
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-7xl mx-auto h-full">
           {renderModule()}
        </div>
        
        {/* Simple footer or watermark */}
        <div className="absolute bottom-4 right-6 text-xs text-slate-300 pointer-events-none">
          Business OS v1.0.0 | Diamond Challenge Edition
        </div>
      </main>
    </div>
  );
};

export default App;