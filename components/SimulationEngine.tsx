import React, { useState, useEffect } from 'react';
import { generateSimulationData } from '../services/geminiService';
import { BusinessState } from '../types';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Loader2, TrendingUp, AlertCircle, DollarSign, Activity, Calendar, ArrowUpRight } from 'lucide-react';

interface SimulationEngineProps {
  business: BusinessState;
  onUpdate: (data: Partial<BusinessState>) => void;
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({ business, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  // Auto-run only if requested, otherwise we show zero state
  const hasData = !!business.simulationData;

  const runSimulation = async () => {
    setLoading(true);
    try {
      const data = await generateSimulationData(business.name, business.idea);
      onUpdate({ simulationData: data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Zero state data for initial view - showing "Simulation but zero understood"
  const zeroData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    revenue: 0,
    expenses: 0,
    profit: 0,
    event: 'Pending Simulation'
  }));

  const displayData = business.simulationData || zeroData;

  const totalRevenue = displayData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = displayData.reduce((acc, curr) => acc + curr.profit, 0);
  
  const marginNum = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const marginDisplay = marginNum.toFixed(1);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Business Simulation Engine</h2>
          <p className="text-slate-500">AI-projected financial performance and realistic scenario analysis.</p>
        </div>
        <button
          onClick={runSimulation}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Activity size={18} />}
          {hasData ? 'Re-Run Simulation' : 'Run Market Simulation'}
        </button>
      </div>

      {/* Metrics Section - Always visible, zeros if no data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Proj. Annual Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="up" 
          subtext={hasData ? "Aggregated" : "Projected"}
          highlight={hasData}
        />
        <MetricCard 
          label="Proj. Net Profit" 
          value={`$${totalProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          trend={totalProfit > 0 ? "up" : "down"} 
          subtext={`${marginDisplay}% Margin`}
          highlight={hasData}
        />
        <MetricCard 
          label="Risk Assessment" 
          value={hasData ? (marginNum < 10 ? "High" : "Moderate") : "Pending"} 
          icon={AlertCircle} 
          trend={marginNum < 10 ? "down" : "neutral"} 
          subtext={hasData ? "Based on burn rate" : "Requires simulation"}
          highlight={hasData}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
          <h3 className="font-semibold text-slate-700 mb-6">Financial Projections</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill={hasData ? "#6366f1" : "#e2e8f0"} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={hasData ? "#cbd5e1" : "#f1f5f9"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
          <h3 className="font-semibold text-slate-700 mb-6">Profit Trajectory</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={hasData ? "#10b981" : "#94a3b8"} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={hasData ? "#10b981" : "#94a3b8"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']}
                />
                <Area type="monotone" dataKey="profit" stroke={hasData ? "#10b981" : "#cbd5e1"} strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-500" />
          Projected Timeline & Market Events
        </h3>
        {hasData ? (
          <div className="space-y-0 divide-y divide-slate-100">
            {displayData.map((data, idx) => {
               const prev = displayData[idx - 1];
               const growth = prev && prev.revenue > 0 ? ((data.revenue - prev.revenue) / prev.revenue) * 100 : 0;
               
               return (
                <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 hover:bg-slate-50 transition-colors animate-fade-in">
                   <div className="md:w-32 shrink-0 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-slate-700">{data.month}</span>
                   </div>
                   
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{data.event}</span>
                        {growth > 15 && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <ArrowUpRight size={12} /> High Growth
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                         <span className="text-slate-500">Rev: <span className="text-slate-700 font-medium">${data.revenue.toLocaleString()}</span></span>
                         <span className="text-slate-500">Exp: <span className="text-slate-700 font-medium">${data.expenses.toLocaleString()}</span></span>
                         <span className={data.profit > 0 ? "text-emerald-600 font-medium" : "text-rose-500 font-medium"}>
                           {data.profit > 0 ? '+' : ''}${data.profit.toLocaleString()}
                         </span>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
             <Activity className="mx-auto mb-3 opacity-50" size={32} />
             <p>Run the simulation to generate a realistic timeline based on your business model.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, trend, subtext, highlight }: any) => (
  <div className={`p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between transition-colors ${highlight ? 'bg-white' : 'bg-slate-50/50'}`}>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <h3 className={`text-2xl font-bold ${highlight ? 'text-slate-900' : 'text-slate-400'}`}>{value}</h3>
      <p className={`text-xs mt-2 font-medium ${
        !highlight ? 'text-slate-400' :
        trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500'
      }`}>
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-xl ${
      !highlight ? 'bg-slate-100 text-slate-300' :
      trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
      trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
    }`}>
      <Icon size={24} />
    </div>
  </div>
);

export default SimulationEngine;