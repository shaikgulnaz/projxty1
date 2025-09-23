import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types/blog';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample blog posts for demo (when Supabase is not connected)
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of Web Development: Trends to Watch in 2024',
      content: `
        <p>Web development is evolving at an unprecedented pace, and 2024 promises to bring exciting new trends that will reshape how we build and interact with web applications.</p>
        
        <h2>1. AI-Powered Development Tools</h2>
        <p>Artificial Intelligence is revolutionizing the development process. From code generation to automated testing, AI tools are becoming indispensable for modern developers.</p>
        
        <h2>2. WebAssembly (WASM) Adoption</h2>
        <p>WebAssembly is gaining traction as a way to run high-performance applications in the browser. Languages like Rust and C++ can now run at near-native speeds on the web.</p>
        
        <h2>3. Serverless Architecture</h2>
        <p>Serverless computing continues to grow, offering developers the ability to build scalable applications without managing infrastructure.</p>
        
        <h2>4. Progressive Web Apps (PWAs)</h2>
        <p>PWAs are bridging the gap between web and mobile applications, providing native-like experiences with web technologies.</p>
        
        <p>These trends represent just the beginning of what's possible in modern web development. Stay tuned for more insights!</p>
      `,
      excerpt: 'Explore the cutting-edge trends shaping web development in 2024, from AI-powered tools to WebAssembly and serverless architecture.',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Web Development',
      tags: ['Web Development', 'AI', 'WebAssembly', 'Serverless', 'PWA'],
      author: 'Projxty Team',
      publishDate: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      published: true,
      readTime: 5,
      views: 1250
    },
    {
      id: '2',
      title: 'Building Scalable Mobile Apps with React Native',
      content: `
        <p>React Native has become the go-to framework for cross-platform mobile development. In this comprehensive guide, we'll explore best practices for building scalable mobile applications.</p>
        
        <h2>Why Choose React Native?</h2>
        <p>React Native offers several advantages for mobile development:</p>
        <ul>
          <li>Code reusability across platforms</li>
          <li>Faster development cycles</li>
          <li>Strong community support</li>
          <li>Native performance</li>
        </ul>
        
        <h2>Architecture Patterns</h2>
        <p>Implementing the right architecture is crucial for scalability. We recommend using patterns like Redux for state management and modular component architecture.</p>
        
        <h2>Performance Optimization</h2>
        <p>Key strategies for optimizing React Native apps include:</p>
        <ul>
          <li>Image optimization and lazy loading</li>
          <li>Efficient list rendering with FlatList</li>
          <li>Memory management</li>
          <li>Bundle size optimization</li>
        </ul>
        
        <p>By following these practices, you can build mobile apps that scale effectively and provide excellent user experiences.</p>
      `,
      excerpt: 'Learn how to build scalable mobile applications with React Native, covering architecture patterns, performance optimization, and best practices.',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Mobile Development',
      tags: ['React Native', 'Mobile Development', 'Performance', 'Architecture'],
      author: 'Projxty Team',
      publishDate: '2024-01-10',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
      published: true,
      readTime: 7,
      views: 890
    },
    {
      id: '3',
      title: 'Machine Learning in Web Applications: A Practical Guide',
      content: `
        <p>Integrating machine learning into web applications is becoming increasingly accessible. This guide will walk you through practical approaches to add AI capabilities to your web projects.</p>
        
        <h2>Getting Started with TensorFlow.js</h2>
        <p>TensorFlow.js allows you to run machine learning models directly in the browser. This opens up possibilities for:</p>
        <ul>
          <li>Real-time image recognition</li>
          <li>Natural language processing</li>
          <li>Predictive analytics</li>
          <li>Recommendation systems</li>
        </ul>
        
        <h2>Pre-trained Models</h2>
        <p>You don't always need to train models from scratch. Many pre-trained models are available for common tasks like object detection, sentiment analysis, and more.</p>
        
        <h2>Performance Considerations</h2>
        <p>Running ML models in the browser requires careful consideration of:</p>
        <ul>
          <li>Model size and loading times</li>
          <li>CPU vs GPU acceleration</li>
          <li>Memory usage</li>
          <li>User experience during processing</li>
        </ul>
        
        <p>Machine learning in web applications is an exciting frontier that's becoming more accessible every day.</p>
      `,
      excerpt: 'Discover how to integrate machine learning into web applications using TensorFlow.js, covering practical implementations and performance considerations.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'AI/ML',
      tags: ['Machine Learning', 'TensorFlow.js', 'AI', 'Web Development'],
      author: 'Projxty Team',
      publishDate: '2024-01-05',
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T09:15:00Z',
      published: true,
      readTime: 8,
      views: 1450
    }
  ];

  // Fetch blog posts from database
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!supabase) {
        // If no Supabase connection, use sample data
        setPosts(samplePosts);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('publish_date', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform database data to match BlogPost interface
        const transformedPosts: BlogPost[] = data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          image: post.image,
          category: post.category,
          tags: post.tags,
          author: post.author,
          publishDate: post.publish_date,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          published: post.published,
          readTime: post.read_time || 5,
          views: post.views || 0
        }));

        setPosts(transformedPosts);
      } catch (fetchError) {
        console.error('Database fetch failed:', fetchError);
        setPosts(samplePosts);
        setError('Using sample blog posts. Connect to Supabase for full functionality.');
      }
    } catch (err) {
      console.error('Error in fetchPosts:', err);
      setPosts(samplePosts);
      setError('Using sample blog posts. Connect to Supabase for full functionality.');
    } finally {
      setLoading(false);
    }
  };

  // Add new blog post
  const addPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Please connect to Supabase first to save blog posts permanently' };
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          image: postData.image,
          category: postData.category,
          tags: postData.tags,
          author: postData.author,
          publish_date: postData.publishDate,
          published: postData.published,
          read_time: postData.readTime
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform and add to local state
      const newPost: BlogPost = {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        image: data.image,
        category: data.category,
        tags: data.tags,
        author: data.author,
        publishDate: data.publish_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        published: data.published,
        readTime: data.read_time || 5,
        views: data.views || 0
      };

      setPosts(prev => [newPost, ...prev]);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add blog post';
      return { success: false, error: errorMessage };
    }
  };

  // Update blog post
  const updatePost = async (id: string, postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Please connect to Supabase first to update blog posts' };
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          image: postData.image,
          category: postData.category,
          tags: postData.tags,
          author: postData.author,
          publish_date: postData.publishDate,
          published: postData.published,
          read_time: postData.readTime
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform and update local state
      const updatedPost: BlogPost = {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        image: data.image,
        category: data.category,
        tags: data.tags,
        author: data.author,
        publishDate: data.publish_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        published: data.published,
        readTime: data.read_time || 5,
        views: data.views || 0
      };

      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update blog post';
      return { success: false, error: errorMessage };
    }
  };

  // Delete blog post
  const deletePost = async (id: string) => {
    try {
      if (!supabase) {
        return { success: false, error: 'Please connect to Supabase first to delete blog posts' };
      }
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from local state
      setPosts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete blog post';
      return { success: false, error: errorMessage };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchPosts();

    if (!supabase) return;

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
          console.log('Real-time blog update:', payload);
          // Refetch data when changes occur
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    posts,
    loading,
    error,
    addPost,
    updatePost,
    deletePost,
    refetch: fetchPosts
  };
};