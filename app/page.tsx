'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';

interface Video {
  id: string;
  title: string;
  category: string;
  voe_url: string;
  cover_url: string;
  description?: string;
  tags?: string[] | string;
  views?: number;
  likes?: number;
  created_at?: string;
  is_short?: boolean;
  is_photo?: boolean;
  author?: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  buy_url: string;
  category?: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  created_at: string;
}

interface SocialPost {
  id: string;
  user: string;
  content: string;
  media_url?: string;
  likes: number;
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
    <div className="w-full flex flex-col justify-center items-center overflow-hidden bg-transparent my-3">
      <div ref={containerRef} className="flex justify-center items-center max-w-full overflow-hidden" />
    </div>
  );
}

function DraggableAdPopup({ zoneId }: { zoneId: string }) {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || minimized || !isVisible) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://pl30814143.effectivecpmnetwork.com/${zoneId}/invoke.js`;

    const innerDiv = document.createElement('div');
    innerDiv.id = `container-draggable-${zoneId}`;

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(innerDiv);
  }, [zoneId, minimized, isVisible]);

  if (!isVisible) return null;

  const handleTouchStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const handleTouchMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragOffset.x,
      y: clientY - dragOffset.y
    });
  };

  return (
    <div 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-50 bg-zinc-950/95 border border-zinc-700 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-shadow select-none max-w-[280px]"
    >
      <div 
        className="bg-zinc-900 px-3 py-1.5 flex items-center justify-between cursor-move border-b border-zinc-800"
        onMouseDown={(e) => handleTouchStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleTouchMove(e.clientX, e.clientY)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleTouchMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
          <span>📌</span> Patrocinado
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setMinimized(!minimized)} 
            className="text-zinc-400 hover:text-white text-xs px-1 font-bold"
          >
            {minimized ? '+' : '−'}
          </button>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-zinc-400 hover:text-red-400 text-xs px-1 font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="p-2 flex flex-col items-center justify-center bg-black/40">
          <div ref={containerRef} className="w-full flex justify-center items-center min-h-[120px]" />
        </div>
      )}
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
  const [adminTab, setAdminTab] = useState<'video' | 'photo' | 'afiliado'>('video');
  const [showStore, setShowStore] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showWatchLaterModal, setShowWatchLaterModal] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [currentUsername, setCurrentUsername] = useState('MiUsuario');
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [showSocialFeed, setShowSocialFeed] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [newPostText, setNewPostText] = useState('');

  const [chatMessages, setChatMessages] = useState<Comment[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [history, setHistory] = useState<Video[]>([]);
  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);

  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});
  const [viewsMap, setViewsMap] = useState<Record<string, number>>({});

  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HD');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [videoTagsInput, setVideoTagsInput] = useState('HD, Latino, Casero');
  const [isShortVideo, setIsShortVideo] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoTitleInput, setPhotoTitleInput] = useState('');

  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodUrl, setProdUrl] = useState('');

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [newCommentText, setNewCommentText] = useState('');

  const defaultTags = ['Todos', 'Destacados', 'Fotos', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR', 'Rubias', 'Morochas', 'Caseros'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('age_verified') === 'true') {
        setAgeAccepted(true);
      }
      const savedUser = localStorage.getItem('flixxes_username');
      if (savedUser) setCurrentUsername(savedUser);

      const savedHistory = localStorage.getItem('flixxes_history');
      if (savedHistory) {
        try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
      }
      const savedWatchLater = localStorage.getItem('flixxes_watch_later');
      if (savedWatchLater) {
        try { setWatchLater(JSON.parse(savedWatchLater)); } catch (e) { console.error(e); }
      }

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      });
    }
    fetchVideos();
    fetchProducts();
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('Para instalar la app, toca los tres puntos de tu navegador y selecciona "Instalar aplicación" o "Agregar a la pantalla principal".');
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) {
        const enriched = data.map(v => ({ ...v, author: v.author || 'FlixxesOfficial' }));
        setVideos(enriched);
        const vMap: Record<string, number> = {};
        data.forEach(v => {
          vMap[v.id] = v.views || 0;
        });
        setViewsMap(vMap);
      }
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
    }
  };

  const incrementRealView = async (videoId: string) => {
    try {
      const currentViews = viewsMap[videoId] !== undefined ? viewsMap[videoId] : 0;
      const newViews = currentViews + 1;
      setViewsMap(prev => ({ ...prev, [videoId]: newViews }));
      await supabase.from('videos').update({ views: newViews }).eq('id', videoId);
    } catch (e) {
      console.error(e);
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
    incrementRealView(video.id);
    
    const updatedHistory = [video, ...history.filter(h => h.id !== video.id)].slice(0, 15);
    setHistory(updatedHistory);
    localStorage.setItem('flixxes_history', JSON.stringify(updatedHistory));
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setIsPipActive(false);
    setIsCinemaMode(false);
    window.history.pushState(null, '', window.location.pathname);
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
    localStorage.setItem('flixxes_watch_later', JSON.stringify(updated));
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

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }

    try {
      if (adminTab === 'video') {
        if (!title || !voeUrl) {
          alert('Por favor completa el título y la URL del video');
          return;
        }
        const tagsArray = videoTagsInput.split(',').map(t => t.trim()).filter(Boolean);
        const { error } = await supabase.from('videos').insert([{
          title,
          category,
          voe_url: voeUrl,
          cover_url: coverUrl || DEFAULT_COVER_IMAGE,
          description,
          tags: tagsArray,
          is_short: isShortVideo,
          is_photo: false,
          author: currentUsername
        }]);
        if (error) throw error;
        alert('¡Video agregado con éxito!');
        setTitle('');
        setVoeUrl('');
        setCoverUrl('');
        setDescription('');
      } else if (adminTab === 'photo') {
        if (!photoTitleInput || !photoUrlInput) {
          alert('Completa el título y la URL de la foto');
          return;
        }
        const { error } = await supabase.from('videos').insert([{
          title: photoTitleInput,
          category: 'Fotos',
          voe_url: photoUrlInput,
          cover_url: photoUrlInput,
          is_photo: true,
          is_short: false,
          author: currentUsername
        }]);
        if (error) throw error;
        alert('¡Foto agregada con éxito!');
        setPhotoTitleInput('');
        setPhotoUrlInput('');
      } else if (adminTab === 'afiliado') {
        if (!prodTitle || !prodPrice || !prodUrl) {
          alert('Completa los campos del producto');
          return;
        }
        const { error } = await supabase.from('products').insert([{
          title: prodTitle,
          price: prodPrice,
          image_url: prodImage || DEFAULT_COVER_IMAGE,
          buy_url: prodUrl
        }]);
        if (error) throw error;
        alert('¡Producto de afiliado agregado con éxito!');
        setProdTitle('');
        setProdPrice('');
        setProdImage('');
        setProdUrl('');
      }
      fetchVideos();
      fetchProducts();
      setShowAdminModal(false);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    }
  };

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 w-full">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
          <h1 className="text-4xl font-black text-white tracking-tight">FLIX<span className="text-blue-500">XES</span></h1>
          <p className="text-xs text-zinc-400">Este sitio contiene material para adultos. Debes ser mayor de edad para ingresar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-colors">INGRESAR</button>
        </div>
      </div>
    );
  }

  const filteredVideos = videos.filter(v => {
    const vTags = Array.isArray(v.tags) ? v.tags : (v.tags ? [String(v.tags)] : []);
    const matchesTag = activeTag === 'Todos' || (activeTag === 'Fotos' ? v.is_photo : (v.category === activeTag || vTags.some(t => t.toLowerCase() === activeTag.toLowerCase())));
    const query = searchQuery.toLowerCase();
    const matchesSearch = v.title.toLowerCase().includes(query) || (v.category && v.category.toLowerCase().includes(query));
    return matchesTag && matchesSearch;
  });

  const horizontalVideos = filteredVideos.filter(v => !v.is_short && !v.is_photo);
  const photoGallery = filteredVideos.filter(v => v.is_photo);
  const verticalShorts = filteredVideos.filter(v => v.is_short);

  return (
    <main className={`min-h-screen ${isCinemaMode ? 'bg-black' : 'bg-[#0f0f0f]'} text-zinc-200 flex flex-col justify-between w-full max-w-[100vw] overflow-x-hidden`}>
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        
        {/* BARRA SUPERIOR */}
        <nav className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMenu(true)} className="text-zinc-200 hover:bg-zinc-800 p-2 rounded-xl transition-colors">
              ☰ Menú
            </button>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-black text-white cursor-pointer" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); }}>
              FLIX<span className="text-blue-500">XES</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowChatDrawer(true)} className="bg-zinc-800 text-xs px-3 py-1.5 rounded-full font-bold">💬 Chat</button>
          </div>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-4 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {defaultTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTag === tag ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-zinc-500">Cargando contenido...</div>
          ) : (
            <div className="space-y-8">
              {horizontalVideos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Videos Destacados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {horizontalVideos.map(video => (
                      <div key={video.id} onClick={() => handleSelectVideo(video)} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden group cursor-pointer hover:border-zinc-700 transition-all">
                        <div className="aspect-video relative overflow-hidden bg-zinc-950">
                          <img src={video.cover_url || DEFAULT_COVER_IMAGE} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">HD</div>
                        </div>
                        <div className="p-3 flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm line-clamp-1">{video.title}</h4>
                            <p className="text-xs text-zinc-400 mt-1">{viewsMap[video.id] || 0} vistas</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL DE REPRODUCCIÓN (CON SANDBOX PROTECTOR) */}
        {selectedVideo && !isPipActive && (
          <>
            <DraggableAdPopup zoneId="df896f70ade366b92d5f509ddfef3a78" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md overflow-y-auto" onClick={handleCloseVideo}>
              <div className="bg-[#0f0f0f] w-full min-h-screen md:min-h-0 md:max-w-4xl md:rounded-3xl overflow-hidden flex flex-col my-auto border border-zinc-800 shadow-2xl" onClick={e => e.stopPropagation()}>
                
                <div className="bg-zinc-950 px-4 py-2.5 border-b border-zinc-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    {!selectedVideo.is_photo && (
                      <button onClick={() => setIsCinemaMode(!isCinemaMode)} className="px-2.5 py-1 rounded-lg font-bold bg-zinc-900 text-zinc-300">
                        🎬 Modo Cine
                      </button>
                    )}
                  </div>
                  <button onClick={handleCloseVideo} className="bg-zinc-800 text-zinc-400 text-xs px-4 py-2 rounded-full font-bold">CERRAR</button>
                </div>

                {selectedVideo.is_photo ? (
                  <div className="w-full bg-black flex justify-center items-center py-6">
                    <img src={selectedVideo.cover_url} alt={selectedVideo.title} className="max-w-full max-h-[70vh] object-contain rounded-xl" />
                  </div>
                ) : (
                  // IFRAME SEGURO CON SANDBOX PARA EVITAR SALIDAS A OTRAS WEBS
                  <div className="w-full bg-black aspect-video relative flex items-center justify-center overflow-hidden">
                    <iframe 
                      src={`${selectedVideo.voe_url}${selectedVideo.voe_url.includes('?') ? '&' : '?'}autoplay=1`}
                      className="w-full h-full border-0" 
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={selectedVideo.title}
                    />
                  </div>
                )}

                <div className="p-4 bg-[#0f0f0f] flex justify-between items-center border-b border-zinc-800">
                  <h2 className="font-bold text-white text-base">{selectedVideo.title}</h2>
                  <button onClick={() => handleLike(selectedVideo.id)} className="bg-zinc-800 text-xs px-3.5 py-2 rounded-full font-bold text-white">
                    👍 {likesMap[selectedVideo.id] || 0}
                  </button>
                </div>

              </div>
            </div>
          </>
        )}

        {/* MENÚ LATERAL */}
        {showMenu && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start" onClick={() => setShowMenu(false)}>
            <div className="bg-[#0f0f0f] border-r border-zinc-800 w-80 h-full p-6 flex flex-col justify-between shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-black text-white">FLIX<span className="text-blue-500">XES</span></h2>
                  <button onClick={() => setShowMenu(false)} className="text-zinc-400 hover:text-white font-bold">✕</button>
                </div>
                <div className="space-y-2">
                  <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-900 font-bold hover:bg-zinc-800 transition-colors">⚙️ Panel de Administración</button>
                  <button onClick={() => { setShowMenu(false); setShowStore(true); }} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-900 font-bold hover:bg-zinc-800 transition-colors">🛍️ Tienda / Afiliados</button>
                </div>
              </div>
              <div className="text-xs text-zinc-500 text-center">Flixxes App v2.6</div>
            </div>
          </div>
        )}

        {/* MODAL ADMIN */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] border border-zinc-800 w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Panel de Administración</h3>
                <button onClick={() => setShowAdminModal(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Contraseña de Admin</label>
                  <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="••••••••" required />
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setAdminTab('video')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${adminTab === 'video' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}>Video</button>
                  <button type="button" onClick={() => setAdminTab('photo')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${adminTab === 'photo' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}>Foto</button>
                  <button type="button" onClick={() => setAdminTab('afiliado')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${adminTab === 'afiliado' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}>Afiliado</button>
                </div>

                {adminTab === 'video' && (
                  <>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Título</label>
                      <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="Título del video" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">URL del Video (Voe / Embed)</label>
                      <input type="text" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Portada (URL de imagen)</label>
                      <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="https://..." />
                    </div>
                  </>
                )}

                {adminTab === 'photo' && (
                  <>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Título de la Foto</label>
                      <input type="text" value={photoTitleInput} onChange={e => setPhotoTitleInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="Título" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">URL de la Imagen</label>
                      <input type="text" value={photoUrlInput} onChange={e => setPhotoUrlInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="https://..." />
                    </div>
                  </>
                )}

                {adminTab === 'afiliado' && (
                  <>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Título del Producto</label>
                      <input type="text" value={prodTitle} onChange={e => setProdTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="Nombre" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Precio</label>
                      <input type="text" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="$0.00" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Enlace de Compra (Afiliado)</label>
                      <input type="text" value={prodUrl} onChange={e => setProdUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white" placeholder="https://..." />
                    </div>
                  </>
                )}

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">Guardar Contenido</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

