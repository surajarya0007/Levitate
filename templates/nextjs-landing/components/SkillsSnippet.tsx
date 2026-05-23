import React from 'react';
import { Code, Server, Database, GitBranch } from 'lucide-react';

const skills = [
  { name: 'JavaScript (ES6+)', icon: Code },
  { name: 'TypeScript', icon: Code },
  { name: 'React.js', icon: Code },
  { name: 'Next.js', icon: Code },
  { name: 'Node.js', icon: Server },
  { name: 'Express.js', icon: Server },
  { name: 'MongoDB', icon: Database },
  { name: 'PostgreSQL', icon: Database },
  { name: 'Tailwind CSS', icon: Code },
  { name: 'Git & GitHub', icon: GitBranch },
];

const SkillsSnippet: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-slate-950 text-slate-200 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          <span className="text-emerald-300 font-mono text-2xl mr-2">02.</span> My Core Skills
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <skill.icon className="w-6 h-6 text-emerald-300" />
              <span className="text-lg font-semibold">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSnippet;
