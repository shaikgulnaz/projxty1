import React, { useEffect, useState, useRef } from "react";
import {
  TrendingUp,
  Star,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Search,
  Play,
  Share2,
} from "lucide-react";

export type Project = {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  featured?: boolean;
  technologies: string[];
  category?: string;
};

export const HomePage = ({
  projects = [],
  stats = { total: 0, featured: 0, categories: 0 },
  featuredProjects = [],
  onNavigateToProjects = () => {},
  onProjectClick = () => {},
  onShareProject = () => {},
}: any) => {
  // local state
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto advance featured carousel for desktop preview
    const id = setInterval(() => {
      setCarouselIndex((i) => (featuredProjects.length ? (i + 1) % featuredProjects.length : 0));
    }, 4500);
    return () => clearInterval(id);
  }, [featuredProjects.length]);

  useEffect(() => {
    // close menu on resize
    const handler = () => setMenuOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const filtered = projects.filter((p: Project) =>
    query.trim()
      ? p.title.toLowerCase().includes(query.toLowerCase()) || p.technologies.join(" ").toLowerCase().includes(query.toLowerCase())
      : true
  );

  // Instagram-like framed container styles
  const frameClasses = "w-full max-w-[680px] sm:max-w-2xl bg-[#1b1b1d] rounded-2xl shadow-2xl border border-gray-800";

  return (
    <div className="min-h-screen bg-[#1b1b1d] text-white antialiased">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#111113] bg-opacity-60 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white">&lt;/&gt;</div>
            <div className="font-semibold text-lg">Projxty</div>
            <nav className="hidden md:flex items-center gap-4 ml-6 text-gray-300">
              <button className="hover:text-white">Home</button>
              <button className="hover:text-white" onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}>Projects</button>
              <button className="hover:text-white">About</button>
              <button className="hover:text-white">Contact</button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1">
              <Search className="w-4 h-4 text-gray-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects or tech..."
                className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400 w-48"
                aria-label="Search projects"
              />
            </div>

            <button className="hidden sm:inline-flex bg-white text-black px-3 py-1.5 rounded-md font-medium" onClick={onNavigateToProjects}>
              Explore
            </button>

            <button className="md:hidden p-2 rounded-md hover:bg-gray-800" onClick={() => setMenuOpen((s) => !s)} aria-label="Toggle menu">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-[#0f0f10]">
            <div className="px-4 py-3 flex flex-col gap-2">
              <button className="text-left" onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button>
              <button className="text-left" onClick={() => { setMenuOpen(false); window.scrollTo({ top: 700, behavior: 'smooth' }); }}>Projects</button>
              <button className="text-left">About</button>
              <button className="text-left">Contact</button>
            </div>
          </div>
        )}
      </header>

      {/* CENTER FRAME (Instagram-like) */}
      <main className="flex items-center justify-center py-12 px-4">
        <div className={`${frameClasses} py-16 px-6 sm:px-10`}> 
          {/* HERO */}
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Code that actually <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-300">slaps</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300">
              Practical, well-documented projects with clean code structure. Fork, learn and ship faster.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={onNavigateToProjects} className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition">
                Explore Projects
                <ArrowRight className="w-4 h-4" />
              </button>

              <button onClick={onNavigateToProjects} className="inline-flex items-center gap-2 border border-gray-700 px-5 py-3 rounded-lg text-gray-200 hover:bg-white/5 transition">
                <TrendingUp className="w-4 h-4" />
                View all {stats.total}
              </button>
            </div>

            {/* small stats row for compact view */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="bg-gray-800 px-3 py-2 rounded-lg text-center">
                <div className="text-sm text-gray-300">Projects</div>
                <div className="font-semibold text-lg">{stats.total}</div>
              </div>
              <div className="bg-gray-800 px-3 py-2 rounded-lg text-center">
                <div className="text-sm text-gray-300">Featured</div>
                <div className="font-semibold text-lg">{stats.featured}</div>
              </div>
              <div className="bg-gray-800 px-3 py-2 rounded-lg text-center">
                <div className="text-sm text-gray-300">Categories</div>
                <div className="font-semibold text-lg">{stats.categories}</div>
              </div>
            </div>
          </section>

          {/* FEATURED DESKTOP PREVIEW + MOBILE CAROUSEL */}
          <section className="mt-12">
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-4">
                {featuredProjects.slice(0, 3).map((p: Project, idx: number) => (
                  <article key={p.id} className={`rounded-xl overflow-hidden border border-gray-800 bg-[#121213] cursor-pointer transform transition hover:scale-[1.02]`} onClick={() => { setActiveProject(p); onProjectClick(p); }}>
                    <div className="relative h-36">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold">{p.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-2 text-xs text-gray-300 flex-wrap">
                          {p.technologies.slice(0, 3).map((t) => (
                            <span key={t} className="px-2 py-1 bg-gray-800 rounded-md">{t}</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">{idx + 1}/{featuredProjects.length}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
              <div ref={carouselRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x py-2">
                {featuredProjects.map((p: Project) => (
                  <article key={p.id} className="min-w-[85%] snap-center rounded-xl overflow-hidden border border-gray-800 bg-[#121213] p-4" onClick={() => { setActiveProject(p); onProjectClick(p); }}>
                    <div className="h-44 mb-3">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover rounded-md" />
                    </div>
                    <h4 className="font-semibold">{p.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* LIVE PROJECT GRID (search results) */}
          <section id="projects" className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Projects</h3>
              <div className="text-sm text-gray-400">Showing {filtered.length} results</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((p: Project) => (
                <div key={p.id} className="bg-[#0f0f10] rounded-xl p-4 border border-gray-800 hover:scale-[1.01] transition" onClick={() => { setActiveProject(p); onProjectClick(p); }}>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                      {p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{p.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {p.technologies.slice(0, 4).map((t: string) => (
                          <span key={t} className="text-xs bg-gray-800 px-2 py-1 rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button className="p-2 rounded-md bg-gray-800" onClick={(e) => { e.stopPropagation(); onShareProject(p); }} aria-label={`Share ${p.title}`}>
                        <Share2 className="w-4 h-4 text-gray-200" />
                      </button>
                      <div className="text-xs text-gray-400 mt-2">{p.category}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA + Footer inside frame */}
          <section className="mt-12 text-center">
            <div className="rounded-lg bg-gradient-to-r from-[#111113] via-[#141416] to-[#111113] p-6">
              <h4 className="font-bold text-lg">Need a custom solution?</h4>
              <p className="text-gray-300 text-sm mt-2">We build production-ready projects and prototypes. Let's chat.</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button className="px-4 py-2 bg-white text-black rounded-md font-semibold">Contact Us</button>
                <button className="px-4 py-2 border border-gray-700 rounded-md text-gray-200">Docs</button>
              </div>
            </div>

            <footer className="mt-6 text-xs text-gray-500">© {new Date().getFullYear()} Projxty • Built with care</footer>
          </section>
        </div>
      </main>

      {/* Project modal */}
      {activeProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-[#0f0f10] rounded-xl overflow-auto">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold">{activeProject.title}</h3>
              <button onClick={() => setActiveProject(null)} className="p-2 rounded-md hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {activeProject.image && <img src={activeProject.image} alt={activeProject.title} className="w-full h-64 object-cover rounded-md mb-4" />}
              <p className="text-gray-300 mb-4">{activeProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {activeProject.technologies.map((t) => (
                  <span key={t} className="text-xs bg-gray-800 px-2 py-1 rounded-md">{t}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white text-black rounded-md">Open Repo</button>
                <button className="px-4 py-2 border border-gray-700 rounded-md text-gray-200">Live demo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
