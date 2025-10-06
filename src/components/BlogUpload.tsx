import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

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
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setHtmlContent(content);
        setHtmlFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid HTML file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !htmlContent) {
      alert('Please fill in title and upload HTML content');
      return;
    }

    setIsSubmitting(true);
    try {
      const blogData: BlogFormData = {
        title,
        slug: generateSlug(title),
        description: '',
        html_content: htmlContent,
        author: 'Admin',
        featured_image: '',
        tags: [],
        published: true,
        publish_date: new Date().toISOString().split('T')[0],
      };

      await onSubmit(blogData);
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
      <div className="glass rounded-2xl max-w-2xl w-full my-8 border border-gray-700">
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-white focus:outline-none transition-colors"
              placeholder="Enter blog post title"
              required
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
              className="w-full flex items-center justify-center gap-3 px-4 py-12 bg-black/50 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-white hover:bg-white/5 transition-all"
            >
              <FileText className="w-10 h-10 text-gray-400" />
              <div className="text-center">
                <p className="text-white font-medium text-lg">
                  {htmlFileName || 'Click to upload HTML file'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload your blog post as an HTML file
                </p>
              </div>
            </label>
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
