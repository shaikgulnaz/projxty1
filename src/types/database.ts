export interface Database {
  public: {
    Tables: {
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
      user_profiles: {
        Row: {
          id: string;
          phone: string;
          name: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone: string;
          name: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          name?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}