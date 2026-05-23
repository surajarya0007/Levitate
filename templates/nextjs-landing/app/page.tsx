import HeroSection from '@/components/HeroSection';
import AboutSnippet from '@/components/AboutSnippet';
import SkillsSnippet from '@/components/SkillsSnippet';
import FeaturedProjects from '@/components/FeaturedProjects';
import ContactCTA from '@/components/ContactCTA';

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased">
      <HeroSection />
      <AboutSnippet />
      <SkillsSnippet />
      <FeaturedProjects />
      <ContactCTA />
    </div>
  );
}
