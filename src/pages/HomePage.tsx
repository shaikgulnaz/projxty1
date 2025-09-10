import React from "react";
import { TrendingUp, Star, Sparkles, Play, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Project } from "../types";

// Framer Motion template: fade-in + staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  onNavigateToProjects,
  onProjectClick,
  onShareProject,
}) => {
  const featured = projects.filter(p => p.featured).slice(0, 3);
  const stats = {
    total: projects.length,
    featured: featured.length,
    categories: new Set(projects.map(p => p.category)).size,
  };

  return (
    <div className="bg-gray-900 text-white font-sans antialiased">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative max-w-5xl mx-auto px-4"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-bold neon-glow mb-6 leading-snug"
          >
            Code That Actually <span className="gradient-text-fire">Slaps</span> 
            <span className="ml-2">🔥</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl"
          >
            From AI that hits different to web apps that go hard. Perfect inspo
            for your next assignment or hustle.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onNavigateToProjects}
              className="px-8 py-3 bg-white text-black rounded-lg text-lg font-semibold hover:scale-105 transition-transform"
            >
              Explore Projects <ArrowRight className="inline-block ml-2 w-5 h-5"/>
            </button>
            <button
              onClick={onNavigateToProjects}
              className="px-8 py-3 border border-gray-400 text-gray-200 rounded-lg text-lg hover:bg-white/10 hover:scale-105 transition"
            >
              <TrendingUp className="inline-block w-5 h-5 mr-2" /> View All {stats.total}
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-4">
            Project Statistics
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8">
            Showcasing innovation across domains
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {[
              {icon: <TrendingUp />, value: stats.total, label: "Total"},
              {icon: <Star />, value: stats.featured, label: "Featured"},
              {icon: <Sparkles />, value: stats.categories, label: "Categories"}
            ].map((s, i) => (
              <motion.div
                variants={itemVariants}
                key={i}
                className="flex-1 bg-gray-800 rounded-lg py-6 px-4"
              >
                <div className="mb-2 inline-block">{s.icon}</div>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-gray-300">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto px-4 text-center mb-10"
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-4">
              Featured Projects
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-300">
              Handpicked innovation.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-5xl mx-auto">
            {featured.map((p, i) => (
              <motion.div key={p.id} variants={itemVariants} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform">
                <div className="relative h-48">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover"/>
                  <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" /> Featured
                  </div>
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                        {tech}
                      </span>
                    ))}
                    {p.technologies.length > 3 && <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                      +{p.technologies.length - 3}
                    </span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={() => { onNavigateToProjects(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="px-8 py-3 bg-black border border-gray-400 rounded-lg text-lg hover:scale-105 transition"
            >
              View All Projects <ArrowRight className="inline-block ml-2 w-5 h-5"/>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
