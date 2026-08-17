'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
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
    <div className="w-full flex justify-center items-center overflow-hidden bg-transparent my-3">
      <div ref={containerRef} className="w-full flex justify-center items-center" />
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
          <span>📌</span> Patrocinado (Desplazable)
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setMinimized(!minimized)} 
            className="text-zinc-400 hover:text-white text-xs px-1 font-bold"
            title={minimized ? "Maximizar" : "Minimizar"}
          >
            {minimized ? '+' : '−'}
          </button>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-zinc-400 hover:text-red-400 text-xs px-1 font-bold"
            title="Cerrar"
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

function HorizontalVideoCard({ 
  video, 
  onSelect, 
  isSaved, 
  onToggleSave, 
  likesCount,
  viewsCount,
  onOpenProfile 
}: { 
  video: Video; 
  onSelect: (v: Video) => void; 
  isSaved: boolean; 
  onToggleSave: (v: Video, e: React.MouseEvent) => void; 
  likesCount: number;
  viewsCount: number;
  onOpenProfile: (username: string, e: React.MouseEvent) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (video.is_photo) return;
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 250);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="flex flex-col w-full max-w-full overflow-hidden bg-zinc-900/40 rounded-2xl border border-zinc-800/80 hover:border-blue-500/50 transition-all shadow-md group cursor-pointer" 
      onClick={() => onSelect(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full relative w-full">
        <div className="relative aspect-video rounded-t-2xl overflow-hidden bg-black w-full flex items-center justify-center">
          {!isHovered || video.is_photo ? (
            <>
              <img src={video.cover_url || DEFAULT_COVER_IMAGE} alt={video.title} className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-zinc-700/50">
                {video.is_photo ? '📷 Foto' : video.category}
              </span>
            </>
          ) : (
            <div 
              className="w-full h-full pointer-events-none"
              dangerouslySetInnerHTML={{ 
                __html: video.voe_url.includes('<iframe') 
                  ? video.voe_url 
                  : `<iframe src="${video.voe_url}${video.voe_url.includes('?') ? '&' : '?'}autoplay=1&mute=1" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-presentation" allow="autoplay" title="${video.title}"></iframe>`
              }} 
            />
          )}

          <button 
            onClick={(e) => onToggleSave(video, e)}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all z-10 ${isSaved ? 'bg-blue-600 text-white' : 'bg-black/60 text-white hover:bg-black'}`}
            title={isSaved ? "Quitar de guardados" : "Guardar para después"}
          >
            ⭐
          </button>
        </div>
        
        <div className="p-3 flex gap-2.5 w-full items-start">
          <div 
            onClick={(e) => onOpenProfile(video.author || 'FlixxesUser', e)}
            className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black flex items-center justify-center flex-shrink-0 text-xs hover:bg-blue-600 hover:text-white transition-colors"
            title="Ver perfil"
          >
            {(video.author || 'F').charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{video.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-400 font-medium">
              <span 
                onClick={(e) => onOpenProfile(video.author || 'FlixxesUser', e)}
                className="hover:text-blue-400 underline cursor-pointer"
              >
                {video.author || 'FlixxesUser'}
              </span>
              <span>•</span>
              <span>👁️ {viewsCount}</span>
              <span>•</span>
              <span>👍 {likesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
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
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([
    { id: '1', user: 'Carlos99', content: '¡Hola a todos! Acabo de subir un nuevo video corto a mi perfil.', likes: 12, created_at: 'Hace 1 hora' },
    { id: '2', user: 'FoxyUser', content: 'Excelente comunidad la que se está formando en Flixxes 🚀', likes: 25, created_at: 'Hace 3 horas' }
  ]);
  const [newPostText, setNewPostText] = useState('');

  const [chatMessages, setChatMessages] = useState<Comment[]>([
    { id: '1', user: 'SoporteFlixxes', text: '¡Bienvenidos al chat general de la comunidad!', created_at: 'Hace 10 min' }
  ]);
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

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    default: [
      { id: '1', user: 'Carlos99', text: 'Excelente contenido, gracias por compartir!', created_at: 'Hace 2 horas' },
      { id: '2', user: 'FoxyUser', text: 'Muy buen aporte bro.', created_at: 'Hace 5 horas' }
    ]
  });
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

  useEffect(() => {
    if (selectedVideo) {
      document.title = `${selectedVideo.title} | Flixxes`;
    } else {
      document.title = 'Flixxes - Streaming Pro';
    }
  }, [selectedVideo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('v');
    if (vId && videos.length > 0) {
      const video = videos.find(v => v.id === vId);
      if (video) {
        setSelectedVideo(video);
        incrementRealView(video.id);
      }
    }
  }, [videos]);

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
      
      await supabase
        .from('videos')
        .update({ views: newViews })
        .eq('id', videoId);
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

    if (adminTab === 'afiliado') {
      if (!prodTitle.trim() || !prodPrice.trim() || !prodUrl.trim()) {
        alert('Por favor completa al menos el título, precio y URL de compra del producto.');
        return;
      }
      const { error } = await supabase.from('products').insert([{
        title: prodTitle,
        price: prodPrice,
        image_url: prodImage.trim() ? prodImage.trim() : DEFAULT_COVER_IMAGE,
        buy_url: prodUrl
      }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowAdminModal(false);
        setProdTitle('');
        setProdPrice('');
        setProdImage('');
        setProdUrl('');
        setAdminPassword('');
        fetchProducts();
      }
      return;
    }

    if (adminTab === 'photo') {
      if (!photoUrlInput.trim() || !photoTitleInput.trim()) {
        alert('Por favor completa el título y la URL de la foto.');
        return;
      }
      const { error } = await supabase.from('videos').insert([{
        title: photoTitleInput,
        category: 'Fotos',
        voe_url: '',
        cover_url: photoUrlInput,
        description: 'Fotografía exclusiva en alta resolución disponible en Flixxes.',
        tags: ['Fotos', 'HD'],
        is_photo: true,
        is_short: false,
        author: currentUsername,
        views: 0
      }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowAdminModal(false);
        setPhotoTitleInput('');
        setPhotoUrlInput('');
        setAdminPassword('');
        fetchVideos();
      }
      return;
    }

    const parsedTags = videoTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const finalCoverUrl = coverUrl.trim() ? coverUrl.trim() : DEFAULT_COVER_IMAGE;

    const { error } = await supabase.from('videos').insert([{ 
      title, 
      category, 
      voe_url: voeUrl, 
      cover_url: finalCoverUrl,
      description: description || 'Disfruta de este contenido en alta definición disponible en Flixxes.',
      tags: parsedTags.length > 0 ? parsedTags : [category, 'HD'],
      is_short: isShortVideo,
      is_photo: false,
      author: currentUsername,
      views: 0
    }]);

    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setVideoTagsInput('HD, Latino, Casero'); setIsShortVideo(false); setAdminPassword('');
      fetchVideos();
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
      user: currentUsername || 'Anónimo',
      text: newCommentText.trim(),
      created_at: 'Justo ahora'
    };
    const currentList = commentsMap[videoId] || commentsMap['default'];
    setCommentsMap({
      ...commentsMap,
      [videoId]: [commentItem, ...currentList]
    });
    setNewCommentText('');
  };

  const handleToggleFollow = (username: string) => {
    const isFollowing = !!followingMap[username];
    setFollowingMap({ ...followingMap, [username]: !isFollowing });
  };

  const handleCreateSocialPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost: SocialPost = {
      id: Date.now().toString(),
      user: currentUsername,
      content: newPostText.trim(),
      likes: 0,
      created_at: 'Justo ahora'
    };
    setSocialPosts([newPost, ...socialPosts]);
    setNewPostText('');
  };

  const handleLikePost = (postId: string) => {
    setSocialPosts(socialPosts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleOpenProfile = (username: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setViewingProfile(username);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: Comment = {
      id: Date.now().toString(),
      user: currentUsername,
      text: chatInput.trim(),
      created_at: 'Justo ahora'
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
  };

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 w-full overflow-x-hidden">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
          <h1 className="text-4xl font-black text-white tracking-tight">FLIX<span className="text-blue-500">XES</span></h1>
          <p className="text-xs text-zinc-400">Este sitio contiene material para adultos. Debes ser mayor de edad para ingresar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-colors">INGRESAR</button>
        </div>
      </div>
    );
  }

  const filteredVideos = videos
    .filter(v => {
      const vTags = Array.isArray(v.tags) ? v.tags : (v.tags ? [String(v.tags)] : []);
      const matchesTag = activeTag === 'Todos' || (activeTag === 'Fotos' ? v.is_photo : (v.category === activeTag || vTags.some(t => t.toLowerCase() === activeTag.toLowerCase())));
      const query = searchQuery.toLowerCase();
      const matchesSearch = v.title.toLowerCase().includes(query) || 
                            (v.category && v.category.toLowerCase().includes(query)) ||
                            vTags.some(t => t.toLowerCase().includes(query)) ||
                            (v.author && v.author.toLowerCase().includes(query));
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
      if (sortBy === 'popular') return (viewsMap[b.id] || 0) - (viewsMap[a.id] || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  const horizontalVideos = filteredVideos.filter(v => !v.is_short && !v.is_photo);
  const photoGallery = filteredVideos.filter(v => v.is_photo);
  const verticalShorts = filteredVideos.filter(v => v.is_short);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(storeSearchQuery.toLowerCase())
  );

  return (
    <main className={`min-h-screen ${isCinemaMode ? 'bg-black' : 'bg-[#0f0f0f]'} text-zinc-200 flex flex-col justify-between w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300`}>
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        
        {/* BARRA SUPERIOR */}
        <nav className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 flex items-center justify-between gap-3 w-full max-w-[100vw]">
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => setShowMenu(true)} 
              className="text-zinc-200 hover:bg-zinc-800 p-2 rounded-xl transition-colors focus:outline-none flex items-center gap-1.5"
              aria-label="Abrir Menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs font-bold hidden sm:inline">Menú</span>
            </button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <h1 className="text-xl font-black text-white cursor-pointer tracking-tight" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setViewingProfile(null); setShowSocialFeed(false); }}>
              FLIX<span className="text-blue-500">XES</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <button 
              onClick={() => setShowChatDrawer(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-full font-bold border border-zinc-700 transition-all flex items-center gap-1"
            >
              <span>💬</span>
              <span className="hidden md:inline">Chat</span>
            </button>
            <button 
              onClick={() => handleOpenProfile(currentUsername)} 
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-1.5 rounded-full font-bold transition-all shadow flex items-center gap-1.5"
            >
              <span>👤</span>
              <span className="hidden md:inline">Registro</span>
            </button>
          </div>
        </nav>

        {/* SECCIÓN BOTONES ADICIONALES */}
        <div className="bg-[#141414] border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-center gap-3 w-full">
          <button 
            onClick={() => setShowDonateModal(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs px-4 py-2 rounded-full font-bold border border-zinc-700 transition-all flex items-center gap-1.5 shadow"
          >
            <span>☕</span>
            <span>Donar</span>
          </button>
          <button 
            onClick={() => setShowStore(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs px-4 py-2 rounded-full font-bold border border-zinc-700 transition-all flex items-center gap-1.5 shadow"
          >
            <span>🛍️</span>
            <span>Tienda</span>
          </button>
          <button 
            onClick={handleInstallClick}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-full font-black transition-all shadow flex items-center gap-1.5"
          >
            <span>📱</span>
            <span>Instalar App</span>
          </button>
        </div>

        {/* MENÚ LATERAL */}
        {showMenu && (
          <div className="fixed inset-0 z-50 flex max-w-[100vw] overflow-x-hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
            <div className="relative bg-[#181818] border-r border-zinc-800 w-80 max-w-[85vw] h-full p-6 flex flex-col z-10 overflow-y-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h2 className="text-lg font-black text-white tracking-wider">MENÚ PRINCIPAL</h2>
                <button onClick={() => setShowMenu(false)} className="text-zinc-400 hover:text-white p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-2 text-sm font-semibold">
                <button onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setViewingProfile(null); setShowSocialFeed(false); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🏠 Inicio</button>
                <button onClick={() => { setShowSocialFeed(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold">💬 Feed Social y Muro</button>
                <button onClick={() => { setShowChatDrawer(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📥 Bandeja de Chat en Vivo</button>
                <button onClick={() => { handleOpenProfile(currentUsername); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">👤 Mi Perfil de Usuario</button>
                <button onClick={() => { setActiveTag('Fotos'); setShowMenu(false); setViewingProfile(null); setShowSocialFeed(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📷 Galería de Fotos</button>
                <button onClick={() => { setShowWatchLaterModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">⭐ Lista de Guardados ({watchLater.length})</button>
                <button onClick={() => { setShowStore(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🛍️ Tienda Oficial</button>
                <button onClick={() => { setShowDonateModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">☕ Apóyame con una Donación</button>
                <button onClick={() => { handleInstallClick(); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 text-left">📱 Instalar Aplicación Web</button>
                
                <div className="pt-2 border-t border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 px-3 tracking-wider">Categorías</span>
                  {defaultTags.filter(t => t !== 'Todos').map(t => (
                    <button key={t} onClick={() => { setActiveTag(t); setShowMenu(false); setViewingProfile(null); setShowSocialFeed(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white">
                      #{t}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full py-3 rounded-2xl bg-blue-600 text-white font-black text-center hover:bg-blue-500">+ Publicar (Admin)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANDEJA DE CHAT */}
        {showChatDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowChatDrawer(false)}></div>
            <div className="relative bg-[#141414] border-l border-zinc-800 w-full max-w-sm h-full flex flex-col z-10 shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <h3 className="font-bold text-white text-sm">Bandeja de Chat Comunidad</h3>
                </div>
                <button onClick={() => setShowChatDrawer(false)} className="text-zinc-400 hover:text-white p-1.5 text-xs font-bold">Cerrar</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-blue-400">@{msg.user}</span>
                      <span className="text-zinc-500">{msg.created_at}</span>
                    </div>
                    <p className="text-xs text-zinc-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-zinc-800 bg-zinc-950 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje al chat..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold">Enviar</button>
              </form>
            </div>
          </div>
        )}

        {/* PERFIL DE USUARIO */}
        {viewingProfile && (
          <div className="px-4 py-8 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-xl">
              <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
                {viewingProfile.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-white">@{viewingProfile}</h2>
                  {viewingProfile !== currentUsername && (
                    <button 
                      onClick={() => handleToggleFollow(viewingProfile)}
                      className={`px-6 py-2 rounded-full font-bold text-xs transition-all ${followingMap[viewingProfile] ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                    >
                      {followingMap[viewingProfile] ? 'Siguiendo ✓' : 'Seguir +'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-400">Creador de contenido y miembro activo de la comunidad en Flixxes.</p>
                <div className="flex justify-center sm:justify-start gap-4 text-xs text-zinc-300 font-semibold pt-1">
                  <span>Videos subidos: <strong>{videos.filter(v => v.author === viewingProfile).length}</strong></span>
                  <span>•</span>
                  <span>Seguidores: <strong>{followingMap[viewingProfile] ? 142 : 141}</strong></span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-blue-400">Publicaciones y Videos de @{viewingProfile}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {videos.filter(v => v.author === viewingProfile).length === 0 ? (
                  <p className="text-zinc-500 text-xs col-span-full py-8 text-center">Este usuario aún no ha publicado videos.</p>
                ) : (
                  videos.filter(v => v.author === viewingProfile).map(v => (
                    <HorizontalVideoCard 
                      key={v.id}
                      video={v}
                      onSelect={handleSelectVideo}
                      isSaved={watchLater.some(item => item.id === v.id)}
                      onToggleSave={toggleWatchLater}
                      likesCount={likesMap[v.id] || 0}
                      viewsCount={viewsMap[v.id] !== undefined ? viewsMap[v.id] : (v.views || 0)}
                      onOpenProfile={handleOpenProfile}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button onClick={() => setViewingProfile(null)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-6 py-2.5 rounded-full">
                ← Volver al Inicio
              </button>
            </div>
          </div>
        )}

        {/* FEED SOCIAL */}
        {showSocialFeed && !viewingProfile && (
          <div className="px-4 py-8 max-w-2xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">Comunidad y Muro Social</h2>
                <p className="text-xs text-zinc-400">Comparte actualizaciones, estados o interactúa con otros miembros.</p>
              </div>
              <button onClick={() => setShowSocialFeed(false)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full font-bold">Cerrar</button>
            </div>

            <form onSubmit={handleCreateSocialPost} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <textarea 
                placeholder="¿Qué estás pensando o compartiendo hoy?" 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500">Publicando como: <strong>@{currentUsername}</strong></span>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl">Publicar Estado</button>
              </div>
            </form>

            <div className="space-y-4">
              {socialPosts.map(post => (
                <div key={post.id} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span 
                      onClick={() => handleOpenProfile(post.user)}
                      className="font-bold text-blue-400 text-xs hover:underline cursor-pointer"
                    >
                      @{post.user}
                    </span>
                    <span className="text-[10px] text-zinc-500">{post.created_at}</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                    <button onClick={() => handleLikePost(post.id)} className="text-zinc-400 hover:text-blue-400 font-bold flex items-center gap-1">
                      👍 {post.likes} Me gusta
                    </button>
                    {post.user !== currentUsername && (
                      <button 
                        onClick={() => handleToggleFollow(post.user)} 
                        className="text-[11px] text-blue-400 font-bold hover:underline"
                      >
                        {followingMap[post.user] ? 'Siguiendo ✓' : 'Seguir +'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTADO PRINCIPAL */}
        {!viewingProfile && !showSocialFeed && (
          <>
            <section className="px-4 pt-4 pb-2 w-full max-w-[100vw] overflow-x-hidden box-border">
              <div className="mb-3 w-full">
                <input 
                  type="text" 
                  placeholder="Buscar por título, categoría o etiqueta..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-[#121212] border border-zinc-800 p-3 rounded-2xl text-xs focus:border-blue-500 outline-none text-zinc-200 box-border shadow-inner" 
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-zinc-800/60 w-full">
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full max-w-full">
                  {defaultTags.map(tag => (
                    <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeTag === tag ? 'bg-blue-600 text-white shadow-md' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'}`}>
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs flex-shrink-0 self-end sm:self-auto">
                  <button onClick={() => setSortBy('recent')} className={`px-3 py-1 rounded-lg font-bold transition-all ${sortBy === 'recent' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Recientes</button>
                  <button onClick={() => setSortBy('popular')} className={`px-3 py-1 rounded-lg font-bold transition-all ${sortBy === 'popular' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Populares</button>
                </div>
              </div>
            </section>

            {/* SHORTS VERTICALES */}
            {verticalShorts.length > 0 && (
              <section className="px-4 py-4 w-full max-w-[100vw] overflow-x-hidden box-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-blue-400 tracking-wider uppercase flex items-center gap-1.5">
                    ⚡ Shorts Verticales ({verticalShorts.length})
                  </h3>
                  <span className="text-[10px] text-zinc-500">Desliza para ver más</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {verticalShorts.map((v) => (
                    <div 
                      key={`short-${v.id}`} 
                      onClick={() => handleSelectVideo(v)}
                      className="min-w-[140px] max-w-[140px] h-[250px] bg-zinc-950 rounded-2xl overflow-hidden relative flex-shrink-0 snap-start border border-zinc-800 shadow-md group cursor-pointer flex items-center justify-center"
                    >
                      <img src={v.cover_url || DEFAULT_COVER_IMAGE} alt={v.title} className="w-full h-full object-cover bg-black group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                        <span className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                          Short
                        </span>
                        <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{v.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* GALERÍA DE FOTOS */}
            {photoGallery.length > 0 && (activeTag === 'Todos' || activeTag === 'Fotos') && (
              <section className="px-4 py-4 w-full max-w-[100vw] overflow-x-hidden box-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-pink-400 tracking-wider uppercase flex items-center gap-1.5">
                    📷 Galería de Fotos ({photoGallery.length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                  {photoGallery.map((photo) => {
                    const isSaved = watchLater.some(v => v.id === photo.id);
                    return (
                      <div 
                        key={`photo-${photo.id}`}
                        onClick={() => handleSelectVideo(photo)}
                        className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group flex flex-col relative shadow"
                      >
                        <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                          <img src={photo.cover_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                          <button 
                            onClick={(e) => toggleWatchLater(photo, e)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${isSaved ? 'bg-blue-600 text-white' : 'bg-black/60 text-white hover:bg-black'}`}
                          >
                            ⭐
                          </button>
                        </div>
                        <div className="p-2.5">
                          <h4 className="text-xs font-bold text-zinc-100 line-clamp-1 group-hover:text-blue-400 transition-colors">{photo.title}</h4>
                          <span 
                            onClick={(e) => handleOpenProfile(photo.author || 'FlixxesUser', e)} 
                            className="text-[10px] text-zinc-400 hover:text-blue-400 underline mt-1 block"
                          >
                            @{photo.author || 'FlixxesUser'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* PUBLICIDAD SUPERIOR */}
            <section className="px-4 py-2 w-full max-w-[100vw]">
              <div className="bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Publicidad Patrocinada</span>
                <AdsterraBlock zoneId="3837baa3b86f4b03245779a93841cdf8" />
              </div>
            </section>

            {/* VIDEOS HORIZONTALES */}
            {horizontalVideos.length > 0 && activeTag !== 'Fotos' && (
              <section className="px-4 pb-12 pt-2 w-full max-w-[100vw] overflow-x-hidden box-border">
                <div className="flex items-center justify-between mb-3 border-t border-zinc-800/60 pt-4">
                  <h3 className="text-xs font-black text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
                    📺 Videos Horizontales ({horizontalVideos.length})
                  </h3>
                  <span className="text-[10px] text-zinc-500">Streaming Estándar</span>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <div key={n} className="animate-pulse flex flex-col space-y-3 w-full">
                        <div className="aspect-video rounded-xl bg-zinc-800 w-full"></div>
                        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                        <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full max-w-full">
                    {horizontalVideos.map((video) => {
                      const isSaved = watchLater.some(v => v.id === video.id);

                      return (
                        <HorizontalVideoCard 
                          key={video.id}
                          video={video}
                          onSelect={handleSelectVideo}
                          isSaved={isSaved}
                          onToggleSave={toggleWatchLater}
                          likesCount={likesMap[video.id] || 0}
                          viewsCount={viewsMap[video.id] !== undefined ? viewsMap[video.id] : (video.views || 0)}
                          onOpenProfile={handleOpenProfile}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* MODAL DE REPRODUCCIÓN + CARRUSEL DE RECOMENDADOS + VENTANA FLOTANTE DESPLAZABLE */}
        {selectedVideo && !isPipActive && (
          <>
            <DraggableAdPopup zoneId="df896f70ade366b92d5f509ddfef3a78" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md overflow-y-auto" onClick={handleCloseVideo}>
              <div id="video-modal-container" className={`bg-[#0f0f0f] w-full min-h-screen md:min-h-0 ${isCinemaMode ? 'md:max-w-6xl' : 'md:max-w-4xl'} md:rounded-3xl overflow-hidden flex flex-col my-auto border border-zinc-800 transition-all duration-300 shadow-2xl`} onClick={e => e.stopPropagation()}>
                
                <div className="bg-zinc-950 px-4 py-2.5 border-b border-zinc-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    {!selectedVideo.is_photo && (
                      <>
                        <button onClick={() => setIsCinemaMode(!isCinemaMode)} className={`px-2.5 py-1 rounded-lg font-bold border ${isCinemaMode ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'}`}>
                          🎬 Modo Cine
                        </button>
                        <button onClick={() => setIsPipActive(true)} className="px-2.5 py-1 rounded-lg font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800">
                          📌 PiP
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {!selectedVideo.is_photo && (
                      <button onClick={handleNextVideo} className="bg-blue-600 text-white font-black px-3 py-1 rounded-lg hover:bg-blue-500">
                        Siguiente ➔
                      </button>
                    )}
                  </div>
                </div>

                {selectedVideo.is_photo ? (
                  <div className="w-full bg-black flex justify-center items-center py-6">
                    <div className="max-w-2xl max-h-[70vh] flex items-center justify-center p-2">
                      <img src={selectedVideo.cover_url} alt={selectedVideo.title} className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl" />
                    </div>
                  </div>
                ) : (
                  <div className={`w-full bg-black flex justify-center items-center relative ${selectedVideo.is_short ? 'py-4 bg-black' : 'aspect-video'}`}>
                    <div className={`w-full relative ${selectedVideo.is_short ? 'max-w-[280px] aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden shadow-lg mx-auto' : 'h-full'}`}>
                      <div 
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedVideo.voe_url.includes('<iframe') 
                            ? selectedVideo.voe_url 
                            : `<iframe src="${selectedVideo.voe_url}${selectedVideo.voe_url.includes('?') ? '&' : '?'}autoplay=1" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-presentation" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen scrolling="no" title="${selectedVideo.title}"></iframe>`
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-[#0f0f0f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800">
                  <div>
                    <h2 className="font-bold text-white text-base sm:text-lg">{selectedVideo.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span 
                        onClick={() => { handleOpenProfile(selectedVideo.author || 'FlixxesUser'); handleCloseVideo(); }}
                        className="text-xs text-blue-400 hover:underline cursor-pointer font-semibold"
                      >
                        @{selectedVideo.author || 'FlixxesUser'}
                      </span>
                      <span className="text-zinc-600 text-xs">•</span>
                      <span className="text-xs text-zinc-400 font-medium">
                        👁️ {viewsMap[selectedVideo.id] !== undefined ? viewsMap[selectedVideo.id] : (selectedVideo.views || 0)} vistas
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    <button 
                      onClick={() => handleLike(selectedVideo.id)}
                      className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-bold transition-colors ${userLikedMap[selectedVideo.id] ? 'bg-blue-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}
                    >
                      👍 {likesMap[selectedVideo.id] || 0}
                    </button>

                    <button 
                      onClick={() => toggleWatchLater(selectedVideo)} 
                      className={`text-xs px-3.5 py-2 rounded-full font-bold border transition-colors ${watchLater.some(v => v.id === selectedVideo.id) ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'}`}
                    >
                      ⭐ {watchLater.some(v => v.id === selectedVideo.id) ? 'Guardado' : 'Guardar'}
                    </button>

                    <button 
                      onClick={() => setShowDonateModal(true)} 
                      className="bg-blue-600 text-white hover:bg-blue-500 text-xs px-4 py-2 rounded-full font-black"
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

                {/* CARRUSEL DE VIDEOS RECOMENDADOS DENTRO DEL MODAL */}
                <div className="p-4 bg-zinc-950 border-b border-zinc-800">
                  <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-3">🔥 Videos Recomendados</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {videos.filter(v => v.id !== selectedVideo.id).slice(0, 10).map(rec => (
                      <div 
                        key={`rec-${rec.id}`}
                        onClick={() => handleSelectVideo(rec)}
                        className="min-w-[160px] max-w-[160px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 group hover:border-blue-500 transition-all shadow"
                      >
                        <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center">
                          <img src={rec.cover_url || DEFAULT_COVER_IMAGE} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                          <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-blue-400 px-1.5 py-0.5 rounded font-bold">
                            {rec.category}
                          </span>
                        </div>
                        <div className="p-2">
                          <h4 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{rec.title}</h4>
                          <span className="text-[9px] text-zinc-400">@{rec.author || 'FlixxesUser'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#0f0f0f] text-xs text-zinc-300 space-y-3">
                  <div>
                    <span className="font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Descripción</span>
                    <p className="mt-1 leading-relaxed text-zinc-200">{selectedVideo.description || 'Disfruta de este contenido en alta definición disponible en Flixxes.'}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(() => {
                      const tagsArr = Array.isArray(selectedVideo.tags) 
                        ? selectedVideo.tags 
                        : (selectedVideo.tags ? [String(selectedVideo.tags)] : [selectedVideo.category, 'HD']);
                      return tagsArr.map(t => (
                        <button 
                          key={t} 
                          onClick={() => { setActiveTag(t); handleCloseVideo(); }} 
                          className="bg-zinc-800 hover:bg-blue-600 hover:text-white text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full transition-colors"
                        >
                          #{t}
                        </button>
                      ));
                    })()}
                  </div>
                </div>

                {/* COMENTARIOS */}
                <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Comentarios ({(commentsMap[selectedVideo.id] || commentsMap['default']).length})
                  </h3>

                  <form onSubmit={(e) => handleAddComment(selectedVideo.id, e)} className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Añade un comentario..." 
                        value={newCommentText} 
                        onChange={(e) => setNewCommentText(e.target.value)} 
                        className="flex-grow bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-blue-500" 
                      />
                      <button type="submit" className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-blue-500">Comentar</button>
                    </div>
                  </form>

                  <div className="space-y-3 pt-2 max-h-48 overflow-y-auto pr-1">
                    {(commentsMap[selectedVideo.id] || commentsMap['default']).map(c => (
                      <div key={c.id} className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/60 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span 
                            onClick={() => { handleOpenProfile(c.user); handleCloseVideo(); }}
                            className="font-bold text-blue-400 hover:underline cursor-pointer"
                          >
                            @{c.user}
                          </span>
                          <span className="text-[10px] text-zinc-500">{c.created_at}</span>
                        </div>
                        <p className="text-zinc-300">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ANUNCIO INFERIOR MODAL */}
                <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col items-center">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Publicidad Recomendada</span>
                  <AdsterraNativeBlock zoneId="df896f70ade366b92d5f509ddfef3a78" />
                </div>

              </div>
            </div>
          </>
        )}

        {/* MODAL TIENDA TIPO AMAZON */}
        {showStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowStore(false)}>
            <div className="bg-[#121212] border border-zinc-800 p-0 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              
              {/* HEADER DE LA TIENDA */}
              <div className="p-5 border-b border-zinc-800 bg-[#0f0f0f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">🛍️ Tienda Flixxes</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Compra tus accesorios y suscripciones</p>
                </div>
                
                {/* BUSCADOR DE LA TIENDA */}
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Buscar productos..." 
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 py-2 pl-4 pr-10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-zinc-500">🔍</span>
                </div>
                
                <button onClick={() => setShowStore(false)} className="text-xs text-zinc-400 hover:text-white px-3 py-2 bg-zinc-900 rounded-xl">Cerrar</button>
              </div>

              {/* GRID DE PRODUCTOS */}
              <div className="flex-1 overflow-y-auto p-5">
                {filteredProducts.length === 0 ? (
                  <p className="text-center text-zinc-500 py-20 text-sm">No hay productos disponibles con ese nombre.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredProducts.map(p => (
                      <div key={p.id} className="group bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col">
                        <div className="aspect-square bg-black relative overflow-hidden">
                          <img src={p.image_url || DEFAULT_COVER_IMAGE} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 leading-tight mb-2">{p.title}</h4>
                          <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800/50">
                            <span className="text-blue-400 font-black text-sm">{p.price}</span>
                            <a 
                              href={p.buy_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-white text-black hover:bg-blue-500 hover:text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors"
                            >
                              COMPRAR
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER TIENDA */}
              <div className="p-4 bg-zinc-950/50 text-center border-t border-zinc-800">
                <p className="text-[9px] text-zinc-600">Envíos garantizados a todo el mundo con seguridad SSL.</p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DONAR */}
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDonateModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-black text-white">☕ Apóyame con una Donación</h2>
              <p className="text-xs text-zinc-400">Tu apoyo ayuda a mantener los servidores y traer contenido nuevo diariamente.</p>
              <a 
                href="https://paypal.me/TU_USUARIO_PAYPAL" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-sm transition-all"
              >
                Donar con PayPal
              </a>
              <button onClick={() => setShowDonateModal(false)} className="w-full text-xs text-zinc-500 hover:text-white py-2">Cancelar</button>
            </div>
          </div>
        )}

        {/* MODAL GUARDADOS */}
        {showWatchLaterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowWatchLaterModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-2xl w-full space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-xl font-black text-white">⭐ Elementos Guardados</h2>
                <button onClick={() => setShowWatchLaterModal(false)} className="text-xs text-zinc-400 hover:text-white">CERRAR</button>
              </div>

              {watchLater.length === 0 ? (
                <p className="text-center text-zinc-500 py-8 text-xs">No tienes ningún elemento guardado en tu lista.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {watchLater.map(v => (
                    <div key={v.id} className="bg-zinc-900 p-2 rounded-xl flex gap-3 items-center border border-zinc-800">
                      <img src={v.cover_url || DEFAULT_COVER_IMAGE} alt={v.title} className="w-20 aspect-video rounded-lg object-cover bg-black pointer-events-none" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{v.title}</h4>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { handleSelectVideo(v); setShowWatchLaterModal(false); }} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded font-bold">Ver</button>
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

        {/* MODAL ADMIN */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <form onSubmit={handleAdminSubmit} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Panel Admin</h2>
                <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                  <button type="button" onClick={() => setAdminTab('video')} className={`px-2.5 py-1 rounded-lg transition-colors ${adminTab === 'video' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Video</button>
                  <button type="button" onClick={() => setAdminTab('photo')} className={`px-2.5 py-1 rounded-lg transition-colors ${adminTab === 'photo' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Foto</button>
                  <button type="button" onClick={() => setAdminTab('afiliado')} className={`px-2.5 py-1 rounded-lg transition-colors ${adminTab === 'afiliado' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Afiliado</button>
                </div>
              </div>

              <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
              <input type="text" placeholder="Tu Nombre de Usuario / Autor" value={currentUsername} onChange={e => { setCurrentUsername(e.target.value); localStorage.setItem('flixxes_username', e.target.value); }} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
              
              {adminTab === 'afiliado' ? (
                <>
                  <input type="text" placeholder="Título del producto" value={prodTitle} onChange={e => setProdTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="Precio (ej: $29.99)" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="URL de la imagen del producto" value={prodImage} onChange={e => setProdImage(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="URL de compra (Enlace de afiliado)" value={prodUrl} onChange={e => setProdUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                </>
              ) : adminTab === 'photo' ? (
                <>
                  <input type="text" placeholder="Título de la foto" value={photoTitleInput} onChange={e => setPhotoTitleInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="URL de la foto" value={photoUrlInput} onChange={e => setPhotoUrlInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                </>
              ) : (
                <>
                  <input type="text" placeholder="Título del video" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-zinc-300 outline-none focus:border-blue-500">
                    {defaultTags.filter(t => t !== 'Todos' && t !== 'Fotos').map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <textarea placeholder="Descripción del video personalizada" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500 resize-none" />
                  
                  <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                    <input 
                      type="checkbox" 
                      id="shortCheckbox" 
                      checked={isShortVideo} 
                      onChange={(e) => setIsShortVideo(e.target.checked)} 
                      className="w-4 h-4 accent-blue-500 cursor-pointer" 
                    />                    <label htmlFor="shortCheckbox" className="text-xs font-bold text-white cursor-pointer select-none">
                      ¿Es un Video Vertical / Short?
                    </label>
                  </div>

                  <input type="text" placeholder="Etiquetas (separadas por coma)" value={videoTagsInput} onChange={e => setVideoTagsInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="URL del video (iframe o enlace embed)" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="URL Portada / Miniatura (Opcional)" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700">Cancelar</button>
                <button type="submit" className="w-full p-3 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-500">Publicar</button>
              </div>
            </form>
          </div>
        )}

      <footer className="bg-black border-t border-zinc-900 py-10 px-4 mt-12 text-center text-xs text-zinc-500 space-y-6 w-full max-w-[100vw] overflow-x-hidden">
        <div className="max-w-3xl mx-auto space-y-3">
          <h3 className="text-zinc-300 font-bold uppercase tracking-widest text-sm">AVISO LEGAL</h3>
          <p className="leading-relaxed text-[11px] text-zinc-400">
            Todo el material alojado en esta web es recolectado de sitios web públicos. Flixxes es un sitio donde usted encontrará videos caseros, HD, latinos, fotos, entre otros. Prohibido el acceso a menores de 18 años.
          </p>
        </div>

        <div className="flex justify-center gap-6 font-semibold text-zinc-400 flex-wrap">
          <a href="#" className="hover:text-blue-500">Política Y privacidad</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-500">DMCA</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-500">2257</a>
          <span>•</span>
          <a href="mailto:umbrellaholdings.global@gmail.com" className="hover:text-blue-500">Contacto</a>
        </div>

        <p className="text-zinc-600 text-[10px]">© FLIXXES.COM 2016-2026</p>
      </footer>
    </main>
  );
}

