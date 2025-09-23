import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Calendar, Clock, Tag, User, Image as ImageIcon } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface BlogEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => void;
  editingPost?: BlogPost | null;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingPost
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: '',
    tags: '',
    author: 'Projxty Team',
    publishDate: new Date().toISOString().split('T')[0],
    published: true,
    readTime: 5
  });

  const [showPreview, setShowPreview] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        excerpt: editingPost.excerpt,
        image: editingPost.image,
        category: editingPost.category,
        tags: editingPost.tags.join(', '),
        author: editingPost.author,
        publishDate: editingPost.publishDate,
        published: editingPost.published,
        readTime: editingPost.readTime
      });
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        category: '',
        tags: '',
        author: 'Projxty Team',
        publishDate: new Date().toISOString().split('T')[0],
        published: true,
        readTime: 5
      });
    }
  }, [editingPost, isOpen]);

  // Auto-calculate read time based on content
  useEffect(() => {
    const wordCount = formData.content.split(/\s+/).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    setFormData(prev => ({ ...prev, readTime: estimatedReadTime }));
  }, [formData.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    onSubmit(postData);
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'AI/ML',
    'Blockchain',
    'Cybersecurity',
    'UI/UX Design',
    'DevOps',
    'Cloud Computing',
    'Data Science',
    'Technology Trends'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 glass border border-gray-600 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Form */}
          {!showPreview && (
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400 text-base"
                  placeholder="Enter an engaging title..."
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 resize-none text-white placeholder-gray-400 text-base"
                  placeholder="Write a compelling excerpt that summarizes your post..."
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Content * (HTML supported)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 resize-none text-white placeholder-gray-400 text-base font-mono"
                  placeholder="Write your blog post content here. You can use HTML tags for formatting..."
                  required
                />
                <p className="text-gray-400 text-sm mt-2">
                  Supports HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Featured Image URL *
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400 text-base"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tags (comma-separated)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400 text-base"
                      placeholder="React, JavaScript, Tutorial"
                    />
                  </div>
                </div>
              </div>

              {/* Author and Publish Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Author *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400 text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Publish Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Read Time and Published Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Estimated Read Time (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 1 })}
                      className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Auto-calculated based on content length</p>
                </div>

                <div className="flex items-center justify-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-5 h-5 text-gray-400 border-gray-600 rounded focus:ring-gray-400 glass"
                    />
                    <span className="text-white font-medium">Publish immediately</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-700">
                <button
                  type="submit"
                  className="w-full bg-black border border-gray-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  {editingPost ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          )}

          {/* Preview */}
          {showPreview && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {/* Preview Header */}
                <div className="mb-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-200 text-sm font-medium">Preview Mode</p>
                </div>

                {/* Featured Image */}
                {formData.image && (
                  <div className="mb-8">
                    <img
                      src={formData.image}
                      alt={formData.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(formData.publishDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {formData.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formData.readTime} min read
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-6">
                  {formData.title || 'Your Post Title'}
                </h1>

                {/* Tags */}
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-gray-800 text-gray-200 rounded-lg text-sm font-medium">
                      {formData.category}
                    </span>
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formData.content || '<p class="text-gray-400">Your content will appear here...</p>' 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};