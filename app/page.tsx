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
    confScript.text = `atOptions = { 'key' : '${zoneId}', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };`;
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${zoneId}/invoke.js`;
    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, [zoneId]);

  return (
    <div className="w-full flex flex-col justify-center items-center overflow-hidden bg-transparent my-4">
      <div ref={containerRef} className="flex justify-center items-center max-w-full overflow-hidden rounded-xl shadow-lg bg-zinc-950/40 p-2 border border-zinc-800/50" />
    </div>
  );
}

function DraggableAdPopup({ zoneId }: { zoneId: string }) {
  const [position, setPosition] = useState({ x: 24, y: 120 });
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
      className="fixed z-50 bg-zinc-950/90 border border-zinc-800/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-shadow select-none max-w-[280px]"
    >
      <div
        className="bg-zinc-900/90 px-3.5 py-2 flex items-center justify-between cursor-move border-b border-zinc-800/80"
        onMouseDown={(e) => handleTouchStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleTouchMove(e.clientX, e.clientY)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleTouchMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Patrocinado
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-zinc-400 hover:text-white text-xs px-1.5 py-0.5 rounded font-bold hover:bg-zinc-800 transition-colors"
          >
            {minimized ? '+' : '−'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-zinc-400 hover:text-red-400 text-xs px-1.5 py-0.5 rounded font-bold hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      {!minimized && (
        <div className="p-2.5 flex flex-col items-center justify-center bg-black/40">
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
      className="flex flex-col w-full max-w-full overflow-hidden bg-zinc-900/50 rounded-2xl border border-zinc-800/80 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 group cursor-pointer"
      onClick={() => onSelect(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full relative w-full">
        <div className="relative aspect-video rounded-t-2xl overflow-hidden bg-black/80 w-full flex items-center justify-center">
          {!isHovered || video.is_photo ? (
            <>
              <img
                src={video.cover_url || DEFAULT_COVER_IMAGE}
                alt={video.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-blue-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-zinc-700/50 shadow">
                {video.is_photo ? '📷 Foto' : (video.is_short ? '⚡ Vertical' : video.category)}
              </span>
            </>
          ) : (
            <div className="w-full h-full absolute inset-0 overflow-hidden flex items-center justify-center bg-black pointer-events-none">
              <div
                key={`preview-${video.id}`}
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:pointer-events-none"
                dangerouslySetInnerHTML={{
                  __html: video.voe_url.includes('<iframe')
                    ? video.voe_url
                        .replace('<iframe', '<iframe sandbox="allow-scripts allow-same-origin allow-presentation" pointer-events="none"')
                        .replace(/src="([^"]*)"/, 'src="$1&autoplay=1&mute=1&controls=0"')
                    : `<iframe src="${video.voe_url}${video.voe_url.includes('?') ? '&' : '?'}autoplay=1&mute=1&controls=0" class="w-full h-full border-0 pointer-events-none" sandbox="allow-scripts allow-same-origin allow-presentation" allow="autoplay" title="${video.title}"></iframe>`
                }}
              />
            </div>
          )}
          <button
            onClick={(e) => onToggleSave(video, e)}
            className={`absolute top-2.5 right-2.5 p-2.5 rounded-full backdrop-blur-md transition-all z-10 shadow-lg ${isSaved ? 'bg-blue-600 text-white scale-105' : 'bg-black/60 text-white hover:bg-black hover:scale-105'}`}
          >
            ⭐
          </button>
        </div>
        <div className="p-3.5 flex gap-3 w-full items-start">
          <div
            onClick={(e) => onOpenProfile(video.author || 'FlixxesUser', e)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-700/10 border border-blue-500/30 text-blue-400 font-black flex items-center justify-center flex-shrink-0 text-xs hover:bg-blue-600 hover:text-white transition-all shadow-inner"
          >
            {(video.author || 'F').charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-relaxed group-hover:text-blue-400 transition-colors">{video.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-400 font-medium flex-wrap">
              <span
                onClick={(e) => onOpenProfile(video.author || 'FlixxesUser', e)}
                className="hover:text-blue-400 underline decoration-zinc-700 underline-offset-2 cursor-pointer"
              >
                {video.author || 'FlixxesUser'}
              </span>
              <span className="text-zinc-600">•</span>
              <span>👁️ {viewsCount}</span>
              <span className="text-zinc-600">•</span>
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
  const [activeShortIndex, setActiveShortIndex] = useState(0);
  
  const shortContainerRef = useRef<HTMLDivElement>(null);

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

  const shuffleArray = (array: Video[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('videos').select('*');
      if (data) {
        const enriched = data.map(v => ({ ...v, author: v.author || 'FlixxesOfficial' }));
        setVideos(shuffleArray(enriched));
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
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(shuffleArray(data as any));
    } catch (e) { console.error(e); }
  }, []);

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
  }, [fetchVideos, fetchProducts]);

  const incrementRealView = useCallback(async (videoId: string) => {
    try {
      const { data: currentVideo, error: fetchError } = await supabase
        .from('videos')
        .select('views')
        .eq('id', videoId)
        .single();
      if (fetchError) return;
      const currentViews = currentVideo?.views || 0;
      const newViews = currentViews + 1;
      await supabase.from('videos').update({ views: newViews }).eq('id', videoId);
      setViewsMap(prev => ({ ...prev, [videoId]: newViews }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('v');
    if (vId && videos.length > 0 && !selectedVideo) {
      const video = videos.find(v => v.id === vId);
      if (video) {
        setSelectedVideo(video);
        incrementRealView(video.id);
      }
    }
  }, [videos, selectedVideo, incrementRealView]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('Para instalar la app, toca los tres puntos de tu navegador y selecciona "Instalar aplicación".');
    }
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPipActive(false);
    window.history.pushState(null, '', `?v=${video.id}`);
    incrementRealView(video.id);
    if (video.is_short) {
      const vShorts = videos.filter(v => v.is_short);
      const idx = vShorts.findIndex(v => v.id === video.id);
      if (idx !== -1) setActiveShortIndex(idx);
    }
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
        alert('Por favor completa al menos el título, precio y URL de compra.');
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
        setProdTitle(''); setProdPrice(''); setProdImage(''); setProdUrl(''); setAdminPassword('');
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
        description: 'Fotografía exclusiva en alta resolución.',
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
        setPhotoTitleInput(''); setPhotoUrlInput(''); setAdminPassword('');
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
      description: description || 'Disfruta de este contenido en alta definición.',
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

  const handleShare = (video?: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = video ? `${window.location.origin}${window.location.pathname}?v=${video.id}` : window.location.href;
    const shareTitle = video ? video.title : 'Flixxes';
    if (navigator.share) {
      navigator.share({ title: shareTitle, url: shareUrl }).catch(() => {});
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
      <div className="min-h-screen bg-black flex items-center justify-center p-6 w-full overflow-x-hidden selection:bg-blue-500 selection:text-white">
        <div className="bg-zinc-950/90 border border-zinc-800/80 p-8 md:p-10 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <h1 className="text-4xl font-black text-white tracking-tight">FLIX<span className="text-blue-500">XES</span></h1>
          <p className="text-xs text-zinc-400 leading-relaxed">Este sitio contiene material exclusivo y para adultos. Debes confirmar que eres mayor de edad para ingresar a la plataforma.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 text-sm tracking-wider">SOY MAYOR DE EDAD - INGRESAR</button>
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
    <main className={`min-h-screen ${isCinemaMode ? 'bg-black' : 'bg-[#0a0a0a]'} text-zinc-200 flex flex-col justify-between w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300 selection:bg-blue-500 selection:text-white`}>
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <nav className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 w-full max-w-[100vw] shadow-lg">
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setShowMenu(true)}
              className="text-zinc-200 hover:bg-zinc-800/80 p-2.5 rounded-xl transition-all focus:outline-none flex items-center gap-2 border border-zinc-800/50 hover:border-zinc-700"
            >
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs font-extrabold hidden sm:inline tracking-wide">Menú</span>
            </button>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <h1 className="text-xl md:text-2xl font-black text-white cursor-pointer tracking-tighter hover:opacity-90 transition-opacity" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setViewingProfile(null); setShowSocialFeed(false); }}>
              FLIX<span className="text-blue-500">XES</span>
            </h1>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0 ml-auto">
            <button
              onClick={() => setShowChatDrawer(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs px-3.5 py-2 rounded-xl font-bold border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1.5 shadow"
            >
              <span>💬</span>
              <span className="hidden md:inline">Chat</span>
            </button>
            <button
              onClick={() => handleOpenProfile(currentUsername)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl font-extrabold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
            >
              <span>👤</span>
              <span className="hidden md:inline">Perfil</span>
            </button>
          </div>
        </nav>

        <div className="bg-[#0f0f0f]/80 backdrop-blur-md border-b border-zinc-800/60 px-4 py-3 flex flex-wrap items-center justify-center gap-3 w-full shadow-inner">
          <button
            onClick={() => setShowStore(true)}
            className="bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs px-4 py-2 rounded-xl font-bold border border-zinc-800 transition-all flex items-center gap-2 shadow"
          >
            <span>🛍️</span>
            <span>Tienda</span>
          </button>
          <button 
            onClick={handleInstallClick}
            className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs px-4 py-2 rounded-xl font-black transition-all border border-blue-500/30 shadow flex items-center gap-2"
          >
            <span>📱</span>
            <span>Instalar App</span>
          </button>
        </div>

        {showMenu && (
          <div className="fixed inset-0 z-50 flex max-w-[100vw] overflow-x-hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setShowMenu(false)}></div>
            <div className="relative bg-[#121212] border-r border-zinc-800 w-80 max-w-[85vw] h-full p-6 flex flex-col z-10 overflow-y-auto space-y-5 shadow-2xl animate-slideRight">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <h2 className="text-base font-black text-white tracking-widest uppercase">Menú Principal</h2>
                <button onClick={() => setShowMenu(false)} className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors">✕</button>
              </div>
              <div className="flex flex-col space-y-2 text-sm font-semibold">
                <button onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setViewingProfile(null); setShowSocialFeed(false); setShowMenu(false); }} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-left text-zinc-200 transition-colors">🏠 Inicio</button>
                <button onClick={() => { setShowSocialFeed(true); setShowMenu(false); }} className="flex items-center gap-3.5 p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold transition-colors">💬 Feed Social</button>
                <button onClick={() => { setShowChatDrawer(true); setShowMenu(false); }} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-left text-zinc-200 transition-colors">📥 Chat en Vivo</button>
                <button onClick={() => { handleOpenProfile(currentUsername); setShowMenu(false); }} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-left text-zinc-200 transition-colors">👤 Mi Perfil</button>
                <button onClick={() => { setActiveTag('Fotos'); setShowMenu(false); setViewingProfile(null); setShowSocialFeed(false); }} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-left text-zinc-200 transition-colors">📷 Galería de Fotos</button>
                <button onClick={() => { setShowWatchLaterModal(true); setShowMenu(false); }} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-left text-zinc-200 transition-colors">⭐ Guardados ({watchLater.length})</button>
                <button onClick={() => { setShowStore(true); setShowMenu(false); }} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-left text-zinc-200 transition-colors">🛍️ Tienda</button>
                <div className="pt-3 border-t border-zinc-800/80 space-y-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-zinc-500 px-3 tracking-widest block">Categorías</span>
                  {defaultTags.filter(t => t !== 'Todos').map(t => (
                    <button key={t} onClick={() => { setActiveTag(t); setShowMenu(false); setViewingProfile(null); setShowSocialFeed(false); }} className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                      #{t}
                    </button>
                  ))}
                </div>
                <div className="pt-3">
                  <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-center shadow-lg shadow-blue-600/20 transition-all">+ Publicar (Admin)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showChatDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fadeIn" onClick={() => setShowChatDrawer(false)}></div>
            <div className="relative bg-[#121212] border-l border-zinc-800 w-full max-w-sm h-full flex flex-col z-10 shadow-2xl">
              <div className="p-4.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💬</span>
                  <h3 className="font-extrabold text-white text-xs tracking-wider uppercase">Chat Comunidad</h3>
                </div>
                <button onClick={() => setShowChatDrawer(false)} className="text-zinc-400 hover:text-white p-1.5 text-xs font-bold bg-zinc-900 rounded-lg">Cerrar</button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="bg-zinc-900/60 border border-zinc-800/70 p-3.5 rounded-2xl space-y-1.5 shadow-inner">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-blue-400">@{msg.user}</span>
                      <span className="text-zinc-500">{msg.created_at}</span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChatMessage} className="p-3.5 border-t border-zinc-800 bg-zinc-950 flex gap-2.5">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-blue-500 transition-colors"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow transition-all">Enviar</button>
              </form>
            </div>
          </div>
        )}

        {viewingProfile && (
          <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
            <div className="bg-zinc-900/50 border border-zinc-800/80 p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-2xl backdrop-blur-xl">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black text-3xl flex items-center justify-center flex-shrink-0 shadow-xl border border-blue-400/30">
                {viewingProfile.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-white tracking-tight">@{viewingProfile}</h2>
                  {viewingProfile !== currentUsername && (
                    <button
                      onClick={() => handleToggleFollow(viewingProfile)}
                      className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow ${followingMap[viewingProfile] ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'}`}
                    >
                      {followingMap[viewingProfile] ? 'Siguiendo ✓' : 'Seguir +'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-400">Creador verificado de contenido en la red Flixxes.</p>
                <div className="flex justify-center sm:justify-start gap-4 text-xs text-zinc-300 font-semibold pt-1">
                  <span>Videos publicados: <strong className="text-blue-400">{videos.filter(v => v.author === viewingProfile).length}</strong></span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Publicaciones de @{viewingProfile}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.filter(v => v.author === viewingProfile).map(v => (
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
                ))}
              </div>
            </div>
            <div className="pt-4 flex justify-center">
              <button onClick={() => setViewingProfile(null)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold px-6 py-3 rounded-xl border border-zinc-800 transition-all shadow">
                ← Volver al Inicio
              </button>
            </div>
          </div>
        )}

        {showSocialFeed && !viewingProfile && (
          <div className="px-4 py-10 max-w-2xl mx-auto w-full space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <h2 className="text-lg font-black text-white tracking-wide">Comunidad y Muro Social</h2>
              </div>
              <button onClick={() => setShowSocialFeed(false)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs px-4 py-2 rounded-xl font-bold border border-zinc-800 transition-all">Cerrar</button>
            </div>
            <form onSubmit={handleCreateSocialPost} className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-3xl space-y-3.5 shadow-xl backdrop-blur-xl">
              <textarea
                placeholder="¿Qué estás pensando compartir con la comunidad?"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl text-xs text-white outline-none focus:border-blue-500 resize-none transition-colors shadow-inner"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-400 font-bold">@{currentUsername}</span>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all">Publicar</button>
              </div>
            </form>
            <div className="space-y-4">
              {socialPosts.map(post => (
                <div key={post.id} className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-3xl space-y-3 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span onClick={() => handleOpenProfile(post.user)} className="font-extrabold text-blue-400 text-xs hover:underline cursor-pointer">
                      @{post.user}
                    </span>
                    <span className="text-[10px] text-zinc-500">{post.created_at}</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs">
                    <button onClick={() => handleLikePost(post.id)} className="text-zinc-400 hover:text-blue-400 font-bold flex items-center gap-1.5 transition-colors">
                      👍 {post.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!viewingProfile && !showSocialFeed && (
          <>
            <section className="px-4 md:px-8 pt-6 pb-3 w-full max-w-[100vw] overflow-x-hidden box-border">
              <div className="mb-4 max-w-4xl mx-auto w-full">
                <input
                  type="text"
                  placeholder="Buscar por título, categoría o etiqueta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#141414] border border-zinc-800/80 p-3.5 rounded-2xl text-xs focus:border-blue-500 outline-none text-zinc-200 shadow-xl transition-all"
                />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-800/60 max-w-7xl mx-auto w-full">
                <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar w-full max-w-full">
                  {defaultTags.map(tag => (
                    <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeTag === tag ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-zinc-800/80'}`}>
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-xl text-xs flex-shrink-0 shadow-inner">
                  <button onClick={() => setSortBy('recent')} className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${sortBy === 'recent' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>Recientes</button>
                  <button onClick={() => setSortBy('popular')} className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${sortBy === 'popular' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>Populares</button>
                </div>
              </div>
            </section>

            {verticalShorts.length > 0 && (
              <section className="px-4 md:px-8 py-4 w-full max-w-[100vw] overflow-x-hidden box-border max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-blue-400 tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Shorts Verticales ({verticalShorts.length})
                  </h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
                  {verticalShorts.map((v, index) => (
                    <div
                      key={`short-${v.id}`}
                      onClick={() => {
                        setActiveShortIndex(index);
                        handleSelectVideo(v);
                      }}
                      className="min-w-[150px] max-w-[150px] h-[265px] bg-zinc-950 rounded-2xl overflow-hidden relative flex-shrink-0 snap-start border border-zinc-800/80 shadow-xl group cursor-pointer flex items-center justify-center hover:border-blue-500/50 transition-all duration-300"
                    >
                      <img
                        src={v.cover_url || DEFAULT_COVER_IMAGE}
                        alt={v.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover bg-black group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                        <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug drop-shadow">{v.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {photoGallery.length > 0 && (activeTag === 'Todos' || activeTag === 'Fotos') && (
              <section className="px-4 md:px-8 py-4 w-full max-w-[100vw] overflow-x-hidden box-border max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-pink-400 tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span> Galería de Fotos ({photoGallery.length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                  {photoGallery.map((photo) => {
                    const isSaved = watchLater.some(v => v.id === photo.id);
                    return (
                      <div
                        key={`photo-${photo.id}`}
                        onClick={() => handleSelectVideo(photo)}
                        className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-pointer group flex flex-col relative shadow-lg hover:border-pink-500/50 transition-all duration-300"
                      >
                        <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                          <img 
                            src={photo.cover_url} 
                            alt={photo.title} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" 
                          />
                          <button
                            onClick={(e) => toggleWatchLater(photo, e)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow ${isSaved ? 'bg-blue-600 text-white scale-105' : 'bg-black/60 text-white hover:bg-black hover:scale-105'}`}
                          >
                            ⭐
                          </button>
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-bold text-zinc-100 line-clamp-1 group-hover:text-pink-400 transition-colors">{photo.title}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="px-4 md:px-8 py-2 w-full max-w-[100vw] max-w-7xl mx-auto">
              <div className="bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center shadow-inner mb-6 backdrop-blur-sm">
                <AdsterraBlock zoneId="3837baa3b86f4b03245779a93841cdf8"/>
              </div>
            </section>

            {horizontalVideos.length > 0 && activeTag !== 'Fotos' && (
              <section className="px-4 md:px-8 pb-16 pt-2 w-full max-w-[100vw] overflow-x-hidden box-border max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4 border-t border-zinc-800/60 pt-6">
                  <h3 className="text-xs font-black text-zinc-300 tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span> Videos Horizontales ({horizontalVideos.length})
                  </h3>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <div key={n} className="animate-pulse flex flex-col space-y-3 w-full bg-zinc-900/30 p-3 rounded-2xl border border-zinc-800/50">
                        <div className="aspect-video rounded-xl bg-zinc-800/80 w-full"></div>
                        <div className="h-4 bg-zinc-800/80 rounded w-3/4"></div>
                        <div className="h-3 bg-zinc-800/80 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-full">
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

        {selectedVideo && !isPipActive && (
          <>
            <DraggableAdPopup zoneId="df896f70ade366b92d5f509ddfef3a78"/>
            {selectedVideo.is_short ? (
              <div 
                ref={shortContainerRef}
                className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between overflow-y-scroll snap-y snap-mandatory no-scrollbar"
                style={{ scrollSnapType: 'y mandatory' }}
              >
                {videos.filter(v => v.is_short).map((v, sIndex) => {
                  const isCurrent = v.id === selectedVideo.id;
                  const isSaved = watchLater.some(item => item.id === v.id);
                  const showAdAfterThisShort = sIndex === 1 || (sIndex > 1 && (sIndex - 1) % 4 === 0);

                  return (
                    <div 
                      key={`fullscreen-short-${v.id}-${sIndex}`}
                      className="w-full h-full min-h-screen min-w-full snap-center relative flex flex-col items-center justify-center bg-black flex-shrink-0"
                    >
                      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
                        <button onClick={handleCloseVideo} className="text-white bg-zinc-900/80 hover:bg-zinc-800 p-2.5 rounded-full backdrop-blur-md transition-all border border-zinc-700/50">
                          ✕
                        </button>
                        <span className="text-white text-xs font-black uppercase tracking-widest bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-zinc-700/50 shadow">
                          ⚡ Feed Vertical ({sIndex + 1}/{videos.filter(item => item.is_short).length})
                        </span>
                        <button onClick={(e) => handleShare(v, e)} className="text-white bg-zinc-900/80 hover:bg-zinc-800 p-2.5 rounded-full backdrop-blur-md transition-all border border-zinc-700/50">
                          🔗
                        </button>
                      </div>

                      <div className="w-full h-full max-w-md relative flex items-center justify-center bg-black">
                        {isCurrent ? (
                          <div
                            key={`active-iframe-${v.id}`}
                            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 absolute inset-0"
                            dangerouslySetInnerHTML={{
                              __html: v.voe_url.includes('<iframe')
                                ? v.voe_url.replace('<iframe', '<iframe sandbox="allow-scripts allow-same-origin allow-presentation"')
                                : `<iframe src="${v.voe_url}${v.voe_url.includes('?') ? '&' : '?'}autoplay=1" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-presentation" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="${v.title}"></iframe>`
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <img src={v.cover_url || DEFAULT_COVER_IMAGE} alt={v.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        
                        <div className="absolute bottom-20 left-4 right-20 z-10 space-y-2.5 pointer-events-none">
                          <div className="flex items-center gap-2.5 pointer-events-auto" onClick={(e) => handleOpenProfile(v.author || 'FlixxesUser', e)}>
                            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-xs border border-white/20 shadow-lg">
                              {(v.author || 'F').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white text-xs font-bold drop-shadow-md">@{v.author || 'FlixxesUser'}</span>
                          </div>
                          <p className="text-white text-xs font-medium drop-shadow-md line-clamp-2 leading-snug">{v.title}</p>
                        </div>
                        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
                          <button
                            onClick={() => handleLike(v.id)}
                            className="flex flex-col items-center text-white gap-1 group"
                          >
                            <div className={`p-3.5 rounded-2xl backdrop-blur-xl transition-all shadow-xl ${userLikedMap[v.id] ? 'bg-blue-600 text-white scale-110' : 'bg-black/60 hover:bg-black'}`}>
                              ❤️
                            </div>
                            <span className="text-[10px] font-bold drop-shadow">{likesMap[v.id] || 0}</span>
                          </button>
                          <button
                            onClick={(e) => toggleWatchLater(v, e)}
                            className="flex flex-col items-center text-white gap-1"
                          >
                            <div className={`p-3.5 rounded-2xl backdrop-blur-xl transition-all shadow-xl ${isSaved ? 'bg-blue-600 text-white scale-110' : 'bg-black/60 hover:bg-black'}`}>
                              ⭐
                            </div>
                            <span className="text-[10px] font-bold drop-shadow">Guardar</span>
                          </button>
                        </div>
                      </div>

                      {showAdAfterThisShort && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/95 px-6 backdrop-blur-xl animate-fadeIn">
                          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-5">
                            <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block">Publicidad Recomendada</span>
                            <div className="flex justify-center">
                              <AdsterraBlock zoneId="3837baa3b86f4b03245779a93841cdf8"/>
                            </div>
                            <button 
                              onClick={() => {
                                const nextElement = shortContainerRef.current?.children[sIndex + 1];
                                if (nextElement) {
                                  nextElement.scrollIntoView({ behavior: 'smooth' });
                                }
                              }} 
                              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/20"
                            >
                              Continuar viendo videos ➔
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center items-center pointer-events-none text-[11px] text-zinc-400 font-medium">
                        <span className="bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-zinc-800">Desliza hacia arriba o abajo para descubrir más videos 👇</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-xl overflow-y-auto animate-fadeIn" onClick={handleCloseVideo}>
                <div className={`bg-[#0f0f0f] w-full min-h-screen md:min-h-0 ${isCinemaMode ? 'md:max-w-6xl' : 'md:max-w-4xl'} md:rounded-3xl overflow-hidden flex flex-col my-auto border border-zinc-800/80 shadow-2xl`} onClick={e => e.stopPropagation()}>
                  <div className="bg-zinc-950 px-5 py-3 border-b border-zinc-800/80 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      {!selectedVideo.is_photo && (
                        <>
                          <button onClick={() => setIsCinemaMode(!isCinemaMode)} className={`px-3.5 py-1.5 rounded-xl font-bold border transition-all ${isCinemaMode ? 'bg-blue-600 text-white border-blue-500 shadow' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'}`}>
                            Modo Cine
                          </button>
                          <button onClick={() => setIsPipActive(true)} className="px-3.5 py-1.5 rounded-xl font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition-all">
                            PiP
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {!selectedVideo.is_photo && (
                        <button onClick={() => {
                          const currentIndex = horizontalVideos.findIndex(v => v.id === selectedVideo.id);
                          if (currentIndex !== -1) {
                            const nextV = horizontalVideos[(currentIndex + 1) % horizontalVideos.length];
                            handleSelectVideo(nextV);
                          }
                        }} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-1.5 rounded-xl shadow transition-all">
                          Siguiente ➔
                        </button>
                      )}
                    </div>
                  </div>
                  {selectedVideo.is_photo ? (
                    <div className="w-full bg-black flex justify-center items-center py-8">
                      <img 
                        src={selectedVideo.cover_url} 
                        alt={selectedVideo.title} 
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" 
                      />
                    </div>
                  ) : (
                    <div className="w-full bg-black flex justify-center items-center relative aspect-video w-full">
                      <div className="w-full h-full relative absolute inset-0">
                        <div
                          key={`modal-player-${selectedVideo.id}`}
                          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                          dangerouslySetInnerHTML={{
                            __html: selectedVideo.voe_url.includes('<iframe')
                              ? selectedVideo.voe_url.replace('<iframe', '<iframe sandbox="allow-scripts allow-same-origin allow-presentation"')
                              : `<iframe src="${selectedVideo.voe_url}${selectedVideo.voe_url.includes('?') ? '&' : '?'}autoplay=1" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-presentation" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="${selectedVideo.title}"></iframe>`
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-5 bg-[#0f0f0f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80">
                    <div>
                      <h2 className="font-extrabold text-white text-base md:text-lg leading-snug">{selectedVideo.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-400 font-medium">
                          👁️ {viewsMap[selectedVideo.id] !== undefined ? viewsMap[selectedVideo.id] : (selectedVideo.views || 0)} vistas
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
                      <button
                        onClick={() => handleLike(selectedVideo.id)}
                        className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow ${userLikedMap[selectedVideo.id] ? 'bg-blue-600 text-white shadow-blue-600/25' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'}`}
                      >
                        👍 {likesMap[selectedVideo.id] || 0}
                      </button>
                      <button
                        onClick={(e) => handleShare(selectedVideo, e)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-zinc-800"
                      >
                        <span>🔗</span> Compartir
                      </button>
                      <button 
                        onClick={handleCloseVideo} 
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-5 py-2.5 rounded-xl font-extrabold transition-all"
                      >
                        CERRAR
                      </button>
                    </div>
                  </div>
                  <div className="p-5 bg-zinc-950/60 border-b border-zinc-800/80 space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
                      {defaultTags.map(tag => (
                        <button
                          key={`nav-sub-${tag}`}
                          onClick={() => setActiveTag(tag)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeTag === tag ? 'bg-blue-600 text-white shadow' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center shadow-inner">
                      <AdsterraBlock zoneId="3837baa3b86f4b03245779a93841cdf8"/>
                    </div>
                  </div>
                  <div className="p-5 bg-zinc-900/40 border-t border-zinc-800/80 space-y-4">
                    <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest">
                      Sección de Comentarios
                    </h3>
                    <form onSubmit={(e) => handleAddComment(selectedVideo.id, e)} className="space-y-3">
                      <div className="flex gap-2.5">
                        <input
                          type="text"
                          placeholder="Añade un comentario constructivo..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-grow bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-xl text-xs text-white outline-none focus:border-blue-500 shadow-inner transition-colors"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-3 rounded-xl text-xs shadow transition-all">Comentar</button>
                      </div>
                    </form>
                    <div className="space-y-3 pt-2 max-h-52 overflow-y-auto pr-1">
                      {(commentsMap[selectedVideo.id] || commentsMap['default']).map(c => (
                        <div key={c.id} className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800/70 text-xs space-y-1.5 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-blue-400">@{c.user}</span>
                            <span className="text-[10px] text-zinc-500">{c.created_at}</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {showStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={() => setShowStore(false)}>
            <div className="bg-[#121212] border border-zinc-800/80 p-0 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-zinc-800/80 bg-[#0f0f0f] flex justify-between items-center">
                <h2 className="text-xl font-black text-white tracking-tight">🛍️ Tienda Oficial Flixxes</h2>
                <button onClick={() => setShowStore(false)} className="text-xs text-zinc-400 hover:text-white px-4 py-2 bg-zinc-900 rounded-xl border border-zinc-800 transition-colors">Cerrar</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="group bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:border-blue-500/50 transition-all duration-300">
                      <div className="aspect-square bg-black relative overflow-hidden">
                        <img
                          src={p.image_url || DEFAULT_COVER_IMAGE}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 mb-3 leading-snug">{p.title}</h4>
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800/60">
                          <span className="text-blue-400 font-black text-sm">{p.price}</span>
                          <a href={p.buy_url} target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-blue-600 hover:text-white text-[10px] font-black px-3.5 py-2 rounded-xl transition-all shadow">COMPRAR</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showWatchLaterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" onClick={() => setShowWatchLaterModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-3xl max-w-2xl w-full space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl backdrop-blur-xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
                <h2 className="text-lg font-black text-white tracking-tight">⭐ Contenido Guardado ({watchLater.length})</h2>
                <button onClick={() => setShowWatchLaterModal(false)} className="text-xs text-zinc-400 hover:text-white bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-800 font-bold">CERRAR</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {watchLater.map(v => (
                  <div key={v.id} className="bg-zinc-900/60 p-3 rounded-2xl flex gap-3.5 items-center border border-zinc-800/80 shadow">
                    <img
                      src={v.cover_url || DEFAULT_COVER_IMAGE}
                      alt={v.title}
                      loading="lazy"
                      decoding="async"
                      className="w-20 aspect-video rounded-xl object-cover bg-black flex-shrink-0 shadow"
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{v.title}</h4>
                      <button onClick={() => { handleSelectVideo(v); setShowWatchLaterModal(false); }} className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold mt-2 shadow transition-all">Ver ahora</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <form onSubmit={handleAdminSubmit} className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-800/80 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-xl">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                <h2 className="text-base font-black text-white tracking-wide uppercase">Panel de Administración</h2>
                <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl text-xs font-bold border border-zinc-800">
                  <button type="button" onClick={() => setAdminTab('video')} className={`px-3 py-1 rounded-lg transition-all ${adminTab === 'video' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400'}`}>Video</button>
                  <button type="button" onClick={() => setAdminTab('photo')} className={`px-3 py-1 rounded-lg transition-all ${adminTab === 'photo' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400'}`}>Foto</button>
                  <button type="button" onClick={() => setAdminTab('afiliado')} className={`px-3 py-1 rounded-lg transition-all ${adminTab === 'afiliado' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400'}`}>Afiliado</button>
                </div>
              </div>
              <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
              {adminTab === 'afiliado' ? (
                <>
                  <input type="text" placeholder="Título del producto" value={prodTitle} onChange={e => setProdTitle(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                  <input type="text" placeholder="Precio ($29.99)" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                  <input type="text" placeholder="URL imagen" value={prodImage} onChange={e => setProdImage(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                  <input type="text" placeholder="URL compra" value={prodUrl} onChange={e => setProdUrl(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                </>
              ) : adminTab === 'photo' ? (
                <>
                  <input type="text" placeholder="Título de la foto" value={photoTitleInput} onChange={e => setPhotoTitleInput(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                  <input type="text" placeholder="URL de la foto" value={photoUrlInput} onChange={e => setPhotoUrlInput(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                </>
              ) : (
                <>
                  <input type="text" placeholder="Título del video" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                  <div className="flex items-center justify-between bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-300 font-bold">Tipo de formato:</span>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsShortVideo(false)}
                        className={`px-3 py-1.5 text-xs font-bold transition-all rounded-md ${!isShortVideo ? 'bg-blue-600 text-white shadow' : 'bg-zinc-800 text-zinc-400'}`}
                      >
                        Horizontal
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsShortVideo(true)}
                        className={`px-3 py-1.5 text-xs font-bold transition-all rounded-md ${isShortVideo ? 'bg-blue-600 text-white shadow' : 'bg-zinc-800 text-zinc-400'}`}
                      >
                        Vertical (Short)
                      </button>
                    </div>
                  </div>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-zinc-300 outline-none shadow-inner">
                    {defaultTags.filter(t => t !== 'Todos' && t !== 'Fotos').map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <textarea placeholder="Description del contenido" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none resize-none shadow-inner" />
                  <input type="text" placeholder="URL del video embed" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                  <input type="text" placeholder="URL Miniatura (Opcional)" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 shadow-inner" />
                </>
              )}
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-all border border-zinc-800">Cancelar</button>
                <button type="submit" className="w-full p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all">Publicar</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="bg-black border-t border-zinc-900 py-12 px-6 mt-16 text-center text-xs text-zinc-500 space-y-6 w-full max-w-[100vw] overflow-x-hidden">
        <div className="max-w-3xl mx-auto space-y-3">
          <h3 className="text-zinc-300 font-extrabold uppercase tracking-widest text-xs">AVISO LEGAL DE LA COMUNIDAD</h3>
          <p className="leading-relaxed text-[11px] text-zinc-400">
            Todo el material alojado en esta plataforma es recopilado de sitios públicos de internet. Acceso estrictamente prohibido a menores de 18 años.
          </p>
        </div>
        <p className="text-zinc-600 text-[10px] tracking-wider">© FLIXXES.COM 2016-2026 • TODOS LOS DERECHOS RESERVADOS</p>
      </footer>
    </main>
  );
}

