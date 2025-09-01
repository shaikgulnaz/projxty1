import React, { useState } from 'react';
import { X, Upload, Plus, Star } from 'lucide-react';
import { Project } from '../types';

interface ProjectUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  editingProject?: Project;
}

export const ProjectUpload: React.FC<ProjectUploadProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingProject
}) => {
  const [formData, setFormData] = useState({
    title: editingProject?.title || '',
    description: editingProject?.description || '',
    image: editingProject?.image || '',
    videoUrl: editingProject?.videoUrl || '',
    category: editingProject?.category || '',
    technologies: editingProject?.technologies.join(', ') || '',
    featured: editingProject?.featured || false,
    stars: editingProject?.stars || 1,
    hackathonCode: editingProject?.hackathonCode || ''
  });

  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      stars: formData.stars,
      hackathonCode: formData.hackathonCode || undefined
    };
    
    onSubmit(projectData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      image: '',
      videoUrl: '',
      category: '',
      technologies: '',
      featured: false,
      stars: 1,
      hackathonCode: ''
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400"
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 resize-none text-white placeholder-gray-400"
              placeholder="Describe your project"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project Image
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-gray-400 bg-gray-500/20'
                  : 'border-gray-500 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm md:text-base text-gray-300 mb-2">Drag & drop an image or enter URL</p>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent text-white placeholder-gray-400"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              required
            />
            <p className="text-gray-400 text-sm mt-2">
              Supports YouTube, Vimeo, or direct video file URLs
            </p>
          </div>

          {/* Category and Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white"
                required
              >
                <option value="">Select category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Technologies
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400"
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                SIH Code (Optional)
              </label>
              <input
                type="text"
                value={formData.hackathonCode}
                onChange={(e) => setFormData({ ...formData, hackathonCode: e.target.value })}
                className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400"
                placeholder="SIH2024-001"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-gray-400 border-gray-600 rounded focus:ring-gray-400 glass"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
              Mark as featured project
            </label>
            </div>
            
            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Importance:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, stars: star })}
                    className={`p-1 rounded transition-colors duration-200 ${
                      star <= formData.stars
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-600 hover:text-gray-500'
                    }`}
                  >
                    <Star 
                      className="w-5 h-5" 
                      fill={star <= formData.stars ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">
                  {formData.stars}/8 stars
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black border border-gray-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            {editingProject ? 'Update Project' : 'Add Project'}
          </button>
        </form>
      </div>
    </div>
  );
};