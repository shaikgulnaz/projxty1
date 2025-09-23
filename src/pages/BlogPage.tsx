import React, { useState, useMemo } from 'react';
import { Search, Plus, Calendar, Clock, Eye, Tag, User, Edit3, Trash2, BookOpen, TrendingUp, Filter } from 'lucide-react';
import { BlogPost } from '../types/blog';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useDebounce } from '../hooks/useDebounce';
import { BlogPostCard } from '../components/BlogPostCard';
import { BlogPostModal } from '../components/BlogPostModal';
import { BlogEditor } from '../components/BlogEditor';

interface BlogPageProps {
  isAuthenticated: boolean;
}

export const BlogPage: React.FC<BlogPageProps> = ({ isAuthenticated }) => {
  const { posts, loading, error, addPost, updatePost, deletePost } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        post.author.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [posts, selectedCategory, debouncedSearchTerm]);

  // Get categories and recent posts
  const categories = useMemo(() => {
    const categoryCount = posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
  }, [posts]);

  const recentPosts = useMemo(() => {
    return posts.slice(0, 5);
  }, [posts]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleAddPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    const result = await addPost(postData);
    if (result.success) {
      setShowEditor(false);
      setEditingPost(null);
    } else {
      alert(result.error || 'Failed to add blog post. Please ensure Supabase is connected.');
    }
  };

  const handleEditPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    if (editingPost) {
      const result = await updatePost(editingPost.id, postData);
      if (result.success) {
        setShowEditor(false);
        setEditingPost(null);
      } else {
        alert(result.error || 'Failed to update blog post. Please ensure Supabase is connected.');
      }
    }
  };

  const handleDeletePost = async (post: BlogPost) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      const result = await deletePost(post.id);
      if (!result.success) {
        alert(result.error || 'Failed to delete blog post. Please ensure Supabase is connected.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center relative overflow-hidden">
        <div className="text-center z-10 px-4">
          <div className="premium-loader mb-6">
            <div className="loader-ring"></div>
            <div className="loader-ring loader-ring-2"></div>
            <div className="loader-center">
              <BookOpen className="w-6 h-6 text-white sm:w-8 sm:h-8" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white neon-glow fade-in-up">
            Loading Blog Posts...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="text-center mb-12">
          <div className="slide-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 neon-glow">
              Our <span className="gradient-text-fire">Blog</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Insights, tutorials, and thoughts on technology, development, and innovation. 
              Stay updated with the latest trends and best practices.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search Bar */}
              <div className="lg:col-span-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 text-white placeholder-gray-400 text-base"
                  />
                </div>
              </div>

              {/* Add Post Button for Admins */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setShowEditor(true);
                  }}
                  className="flex items-center justify-center space-x-2 px-6 py-4 bg-black border border-gray-600 text-white rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">New Post</span>
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max px-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === ''
                      ? 'bg-white text-black shadow-lg'
                      : 'glass border border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  All Posts ({posts.length})
                </button>
                {categories.map(category => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === category.name
                        ? 'bg-white text-black shadow-lg'
                        : 'glass border border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-3">
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BlogPostCard
                      post={post}
                      onClick={handlePostClick}
                      onEdit={isAuthenticated ? (post) => {
                        setEditingPost(post);
                        setShowEditor(true);
                      } : undefined}
                      onDelete={isAuthenticated ? handleDeletePost : undefined}
                      isAdmin={isAuthenticated}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="glass rounded-2xl p-8 md:p-12 border border-gray-600 max-w-md mx-auto">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">No blog posts found</h4>
                  <p className="text-gray-300 text-base">
                    {searchTerm || selectedCategory 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No blog posts available at the moment.'
                    }
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                      className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 border border-gray-600"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Posts */}
            <div className="glass rounded-2xl p-6 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Posts
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.publishDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="glass rounded-2xl p-6 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-between ${
                      selectedCategory === category.name
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Stats */}
            <div className="glass rounded-2xl p-6 border border-gray-600">
              <h3 className="text-xl font-bold text-white mb-4">Blog Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Total Posts</span>
                  <span className="text-white font-semibold">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Categories</span>
                  <span className="text-white font-semibold">{categories.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Total Views</span>
                  <span className="text-white font-semibold">
                    {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Post Modal */}
      <BlogPostModal
        post={selectedPost}
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setSelectedPost(null);
        }}
      />

      {/* Blog Editor Modal */}
      <BlogEditor
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingPost(null);
        }}
        onSubmit={editingPost ? handleEditPost : handleAddPost}
        editingPost={editingPost}
      />
    </div>
  );
};