import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Layout,
  Zap,
  Presentation,
} from "lucide-react";

import TYNLogo from "@/assets/images/TYN_Logo.png";

const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const tools = [
    {
      id: "template",
      title: "Automate Report",
      description: "Use our pre-designed template for fast, consistent results",
      icon: Presentation,
      link: "/slide-report",
      gradient: "from-blue-500 to-purple-600",
      features: ["Ready to use", "Consistent design", "5-min setup"],
    },
    {
      id: "custom",
      title: "Template Manager",
      description: "Build your own template with complete creative freedom",
      icon: Layout,
      link: "/template-manager",
      gradient: "from-green-500 to-blue-500",
      features: ["Full flexibility", "Your own style", "Unlimited options"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-full py-4">
            <img src={TYNLogo} alt="TYN_Logo" className="h-32 mx-auto" />
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">
              Report Slide Creator
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Create Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Perfect{" "}
            </span>
            Report
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose your approach and start building professional report slides
            in minutes
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isHovered = hoveredCard === tool.id;

            return (
              <a
                key={tool.id}
                href={tool.link}
                className="group block"
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animation: `slide-up 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <Card className="h-full border-2 border-slate-200 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 relative">
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    ></div>

                    {/* Icon with animated background */}
                    <div className="relative mb-6">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-75 group-hover:scale-100`}
                      ></div>
                      <div
                        className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {tool.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {tool.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-slate-700"
                          style={{
                            animation: isHovered
                              ? `fade-in-left 0.3s ease-out ${idx * 0.1}s both`
                              : "none",
                          }}
                        >
                          <Zap className="w-4 h-4 text-indigo-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Animated corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent via-transparent to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        {/* Footer hint */}
        <div
          className="text-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <p className="text-sm text-slate-500">
            Not sure which to choose? Start with Quick Report for a faster
            experience
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
