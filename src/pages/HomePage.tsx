import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Sparkles, Play, ArrowRight } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  category: string;
  technologies: string[];
}

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
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  const stats = {
    total: projects.length,
    featured: featuredProjects.length,
    categories: new Set(projects.map((p) => p.category)).size,
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden mx-auto"
        style={{ maxWidth: 1340, height: 690, paddingTop: 20, paddingBottom: 20 }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          {/* Left Half - Hero Content */}
          <div
            className="lg:col-span-3 text-center lg:text-left slide-in flex flex-col justify-start"
            style={{ minHeight: '100%' }}
          >
            <div className="mt-auto mb-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 neon-glow leading-tight tracking-wide">
                Code That Actually <span className="gradient-text-fire">Slaps</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                No cap - these projects are straight fire! From advanced artificial intelligence that hits different to dynamic web applications that go hard.
                Perfect inspiration for your next coding challenge or personal project. Go big or go home.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button
                  onClick={onNavigateToProjects}
                  className="group bg-white text-black px-10 py-4 rounded-2xl font-extrabold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-2xl"
                >
                  Explore Projects
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button
                  onClick={onNavigateToProjects}
                  className="group glass border border-gray-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <TrendingUp className="w-5 h-5" />
                  View All {stats.total} Projects
                </button>
              </div>
            </div>
          </div>

          {/* Right Half - Featured Projects Preview */}
          <div
            className="lg:col-span-2 hidden lg:block slide-in"
            style={{ animationDelay: '200ms', height: '100%' }}
          >
            {featuredProjects.length > 0 && (
              <FeaturedSlideshow projects={featuredProjects} onProjectClick={onProjectClick} />
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-wide">Project Statistics</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Showcasing innovation across multiple domains</p>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <StatCard icon={<TrendingUp className="w-10 h-10 text-white" />} number={stats.total} label="Total Projects" />
            <StatCard icon={<Star className="w-10 h-10 text-white" />} number={stats.featured} label="Featured Projects" />
            <StatCard icon={<Sparkles className="w-10 h-10 text-white" />} number={stats.categories} label="Categories" />
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="relative py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-wide">Featured Projects</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">Handpicked projects that showcase exceptional innovation</p>
              <div className="w-40 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 max-w-[1340px] mx-auto">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="slide-in"
                  style={{ animationDelay: `${index * 120}ms`, aspectRatio: '4 / 3' }}
                >
                  <FeaturedProjectCard project={project} onClick={onProjectClick} onShare={onShareProject} />
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <button
                onClick={() => {
                  onNavigateToProjects();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-black border border-gray-600 text-white px-14 py-6 rounded-2xl font-semibold text-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 flex items-center justify-center gap-4 mx-auto"
              >
                View All Projects
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; number: number; label: string }> = ({ icon, number, label }) => (
  <div className="glass rounded-3xl p-12 border border-gray-600 text-center hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-400 transform hover:scale-105">
    <div className="bg-black border border-gray-600 p-5 rounded-2xl w-fit mx-auto mb-5">{icon}</div>
    <h3 className="text-5xl font-extrabold text-white mb-3">{number}</h3>
    <p className="text-gray-300 text-lg">{label}</p>
  </div>
);

const FeaturedProjectCard: React.FC<{
  project: Project;
  onClick: (project: Project) => void;
  onShare: (project: Project) => void;
}> = ({ project, onClick, onShare }) => {
  return (
    <div
      className="group glass rounded-3xl overflow-hidden border border-gray-600 hover:border-gray-400 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-3xl hover:shadow-gray-600/30 flex flex-col h-full"
      onClick={() => onClick(project)}
      style={{ aspectRatio: '4 / 3' }}
    >
      {/* Image section 40% height */}
      <div className="relative flex-shrink-0" style={{ height: '40%' }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 bg-black border border-gray-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-xl">
            <Sparkles className="w-4 h-4" />
            Featured
          </div>
        )}

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-black/90 hover:bg-black text-white p-6 rounded-full transition-all duration-300 transform hover:scale-110 backdrop-blur-md border border-gray-600 shadow-3xl">
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Text/details section 60% height */}
      <div className="p-6 flex flex-col justify-between flex-grow" style={{ height: '60%' }}>
        <div>
          <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:text-gray-200 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed text-base">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onShare(project);
              }}
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded-full text-sm font-semibold border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all duration-300 cursor-pointer select-none"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full text-sm font-semibold border border-gray-500 select-none">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturedSlideshow: React.FC<{
  projects: Project[];
  onProjectClick: (project: Project) => void;
}> = ({ projects, onProjectClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (projects.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
        setIsTransitioning(false);
      }, 150);
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const handleIndicatorClick = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  if (projects.length === 0) return null;

  const currentProject = projects[currentIndex];

  return (
    <div className="space-y-10 h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-10">
        <Star className="w-7 h-7 text-gray-400" />
        <h3 className="text-3xl font-extrabold text-white tracking-wide">Featured Projects</h3>
      </div>

      <div className="glass rounded-3xl border border-gray-600 overflow-hidden transform transition-all duration-500 hover:scale-[1.04] hover:shadow-3xl hover:shadow-gray-600/30 flex-grow flex flex-col">
        <div
          className={`relative cursor-pointer overflow-hidden transition-all duration-300 flex-shrink-0`}
          style={{ height: '40%' }}
          onClick={() => onProjectClick(currentProject)}
        >
          <img
            src={currentProject.image}
            alt={currentProject.title}
            className={`w-full h-full object-cover hover:scale-110 transition-transform duration-300 ${
              isTransitioning ? 'opacity-90 scale-95' : 'opacity-100 scale-100'
            }`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />

          <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md border border-gray-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-xl">
            <Sparkles className="w-4 h-4 text-white" />
            Featured
          </div>
        </div>

        <div
          className={`p-8 bg-gray-900/25 backdrop-blur-md transition-all duration-300 flex-grow flex flex-col justify-between ${
            isTransitioning ? 'opacity-80' : 'opacity-100'
          }`}
          style={{ height: '60%' }}
        >
          <div>
            <h4 className="text-2xl font-extrabold text-white mb-4 hover:text-gray-200 transition-colors duration-300 tracking-wide">
              {currentProject.title}
            </h4>
            <p className="text-gray-300 text-lg mb-8 line-clamp-3 leading-relaxed">{currentProject.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {currentProject.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-5 py-3 bg-gray-800 text-gray-200 rounded-full text-base font-semibold border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all duration-300 select-none"
              >
                {tech}
              </span>
            ))}
            {currentProject.technologies.length > 3 && (
              <span className="px-5 py-3 bg-gray-700 text-gray-300 rounded-full text-base font-semibold border border-gray-500 select-none">
                +{currentProject.technologies.length - 3}
              </span>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleIndicatorClick(index);
                }}
                className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-125 ${
                  index === currentIndex
                    ? 'bg-white w-10 shadow-xl shadow-white/60'
                    : 'bg-gray-500 hover:bg-gray-400 hover:w-6'
                }`}
                aria-label={`Go to featured project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
