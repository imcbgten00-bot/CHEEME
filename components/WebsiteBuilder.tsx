import React, { useState } from 'react';
import { generateWebsiteCode } from '../services/geminiService';
import { BusinessState } from '../types';
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";
import { Loader2, Globe, Code, ExternalLink, RefreshCw } from 'lucide-react';

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

  const handleOpenNewTab = () => {
    if (!business.websiteCode) return;

    // Clean up code for standalone HTML file
    const processedCode = business.websiteCode
      .replace(/export\s+default\s+function\s+App/, 'function App')
      .replace(/import\s+React.*?;/, '')
      .replace(/import\s+{.*?}\s+from\s+['"]lucide-react['"];/, '');

    // Extract lucide icons used
    const lucideMatch = business.websiteCode.match(/import\s+{(.*?)}\s+from\s+['"]lucide-react['"]/);
    const icons = lucideMatch ? lucideMatch[1].split(',').map(s => s.trim()) : [];
    
    // Create icon destructuring string
    const iconDestructuring = icons.length > 0 
      ? `const { ${icons.join(', ')} } = lucide;` 
      : '';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- React & ReactDOM -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Babel -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://unpkg.com/lucide-react@latest/dist/lucide-react.min.js"></script>

    <style>body { background-color: white; }</style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // Globals from UMD builds
        const { useState, useEffect } = React;
        
        // Lucide icons setup
        ${iconDestructuring}

        // Inject generated code
        ${processedCode}

        // Mount the app
        const root = ReactDOM.createRoot(document.getElementById('root'));
        try {
            root.render(<App />);
            setTimeout(() => {
                if (window.lucide && window.lucide.createIcons) {
                    window.lucide.createIcons();
                }
            }, 100);
        } catch (e) {
            document.body.innerHTML = '<div style="color:red; padding: 20px;">Error rendering preview: ' + e.message + '</div>';
        }
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const defaultCode = `import React from 'react';
import { Hammer } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-100 rounded-full">
                <Hammer size={48} className="text-indigo-600" />
            </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ready to Build?</h1>
        <p className="text-gray-600 max-w-md mx-auto">Click the "Build Website" button above to generate a full React landing page using AI.</p>
      </div>
    </div>
  );
}`;

  // Ensure imports are present in the final code fed to Sandpack
  const getSanitizedCode = (code: string | null) => {
    if (!code) return defaultCode;
    let safeCode = code;
    // Basic check to ensure React import exists
    if (!safeCode.includes("import React")) {
      safeCode = "import React from 'react';\n" + safeCode;
    }
    return safeCode;
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Website Builder</h2>
          <p className="text-slate-500">AI-generated React landing page with live in-app preview.</p>
        </div>
        <div className="flex gap-2">
           {business.websiteCode && (
              <button
                onClick={handleOpenNewTab}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                <ExternalLink size={18} />
                Open in New Tab
              </button>
           )}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
            {business.websiteCode ? 'Regenerate Website' : 'Build Website'}
          </button>
        </div>
      </div>

      <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col relative isolate">
        {loading ? (
           <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-slate-400 space-y-4">
             <div className="relative">
               <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Code size={20} className="text-indigo-600" />
               </div>
             </div>
             <p className="font-medium animate-pulse">Writing code...</p>
           </div>
        ) : null}
        
        <div className="h-full w-full">
           <SandpackProvider
            template="react"
            theme="light"
            files={{
              "/App.js": getSanitizedCode(business.websiteCode),
              "/index.js": `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
              "/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
              "/styles.css": `/* Global Styles */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}
`
            }}
            customSetup={{ 
              dependencies: { 
                "lucide-react": "latest",
                "react": "^18.2.0",
                "react-dom": "^18.2.0"
              } 
            }}
          >
            <SandpackLayout style={{ height: '100%', border: 'none' }}>
              <SandpackPreview 
                style={{ height: '100%' }} 
                showNavigator={true}
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
              />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
      
      <div className="flex gap-2 text-xs text-slate-400 shrink-0 justify-between">
        <span>Powered by Sandpack & Gemini 2.5</span>
        <span className="flex items-center gap-1"><RefreshCw size={10}/> Auto-refresh enabled</span>
      </div>
    </div>
  );
};

export default WebsiteBuilder;