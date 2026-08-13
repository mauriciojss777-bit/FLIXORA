'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Script from 'next/script';
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
  views?: number;
  likes?: number;
  created_at?: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  buy_url: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  created_at: string;
}

function AdsterraBlock({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.text = `
      atOptions = {
        'key' : '${zoneId}',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${zoneId}/invoke.js`;

    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, [zoneId]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center overflow-hidden bg-transparent">
      <div ref={containerRef} className="flex justify-center items-center w-[300px] h-[250px]" />
    </div>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'likes'>('recent');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showAdminProd, setShowAdminProd] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showWatchLaterModal, setShowWatchLaterModal] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [history, setHistory] = useState<Video[]>([]);
  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});

  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HD');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [videoTagsInput, setVideoTagsInput] = useState('HD, Latino, Casero');

  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBuyUrl, setProdBuyUrl] = useState('');

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    default: [
      { id: '1', user: 'Carlos99', text: 'Excelente calidad de video, gracias por compartir!', created_at: 'Hace 2 horas' },
      { id: '2', user: 'FoxyUser', text: 'Muy buen aporte bro.', created_at: 'Hace 5 horas' }
    ]
  });
  const [newCommentUser, setNewCommentUser] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const defaultTags = ['Todos', 'Destacados', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR', 'Rubias', 'Morochas', 'Jovencitas', 'Caseros'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('age_verified') === 'true') {
        setAgeAccepted(true);
      }
      const savedHistory = localStorage.getItem('flixes_history');
      if (savedHistory) {
        try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
      }
      const savedWatchLater = localStorage.getItem('flixes_watch_later');
      if (savedWatchLater) {
        try { setWatchLater(JSON.parse(savedWatchLater)); } catch (e) {}
      }
    }
    fetchVideos();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      document.title = `${selectedVideo.title} | Flixes`;
    } else {
      document.title = 'Flixes - Streaming Pro';
    }
  }, [selectedVideo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('v');
    if (vId && videos.length > 0) {
      const video = videos.find(v => v.id === vId);
      if (video) {
        setSelectedVideo(video);
      }
    }
  }, [videos]);

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

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } catch (e) { console.error(e); }
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPipActive(false);
    window.history.pushState(null, '', `?v=${video.id}`);
    
    const updatedHistory = [video, ...history.filter(h => h.id !== video.id)].slice(0, 15);
    setHistory(updatedHistory);
    localStorage.setItem('flixes_history', JSON.stringify(updatedHistory));
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setIsPipActive(false);
    setIsCinemaMode(false);
    window.history.pushState(null, '', '/');
  };

  const toggleWatchLater = (video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = watchLater.some(v => v.id === video.id);
    let updated: Video[];
    if (exists) {
      updated = watchLater.filter(v => v.id !== video.id);
    } else {
      updated = [video, ...watchLater];
    }
    setWatchLater(updated);
    localStorage.setItem('flixes_watch_later', JSON.stringify(updated));
  };

  const handleNextVideo = () => {
    if (!selectedVideo || videos.length === 0) return;
    const currentIndex = videos.findIndex(v => v.id === selectedVideo.id);
    const nextVideo = videos[(currentIndex + 1) % videos.length];
    handleSelectVideo(nextVideo);
  };

  const handleLike = (videoId: string) => {
    const currentLikes = likesMap[videoId] || 0;
    const isLiked = userLikedMap[videoId];
    setLikesMap({ ...likesMap, [videoId]: isLiked ? currentLikes - 1 : currentLikes + 1 });
    setUserLikedMap({ ...userLikedMap, [videoId]: !isLiked });
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }
    const parsedTags = videoTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from('videos').insert([{ 
      title, 
      category, 
      voe_url: voeUrl, 
      cover_url: coverUrl,
      description: description || 'Disfruta de este contenido en alta definición disponible en Flixes.',
      tags: parsedTags.length > 0 ? parsedTags : [category, 'HD']
    }]);
    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setVideoTagsInput('HD, Latino, Casero'); setAdminPassword('');
      fetchVideos();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }
    const { error } = await supabase.from('products').insert([{ 
      title: prodTitle, 
      price: prodPrice, 
      image_url: prodImage, 
      buy_url: prodBuyUrl 
    }]);
    
    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminProd(false);
      setProdTitle(''); setProdPrice(''); setProdImage(''); setProdBuyUrl(''); setAdminPassword('');
      fetchProducts();
      alert('¡Producto agregado con éxito!');
    }
  };

  const handleShare = (video: Video) => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: video.title, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleAddComment = (videoId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const commentItem: Comment = {
      id: Date.now().toString(),
      user: newCommentUser.trim() || 'Anónimo',
      text: newCommentText.trim(),
      created_at: 'Justo ahora'
    };
    const currentList = commentsMap[videoId] || commentsMap['default'];
    setCommentsMap({
      ...commentsMap,
      [videoId]: [commentItem, ...currentList]
    });
    setNewCommentText('');
    setNewCommentUser('');
  };

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6">
          <h1 className="text-4xl font-black text-white tracking-tight">FLI<span className="text-amber-500">XES</span></h1>
          <p className="text-xs text-zinc-400">Este sitio contiene material para adultos. Debes ser mayor de edad para ingresar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition-colors">INGRESAR</button>
        </div>
      </div>
    );
  }

  const filteredVideos = videos
    .filter(v => {
      const matchesTag = activeTag === 'Todos' || v.category === activeTag || (v.tags && v.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));
      const query = searchQuery.toLowerCase();
      const matchesSearch = v.title.toLowerCase().includes(query) || 
                            (v.category && v.category.toLowerCase().includes(query)) ||
                            (v.tags && v.tags.some(t => t.toLowerCase().includes(query)));
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  return (
    <main className={`min-h-screen ${isCinemaMode ? 'bg-black' : 'bg-[#0f0f0f]'} text-zinc-200 flex flex-col justify-between transition-colors duration-300`}>
      <div>
        <nav className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMenu(true)} 
              className="text-zinc-200 hover:bg-zinc-800 p-2 rounded-xl transition-colors focus:outline-none"
              aria-label="Abrir Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-black text-white cursor-pointer tracking-tight" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); }}>
              FLI<span className="text-amber-500">XES</span>
            </h1>
          </div>

          <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Buscar en Flixes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-[#141414] border border-zinc-700 pl-4 pr-10 py-2 rounded-full text-sm text-zinc-200 focus:border-amber-500 outline-none" 
              />
              <button className="absolute right-3 top-2.5 text-zinc-400">🔍</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowWatchLaterModal(true)} className="relative bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3.5 py-1.5 rounded-full font-bold border border-zinc-700 transition-all">
              ⭐ Guardados {watchLater.length > 0 && <span className="ml-1 bg-amber-500 text-black px-1.5 py-0.2 rounded-full text-[10px] font-black">{watchLater.length}</span>}
            </button>
            <button onClick={() => setShowDonateModal(true)} className="bg-amber-500 hover:bg-amber-400 text-black text-xs px-3.5 py-1.5 rounded-full font-black transition-all">☕ Donar</button>
            <button onClick={() => { setShowStore(true); fetchProducts(); }} className="bg-zinc-800 text-amber-400 text-xs px-3.5 py-1.5 rounded-full font-bold border border-zinc-700 hover:bg-zinc-700 transition-all">🛍️ Tienda</button>
            <button onClick={() => setShowAdminModal(true)} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-1.5 rounded-full border border-zinc-700 font-bold transition-all">+ SUBIR</button>
          </div>
        </nav>

        {showMenu && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
            <div className="relative bg-[#0f0f0f] border-r border-zinc-800 w-80 h-full p-6 flex flex-col z-10 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h2 className="text-lg font-black text-white tracking-wider">MENÚ PRINCIPAL</h2>
                <button onClick={() => setShowMenu(false)} className="text-zinc-400 hover:text-white p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-2 text-sm font-semibold">
                <button onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🏠 Inicio</button>
                <button onClick={() => { setShowWatchLaterModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">⭐ Lista de Guardados ({watchLater.length})</button>
                <button onClick={() => { setShowStore(true); setShowMenu(false); fetchProducts(); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🛍️ Tienda / Recomendados</button>
                <button onClick={() => { setShowDonateModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">☕ Apóyame con una Donación</button>
                <button onClick={() => { alert(history.length > 0 ? `Tienes ${history.length} videos en tu historial reciente.` : 'No hay historial reciente.'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">⏱️ Historial Reciente ({history.length})</button>
                <a href="mailto:umbrellaholdings.global@gmail.com" className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📢 Contacto y Publicidad</a>
                
                <div className="pt-2 border-t border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 px-3 tracking-wider">Categorías</span>
                  {defaultTags.filter(t => t !== 'Todos').map(t => (
                    <button key={t} onClick={() => { setActiveTag(t); setShowMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white">
                      #{t}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full py-3 rounded-2xl bg-amber-500 text-black font-black text-center hover:bg-amber-400">+ Subir Video (Admin)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="px-4 pt-4 pb-2">
          <div className="sm:hidden mb-3">
            <input 
              type="text" 
              placeholder="Buscar por título, categoría o etiqueta..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#121212] border border-zinc-800 p-3 rounded-2xl text-sm focus:border-amber-500 outline-none text-zinc-200" 
            />
          </div>

          <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
              {defaultTags.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeTag === tag ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
              <button onClick={() => setSortBy('recent')} className={`px-2.5 py-1 rounded-lg font-bold transition-all ${sortBy === 'recent' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400 hover:text-white'}`}>Más Recientes</button>
              <button onClick={() => setSortBy('likes')} className={`px-2.5 py-1 rounded-lg font-bold transition-all ${sortBy === 'likes' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400 hover:text-white'}`}>Más Gustados</button>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <div key={n} className="animate-pulse flex flex-col space-y-3">
                  <div className="aspect-video rounded-xl bg-zinc-800"></div>
                  <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
              
              <div className="flex flex-col rounded-2xl bg-zinc-900/95 border border-amber-500/40 p-2 shadow-xl min-h-[280px]">
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Patrocinado</span>
                  <span className="text-[9px] text-zinc-500">Adsterra</span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950">
                  <AdsterraBlock zoneId="df896f70ade366b92d50697ad57088aa" />
                </div>
              </div>

              {filteredVideos.map((video) => {
                const isSaved = watchLater.some(v => v.id === video.id);

                return (
                  <div key={video.id} className="flex flex-col">
                    <div onClick={() => handleSelectVideo(video)} className="group cursor-pointer flex flex-col h-full relative">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                        <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {video.category}
                        </span>

                        <button 
                          onClick={(e) => toggleWatchLater(video, e)}
                          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${isSaved ? 'bg-amber-500 text-black' : 'bg-black/60 text-white hover:bg-black'}`}
                          title={isSaved ? "Quitar de guardados" : "Guardar para después"}
                        >
                          ⭐
                        </button>
                      </div>
                      <div className="mt-3 flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex items-center justify-center flex-shrink-0 text-xs">
                          F
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">{video.title}</h3>
                          <p className="text-xs text-zinc-400 mt-1">Flixes • HD • 👍 {likesMap[video.id] || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {selectedVideo && isPipActive && (
          <div className="fixed bottom-4 right-4 z-50 w-80 bg-zinc-950 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="relative aspect-video w-full bg-black">
              <iframe 
                src={selectedVideo.voe_url} 
                className="w-full h-full border-0" 
                allowFullScreen 
                scrolling="no"
                title={selectedVideo.title}
              />
              <button 
                onClick={() => setIsPipActive(false)} 
                className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors"
              >
                ✕ Expandir
              </button>
            </div>
            <div className="p-3 flex justify-between items-center bg-zinc-900">
              <p className="text-xs font-bold text-white line-clamp-1">{selectedVideo.title}</p>
              <button onClick={handleNextVideo} className="text-amber-400 text-xs font-bold hover:underline">Siguiente ➔</button>
            </div>
          </div>
        )}

        {showWatchLaterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowWatchLaterModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-2xl w-full space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-xl font-black text-white">⭐ Videos Guardados</h2>
                <button onClick={() => setShowWatchLaterModal(false)} className="text-xs text-zinc-400 hover:text-white">CERRAR</button>
              </div>

              {watchLater.length === 0 ? (
                <p className="text-center text-zinc-500 py-8 text-xs">No tienes ningún video guardado en tu lista.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {watchLater.map(v => (
                    <div key={v.id} className="bg-zinc-900 p-2 rounded-xl flex gap-3 items-center border border-zinc-800">
                      <img src={v.cover_url} className="w-20 aspect-video rounded-lg object-cover" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{v.title}</h4>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { handleSelectVideo(v); setShowWatchLaterModal(false); }} className="text-[10px] bg-amber-500 text-black px-2 py-1 rounded font-bold">Ver</button>
                          <button onClick={() => toggleWatchLater(v)} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDonateModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4 text-center" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-black text-white">☕ Apóyame con una Donación</h2>
              <p className="text-xs text-zinc-400">Si te gusta el contenido de Flixes, tu apoyo ayuda a mantener los servidores y traer nuevos videos diariamente.</p>
              <a 
                href="https://paypal.me/TU_USUARIO_PAYPAL" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 rounded-xl text-sm transition-all"
              >
                Donar con PayPal
              </a>
              <button onClick={() => setShowDonateModal(false)} className="w-full text-xs text-zinc-500 hover:text-white py-2">Cancelar</button>
            </div>
          </div>
        )}

        {showStore && (
          <div className="fixed inset-0 z-50 bg-black/95 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-900">
                <div>
                  <h2 className="text-2xl font-black text-white">🛍️ Recomendados y Afiliados</h2>
                  <p className="text-xs text-zinc-400 mt-1">Explora nuestros productos recomendados de Amazon y más.</p>
                </div>
                <div className="flex gap-3 items-center">
                  <button onClick={() => setShowAdminProd(true)} className="text-xs bg-zinc-900 hover:border-amber-500 border border-zinc-800 text-zinc-200 px-4 py-2 rounded-xl font-bold">+ Agregar Producto</button>
                  <button onClick={() => setShowStore(false)} className="bg-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold">CERRAR</button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {products.map(p => (
                  <a key={p.id} href={p.buy_url} target="_blank" rel="noopener noreferrer" className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 hover:border-amber-500 transition-all flex flex-col group">
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-zinc-900 mb-3">
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h3 className="text-sm font-semibold text-white line-clamp-2 flex-grow">{p.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-amber-500 font-black text-sm">{p.price}</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-bold">Ver en Amazon</span>
                    </div>
                  </a>
                ))}
                {products.length === 0 && (
                  <p className="col-span-full text-center text-zinc-500 py-12">No hay productos recomendados todavía.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {showAdminProd && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <form onSubmit={handleSaveProduct} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold text-white">Panel Admin - Producto de Afiliado</h2>
              <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <input type="text" placeholder="Nombre del producto" value={prodTitle} onChange={e => setProdTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <input type="text" placeholder="Precio (ej. $19.99 USD)" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <input type="text" placeholder="URL de la imagen del producto" value={prodImage} onChange={e => setProdImage(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <input type="text" placeholder="Enlace de afiliado (ej. https://amzn.to/...)" value={prodBuyUrl} onChange={e => setProdBuyUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminProd(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700">Cancelar</button>
                <button type="submit" className="w-full p-3 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400">Guardar Afiliado</button>
              </div>
            </form>
          </div>
        )}

        {selectedVideo && !isPipActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md overflow-y-auto" onClick={handleCloseVideo}>
            <div id="video-modal-container" className={`bg-[#0f0f0f] w-full min-h-screen md:min-h-0 ${isCinemaMode ? 'md:max-w-6xl' : 'md:max-w-4xl'} md:rounded-3xl overflow-hidden flex flex-col my-auto border border-zinc-800 transition-all duration-300`} onClick={e => e.stopPropagation()}>
              
              <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsCinemaMode(!isCinemaMode)} className={`px-2.5 py-1 rounded-lg font-bold border ${isCinemaMode ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'}`}>
                    🎬 Modo Cine
                  </button>
                  <button onClick={() => setIsPipActive(true)} className="px-2.5 py-1 rounded-lg font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800">
                    📌 Modo Flotante (PiP)
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 font-semibold select-none">
                    <input type="checkbox" checked={autoPlayNext} onChange={(e) => setAutoPlayNext(e.target.checked)} className="accent-amber-500" />
                    Autoplay Siguiente
                  </label>
                  <button onClick={handleNextVideo} className="bg-amber-500 text-black font-black px-3 py-1 rounded-lg hover:bg-amber-400">
                    Siguiente ➔
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <iframe 
                  src={selectedVideo.voe_url} 
                  className="w-full h-full border-0" 
                  allowFullScreen 
                  scrolling="no"
                  title={selectedVideo.title}
                />
              </div>
              
              <div className="p-4 bg-[#0f0f0f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800">
                <h2 className="font-bold text-white text-base sm:text-lg truncate w-full sm:w-1/2">{selectedVideo.title}</h2>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                  <button 
                    onClick={() => handleLike(selectedVideo.id)}
                    className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-bold transition-colors ${userLikedMap[selectedVideo.id] ? 'bg-amber-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}
                  >
                    👍 {likesMap[selectedVideo.id] || 0}
                  </button>

                  <button 
                    onClick={() => toggleWatchLater(selectedVideo)} 
                    className={`text-xs px-3.5 py-2 rounded-full font-bold border transition-colors ${watchLater.some(v => v.id === selectedVideo.id) ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'}`}
                  >
                    ⭐ {watchLater.some(v => v.id === selectedVideo.id) ? 'Guardado' : 'Guardar'}
                  </button>

                  <button 
                    onClick={() => setShowDonateModal(true)} 
                    className="bg-amber-500 text-black hover:bg-amber-400 text-xs px-4 py-2 rounded-full font-black"
                  >
                    ☕ Donar
                  </button>

                  <button 
                    type="button" 
                    onClick={() => handleShare(selectedVideo)} 
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-2 rounded-full font-bold"
                  >
                    🔗 Compartir
                  </button>

                  <button 
                    type="button" 
                    onClick={handleCloseVideo} 
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-4 py-2 rounded-full font-bold"
                  >
                    CERRAR
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/60 text-xs text-zinc-300 space-y-3">
                <div>
                  <span className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Descripción</span>
                  <p className="mt-1 leading-relaxed text-zinc-200">{selectedVideo.description || 'Disfruta de este contenido en alta definición disponible en Flixes.'}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {(selectedVideo.tags || [selectedVideo.category, 'HD']).map(t => (
                    <button 
                      key={t} 
                      onClick={() => { setActiveTag(t); handleCloseVideo(); }} 
                      className="bg-zinc-800 hover:bg-amber-500 hover:text-black text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full transition-colors"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#0f0f0f] border-t border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Carrusel de Videos Relacionados</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {videos.filter(v => v.id !== selectedVideo.id).map(v => (
                    <div 
                      key={v.id} 
                      onClick={() => {
                        handleSelectVideo(v);
                        const container = document.getElementById('video-modal-container');
                        if (container) container.scrollTop = 0;
                      }} 
                      className="min-w-[160px] max-w-[160px] cursor-pointer group flex-shrink-0"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                        <img src={v.cover_url} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="mt-1 text-xs font-semibold text-zinc-300 line-clamp-1 group-hover:text-amber-400">{v.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 space-y-4">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Comentarios ({(commentsMap[selectedVideo.id] || commentsMap['default']).length})
                </h3>

                <form onSubmit={(e) => handleAddComment(selectedVideo.id, e)} className="space-y-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Tu usuario..." 
                      value={newCommentUser} 
                      onChange={(e) => setNewCommentUser(e.target.value)} 
                      className="w-1/3 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-amber-500" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Añade un comentario..." 
                      value={newCommentText} 
                      onChange={(e) => setNewCommentText(e.target.value)} 
                      className="flex-grow bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-amber-500" 
                    />
                    <button type="submit" className="bg-amber-500 text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-400">Comentar</button>
                  </div>
                </form>

                <div className="space-y-3 pt-2 max-h-48 overflow-y-auto pr-1">
                  {(commentsMap[selectedVideo.id] || commentsMap['default']).map(c => (
                    <div key={c.id} className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/60 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-500">{c.user}</span>
                        <span className="text-[10px] text-zinc-500">{c.created_at}</span>
                      </div>
                      <p className="text-zinc-300">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-black flex justify-center border-t border-zinc-900">
                <AdsterraBlock zoneId="df896f70ade366b92d50697ad57088aa" />
              </div>

            </div>
          </div>
        )}

        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <form onSubmit={handleSaveVideo} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white">Panel Admin - Subir Video</h2>
              <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <input type="text" placeholder="Título del video" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-zinc-300 outline-none focus:border-amber-500">
                {defaultTags.filter(t => t !== 'Todos').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <textarea placeholder="Descripción del video personalizada" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500 resize-none" />
              <input type="text" placeholder="Etiquetas (separadas por coma: HD, Rubias, etc.)" value={videoTagsInput} onChange={e => setVideoTagsInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <input type="text" placeholder="URL StreamHG / Embed del video" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <input type="text" placeholder="URL Portada / Miniatura" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700">Cancelar</button>
                <button type="submit" className="w-full p-3 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400">Publicar</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="bg-black border-t border-zinc-900 py-10 px-4 mt-12 text-center text-xs text-zinc-500 space-y-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <h3 className="text-zinc-300 font-bold uppercase tracking-widest text-sm">AVISO LEGAL</h3>
          <p className="leading-relaxed text-[11px] text-zinc-400">
            Todo el material alojado en esta web es recolectado de sitios web públicos. Flixes es un sitio donde usted encontrará videos caseros, HD, latinos, entre otros. Prohibido el acceso a menores de 18 años.
          </p>
        </div>

        <div className="flex justify-center gap-6 font-semibold text-zinc-400 flex-wrap">
          <a href="#" className="hover:text-amber-500">Política Y privacidad</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500">DMCA</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500">2257</a>
          <span>•</span>
          <a href="mailto:umbrellaholdings.global@gmail.com" className="hover:text-amber-500">Contacto</a>
        </div>

        <p className="text-zinc-600 text-[10px]">© FLIXES.COM 2016-2026</p>
      </footer>
    </main>
  );
}
