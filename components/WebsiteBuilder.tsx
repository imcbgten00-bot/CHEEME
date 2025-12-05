import React, { useState } from 'react';
import { generateWebsiteCode } from '../services/geminiService';
import { BusinessState } from '../types';
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";
import { Loader2, Globe, Code, Server, Box, Database, Zap, Cpu, ArrowRight } from 'lucide-react';

interface WebsiteBuilderProps {
  business: BusinessState;
  onUpdate: (data: Partial<BusinessState>) => void;
}

const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({ business, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const code = await generateWebsiteCode(
        business.name, 
        business.idea, 
        business.branding?.colors || []
      );
      onUpdate({ websiteCode: code });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const defaultCode = `import React, { useState } from 'react';
import Head from 'next/head';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

export default function Home({ launchDate, spotsRemaining }) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const joinList = async (e) => {
    e.preventDefault();
    await fetch('/api/contact', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setJoined(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Head>
        <title>Business OS | Full Stack Next.js</title>
      </Head>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-slate-900 pt-16 pb-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1519681393798-2f61f2950a4b?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="container mx-auto px-6 relative z-10 text-center">
           <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              SSR Enabled: Launching {launchDate}
           </div>
           <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
             Turn Ideas Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Reality</span>
           </h1>
           <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
             The only platform that combines AI intelligence with full-stack execution. 
             Built on Next.js for speed, scale, and SEO.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all flex items-center gap-2">
                 Get Started <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium border border-slate-700 transition-all">
                 View Demo
              </button>
           </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
         <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
               <FeatureCard icon={Zap} title="Lightning Fast" desc="Server-side rendering ensures optimal performance." />
               <FeatureCard icon={Shield} title="Secure Backend" desc="Node.js API routes protect your business logic." />
               <FeatureCard icon={Star} title="Scalable" desc="Built to grow with your user base from day one." />
            </div>
         </div>
      </section>

      {/* Server-Side Waitlist */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-6 max-w-xl text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Backend Beta</h2>
            <p className="text-slate-600 mb-8">Only {spotsRemaining} spots reserved via Server-Side Props.</p>
            
            {joined ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-medium">
                 Data sent to Node.js backend successfully!
              </div>
            ) : (
              <form onSubmit={joinList} className="flex gap-2">
                 <input 
                   type="email" 
                   required
                   placeholder="founder@example.com" 
                   className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                 />
                 <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">
                    Join
                 </button>
              </form>
            )}
         </div>
      </section>
      
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100">
         <p>Powered by Next.js & Node.js Runtime</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
       <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
          <Icon size={24} />
       </div>
       <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
       <p className="text-slate-600">{desc}</p>
    </div>
  )
}

// Next.js Server-Side Logic
export async function getServerSideProps() {
  // Simulate dynamic data fetching on the server
  const months = ["January", "February", "March", "April"];
  const currentMonth = months[new Date().getMonth() % 4]; // Mock
  
  return {
    props: {
      launchDate: currentMonth + " 2025",
      spotsRemaining: Math.floor(Math.random() * 50) + 10
    }
  };
}`;

  const getSanitizedCode = (code: string | null) => {
    if (!code) return defaultCode;
    let safeCode = code;
    // Ensure React import exists
    if (!safeCode.includes("import React")) {
      safeCode = "import React from 'react';\n" + safeCode;
    }
    return safeCode;
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Full Stack Application <span className="text-xs bg-black text-white px-2 py-1 rounded font-mono">NEXT.JS</span>
          </h2>
          <p className="text-slate-500">Node.js Environment with Server-Side Rendering (SSR) & API Routes.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            {business.websiteCode ? 'Re-Deploy Full Stack' : 'Deploy Next.js App'}
          </button>
        </div>
      </div>

      <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col relative isolate">
        {loading ? (
           <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-slate-400 space-y-4">
             <div className="relative">
               <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Server size={20} className="text-indigo-600" />
               </div>
             </div>
             <p className="font-medium animate-pulse">Running Build Process (Next.js)...</p>
           </div>
        ) : null}
        
        <div className="h-full w-full">
           <SandpackProvider
            template="nextjs"
            theme="light"
            files={{
              "/pages/index.js": getSanitizedCode(business.websiteCode),
              "/pages/api/status.js": `// Backend API Route (Node.js)
export default function handler(req, res) {
  res.status(200).json({ 
    system: 'BusinessOS Node Cluster', 
    status: 'Operational', 
    uptime: process.uptime() 
  });
}`,
              "/pages/api/contact.js": `// Backend Form Handler
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Simulate database write
    console.log("Saving to DB:", req.body);
    res.status(200).json({ success: true, id: Date.now() });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}`,
              "/pages/_app.js": `import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp`,
              "/pages/_document.js": `import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}`,
              "/styles/globals.css": `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
`
            }}
            customSetup={{ 
              dependencies: { 
                "lucide-react": "latest",
                "next": "latest",
                "react": "latest",
                "react-dom": "latest"
              } 
            }}
          >
            <SandpackLayout style={{ height: '100%', border: 'none' }}>
              <SandpackPreview 
                style={{ height: '100%' }} 
                showNavigator={true}
                showOpenInCodeSandbox={true}
                showRefreshButton={true}
                actionsChildren={
                  <div className="flex items-center gap-3 px-2 text-xs text-slate-500 font-medium">
                     <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded"><Server size={12}/> Node.js Active</span>
                     <span className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded"><Cpu size={12}/> SSR Enabled</span>
                  </div>
                }
              />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
      
      <div className="flex gap-2 text-xs text-slate-400 shrink-0 justify-between">
        <span className="flex items-center gap-1"><Box size={10} /> Powered by Next.js & Node.js Runtime</span>
        <span className="flex items-center gap-1"><Database size={10}/> Full Stack Environment</span>
      </div>
    </div>
  );
};

export default WebsiteBuilder;