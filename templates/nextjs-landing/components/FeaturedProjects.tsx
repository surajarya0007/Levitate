import React from 'react';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

interface ProjectProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  image?: string;
}

const projects: ProjectProps[] = [
  {
    title: 'Dev Portfolio Pro',
    description: 'A professional online portfolio template for coders to showcase their projects, skills, and experience.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    githubLink: 'https://github.com/johndoe/dev-portfolio-pro',
    liveLink: 'https://dev-portfolio-pro.vercel.app',
    image: 'https://via.placeholder.com/400x250/0A192F/CCD6F6?text=Project+1+Image'
  },
  {
    title: 'E-commerce Storefront',
    description: 'A full-stack e-commerce application with product listings, user authentication, and shopping cart functionality.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    githubLink: 'https://github.com/johndoe/e-commerce-storefront',
    liveLink: 'https://ecommerce-store.vercel.app',
    image: 'https://via.placeholder.com/400x250/0A192F/CCD6F6?text=Project+2+Image'
  },
  {
    title: 'Task Management App',
    description: 'A robust task management application to help users organize their daily tasks and boost productivity.',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    githubLink: 'https://github.com/johndoe/task-manager',
    liveLink: 'https://task-manager.netlify.app',
    image: 'https://via.placeholder.com/400x250/0A192F/CCD6F6?text=Project+3+Image'
  }
];

const ProjectCard: React.FC<ProjectProps> = ({ title, description, technologies, githubLink, liveLink, image }) => (
  <article className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
    {image && (
      <img
        src={image}
        alt={`Screenshot of ${title}`}
        className="w-full h-48 object-cover rounded-t-lg"
      />
    )}
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-base mb-4 flex-grow">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech, index) => (
          <span key={index} className="px-3 py-1 bg-emerald-300 text-slate-900 rounded-full text-xs font-medium">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex justify-end space-x-4 mt-auto">
        {githubLink && (
          <a href={githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" className="text-slate-400 hover:text-emerald-300 transition-colors duration-300">
            <Github className="w-6 h-6" />
          </a>
        )}
        {liveLink && (
          <a href={liveLink} target="_blank" rel="noopener noreferrer" aria-label="Live Demo" className="text-slate-400 hover:text-emerald-300 transition-colors duration-300">
            <ExternalLink className="w-6 h-6" />
          </a>
        )}
      </div>
    </div>
  </article>
);

const FeaturedProjects: React.FC = () => {
  return (
    <section id="projects" className="py-20 bg-slate-950 text-slate-200 p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          <span className="text-emerald-300 font-mono text-2xl mr-2">03.</span> Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="/projects" className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-300 text-emerald-300 rounded-lg hover:bg-emerald-300 hover:text-slate-950 transition-colors duration-300 text-lg font-semibold">
            View All Projects
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
