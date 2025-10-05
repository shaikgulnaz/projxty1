import React, { useEffect, useState } from 'react';
import { Calendar, Eye, Tag, ArrowLeft, Clock, User } from 'lucide-react';
import { useBlogPosts } from '../hooks/useBlogPosts';
import type { BlogPost } from '../hooks/useBlogPosts';

interface BlogDetailPageProps {
  slug: string;
  onBack: () => void;
}

export default function BlogDetailPage({ slug, onBack }: BlogDetailPageProps) {
  const { getBlogPostBySlug, incrementViews } = useBlogPosts();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const result = await getBlogPostBySlug(slug);
      if (result.success && result.data) {
        setPost(result.data);
        await incrementViews(result.data.id);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="premium-loader">
          <div className="loader-ring"></div>
          <div className="loader-ring loader-ring-2"></div>
          <div className="loader-ring loader-ring-3"></div>
          <div className="loader-center">
            <div className="loading-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </button>

        <article className="slide-in">
          {post.featured_image && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-xl text-gray-300 mb-6">
                {post.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-6 border-b border-gray-700">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(post.publish_date)}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {post.views || 0} views
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 border border-gray-700 rounded-full text-sm text-gray-300 flex items-center gap-2"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-pink-400 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-black/50 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:border prose-img:border-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-white/30 prose-blockquote:text-gray-400 prose-blockquote:italic
              prose-ul:text-gray-300 prose-ol:text-gray-300
              prose-li:text-gray-300 prose-li:marker:text-gray-500
              prose-table:border prose-table:border-gray-700
              prose-th:bg-white/5 prose-th:text-white prose-th:border prose-th:border-gray-700
              prose-td:border prose-td:border-gray-700 prose-td:text-gray-300
              prose-hr:border-gray-700"
            dangerouslySetInnerHTML={{ __html: post.html_content }}
          />

          <div className="mt-12 pt-8 border-t border-gray-700">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to all posts
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
