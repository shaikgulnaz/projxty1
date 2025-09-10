import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, Star, Sparkles, Play, ArrowRight, Share2 } from 'lucide-react';
import { Project } from '../types';

interface HomePageProps {
  projects: Project[];
  onNavigateToProjects: () => void;
  onProjectClick: (project: Project) => void;
  onShareProject: (project: Project) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  onNavigateToProjects,
  onProjectClick,
  onShareProject,
}) => {
  // entrance animation (simple, no external deps)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const stats = {
    total: projects.length,
    featured: projects.filter((p) => p.featured).length,
    categories: new Set(projects.map((p) => p.category)).size,
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* inject small utility styles (neon + gradient + scrollbar hide) */}
      <style>{`
        .neon-glow { text-shadow: 0 2px 14px rgba(99,102,241,0.06), 0 6px 40px rgba(59,130,246,0.04); }
        .gradient-text-fire { background: linear-gradient(90deg,#ff7a18,#af002d 50%,#5f00d0); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .no-scrollbar::-webkit-scrollbar{ display:none } .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none }
      `}</style>

      <div className="container mx-auto px-4 pt-8 pb-20">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-10 items-center`}> 
            {/* left - content */}
            <div
              className={`lg:col-span-3 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight neon-glow">
                Code That Actually <span className="gradient-text-fire">Slaps</span>
                <span className="ml-2">🔥</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl">
                Practical projects, clean code, and modern UI patterns — ready to study, fork or use as a base for your next assignment or side-hustle.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  onClick={onNavigateToProjects}
                  className="inline-flex items-center gap-3 bg-white text-black px-6 sm:px-8 py-3 rounded-lg font-semibold shadow-md hover:scale-103 transform transition"
                >
                  Explore Projects
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onNavigateToProjects}
                  className="inline-flex items-center gap-3 border border-gray-600 px-6 sm:px-8 py-3 rounded-lg text-gray-200 hover:bg-white/5 transition"
                >
                  <TrendingUp className="w-4 h-4" />
                  View All {stats.total}
                </button>
              </div>

              {/* lightweight stats strip for mobile under hero */}
              <div className="mt-8 grid grid-cols-3 gap-3 sm:hidden">
                <StatPill icon={<TrendingUp />} value={stats.total} label="All" />
                <StatPill icon={<Star />} value={stats.featured} label="Featured" />
                <StatPill icon={<Sparkles />} value={stats.categories} label="Cats" />
              </div>
            </div>

            {/* right - preview (desktop) */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className={`${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700`}> 
                {featuredProjects.length > 0 ? (
                  <FeaturedSlideshow projects={featuredProjects} onProjectClick={onProjectClick} />
                ) : (
                  <div className="bg-gray-800 rounded-lg h-56 flex items-center justify-center text-gray-400">No featured projects yet</div>
                )}
              </div>
            </div>

            {/* right - mobile carousel (below content on small screens) */}
            <div className="col-span-1 lg:hidden mt-6">
              <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x py-2">
                {featuredProjects.map((p) => (
                  <div key={p.id} className="min-w-[78%] snap-center">
                    <FeaturedProjectCard
                      project={p}
                      onClick={onProjectClick}
                      onShare={onShareProject}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS (desktop) */}
        <section className="mt-14 hidden sm:block">
          <div className="bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <StatCard icon={<TrendingUp />} value={stats.total} label="Total Projects" />
              <StatCard icon={<Star />} value={stats.featured} label="Featured" />
              <StatCard icon={<Sparkles />} value={stats.categories} label="Categories" />
            </div>
          </div>
        </section>

        {/* FEATURED GRID */}
        {featuredProjects.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Featured Projects</h2>
                <p className="text-gray-300 text-sm mt-1">Handpicked projects with clear value and readable code.</p>
              </div>
              <div className="hidden sm:block">
                <button
                  onClick={() => { onNavigateToProjects(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-white/5 transition"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <FeaturedProjectCard
                  key={project.id}
                  project={project}
                  onClick={onProjectClick}
                  onShare={onShareProject}
                />
              ))}
            </div>

            {/* mobile CTA */}
            <div className="mt-8 text-center sm:hidden">
              <button
                onClick={() => { onNavigateToProjects(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-6 py-3 bg-white text-black rounded-md font-semibold shadow-sm"
              >
                View All Projects
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/* ----------------- Small subcomponents ----------------- */
const StatCard: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
  <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
    <div className="bg-black/40 p-3 rounded-md mb-3 inline-flex">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-gray-300 text-sm mt-1">{label}</div>
  </div>
);

const StatPill: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
  <div className="bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-3">
    <div className="p-2 bg-black/30 rounded-md">{icon}</div>
    <div>
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-gray-300">{label}</div>
    </div>
  </div>
);

const FeaturedProjectCard: React.FC<{
  project: Project;
  onClick: (project: Project) => void;
  onShare: (project: Project) => void;
}> = ({ project, onClick, onShare }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(project); }}
      className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 cursor-pointer transition-transform transform hover:-translate-y-1"
    >
      <div className="relative h-48">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-full text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Featured</span>
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onShare(project); }}
            className="bg-black/50 p-2 rounded-md hover:bg-black/60 transition"
            aria-label={`Share ${project.title}`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="bg-black/70 p-3 rounded-full">
            <Play className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((t, i) => (
            <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded-full">{t}</span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">+{project.technologies.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturedSlideshow: React.FC<{ projects: Project[]; onProjectClick: (p: Project) => void }> = ({ projects, onProjectClick }) => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // auto advance
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % projects.length);
    }, 4500);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [projects.length]);

  const project = projects[index];

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <div className="relative h-56 cursor-pointer" onClick={() => onProjectClick(project)}>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-md text-sm">{project.title}</div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-gray-500'} transition`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-300">{index + 1}/{projects.length}</div>
      </div>
    </div>
  );
};

export default HomePage;
