import React from 'react';
import { Tag, Sparkles, Edit3, Trash2, Star } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  isAdmin?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onEdit, onDelete, isAdmin = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="group relative glass rounded-xl shadow-lg hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-500 overflow-hidden border border-gray-600 hover:border-gray-400 cursor-pointer transform hover:scale-105 h-[420px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(project)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-gray-900 flex-shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 bg-black border border-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        )}
        
        {/* Star Rating Badge - Only show in admin mode */}
        {isAdmin && (
          <div className="absolute top-3 left-3 bg-black/80 border border-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span>{project.stars}/8</span>
          </div>
        )}
        
        {/* Edit Button for Host */}
        <div className={`absolute ${isAdmin ? 'top-12' : 'top-3'} left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2`}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-2 glass hover:bg-gray-700 hover:text-white rounded-full shadow-lg transition-all duration-300 border border-gray-600"
              title="Edit Project"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
                  onDelete(project);
                }
              }}
              className="p-2 glass hover:bg-gray-700 hover:text-white rounded-full shadow-lg transition-all duration-300 border border-gray-600"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-2">
            <div className="glass px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 shadow-lg border border-gray-600">
              <Tag className="w-3 h-3" />
              {project.category}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative flex-1 flex flex-col">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gray-800/10 opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-all duration-500 mb-3 line-clamp-2 min-h-[3.5rem]">
            {project.title}
          </h3>

          <p className="text-base text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-1 min-h-[4.5rem]">{project.description}</p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {/* SIH Code Badge - Always visible when present */}
            {project.hackathonCode && (
              <span className="px-3 py-1 bg-orange-600 text-orange-100 rounded-full text-sm font-medium border border-orange-500 flex items-center gap-1">
                SIH: {project.hackathonCode}
              </span>
            )}
            
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 border border-gray-600"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium border border-gray-500">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};