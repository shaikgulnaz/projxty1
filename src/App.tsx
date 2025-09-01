import React, { useState, useEffect } from 'react';
import { Search, Plus, Code2, Users, Star, TrendingUp, LogOut, Lock, User, Phone, X, Shield, MessageCircle, Sparkles } from 'lucide-react';
import { ProjectCard } from './components/ProjectCard';
import { ProjectUpload } from './components/ProjectUpload';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ShareModal } from './components/ShareModal';
import { Project } from './types';
import { useProjects } from './hooks/useProjects';
import { signInWithOTP, verifyOTP, signOut } from './lib/supabase';

function App() {
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjects();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [sharingProject, setSharingProject] = useState<Project | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [authForm, setAuthForm] = useState({ 
    phone: '', 
    otp: '', 
    error: '', 
    isLoading: false,
    otpSent: false 
  });

  // Host credentials
  const HOST_PHONE = '6361064550';
  const GENERATED_OTP = '664477';

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('devcode_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }

    // Check for shared project in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedProjectId = urlParams.get('project');
    if (sharedProjectId && projects.length > 0) {
      const sharedProject = projects.find(p => p.id === sharedProjectId);
      if (sharedProject) {
        setSelectedProject(sharedProject);
        setShowProjectDetail(true);
      }
    }
  }, [projects]);

  // Filter projects based on search and category
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory]);

  const handleAddProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const result = await addProject(projectData);
    if (result.success) {
      setShowUpload(false);
    } else {
      alert(result.error || 'Failed to add project. Please ensure Supabase is connected.');
    }
  };

  const handleEditProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    if (editingProject) {
      const result = await updateProject(editingProject.id, projectData);
      if (result.success) {
        setEditingProject(null);
        setShowUpload(false);
      } else {
        alert(result.error || 'Failed to update project. Please ensure Supabase is connected.');
      }
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const result = await deleteProject(project.id);
    if (!result.success) {
      alert(result.error || 'Failed to delete project. Please ensure Supabase is connected.');
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleShareProject = (project: Project) => {
    setSharingProject(project);
    setShowShare(true);
  };
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    const result = await signInWithOTP(authForm.phone);
    
    if (result.success) {
      setAuthForm(prev => ({ 
        ...prev, 
        isLoading: false, 
        otpSent: true 
      }));
      setAuthStep('otp');
    } else {
      setAuthForm(prev => ({ 
        ...prev, 
        error: 'This phone number is not authorized for admin access.',
        isLoading: false 
      }));
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm(prev => ({ ...prev, isLoading: true, error: '' }));

    const result = await verifyOTP(authForm.phone, authForm.otp);
    
    if (result.success) {
      setIsAuthenticated(true);
      localStorage.setItem('devcode_auth', 'authenticated');
      setShowAuth(false);
      setAuthForm({ phone: '', otp: '', error: '', isLoading: false, otpSent: false });
      setAuthStep('phone');
    } else {
      setAuthForm(prev => ({ 
        ...prev, 
        error: 'Invalid OTP. Please check and try again.',
        isLoading: false 
      }));
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    localStorage.removeItem('devcode_auth');
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-gray-500/10 rounded-full blur-xl" style={{ animationDelay: '2s' }}></div>
          <div className="floating-element absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl" style={{ animationDelay: '4s' }}></div>
          <div className="floating-element absolute bottom-20 right-1/3 w-36 h-36 bg-gray-400/10 rounded-full blur-xl" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center z-10">
          <div className="premium-loader mb-8">
            <div className="loader-ring"></div>
            <div className="loader-ring loader-ring-2"></div>
            <div className="loader-ring loader-ring-3"></div>
            <div className="loader-center">
              <Code2 className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white neon-glow fade-in-up">
              projx
            </h2>
            <p className="text-lg text-white/80 fade-in-up" style={{ animationDelay: '0.3s' }}>
              Curating exceptional projects...
            </p>
            <div className="flex justify-center space-x-2 fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="loading-dot"></div>
              <div className="loading-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="loading-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-red-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Database Connection Required</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm mb-6">Click the "Connect to Supabase" button in the top-right corner to enable database functionality.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What you'll get with Supabase:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Projects persist after page refresh</li>
              <li>• Real-time updates across devices</li>
              <li>• Secure admin authentication</li>
              <li>• Scalable to 100+ projects</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const categories = ['Web Development', 'Mobile App', 'AI/ML', 'Blockchain', 'Computer Vision', 'Cyber Security', 'Others'];

  const stats = {
    total: projects.length,
    featured: projects.filter(p => p.featured).length,
    categories: new Set(projects.map(p => p.category)).size
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-gray-500/10 rounded-full blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="floating-element absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl" style={{ animationDelay: '4s' }}></div>
        <div className="floating-element absolute bottom-20 right-1/3 w-36 h-36 bg-gray-400/10 rounded-full blur-xl" style={{ animationDelay: '1s' }}></div>
        
        {/* Geometric shapes */}
        <div className="pulse-element absolute top-1/4 left-1/2 w-2 h-2 bg-white/20 rounded-full"></div>
        <div className="pulse-element absolute top-1/3 right-1/4 w-1 h-1 bg-gray-400/30 rounded-full" style={{ animationDelay: '1s' }}></div>
        <div className="pulse-element absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/15 rounded-full" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="glass border-b border-gray-700 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-black border border-gray-600 p-3 rounded-xl shadow-lg">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                projx
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glass text-gray-300 border border-gray-600">
                    <Shield className="w-4 h-4" />
                    Admin Mode
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 glass rounded-lg hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="p-3 bg-black border border-gray-600 text-white rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                  title="Admin Access"
                >
                  <Code2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Half - Title and Description */}
            <div className="text-left slide-in">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 neon-glow">
                Code That Actually <span className="gradient-text-fire">Slaps</span> 🔥
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                No cap - these projects are straight fire! 🚀 From AI that hits different to web apps that go hard. 
                Perfect inspo for your next assignment or side hustle 💯
              </p>
              
              {/* Creative Stats Placement */}
              <div className="relative">
                <div className="glass rounded-2xl p-6 border border-gray-600 hover:shadow-xl hover:shadow-gray-500/20 transition-all duration-300 transform hover:scale-105 max-w-xs">
                  <div className="flex items-center space-x-4">
                    <div className="bg-black border border-gray-600 p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-white block">{stats.total}</span>
                      <p className="text-sm text-gray-300">Total Projects</p>
                    </div>
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Right Half - Featured Projects Slideshow */}
            <div className="slide-in" style={{ animationDelay: '200ms' }}>
              {featuredProjects.length > 0 && (
                <FeaturedSlideshow 
                  projects={featuredProjects}
                  onProjectClick={handleProjectClick}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search and Controls Section */}
        <section className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-6 slide-in text-center justify-center">
              <Search className="w-6 h-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-white">Search & Filter</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Category Filter Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === ''
                        ? 'bg-white text-black shadow-lg'
                        : 'glass border border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category
                          ? 'bg-white text-black shadow-lg'
                          : 'glass border border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowUpload(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-black border border-gray-600 text-white rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Project</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* All Projects Section */}
        <section>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white slide-in">All Projects</h3>
            <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full"></div>
          </div>
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard
                    project={project}
                    onClick={handleProjectClick}
                    onShare={handleShareProject}
                    onEdit={isAuthenticated ? (project) => {
                      setEditingProject(project);
                      setShowUpload(true);
                    } : undefined}
                    onDelete={isAuthenticated ? handleDeleteProject : undefined}
                   isAdmin={isAuthenticated}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="glass rounded-2xl p-8 md:p-12 border border-gray-600 max-w-md mx-auto">
                <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">No projects found</h4>
                <p className="text-gray-300">
                  {searchTerm || selectedCategory 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No projects available at the moment.'
                  }
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* WhatsApp Contact Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <a
          href="https://wa.me/916361064550?text=Hi! I'm interested in your projects and would like to connect."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Contact on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/80 backdrop-blur-sm text-white text-xs md:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden md:block border border-gray-600">
            Chat on WhatsApp
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-600"></div>
          </div>
        </a>
      </div>

      {/* Phone + OTP Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl shadow-2xl w-full max-w-md border border-gray-600">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-black border border-gray-600 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Admin Access</h2>
              </div>
              <button
                onClick={handleAuthClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {authStep === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="p-6">
                <div className="mb-6">
                  <p className="text-gray-300 text-sm mb-6 text-center">
                    Enter your registered phone number to receive OTP
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={authForm.phone}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, phone: e.target.value, error: '' }))}
                        className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="Enter phone number"
                        required
                        disabled={authForm.isLoading}
                      />
                    </div>
                  </div>
                  
                  {authForm.error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                      <p className="text-red-200 text-sm flex items-center gap-2">
                        <X className="w-4 h-4" />
                        {authForm.error}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={authForm.isLoading}
                  className="w-full bg-black border border-gray-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {authForm.isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="p-6">
                <div className="mb-6">
                  <p className="text-gray-300 text-sm mb-6 text-center">
                    Enter the 6-digit OTP sent to {authForm.phone}
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">OTP Code</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={authForm.otp}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, otp: e.target.value, error: '' }))}
                        className="w-full pl-10 pr-4 py-3 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest text-white placeholder-gray-400"
                        placeholder="000000"
                        maxLength={6}
                        required
                        disabled={authForm.isLoading}
                      />
                    </div>
                  </div>
                  
                  {authForm.error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                      <p className="text-red-200 text-sm flex items-center gap-2">
                        <X className="w-4 h-4" />
                        {authForm.error}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={authForm.isLoading}
                    className="w-full bg-black border border-gray-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {authForm.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5" />
                        Verify OTP
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAuthStep('phone')}
                    className="w-full text-gray-400 hover:text-white py-2 transition-colors"
                  >
                    ← Back to phone number
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Project Upload Modal */}
      {showUpload && (
        <ProjectUpload
          isOpen={showUpload}
          onClose={() => {
            setShowUpload(false);
            setEditingProject(null);
          }}
          onSubmit={editingProject ? handleEditProject : handleAddProject}
          editingProject={editingProject}
        />
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={showProjectDetail}
        onClose={() => {
          setShowProjectDetail(false);
          setSelectedProject(null);
        }}
        onShare={handleShareProject}
        isAdmin={isAuthenticated}
      />

      {/* Share Modal */}
      <ShareModal
        project={sharingProject}
        isOpen={showShare}
        onClose={() => {
          setShowShare(false);
          setSharingProject(null);
        }}
      />
    </div>
  );
}

// Featured Projects Slideshow Component
const FeaturedSlideshow: React.FC<{
  projects: Project[];
  onProjectClick: (project: Project) => void;
}> = ({ projects, onProjectClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (projects.length === 0) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
        setIsTransitioning(false);
      }, 150);
    }, 4000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const handleIndicatorClick = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  if (projects.length === 0) return null;

  const currentProject = projects[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Star className="w-6 h-6 text-gray-400" />
        <h3 className="text-2xl font-bold text-white">Featured Projects</h3>
      </div>
      
      {/* Slideshow Container */}
      <div className="glass rounded-xl border border-gray-600 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-500/20">
        {/* Image Section */}
        <div 
          className={`relative h-64 cursor-pointer overflow-hidden transition-all duration-300 ${isTransitioning ? 'opacity-90 scale-95' : 'opacity-100 scale-100'}`}
          onClick={() => onProjectClick(currentProject)}
        >
          <img
            src={currentProject.image}
            alt={currentProject.title} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          
          {/* Featured Badge */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg hover:bg-black/90 transition-all duration-300">
            <Sparkles className="w-3 h-3 text-white" />
            Featured
          </div>
        </div>
        
        {/* Project Info Below Image */}
        <div className={`p-6 bg-gray-900/20 backdrop-blur-sm transition-all duration-300 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
          <h4 className="text-xl font-bold text-white mb-3 hover:text-gray-200 transition-colors duration-300">
            {currentProject.title}
          </h4>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {currentProject.description}
          </p>
          
          {/* Technologies - Show only 3 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentProject.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-xs font-medium border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                {tech}
              </span>
            ))}
            {currentProject.technologies.length > 3 && (
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium border border-gray-500 hover:bg-gray-600 transition-all duration-300">
                +{currentProject.technologies.length - 3} more
              </span>
            )}
          </div>
          
          {/* Slideshow Indicators */}
          <div className="flex justify-center space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleIndicatorClick(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-500 hover:scale-125 ${
                  index === currentIndex 
                    ? 'bg-white w-6 shadow-lg shadow-white/50' 
                    : 'bg-gray-500 hover:bg-gray-400 hover:w-4'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;