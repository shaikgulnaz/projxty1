import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  html_content: string;
  author: string;
  featured_image: string;
  tags: string[];
  published: boolean;
  publish_date: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export function useBlogPosts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogPosts = async (publishedOnly = true) => {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false });

      if (publishedOnly) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        return;
      }

      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const addBlogPost = async (blogData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...blogData,
          views: 0,
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchBlogPosts(false);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding blog post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const updateBlogPost = async (id: string, blogData: Partial<BlogPost>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(blogData)
        .eq('id', id);

      if (error) throw error;

      await fetchBlogPosts(false);
      return { success: true };
    } catch (error) {
      console.error('Error updating blog post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchBlogPosts(false);
      return { success: true };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const getBlogPostBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const { error } = await supabase.rpc('increment_blog_views', { blog_id: id });

      if (error) {
        const { data } = await supabase
          .from('blog_posts')
          .select('views')
          .eq('id', id)
          .single();

        if (data) {
          await supabase
            .from('blog_posts')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
        }
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  return {
    blogPosts,
    loading,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogPostBySlug,
    incrementViews,
    refreshBlogPosts: fetchBlogPosts,
  };
}
