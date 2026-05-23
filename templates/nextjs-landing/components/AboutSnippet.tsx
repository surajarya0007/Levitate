import React from 'react';

const AboutSnippet: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-950 text-slate-200 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          <span className="text-emerald-300 font-mono text-2xl mr-2">01.</span> About Me
        </h2>
        <div className="text-lg leading-relaxed text-center md:text-left">
          <p className="mb-4">
            Hello! I&apos;m John, a passionate software engineer with a strong foundation in full-stack development. My journey into coding began in 2018 when I built my first dynamic website, and I&apos;ve been hooked ever since.
          </p>
          <p className="mb-4">
            I love to create robust, scalable, and user-friendly applications that solve real-world problems. My expertise spans various technologies, including modern JavaScript frameworks like <span className="text-emerald-300">React</span> and <span className="text-emerald-300">Next.js</span>, backend services with <span className="text-emerald-300">Node.js</span>, and database management.
          </p>
          <p>
            When I&apos;m not coding, you can find me exploring new tech, contributing to open-source projects, or enjoying a good book. I&apos;m always eager to learn and grow, taking on new challenges to expand my skill set.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;
