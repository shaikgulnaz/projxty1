import React, { useState, useEffect } from 'react';
import { Search, Plus, Code2, Users, Star, TrendingUp, LogOut, Lock, User, Phone, X, Shield, MessageCircle, Sparkles, Menu } from 'lucide-react';
import { ProjectCard } from './components/ProjectCard';
import { ProjectUpload } from './components/ProjectUpload';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ShareModal } from './components/ShareModal';
import { SearchBar } from './components/SearchBar';
import { Project } from './types';
import { useProjects } from './hooks/useProjects';
import { useSearch } from './hooks/useSearch';
import { useDebounce } from './hooks/useDebounce';
import { signInWithOTP, verifyOTP, signOut } from './lib/supabase';

function App() {
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use intelligent search hook
  const { searchResults, isSearching, searchStats } = useSearch({
    projects,
    searchTerm: debouncedSearchTerm,
    selectedCategory
  });
  
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    setShowMobileMenu(false);
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center relative overflow-hidden">
        {/* Simplified background for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-20 left-4 w-20 h-20 bg-white/5 rounded-full blur-xl sm:w-32 sm:h-32 sm:left-10"></div>
          <div className="floating-element absolute top-40 right-4 w-32 h-32 bg-gray-500/10 rounded-full blur-xl sm:w-48 sm:h-48 sm:right-20" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center z-10 px-4">
          <div className="premium-loader mb-6">
            <div className="loader-ring"></div>
            <div className="loader-ring loader-ring-2"></div>
            <div className="loader-center">
              <Code2 className="w-6 h-6 text-white sm:w-8 sm:h-8" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white neon-glow fade-in-up">
              projx
            </h2>
            <p className="text-base sm:text-lg text-white/80 fade-in-up" style={{ animationDelay: '0.3s' }}>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-red-200 max-w-md w-full">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Database Connection Required</h2>
          <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
          <p className="text-gray-600 text-xs sm:text-sm mb-6">Click the "Connect to Supabase" button in the top-right corner to enable database functionality.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">What you'll get with Supabase:</h3>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
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

  const featuredProjects = searchResults.filter(p => p.featured);
  const categories = ['Web Development', 'Mobile App', 'AI/ML', 'Blockchain', 'Computer Vision', 'Cyber Security', 'Others'];

  const stats = {
    total: projects.length,
    featured: projects.filter(p => p.featured).length,
    categories: new Set(projects.map(p => p.category)).size
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Simplified background for mobile performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-4 w-20 h-20 bg-white/5 rounded-full blur-xl sm:w-32 sm:h-32 sm:left-10"></div>
        <div className="floating-element absolute top-40 right-4 w-32 h-32 bg-gray-500/10 rounded-full blur-xl sm:w-48 sm:h-48 sm:right-20" style={{ animationDelay: '2s' }}></div>
        <div className="floating-element absolute bottom-32 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl sm:w-40 sm:h-40" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Mobile-First Header */}
      <header className="glass border-b border-gray-700 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-black border border-gray-600 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
                <Code2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-xl sm:text-3xl font-bold text-white">
                projx
              </h1>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium glass text-gray-300 border border-gray-600">
                  <Shield className="w-3 h-3" />
                  Admin
                </div>
              )}
              
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 bg-black border border-gray-600 text-white rounded-lg hover:bg-gray-900 transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Desktop Auth */}
              <div className="hidden sm:flex items-center space-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 glass rounded-lg hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
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
          
          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="sm:hidden border-t border-gray-700 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300">
                    <Shield className="w-4 h-4" />
                    Admin Mode Active
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white transition-all duration-300 glass rounded-lg hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuth(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 bg-black border border-gray-600 text-white rounded-lg hover:bg-gray-900 transition-all duration-300"
                >
                  <Code2 className="w-5 h-5" />
                  <span>Admin Access</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile-Optimized Hero Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Half - Title and Description */}
            <div className="text-center lg:text-left slide-in">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 neon-glow leading-tight">
                Code That Actually <span className="gradient-text-fire">Slaps</span> 🔥
              </h2>
              <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                No cap - these projects are straight fire! 🚀 From AI that hits different to web apps that go hard. 
                Perfect inspo for your next assignment or side hustle 💯
              </p>
              
              {/* Mobile-Friendly Stats */}
              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={scrollToProjects}
                  className="group glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600 hover:shadow-xl hover:shadow-gray-500/20 transition-all duration-300 transform hover:scale-105 w-full max-w-xs touch-manipulation"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="bg-black border border-gray-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="text-2xl sm:text-3xl font-bold text-white block">{stats.total}</span>
                      <p className="text-xs sm:text-sm text-gray-300">Total Projects</p>
                      <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Tap to explore →
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Right Half - Featured Projects (Hidden on small mobile) */}
            <div className="hidden md:block slide-in" style={{ animationDelay: '200ms' }}>
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
      <main id="projects-section" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Mobile-First Search Section */}
        <section className="mb-8 sm:mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-4 sm:mb-6 slide-in">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                Search & Filter
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Search Bar */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isSearching={isSearching}
                searchStats={searchStats}
                placeholder="Search projects..."
              />
              
              {/* Mobile-Optimized Category Filters */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max px-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap touch-manipulation ${
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
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap touch-manipulation ${
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
              
              {/* Mobile Add Project Button */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setShowUpload(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-black border border-gray-600 text-white rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 touch-manipulation"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Project</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section>
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white slide-in">All Projects</h3>
            <div className="w-16 sm:w-24 h-1 bg-white mx-auto mt-3 sm:mt-4 rounded-full"></div>
            
            {/* Search Results Summary */}
            {(searchTerm || selectedCategory) && (
              <div className="mt-4 text-gray-300 text-sm slide-in" style={{ animationDelay: '0.2s' }}>
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p>
                      Showing {searchResults.length} of {projects.length} projects
                      {searchTerm && ` for "${searchTerm}"`}
                      {selectedCategory && ` in ${selectedCategory}`}
                    </p>
                    {searchStats.searchTime > 0 && (
                      <p className="text-gray-400 text-xs">
                        Search completed in {searchStats.searchTime}ms
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {searchResults.map((project, index) => (
                <div
                  key={project.id}
                  className="slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
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
            <div className="text-center py-12 sm:py-16">
              <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-600 max-w-md mx-auto">
                <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">No projects found</h4>
                <p className="text-gray-300 text-sm sm:text-base">
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

      {/* Mobile-Optimized WhatsApp Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://wa.me/916361064550?text=Hi! I'm interested in your projects and would like to connect."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 touch-manipulation"
          title="Contact on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Mobile-Optimized Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl shadow-2xl w-full max-w-sm border border-gray-600">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-black border border-gray-600 p-2 rounded-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Admin Access</h2>
              </div>
              <button
                onClick={handleAuthClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 touch-manipulation"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {authStep === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="p-4 sm:p-6">
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
                        className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-base"
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
                  className="w-full bg-black border border-gray-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 touch-manipulation"
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
              <form onSubmit={handleOtpSubmit} className="p-4 sm:p-6">
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
                        className="w-full pl-10 pr-4 py-4 glass border border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest text-white placeholder-gray-400"
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
                    className="w-full bg-black border border-gray-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 touch-manipulation"
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
                    className="w-full text-gray-400 hover:text-white py-3 transition-colors touch-manipulation"
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

// Mobile-Optimized Featured Projects Slideshow
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
        <h3 className="text-xl sm:text-2xl font-bold text-white">Featured Projects</h3>
      </div>
      
      {/* Mobile-Optimized Slideshow */}
      <div className="glass rounded-xl border border-gray-600 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-500/20">
        {/* Image Section */}
        <div 
          className={`relative h-48 sm:h-64 cursor-pointer overflow-hidden transition-all duration-300 touch-manipulation ${isTransitioning ? 'opacity-90 scale-95' : 'opacity-100 scale-100'}`}
          onClick={() => onProjectClick(currentProject)}
        >
          <img
            src={currentProject.image}
            alt={currentProject.title} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          
          {/* Featured Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/80 backdrop-blur-sm border border-gray-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-white" />
            Featured
          </div>
        </div>
        
        {/* Project Info */}
        <div className={`p-4 sm:p-6 bg-gray-900/20 backdrop-blur-sm transition-all duration-300 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
          <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 hover:text-gray-200 transition-colors duration-300">
            {currentProject.title}
          </h4>
          <p className="text-gray-300 text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
            {currentProject.description}
          </p>
          
          {/* Technologies - Mobile optimized */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {currentProject.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-xs font-medium border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
            {currentProject.technologies.length > 3 && (
              <span className="px-2 sm:px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium border border-gray-500">
                +{currentProject.technologies.length - 3}
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
                className={`w-2 h-2 rounded-full transition-all duration-500 hover:scale-125 touch-manipulation ${
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