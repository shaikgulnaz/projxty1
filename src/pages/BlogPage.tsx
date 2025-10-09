import React, { useState } from 'react';
import { Calendar, Clock, Eye, Tag, Search, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../hooks/useBlogPosts';

interface BlogPageProps {
  onBlogSelect: (slug: string) => void;
}

export default function BlogPage({ onBlogSelect }: BlogPageProps) {
  const { blogPosts, loading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(blogPosts.flatMap(post => post.tags || []))
  ).sort();

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);

    return matchesSearch && matchesTag && post.published;
  });

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

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 slide-in">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            <span className="gradient-text">Our Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and stories from our team
          </p>
        </div>

        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blog posts..."
              className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedTag === null
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                All Posts
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedTag === tag
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No blog posts found</p>
            <p className="text-gray-500 mt-2">
              {searchQuery || selectedTag ? 'Try adjusting your filters' : 'Check back soon for updates!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className="glass rounded-xl overflow-hidden border border-gray-700 hover:border-white/30 transition-all duration-300 group cursor-pointer slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onBlogSelect(post.slug)}
              >
                {post.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.publish_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views || 0}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h2>

                  {post.description && (
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-sm text-gray-400">By {post.author}</span>
                    <button className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
