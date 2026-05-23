import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-emerald-300 font-mono text-lg mb-2">Hi, my name is</p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          John Doe.
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-6">
          I build things for the web.
        </h2>
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
          I&apos;m a software engineer specializing in building (and occasionally designing) exceptional digital experiences. Currently, I&apos;m focused on building accessible, human-centered products at <span className="text-emerald-300">InnovateTech Inc.</span>
        </p>
        <a href="#projects" className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-300 text-emerald-300 rounded-lg hover:bg-emerald-300 hover:text-slate-950 transition-colors duration-300 text-lg font-semibold">
          View My Projects
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
