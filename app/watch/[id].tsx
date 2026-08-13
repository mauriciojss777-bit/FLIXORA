'use client';

export const dynamic = 'force-dynamic';

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
  is_short?: boolean;
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
    <div className="w-full max-w-full flex flex-col justify-center items-center overflow-hidden bg-transparent box-border">
      <div ref={containerRef} className="flex justify-center items-center w-full max-w-full h-[250px] overflow-hidden" />
    </div>
  );
}

function AdsterraNativeBlock({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://pl30814143.effectivecpmnetwork.com/${zoneId}/invoke.js`;

    const innerDiv = document.createElement('div');
    innerDiv.id = `container-${zoneId}`;

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(innerDiv);
  }, [zoneId]);

  return (
    <div className="w-full max-w-full flex justify-center items-center overflow-hidden bg-transparent my-2 box-border">
      <div ref={containerRef} className="w-full max-w-full flex justify-center items-center overflow-hidden" />
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
  const [isShortVideo, setIsShortVideo] = useState(false);

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
      const savedHistory = localStorage.getItem('flixora_history');
      if (savedHistory) {
        try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
      }
      const savedWatchLater = localStorage.getItem('flixora_watch_later');
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
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(24);
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
    localStorage.setItem('flixora_history', JSON.stringify(updatedHistory));
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
    localStorage.setItem('flixora_watch_later', JSON.stringify(updated));
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
      description: description || 'Disfruta de este contenido en alta definición disponible in Flixora.',
      tags: parsedTags.length > 0 ? parsedTags : [category, 'HD'],
      is_short: isShortVideo
    }]);
    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setVideoTagsInput('HD, Latino, Casero'); setIsShortVideo(false); setAdminPassword('');
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
      <div className="min-h-screen bg-black flex items-center justify-center p-6 w-full max-w-[100vw] overflow-x-hidden box-border">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6">
          <h1 className="text-4xl font-black text-white tracking-tight">FLI<span className="text-amber-500">XORA</span></h1>
          <p className="text-xs text-zinc-400">Este sitio contiene material para adultos. Debes ser mayor de edad para ingresar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition-colors">INGRESAR</button>
        </div>
      </div>
    );
  }

  const filteredVideos = videos
    .filter(v => {
      const matchesTag = activeTag === 'Todos' || v.category === activeTag || (Array.isArray(v.tags) && v.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));
      const query = searchQuery.toLowerCase();
      const matchesSearch = v.title.toLowerCase().includes(query) || 
                            (v.category && v.category.toLowerCase().includes(query)) ||
                            (Array.isArray(v.tags) && v.tags.some(t => t.toLowerCase().includes(query)));
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  const horizontalVideos = filteredVideos.filter(v => !v.is_short);
  const verticalShorts = filteredVideos.filter(v => v.is_short);

  return (
    <main className={`min-h-screen ${isCinemaMode ? 'bg-black' : 'bg-[#0f0f0f]'} text-zinc-200 flex flex-col justify-between w-full max-w-[100vw] overflow-x-hidden box-border`}>
      <div className="w-full max-w-full p-4 md:p-6 space-y-6 box-border">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 p-4 rounded-2xl w-full max-w-full box-border">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleCloseVideo}>
            <h1 className="text-2xl font-black tracking-wider text-white">FLI<span className="text-amber-500">XORA</span></h1>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowWatchLaterModal(true)} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors">
              Ver más tarde ({watchLater.length})
            </button>
            <button onClick={() => setShowStore(true)} className="bg-amber-500 text-black hover:bg-amber-400 text-xs font-black px-3 py-2 rounded-xl transition-colors">
              Tienda 🛍️
            </button>
          </div>
        </header>

        {/* REPRODUCTOR DE VIDEO O SECCIÓN PRINCIPAL */}
        {selectedVideo ? (
          <div className="space-y-4 w-full max-w-full box-border">
            <div className="flex justify-between items-center">
              <button onClick={handleCloseVideo} className="text-xs font-bold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl text-zinc-300">
                ← Volver al inicio
              </button>
              <div className="flex items-center space-x-2">
                <button onClick={() => setIsCinemaMode(!isCinemaMode)} className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-300">
                  {isCinemaMode ? 'Modo Normal' : 'Modo Cine 🎬'}
                </button>
              </div>
            </div>

            {/* CONTENEDOR DEL VIDEO PRINCIPAL */}
            <div className={`w-full max-w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black flex justify-center items-center ${selectedVideo.is_short ? 'max-w-sm mx-auto aspect-[9/16]' : 'aspect-video'}`}>
              <iframe 
                src={selectedVideo.voe_url} 
                className="w-full h-full border-0" 
                allowFullScreen 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* INFORMACIÓN DEL VIDEO */}
            <div className="bg-zinc-950 border border-zinc-800/80 p-4 md:p-6 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white">{selectedVideo.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1">Categoría: <span className="text-amber-500 font-bold">{selectedVideo.category}</span></p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleLike(selectedVideo.id)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${userLikedMap[selectedVideo.id] ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}
                  >
                    <span>❤️</span>
                    <span>{(likesMap[selectedVideo.id] || 0) + (selectedVideo.likes || 0)}</span>
                  </button>
                  <button onClick={() => handleShare(selectedVideo)} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold">
                    Compartir 🔗
                  </button>
                  <button onClick={(e) => toggleWatchLater(selectedVideo, e)} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold">
                    {watchLater.some(v => v.id === selectedVideo.id) ? 'Guardado ✓' : 'Guardar +'}
                  </button>
                </div>
              </div>

              {selectedVideo.description && (
                <p className="text-xs md:text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                  {selectedVideo.description}
                </p>
              )}

              {/* ANUNCIO ADSTERRA EN VIDEO */}
              <div className="py-4 flex justify-center w-full max-w-full overflow-hidden">
                <AdsterraBlock zoneId="8938927" />
              </div>

              {/* SECCIÓN DE COMENTARIOS */}
              <div className="pt-4 border-t border-zinc-800 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Comentarios</h3>
                
                <form onSubmit={(e) => handleAddComment(selectedVideo.id, e)} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Tu nombre (opcional)" 
                    value={newCommentUser} 
                    onChange={(e) => setNewCommentUser(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <textarea 
                    placeholder="Escribe un comentario..." 
                    value={newCommentText} 
                    onChange={(e) => setNewCommentText(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                  <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs px-5 py-2.5 rounded-xl transition-colors">
                    Comentar
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {(commentsMap[selectedVideo.id] || commentsMap['default']).map((c) => (
                    <div key={c.id} className="bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-500">{c.user}</span>
                        <span className="text-[10px] text-zinc-500">{c.created_at}</span>
                      </div>
                      <p className="text-xs text-zinc-300">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* LISTADO PRINCIPAL (INICIO) */
          <div className="space-y-6 w-full max-w-full box-border">
            
            {/* BUSCADOR Y FILTROS */}
            <div className="flex flex-col md:flex-row gap-3 w-full max-w-full">
              <input 
                type="text" 
                placeholder="Buscar videos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <select 
                value={sortBy} 
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                <option value="recent">Más recientes</option>
                <option value="popular">Más populares</option>
                <option value="likes">Más gustados</option>
              </select>
            </div>

            {/* ETIQUETAS */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
              {defaultTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${activeTag === tag ? 'bg-amber-500 text-black' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* ÁREA DE SHORTS (VERTICALES) */}
            {verticalShorts.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>⚡ Shorts Verticales</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-full">
                  {verticalShorts.map(video => (
                    <div 
                      key={video.id} 
                      onClick={() => handleSelectVideo(video)}
                      className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all group flex flex-col"
                    >
                      <div className="aspect-[9/16] w-full relative bg-zinc-900 overflow-hidden">
                        <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded">Short</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-white line-clamp-2">{video.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ÁREA DE VIDEOS HORIZONTALES */}
            <div className="space-y-3">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>🎬 Videos Horizontales</span>
              </h2>
              {loading ? (
                <div className="text-center py-12 text-xs text-zinc-500">Cargando contenido...</div>
              ) : horizontalVideos.length === 0 ? (
                <div className="text-center py-12 text-xs text-zinc-500">No se encontraron videos disponibles.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-full">
                  {horizontalVideos.map(video => (
                    <div 
                      key={video.id} 
                      onClick={() => handleSelectVideo(video)}
                      className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all group flex flex-col"
                    >
                      <div className="aspect-video w-full relative bg-zinc-900 overflow-hidden">
                        <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-white line-clamp-2">{video.title}</h3>
                        <div className="flex justify-between items-center text-[10px] text-zinc-400">
                          <span className="text-amber-500 font-bold">{video.category}</span>
                          <span>❤️ {video.likes || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ANUNCIO NATIVO ADSTERRA */}
            <div className="py-4 w-full max-w-full overflow-hidden flex justify-center">
              <AdsterraNativeBlock zoneId="8938927" />
            </div>

          </div>
        )}

      </div>

      {/* FOOTER & MODAL DE TIENDA / ADMIN */}
      <footer className="w-full max-w-full text-center py-6 text-xs text-zinc-600 border-t border-zinc-900 mt-8 box-border">
        <p>Flixora © 2026 — Todos los derechos reservados.</p>
        <button onClick={() => setShowAdminModal(true)} className="text-[10px] text-zinc-700 hover:text-zinc-400 mt-2 underline">
          Panel de Administración
        </button>
      </footer>

      {/* MODAL DE ADMIN PARA SUBIR VIDEOS */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-sm font-black text-white">Subir Nuevo Video</h3>
            <form onSubmit={handleSaveVideo} className="space-y-3">
              <input type="password" placeholder="Contraseña Admin" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <input type="text" placeholder="URL del video (Voe)" value={voeUrl} onChange={(e) => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <input type="text" placeholder="URL de la portada (Cover)" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <textarea placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white resize-none" />
              <input type="text" placeholder="Etiquetas (separadas por coma)" value={videoTagsInput} onChange={(e) => setVideoTagsInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              
              <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer pt-1">
                <input type="checkbox" checked={isShortVideo} onChange={(e) => setIsShortVideo(e.target.checked)} className="rounded bg-zinc-900 border-zinc-800 text-amber-500 focus:ring-0" />
                <span>¿Es un Short vertical (9:16)?</span>
              </label>

              <div className="flex space-x-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="flex-1 bg-zinc-900 text-zinc-300 font-bold py-3 rounded-xl text-xs">Cancelar</button>
                <button type="submit" className="flex-1 bg-amber-500 text-black font-black py-3 rounded-xl text-xs">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE TIENDA */}
      {showStore && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white">Tienda de Productos 🛍️</h3>
              <button onClick={() => setShowStore(false)} className="text-xs text-zinc-400 hover:text-white">✕ Cerrar</button>
            </div>
            
            <div className="space-y-3">
              {products.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">No hay productos en la tienda por ahora.</p>
              ) : (
                products.map(prod => (
                  <div key={prod.id} className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <img src={prod.image_url} alt={prod.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{prod.title}</h4>
                        <span className="text-xs text-amber-500 font-black">{prod.price}</span>
                      </div>
                    </div>
                    <a href={prod.buy_url} target="_blank" rel="noopener noreferrer" className="bg-amber-500 text-black text-xs font-bold px-4 py-2 rounded-xl">
                      Comprar
                    </a>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => { setShowStore(false); setShowAdminProd(true); }} className="w-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 py-2 rounded-xl">
              + Agregar producto (Admin)
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE VER MÁS TARDE */}
      {showWatchLaterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white">Videos guardados para ver más tarde</h3>
              <button onClick={() => setShowWatchLaterModal(false)} className="text-xs text-zinc-400 hover:text-white">✕ Cerrar</button>
            </div>
            <div className="space-y-2">
              {watchLater.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8">No tienes ningún video guardado.</p>
              ) : (
                watchLater.map(video => (
                  <div key={video.id} onClick={() => { setSelectedVideo(video); setShowWatchLaterModal(false); }} className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 p-2 rounded-xl cursor-pointer hover:border-amber-500">
                    <div className="flex items-center space-x-3">
                      <img src={video.cover_url} alt={video.title} className="w-16 h-9 rounded object-cover" />
                      <span className="text-xs font-bold text-white line-clamp-1">{video.title}</span>
                    </div>
                    <button onClick={(e) => toggleWatchLater(video, e)} className="text-xs text-red-400 px-2 py-1">Quitar</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADMIN PRODUCTOS */}
      {showAdminProd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-sm font-black text-white">Agregar Producto a Tienda</h3>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <input type="password" placeholder="Contraseña Admin" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <input type="text" placeholder="Título del producto" value={prodTitle} onChange={(e) => setProdTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <input type="text" placeholder="Precio (ej: $9.99)" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <input type="text" placeholder="URL de la imagen" value={prodImage} onChange={(e) => setProdImage(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              <input type="text" placeholder="URL de compra" value={prodBuyUrl} onChange={(e) => setProdBuyUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white" />
              
              <div className="flex space-x-2 pt-2">
                <button type="button" onClick={() => setShowAdminProd(false)} className="flex-1 bg-zinc-900 text-zinc-300 font-bold py-3 rounded-xl text-xs">Cancelar</button>
                <button type="submit" className="flex-1 bg-amber-500 text-black font-black py-3 rounded-xl text-xs">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}

