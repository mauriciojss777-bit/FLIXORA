'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Video {
  id: string;
  title: string;
  category: string;
  voe_url: string;
  cover_url: string;
  description?: string;
  tags?: string[];
  is_short?: boolean;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [adWatched, setAdWatched] = useState(false);
  const nativeAdRef = useRef<HTMLDivElement>(null);

  // Formulario Admin
  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HD');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isShort, setIsShort] = useState(false);

  const defaultTags = ['Todos', 'Shorts XXX', 'Destacados', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR'];

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('age_verified') === 'true') {
      setAgeAccepted(true);
    }
    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo && nativeAdRef.current && !nativeAdRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://pl30814143.effectivecpmnetwork.com/df896f70ade366b92d50697ad57088aa/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      nativeAdRef.current.appendChild(script);
    }
  }, [selectedVideo]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) setVideos(data);
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }
    const { error } = await supabase.from('videos').insert([{ 
      title, 
      category: isShort ? 'Shorts XXX' : category, 
      voe_url: voeUrl, 
      cover_url: coverUrl,
      description: description || 'Video exclusivo en Flixes.',
      tags: [category, isShort ? 'Shorts XXX' : 'HD'],
      is_short: isShort
    }]);

    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setAdminPassword(''); setIsShort(false);
      fetchVideos();
    }
  };

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6 text-white">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6">
          <h1 className="text-4xl font-black text-red-600 tracking-tighter">FLIXES</h1>
          <p className="text-xs text-zinc-400">Contenido restringido para adultos. Confirma tu edad para continuar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-red-600 text-white font-black py-3.5 rounded-xl hover:bg-red-700 transition-colors">SOY MAYOR DE EDAD</button>
        </div>
      </div>
    );
  }

  // Separar Shorts y Videos Normales
  const shortsList = videos.filter(v => v.is_short || v.category === 'Shorts XXX');
  const regularVideos = videos.filter(v => !v.is_short && v.category !== 'Shorts XXX');

  const filteredRegularVideos = regularVideos.filter(v => {
    const matchesTag = activeTag === 'Todos' || activeTag === 'Shorts XXX' || v.category === activeTag;
    const query = searchQuery.toLowerCase();
    return matchesTag && v.title.toLowerCase().includes(query);
  });

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-zinc-100 font-sans">
      {/* HEADER ESTILO YOUTUBE */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/95 border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-300">
            ☰
          </button>
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); setSelectedVideo(null); }}>
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-sm tracking-tighter">▶</span>
            <span className="text-xl font-black tracking-tighter text-white">Flixes</span>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-[#121212] border border-zinc-700 px-4 py-2 rounded-l-full text-sm focus:border-red-600 outline-none" 
          />
          <button className="bg-zinc-800 border border-l-0 border-zinc-700 px-5 py-2 rounded-r-full text-zinc-400">🔍</button>
        </div>

        <button onClick={() => setShowAdminModal(true)} className="bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 px-4 py-2 rounded-full font-bold transition-all">
          + Subir
        </button>
      </header>

      {/* BARRA DE CATEGORÍAS */}
      <nav className="px-4 py-3 border-b border-zinc-800/50 flex gap-2 overflow-x-auto no-scrollbar">
        {defaultTags.map(tag => (
          <button 
            key={tag} 
            onClick={() => setActiveTag(tag)} 
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTag === tag ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {tag === 'Shorts XXX' && <span className="text-red-500 font-bold">⚡</span>}
            {tag}
          </button>
        ))}
      </nav>

      <section className="p-4 max-w-[1800px] mx-auto space-y-8">
        
        {/* SECCIÓN DE SHORTS XXX */}
        {(activeTag === 'Todos' || activeTag === 'Shorts XXX') && shortsList.length > 0 && (
          <div className="space-y-4 border-b border-zinc-800/80 pb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-xl">⚡</span>
              <h2 className="text-lg font-black text-white tracking-tight">Shorts XXX</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {shortsList.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedVideo(s)}
                  className="group cursor-pointer relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-red-600 transition-all"
                >
                  <img src={s.cover_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-red-400">
                      {s.title}
                    </h3>
                    <span className="text-[10px] text-zinc-400 mt-1">Shorts XXX</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REJILLA DE VIDEOS PRINCIPALES */}
        {activeTag !== 'Shorts XXX' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white tracking-tight">Videos recomendados</h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(n => (
                  <div key={n} className="animate-pulse space-y-3">
                    <div className="aspect-video bg-zinc-800 rounded-xl"></div>
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {filteredRegularVideos.map((v) => (
                  <div key={v.id} onClick={() => setSelectedVideo(v)} className="group cursor-pointer flex flex-col">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img src={v.cover_url} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {v.category}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-600 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        F
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                          {v.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">Flixes Official • HD</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* REPRODUCTOR ESTILO MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className={`bg-[#0f0f0f] border border-zinc-800 w-full rounded-2xl overflow-hidden flex flex-col max-h-[95vh] ${selectedVideo.is_short ? 'max-w-md' : 'max-w-4xl'}`}>
            <div className={`relative bg-black ${selectedVideo.is_short ? 'aspect-[9/16]' : 'aspect-video'}`}>
              {!adWatched ? (
                <div className="absolute inset-0 z-10 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-lg font-bold text-white mb-2">Publicidad de reproducción</h3>
                  <button 
                    onClick={() => {
                      window.open('https://www.effectivecpmnetwork.com/u9xtrrbj?key=5e1242fb44358ba404f094359ad59a45', '_blank');
                      setAdWatched(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all"
                  >
                    ▶ Continuar al Video
                  </button>
                </div>
              ) : (
                <iframe src={selectedVideo.voe_url} className="w-full h-full border-0" allowFullScreen title={selectedVideo.title} />
              )}
            </div>

            <div className="p-4 flex justify-between items-center border-b border-zinc-800">
              <h2 className="text-base font-bold text-white truncate max-w-md">{selectedVideo.title}</h2>
              <button onClick={() => { setSelectedVideo(null); setAdWatched(false); }} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 rounded-full text-xs font-bold">
                Cerrar
              </button>
            </div>

            <div ref={nativeAdRef} className="p-2 bg-black flex justify-center"></div>
          </div>
        </div>
      )}

      {/* MODAL ADMIN */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveVideo} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-white">Agregar Video / Short</h2>
            <input type="password" placeholder="Clave Admin" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white" />
            <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white" />
            <input type="text" placeholder="URL VOE" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white" />
            <input type="text" placeholder="URL Miniatura" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white" />
            
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input type="checkbox" checked={isShort} onChange={e => setIsShort(e.target.checked)} className="rounded bg-zinc-950 border-zinc-800 text-red-600 focus:ring-0" />
              ¿Es un Short XXX? (Formato vertical)
            </label>

            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdminModal(false)} className="w-full bg-zinc-800 py-2.5 rounded-xl text-xs font-bold">Cancelar</button>
              <button type="submit" className="w-full bg-red-600 py-2.5 rounded-xl text-xs font-bold text-white">Publicar</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
