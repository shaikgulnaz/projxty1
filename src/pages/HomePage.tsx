import React from "react";
import { TrendingUp, Star, Sparkles, Play, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Project } from "../types";

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
    featured: projects.filter((p) => p.featured).length,
    categories: new Set(projects.map((p) => p.category)).size,
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3 text-center lg:text-left space-y-8"
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight neon-glow">
                Code That Actually{" "}
                <span className="gradient-text-fire">Slaps</span> 🔥
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
                🚀 From AI that hits different to web apps that go hard. Perfect
                inspo for your next assignment or hustle 💯
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                <button
                  onClick={onNavigateToProjects}
                  className="group bg-white text-black px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition"
                >
                  Explore Projects
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={onNavigateToProjects}
                  className="group glass border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition flex items-center gap-3"
                >
                  <TrendingUp className="w-5 h-5" />
                  View All {stats.total} Projects
                </button>
              </div>
            </motion.div>

            {/* Right - Featured Preview */}
            <div className="lg:col-span-2 mt-12 lg:mt-0 w-full">
              <div className="lg:block hidden">
                <FeaturedSlideshow
                  projects={featuredProjects}
                  onProjectClick={onProjectClick}
                />
              </div>
              <div className="lg:hidden">
                <div className="flex gap-4 overflow-x-auto snap-x">
                  {featuredProjects.map((p) => (
                    <div key={p.id} className="min-w-[80%] snap-center">
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
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Project Statistics
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Showcasing innovation across multiple domains
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <TrendingUp />, value: stats.total, label: "Total Projects" },
              { icon: <Star />, value: stats.featured, label: "Featured Projects" },
              { icon: <Sparkles />, value: stats.categories, label: "Categories" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-8 border border-gray-600 text-center hover:scale-105 hover:shadow-xl transition"
              >
                <div className="bg-black border border-gray-600 p-4 rounded-xl w-fit mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="relative py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Handpicked projects that showcase exceptional innovation
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {/* Desktop Grid */}
            <div className="lg:grid lg:grid-cols-3 gap-10 hidden">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <FeaturedProjectCard
                    project={project}
                    onClick={onProjectClick}
                    onShare={onShareProject}
                  />
                </motion.div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="lg:hidden flex gap-6 overflow-x-auto snap-x">
              {featuredProjects.map((project) => (
                <div key={project.id} className="min-w-[85%] snap-center">
                  <FeaturedProjectCard
                    project={project}
                    onClick={onProjectClick}
                    onShare={onShareProject}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <button
                onClick={() => {
                  onNavigateToProjects();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group bg-black border border-gray-600 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-gray-900 transition flex items-center justify-center gap-3 mx-auto"
              >
                View All Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Featured Project Card
const FeaturedProjectCard: React.FC<{
  project: Project;
  onClick: (project: Project) => void;
  onShare: (project: Project) => void;
}> = ({ project, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group glass rounded-2xl overflow-hidden border border-gray-600 hover:border-gray-400 cursor-pointer transition hover:shadow-2xl"
      onClick={() => onClick(project)}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition"
        />
        <div className="absolute top-3 right-3 bg-black border border-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          Featured
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="bg-black/80 text-white p-5 rounded-full border border-gray-600">
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-200 transition">
          {project.title}
        </h3>
        <p className="text-gray-300 mb-6 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-3">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded-full text-sm font-medium border border-gray-600 hover:bg-gray-700 transition"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full text-sm font-medium border border-gray-500">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Featured Slideshow
const FeaturedSlideshow: React.FC<{
  projects: Project[];
  onProjectClick: (project: Project) => void;
}> = ({ projects, onProjectClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const currentProject = projects[currentIndex];

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl border border-gray-600 overflow-hidden hover:shadow-2xl"
    >
      <div
        className="relative h-80 cursor-pointer overflow-hidden"
        onClick={() => onProjectClick(currentProject)}
      >
        <img
          src={currentProject.image}
          alt={currentProject.title}
          className="w-full h-full object-cover hover:scale-110 transition"
        />
        <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Featured
        </div>
      </div>
      <div className="p-8 bg-gray-900/40 backdrop-blur-sm">
        <h4 className="text-xl font-bold text-white mb-3">
          {currentProject.title}
        </h4>
        <p className="text-gray-300 text-sm mb-6 line-clamp-2">
          {currentProject.description}
        </p>
        <div className="flex flex-wrap gap-3">
          {currentProject.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded-full text-xs font-medium border border-gray-600 hover:bg-gray-700 transition"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex justify-center space-x-3 mt-6">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
