import React, { useState } from 'react';
import { X, Upload, FileText, Image as ImageIcon, Tag, Calendar, Eye, EyeOff } from 'lucide-react';

interface BlogUploadProps {
  onClose: () => void;
  onSubmit: (blogData: BlogFormData) => Promise<void>;
}

export interface BlogFormData {
  title: string;
  slug: string;
  description: string;
  html_content: string;
  author: string;
  featured_image: string;
  tags: string[];
  published: boolean;
  publish_date: string;
}

export default function BlogUpload({ onClose, onSubmit }: BlogUploadProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    description: '',
    html_content: '',
    author: 'Admin',
    featured_image: '',
    tags: [],
    published: false,
    publish_date: new Date().toISOString().split('T')[0],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [htmlFileName, setHtmlFileName] = useState('');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormData({ ...formData, html_content: content });
        setHtmlFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid HTML file');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.html_content || !formData.slug) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting blog post:', error);
      alert('Failed to submit blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="glass rounded-2xl max-w-4xl w-full my-8 border border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Upload Blog Post
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors"
              placeholder="Enter blog post title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors font-mono text-sm"
              placeholder="blog-post-url"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used in the URL: /blog/{formData.slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors resize-none"
              rows={3}
              placeholder="Brief description of the blog post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              HTML Content *
            </label>
            <input
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="hidden"
              id="html-upload"
            />
            <label
              htmlFor="html-upload"
              className="w-full flex items-center justify-center gap-3 px-4 py-8 bg-black/50 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-white hover:bg-white/5 transition-all"
            >
              <FileText className="w-8 h-8 text-gray-400" />
              <div className="text-center">
                <p className="text-white font-medium">
                  {htmlFileName || 'Click to upload HTML file'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload your blog post as an HTML file
                </p>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors"
                placeholder="Author name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors"
                placeholder="Add tags"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 border border-gray-700 rounded-full text-sm text-gray-300 flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Publish Date
              </label>
              <input
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                {formData.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Status
              </label>
              <label className="flex items-center gap-3 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-white">Publish immediately</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
