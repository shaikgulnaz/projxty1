import React from 'react';
import { X, MessageCircle, Tag, Sparkles, Star } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  isAdmin = false
}) => {
  if (!isOpen || !project) return null;

  const handleContactClick = () => {
    const message = `Hi! I'm interested in your project "${project.title}". I'd like to know more about it.`;
    const whatsappUrl = `https://wa.me/916361064550?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-black border border-gray-600 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Project Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
          >
            <X className="w-6 h-6 text-white/60 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Project Info */}
            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {project.title}
                </h1>
                {project.featured && (
                  <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm font-medium border border-gray-600">
                    <Sparkles className="w-4 h-4" />
                    Featured Project
                  </div>
                )}
                
                {/* Star Rating Display - Only show in admin mode */}
                {isAdmin && (
                  <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm font-medium border border-gray-600 ml-2">
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    <span>{project.stars}/8 Importance</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed text-base">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {/* SIH Code Badge - Prominent display */}
                  {project.hackathonCode && (
                    <span className="px-4 py-2 bg-orange-600 text-orange-100 rounded-lg text-sm font-semibold border border-orange-500 flex items-center gap-2">
                      🏆 SIH: {project.hackathonCode}
                    </span>
                  )}
                  
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gray-800 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 border border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass rounded-lg p-4 border border-gray-600 max-w-xs">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Tag className="w-4 h-4" />
                    Category
                  </div>
                  <p className="text-white font-medium">{project.category}</p>
                </div>
                
                <div className="glass rounded-lg p-4 border border-gray-600 max-w-xs">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Tag className="w-4 h-4" />
                    Created
                  </div>
                  <p className="text-white font-medium">{project.createdAt}</p>
                </div>
              </div>

              {/* Contact Button */}
              <div className="pt-4">
                <button
                  onClick={handleContactClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Developer on WhatsApp
                </button>
                <p className="text-gray-400 text-sm text-center mt-2">
                  Get in touch to discuss this project or collaborate
                </p>
              </div>
            </div>

            {/* Right Side - Project Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl bg-gray-900 aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              
              {/* Additional project stats or info can go here */}
              <div className="glass rounded-xl p-4 border border-gray-600">
                <h4 className="text-white font-semibold mb-2">Project Highlights</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Built with modern technologies</li>
                  <li>• Production-ready implementation</li>
                  <li>• Responsive and user-friendly design</li>
                  <li>• Available for collaboration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};