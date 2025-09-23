import React from 'react';
import { Calendar, Clock, Eye, Tag, User, Edit3, Trash2 } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface BlogPostCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (post: BlogPost) => void;
  isAdmin?: boolean;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onClick,
  onEdit,
  onDelete,
  isAdmin = false
}) => {
  return (
    <article className="group glass rounded-2xl overflow-hidden border border-gray-600 hover:border-gray-400 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-gray-500/20">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/3 relative overflow-hidden h-48 md:h-auto">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Admin Actions */}
          {isAdmin && (onEdit || onDelete) && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  className="p-2 glass hover:bg-gray-700 hover:text-white rounded-full shadow-lg transition-all duration-300 border border-gray-600"
                  title="Edit Post"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post);
                  }}
                  className="p-2 glass hover:bg-red-600 hover:text-white rounded-full shadow-lg transition-all duration-300 border border-gray-600"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-6 md:p-8 flex flex-col">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views.toLocaleString()} views
            </div>
          </div>

          {/* Title */}
          <h2 
            className="text-xl md:text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300 mb-3 line-clamp-2 cursor-pointer"
            onClick={() => onClick(post)}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-1">
            {post.excerpt}
          </p>

          {/* Tags and Category */}
          <div className="flex flex-wrap items-center gap-2 mt-auto">
            {/* Category */}
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm font-medium border border-gray-600">
              <Tag className="w-3 h-3" />
              {post.category}
            </div>

            {/* Tags */}
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium hover:bg-gray-600 hover:text-white transition-all duration-300"
              >
                {tag}
              </span>
            ))}
            
            {post.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-600 text-gray-400 rounded-full text-sm font-medium">
                +{post.tags.length - 3}
              </span>
            )}
          </div>

          {/* Read More Button */}
          <button
            onClick={() => onClick(post)}
            className="mt-4 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-300 self-start"
          >
            Read More →
          </button>
        </div>
      </div>
    </article>
  );
};