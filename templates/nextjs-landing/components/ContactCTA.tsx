import React from 'react';
import { Mail } from 'lucide-react';

const ContactCTA: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-slate-950 text-slate-200 p-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          <span className="text-emerald-300 font-mono text-2xl mr-2">04.</span> Get In Touch
        </h2>
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
          I&apos;m currently open to new opportunities, collaborations, and interesting projects. Whether you have a question or just want to say hi, my inbox is always open!
        </p>
        <a href="mailto:john.doe@example.com" className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-300 text-emerald-300 rounded-lg hover:bg-emerald-300 hover:text-slate-950 transition-colors duration-300 text-lg font-semibold">
          <Mail className="mr-2 w-5 h-5" />
          Say Hello
        </a>
      </div>
    </section>
  );
};

export default ContactCTA;
