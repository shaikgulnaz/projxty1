export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'user';
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string;
          category: string;
          technologies: string[];
          featured: boolean;
          created_at: string;
          updated_at: string;
          stars: number;
          hackathon_code: string | null;
          video_url: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image: string;
          category: string;
          technologies: string[];
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
          stars?: number;
          hackathon_code?: string | null;
          video_url: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image?: string;
          category?: string;
          technologies?: string[];
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
          stars?: number;
          hackathon_code?: string | null;
          video_url?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string;
          image: string;
          category: string;
          tags: string[];
          author: string;
          publish_date: string;
          published: boolean;
          read_time: number;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt: string;
          image: string;
          category: string;
          tags?: string[];
          author: string;
          publish_date: string;
          published?: boolean;
          read_time?: number;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string;
          image?: string;
          category?: string;
          tags?: string[];
          author?: string;
          publish_date?: string;
          published?: boolean;
          read_time?: number;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}