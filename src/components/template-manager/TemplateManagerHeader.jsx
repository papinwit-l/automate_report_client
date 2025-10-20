import { Layout, Presentation } from "lucide-react";
import React from "react";

function TemplateManagerHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Layout className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Template Manager</h1>
      </div>
    </header>
  );
}

export default TemplateManagerHeader;
