import { Layout } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom"; // or use <a> if not using React Router
import TemplateSaveAndLoad from "./TemplateSaveAndLoad";

function TemplateManagerHeader({ slideTemplates, setSlideTemplates }) {
  const navigate = useNavigate(); // Remove this if using <a> tag instead

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
      <button
        onClick={() => navigate("/")} // Or use <a href="/">
        className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <Layout className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Template Manager</h1>
      </button>

      <TemplateSaveAndLoad
        slide={slideTemplates}
        setSlide={setSlideTemplates}
      />
    </header>
  );
}

export default TemplateManagerHeader;
