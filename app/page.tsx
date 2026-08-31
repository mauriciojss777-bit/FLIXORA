'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
const ADSTERRA_SMARTLINK = 'https://www.profitableratecpmnetwork.com/u9xtrrbj?key=5e1242fb44358ba404f094359ad59a45';

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
    <div className="ads-grid-wrapper w-full flex flex-col justify-center items-center overflow-hidden bg-transparent my-2">
      <div ref={containerRef} className="ad-box flex justify-center items-center w-full max-w-full overflow-x-hidden min-h-[120px]" />
    </div>
  );
}

function NativeBannerBlock({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://pl30814143.profitableratecpmnetwork.com/${zoneId}/invoke.js`;

    const innerDiv = document.createElement('div');
    innerDiv.id = `container-${zoneId}`;

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(innerDiv);
  }, [zoneId]);

  return (
    <div className="ads-grid-wrapper w-full flex flex-col justify-center items-center overflow-hidden bg-transparent my-2">
      <div ref={containerRef} className="ad-box flex justify-center items-center w-full max-w-full overflow-x-hidden min-h-[100px]" />
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
    setDragOffset({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleTouchMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({ x: clientX - dragOffset.x, y: clientY - dragOffset.y });
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
          <button onClick={() => setMinimized(!minimized)} className="text-zinc-400 hover:text-white text-xs px-1 font-bold">{minimized ? '+' : '−'}</button>
          <button onClick={() => setIsVisible(false)} className="text-zinc-400 hover:text-red-400 text-xs px-1 font-bold">✕</button>
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

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all ${
      type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300' : 'bg-red-950/90 border-red-500/50 text-red-300'
    }`}>
      <span>{type === 'success' ? '✓' : '⚠️'}</span>
      <span>{message}</span>
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
  onOpenProfile,
  onDonate,
  onShare 
}: { 
  video: Video; 
  onSelect: (v: Video) => void; 
  isSaved: boolean; 
  onToggleSave: (v: Video, e: React.MouseEvent) => void; 
  likesCount: number;
  viewsCount: number;
  onOpenProfile: (username: string, e: React.MouseEvent) => void;
  onDonate: (e: React.MouseEvent) => void;
  onShare: (video: Video, e: React.MouseEvent) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (video.is_photo) return;
    timeoutRef.current = setTimeout(() => setIsHovered(true), 250);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(false);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

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
              <img 
                src={video.cover_url || DEFAULT_COVER_IMAGE} 
                alt={video.title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300" 
              />
              <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-zinc-700/50">
                {video.is_photo ? '📷 Foto' : (video.is_short ? '⚡ Vertical' : video.category)}
              </span>
            </>
          ) : (
            <div className="w-full h-full absolute inset-0 overflow-hidden flex items-center justify-center bg-black pointer-events-none">
              <div 
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                dangerouslySetInnerHTML={{ 
                  __html: video.voe_url.includes('<iframe') 
                    ? video.voe_url.replace('<iframe', '<iframe sandbox="allow-scripts allow-same-origin allow-presentation"') 
                    : `<iframe src="${video.voe_url}${video.voe_url.includes('?') ? '&' : '?'}autoplay=1&mute=1" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-presentation" allow="autoplay" title="${video.title}"></iframe>`
                }} 
              />
            </div>
          )}

          <button 
            onClick={(e) => onToggleSave(video, e)}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all z-10 ${isSaved ? 'bg-blue-600 text-white' : 'bg-black/60 text-white hover:bg-black'}`}
          >
            ⭐
          </button>
        </div>
        
        <div className="p-3 flex gap-2.5 w-full items-start">
          <div 
            onClick={(e) => onOpenProfile(video.author || 'FlixxesUser', e)}
            className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black flex items-center justify-center flex-shrink-0 text-xs hover:bg-blue-600 hover:text-white transition-colors"
          >
            {(video.author || 'F').charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{video.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-400 font-medium flex-wrap">
              <span onClick={(e) => onOpenProfile(video.author || 'FlixxesUser', e)} className="hover:text-blue-400 underline cursor-pointer">
                {video.author || 'FlixxesUser'}
              </span>
              <span>•</span>
              <span>👁️ {viewsCount}</span>
              <span>•</span>
              <span>👍 {likesCount}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/60">
              <button onClick={(e) => { e.stopPropagation(); onDonate(e); }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors"><span>☕</span> Donar</button>
              <button onClick={(e) => { e.stopPropagation(); onShare(video, e); }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors"><span>🔗</span> Compartir</button>
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
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

  const showToast = (text: string, type: 'success' | 'error' = 'success') => setToastMessage({ text, type });

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) {
        const enriched = data.map(v => ({ ...v, author: v.author || 'FlixxesOfficial' }));
        setVideos(enriched);
        const vMap: Record<string, number> = {};
        data.forEach(v => { vMap[v.id] = v.views || 0; });
        setViewsMap(vMap);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('age_verified') === 'true') setAgeAccepted(true);
      const savedUser = localStorage.getItem('flixxes_username');
      if (savedUser) setCurrentUsername(savedUser);

      const savedHistory = localStorage.getItem('flixxes_history');
      if (savedHistory) { try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); } }
      const savedWatchLater = localStorage.getItem('flixxes_watch_later');
      if (savedWatchLater) { try { setWatchLater(JSON.parse(savedWatchLater)); } catch (e) { console.error(e); } }

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
      const { data: currentVideo } = await supabase.from('videos').select('views').eq('id', videoId).single();
      const newViews = (currentVideo?.views || 0) + 1;
      await supabase.from('videos').update({ views: newViews }).eq('id', videoId);
      setViewsMap(prev => ({ ...prev, [videoId]: newViews }));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('v');
    if (vId && videos.length > 0 && !selectedVideo) {
      const video = videos.find(v => v.id === vId);
      if (video) { setSelectedVideo(video); incrementRealView(video.id); }
    }
  }, [videos, selectedVideo, incrementRealView]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      showToast('Para instalar la app, usa el menú de tu navegador.', 'error');
    }
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
    window.open(ADSTERRA_SMARTLINK, '_blank');
    setSelectedVideo(null);
    setIsPipActive(false);
    setIsCinemaMode(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  const toggleWatchLater = (video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = watchLater.some(v => v.id === video.id);
    const updated = exists ? watchLater.filter(v => v.id !== video.id) : [video, ...watchLater];
    setWatchLater(updated);
    localStorage.setItem('flixxes_watch_later', JSON.stringify(updated));
    showToast(exists ? 'Eliminado de guardados' : 'Añadido a guardados ⭐', 'success');
  };

  const handleNextVideo = () => {
    if (!selectedVideo || videos.length === 0) return;
    const currentIndex = videos.findIndex(v => v.id === selectedVideo.id);
    handleSelectVideo(videos[(currentIndex + 1) % videos.length]);
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
      showToast('Contraseña incorrecta', 'error');
      return;
    }

    if (adminTab === 'afiliado') {
      if (!prodTitle.trim() || !prodPrice.trim() || !prodUrl.trim()) {
        showToast('Completa título, precio y URL', 'error');
        return;
      }
      const { error } = await supabase.from('products').insert([{ title: prodTitle, price: prodPrice, image_url: prodImage.trim() || DEFAULT_COVER_IMAGE, buy_url: prodUrl }]);
      if (error) showToast('Error: ' + error.message, 'error');
      else {
        showToast('Producto añadido con éxito');
        setShowAdminModal(false);
        setProdTitle(''); setProdPrice(''); setProdImage(''); setProdUrl(''); setAdminPassword('');
        fetchProducts();
      }
      return;
    }

    if (adminTab === 'photo') {
      if (!photoUrlInput.trim() || !photoTitleInput.trim()) {
        showToast('Completa título y URL de la foto', 'error');
        return;
      }
      const { error } = await supabase.from('videos').insert([{ title: photoTitleInput, category: 'Fotos', voe_url: '', cover_url: photoUrlInput, description: 'Fotografía exclusiva en alta resolución.', tags: ['Fotos', 'HD'], is_photo: true, is_short: false, author: currentUsername, views: 0 }]);
      if (error) showToast('Error: ' + error.message, 'error');
      else {
        showToast('Foto publicada con éxito');
        setShowAdminModal(false);
        setPhotoTitleInput(''); setPhotoUrlInput(''); setAdminPassword('');
        fetchVideos();
      }
      return;
    }

    const parsedTags = videoTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from('videos').insert([{ title, category, voe_url: voeUrl, cover_url: coverUrl.trim() || DEFAULT_COVER_IMAGE, description: description || 'Disfruta de este contenido en alta definición.', tags: parsedTags.length > 0 ? parsedTags : [category, 'HD'], is_short: isShortVideo, is_photo: false, author: currentUsername, views: 0 }]);

    if (error) showToast('Error: ' + error.message, 'error');
    else {
      showToast('Publicado con éxito');
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setVideoTagsInput('HD, Latino, Casero'); setIsShortVideo(false); setAdminPassword('');
      fetchVideos();
    }
  };

  const handleShare = (video?: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = video ? `${window.location.origin}${window.location.pathname}?v=${video.id}` : window.location.href;
    const shareTitle = video ? video.title : 'Flixxes';
    if (navigator.share) navigator.share({ title: shareTitle, url: shareUrl }).catch(() => {});
    else {
      navigator.clipboard.writeText(shareUrl);
      showToast('¡Enlace copiado al portapapeles!');
    }
  };

  const handleAddComment = (videoId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const commentItem: Comment = { id: Date.now().toString(), user: currentUsername || 'Anónimo', text: newCommentText.trim(), created_at: 'Justo ahora' };
    setCommentsMap({ ...commentsMap, [videoId]: [commentItem, ...(commentsMap[videoId] || commentsMap['default'])] });
    setNewCommentText('');
    showToast('Comentario publicado');
  };

  const handleToggleFollow = (username: string) => {
    const isFollowing = !!followingMap[username];
    setFollowingMap({ ...followingMap, [username]: !isFollowing });
    showToast(isFollowing ? `Dejaste de seguir a @${username}` : `Siguiendo a @${username} ✓`);
  };

  const handleCreateSocialPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setSocialPosts([{ id: Date.now().toString(), user: currentUsername, content: newPostText.trim(), likes: 0, created_at: 'Justo ahora' }, ...socialPosts]);
    setNewPostText('');
    showToast('Publicación compartida en el feed');
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
    setChatMessages([...chatMessages, { id: Date.now().toString(), user: currentUsername, text: chatInput.trim(), created_at: 'Justo ahora' }]);
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

  const filteredVideos = videos.filter(v => {
    const vTags = Array.isArray(v.tags) ? v.tags : (v.tags ? [String(v.tags)] : []);
    const matchesTag = activeTag === 'Todos' || (activeTag === 'Fotos' ? v.is_photo : (v.category === activeTag || vTags.some(t => t.toLowerCase() === activeTag.toLowerCase())));
    const query = searchQuery.toLowerCase();
    const matchesSearch = v.title.toLowerCase().includes(query) || (v.category && v.category.toLowerCase().includes(query)) || vTags.some(t => t.toLowerCase().includes(query)) || (v.author && v.author.toLowerCase().includes(query));
    return matchesTag && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'likes') return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
    if (sortBy === 'popular') return (viewsMap[b.id] || 0) - (viewsMap[a.id] || 0);
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  const horizontalVideos = filteredVideos.filter(v => !v.is_short && !v.is_photo);
  const photoGallery = filteredVideos.filter(v => v.is_photo);
  const verticalShorts = filteredVideos.filter(v => v.is_short);
  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(storeSearchQuery.toLowerCase()));

  return (
    <main className={`min-h-screen ${isCinemaMode ? 'bg-black' : 'bg-[#0f0f0f]'} text-zinc-200 flex flex-col justify-between w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300`}>
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        
        {toastMessage && <Toast message={toastMessage.text} type={toastMessage.type} onClose={() => setToastMessage(null)} />}

        <nav className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 flex items-center justify-between gap-3 w-full max-w-[100vw]">
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowMenu(true)} className="text-zinc-200 hover:bg-zinc-800 p-2 rounded-xl transition-colors focus:outline-none flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="text-xs font-bold hidden sm:inline">Menú</span>
            </button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <h1 className="text-xl font-black text-white cursor-pointer tracking-tight" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setViewingProfile(null); setShowSocialFeed(false); }}>
              FLIX<span className="text-blue-500">XES</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <button onClick={() => setShowChatDrawer(true)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-full font-bold border border-zinc-750 transition-all flex items-center gap-1">
              <span>💬</span><span className="hidden md:inline">Chat</span>
            </button>
            <button onClick={() => handleOpenProfile(currentUsername)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-1.5 rounded-full font-bold transition-all shadow flex items-center gap-1.5">
              <span>👤</span><span className="hidden md:inline">Perfil</span>
            </button>
          </div>
        </nav>

        <div className="bg-[#141414] border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-center gap-3 w-full">
          <button onClick={() => setShowDonateModal(true)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs px-4 py-2 rounded-full font-bold border border-zinc-700 transition-all flex items-center gap-1.5 shadow"><span>☕</span><span>Donar</span></button>
          <button onClick={() => setShowStore(true)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs px-4 py-2 rounded-full font-bold border border-zinc-700 transition-all flex items-center gap-1.5 shadow"><span>🛍️</span><span>Tienda</span></button>
          <button onClick={handleInstallClick} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-full font-black transition-all shadow flex items-center gap-1.5"><span>📱</span><span>Instalar App</span></button>
        </div>

        {showMenu && (
          <div className="fixed inset-0 z-50 flex max-w-[100vw] overflow-x-hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
            <div className="relative bg-[#181818] border-r border-zinc-800 w-80 max-w-[85vw] h-full p-6 flex flex-col z-10 overflow-y-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h2 className="text-lg font-black text-white tracking-wider">MENÚ PRINCIPAL</h2>
                <button onClick={() => setShowMenu(false)} className="text-zinc-400 hover:text-white p-2">✕</button>
              </div>

              <div className="flex flex-col space-y-2 text-sm font-semibold">
                <button onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setViewingProfile(null); setShowSocialFeed(false); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🏠 Inicio</button>
                <button onClick={() => { setShowSocialFeed(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold">💬 Feed Social</button>
                <button onClick={() => { setShowChatDrawer(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📥 Chat en Vivo</button>
                <button onClick={() => { handleOpenProfile(currentUsername); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">👤 Mi Perfil</button>
                <button onClick={() => { setActiveTag('Fotos'); setShowMenu(false); setViewingProfile(null); setShowSocialFeed(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📷 Galería de Fotos</button>
                <button onClick={() => { setShowWatchLaterModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">⭐ Guardados ({watchLater.length})</button>
                <button onClick={() => { setShowStore(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🛍️ Tienda</button>
                <button onClick={() => { setShowDonateModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">☕ Donar</button>
                
                <div className="pt-2 border-t border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 px-3 tracking-wider">Categorías</span>
                  {defaultTags.filter(t => t !== 'Todos').map(t => (
                    <button key={t} onClick={() => { setActiveTag(t); setShowMenu(false); setViewingProfile(null); setShowSocialFeed(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white">#{t}</button>
                  ))}
                </div>

                <div className="pt-2">
                  <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full py-3 rounded-2xl bg-blue-600 text-white font-black text-center hover:bg-blue-500">+ Publicar (Admin)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showChatDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowChatDrawer(false)}></div>
            <div className="relative bg-[#141414] border-l border-zinc-800 w-full max-w-sm h-full flex flex-col z-10 shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                <div className="flex items-center gap-2"><span className="text-lg">💬</span><h3 className="font-bold text-white text-sm">Chat Comunidad</h3></div>
                <button onClick={() => setShowChatDrawer(false)} className="text-zinc-400 hover:text-white p-1.5 text-xs font-bold">Cerrar</button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center text-[10px]"><span className="font-bold text-blue-400">@{msg.user}</span><span className="text-zinc-500">{msg.created_at}</span></div>
                    <p className="text-xs text-zinc-200">{msg.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-zinc-800 bg-zinc-950 flex gap-2">
                <input type="text" placeholder="Escribe un mensaje..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-blue-500" />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold">Enviar</button>
              </form>
            </div>
          </div>
        )}

        {viewingProfile && (
          <div className="px-4 py-8 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-xl">
              <div className="w-24 h-24 rounded-2xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center flex-shrink-0 shadow-lg">{viewingProfile.charAt(0).toUpperCase()}</div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-white">@{viewingProfile}</h2>
                  {viewingProfile !== currentUsername && (
                    <button onClick={() => handleToggleFollow(viewingProfile)} className={`px-6 py-2 rounded-full font-bold text-xs transition-all ${followingMap[viewingProfile] ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                      {followingMap[viewingProfile] ? 'Siguiendo ✓' : 'Seguir +'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-400">Creador de contenido en Flixxes.</p>
                <div className="flex justify-center sm:justify-start gap-4 text-xs text-zinc-300 font-semibold pt-1"><span>Videos: <strong>{videos.filter(v => v.author === viewingProfile).length}</strong></span></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-blue-400">Publicaciones de @{viewingProfile}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {videos.filter(v => v.author === viewingProfile).map(v => (
                  <HorizontalVideoCard key={v.id} video={v} onSelect={handleSelectVideo} isSaved={watchLater.some(item => item.id === v.id)} onToggleSave={toggleWatchLater} likesCount={likesMap[v.id] || 0} viewsCount={viewsMap[v.id] !== undefined ? viewsMap[v.id] : (v.views || 0)} onOpenProfile={handleOpenProfile} onDonate={() => setShowDonateModal(true)} onShare={handleShare} />
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-center"><button onClick={() => setViewingProfile(null)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-6 py-2.5 rounded-full">← Volver al Inicio</button></div>
          </div>
        )}

        {showSocialFeed && !viewingProfile && (
          <div className="px-4 py-8 max-w-2xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div><h2 className="text-xl font-black text-white">Comunidad y Muro Social</h2></div>
              <button onClick={() => setShowSocialFeed(false)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full font-bold">Cerrar</button>
            </div>

            <form onSubmit={handleCreateSocialPost} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <textarea placeholder="¿Qué estás pensando?" value={newPostText} onChange={(e) => setNewPostText(e.target.value)} rows={3} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none focus:border-blue-500 resize-none" />
              <div className="flex justify-between items-center"><span className="text-[10px] text-zinc-500">@{currentUsername}</span><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl">Publicar</button></div>
            </form>

            <div className="space-y-4">
              {socialPosts.map(post => (
                <div key={post.id} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center"><span onClick={() => handleOpenProfile(post.user)} className="font-bold text-blue-400 text-xs hover:underline cursor-pointer">@{post.user}</span><span className="text-[10px] text-zinc-500">{post.created_at}</span></div>
                  <p className="text-xs text-zinc-200 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs"><button onClick={() => handleLikePost(post.id)} className="text-zinc-400 hover:text-blue-400 font-bold flex items-center gap-1">👍 {post.likes}</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!viewingProfile && !showSocialFeed && (
          <>
            <section className="px-4 pt-4 pb-2 w-full max-w-[100vw] overflow-x-hidden box-border">
              <div className="mb-3 w-full">
                <input type="text" placeholder="Buscar por título, categoría o etiqueta..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#121212] border border-zinc-800 p-3 rounded-2xl text-xs focus:border-blue-500 outline-none text-zinc-200 shadow-inner" />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-zinc-800/60 w-full">
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full max-w-full">
                  {defaultTags.map(tag => (
                    <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeTag === tag ? 'bg-blue-600 text-white shadow-md' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'}`}>{tag}</button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs flex-shrink-0">
                  <button onClick={() => setSortBy('recent')} className={`px-3 py-1 rounded-lg font-bold transition-all ${sortBy === 'recent' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Recientes</button>
                  <button onClick={() => setSortBy('popular')} className={`px-3 py-1 rounded-lg font-bold transition-all ${sortBy === 'popular' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Populares</button>
                </div>
              </div>
            </section>

            {verticalShorts.length > 0 && (
              <section className="px-4 py-4 w-full max-w-[100vw] overflow-x-hidden box-border">
                <div className="flex items-center justify-between mb-3"><h3 className="text-xs font-black text-blue-400 tracking-wider uppercase">⚡ Shorts Verticales ({verticalShorts.length})</h3></div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {verticalShorts.map((v) => (
                    <div key={`short-${v.id}`} onClick={() => handleSelectVideo(v)} className="min-w-[140px] max-w-[140px] h-[250px] bg-zinc-950 rounded-2xl overflow-hidden relative flex-shrink-0 snap-start border border-zinc-800 shadow-md group cursor-pointer flex items-center justify-center">
                      <img src={v.cover_url || DEFAULT_COVER_IMAGE} alt={v.title} loading="lazy" decoding="async" className="w-full h-full object-cover bg-black group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                        <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{v.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {photoGallery.length > 0 && (activeTag === 'Todos' || activeTag === 'Fotos') && (
              <section className="px-4 py-4 w-full max-w-[100vw] overflow-x-hidden box-border">
                <div className="flex items-center justify-between mb-3"><h3 className="text-xs font-black text-pink-400 tracking-wider uppercase">📷 Galería de Fotos ({photoGallery.length})</h3></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                  {photoGallery.map((photo) => {
                    const isSaved = watchLater.some(v => v.id === photo.id);
                    return (
                      <div key={`photo-${photo.id}`} onClick={() => handleSelectVideo(photo)} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group flex flex-col relative shadow">
                        <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                          <img src={photo.cover_url} alt={photo.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                          <button onClick={(e) => toggleWatchLater(photo, e)} className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${isSaved ? 'bg-blue-600 text-white' : 'bg-black/60 text-white hover:bg-black'}`}>⭐</button>
                        </div>
                        <div className="p-2.5"><h4 className="text-xs font-bold text-zinc-100 line-clamp-1 group-hover:text-blue-400 transition-colors">{photo.title}</h4></div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECCIÓN DE ANUNCIOS OPTIMIZADA EN CUADRÍCULA RESPONSIVA */}
            <section className="px-4 py-2 w-full max-w-[100vw]">
              <div className="ads-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', margin: '15px 0', width: '100%' }}>
                <div className="ad-box bg-[#1a1a1a] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-2 min-h-[120px] shadow-inner">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Patrocinado (Native)</span>
                  <NativeBannerBlock zoneId="df896f70ade366b92d5f509ddfef3a78" />
                </div>
                <div className="ad-box bg-[#1a1a1a] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-2 min-h-[120px] shadow-inner">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Publicidad</span>
                  <AdsterraBlock zoneId="3837baa3b86f4b03245779a93841cdf8" />
                </div>
              </div>
            </section>

            {horizontalVideos.length > 0 && activeTag !== 'Fotos' && (
              <section className="px-4 pb-12 pt-2 w-full max-w-[100vw] overflow-x-hidden box-border">
                <div className="flex items-center justify-between mb-3 border-t border-zinc-800/60 pt-4"><h3 className="text-xs font-black text-zinc-300 tracking-wider uppercase">📺 Videos Horizontales ({horizontalVideos.length})</h3></div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (<div key={n} className="animate-pulse flex flex-col space-y-3 w-full"><div className="aspect-video rounded-xl bg-zinc-800 w-full"></div><div className="h-4 bg-zinc-800 rounded w-3/4"></div></div>))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full max-w-full">
                    {horizontalVideos.map((video) => (
                      <HorizontalVideoCard key={video.id} video={video} onSelect={handleSelectVideo} isSaved={watchLater.some(v => v.id === video.id)} onToggleSave={toggleWatchLater} likesCount={likesMap[video.id] || 0} viewsCount={viewsMap[video.id] !== undefined ? viewsMap[video.id] : (video.views || 0)} onOpenProfile={handleOpenProfile} onDonate={() => setShowDonateModal(true)} onShare={handleShare} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {selectedVideo && !isPipActive && (
          <>
            <DraggableAdPopup zoneId="df896f70ade366b92d5f509ddfef3a78" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md overflow-y-auto" onClick={handleCloseVideo}>
              <div className={`bg-[#0f0f0f] w-full min-h-screen md:min-h-0 ${isCinemaMode ? 'md:max-w-6xl' : 'md:max-w-4xl'} md:rounded-3xl overflow-hidden flex flex-col my-auto border border-zinc-800 shadow-2xl`} onClick={e => e.stopPropagation()}>
                
                <div className="bg-zinc-950 px-4 py-2.5 border-b border-zinc-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    {!selectedVideo.is_photo && (
                      <>
                        <button onClick={() => setIsCinemaMode(!isCinemaMode)} className={`px-2.5 py-1 rounded-lg font-bold border ${isCinemaMode ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-900 text-zinc-300 border-zinc-800'}`}>Modo Cine</button>
                        <button onClick={() => setIsPipActive(true)} className="px-2.5 py-1 rounded-lg font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">PiP</button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {!selectedVideo.is_photo && (<button onClick={handleNextVideo} className="bg-blue-600 text-white font-black px-3 py-1 rounded-lg">Siguiente ➔</button>)}
                  </div>
                </div>

                {selectedVideo.is_photo ? (
                  <div className="w-full bg-black flex justify-center items-center py-6">
                    <img src={selectedVideo.cover_url} alt={selectedVideo.title} loading="lazy" decoding="async" className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl" />
                  </div>
                ) : (
                  <div className={`w-full bg-black flex justify-center items-center relative ${selectedVideo.is_short ? 'py-4' : 'aspect-video w-full'}`}>
                    <div className={`w-full h-full relative ${selectedVideo.is_short ? 'max-w-[280px] aspect-[9/16] bg-zinc-900 rounded-lg overflow-hidden shadow-lg mx-auto' : 'absolute inset-0'}`}>
                      <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0" dangerouslySetInnerHTML={{ __html: selectedVideo.voe_url.includes('<iframe') ? selectedVideo.voe_url.replace('<iframe', '<iframe sandbox="allow-scripts allow-same-origin allow-presentation"') : `<iframe src="${selectedVideo.voe_url}${selectedVideo.voe_url.includes('?') ? '&' : '?'}autoplay=1" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-presentation" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="${selectedVideo.title}"></iframe>` }} />
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-[#0f0f0f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800">
                  <div>
                    <h2 className="font-bold text-white text-base sm:text-lg">{selectedVideo.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5"><span className="text-xs text-zinc-400 font-medium">👁️ {viewsMap[selectedVideo.id] !== undefined ? viewsMap[selectedVideo.id] : (selectedVideo.views || 0)} vistas</span></div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    <button onClick={() => handleLike(selectedVideo.id)} className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-bold transition-colors ${userLikedMap[selectedVideo.id] ? 'bg-blue-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}>👍 {likesMap[selectedVideo.id] || 0}</button>
                    <button onClick={(e) => handleShare(selectedVideo, e)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3.5 py-2 rounded-full font-bold flex items-center gap-1.5 transition-colors"><span>🔗</span> Compartir</button>
                    <button onClick={() => setShowDonateModal(true)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3.5 py-2 rounded-full font-bold flex items-center gap-1.5 transition-colors"><span>☕</span> Donar</button>
                    <button onClick={handleCloseVideo} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-4 py-2 rounded-full font-bold">CERRAR</button>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 space-y-3">
                  <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar w-full">
                    {defaultTags.map(tag => (<button key={`nav-sub-${tag}`} onClick={() => setActiveTag(tag)} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeTag === tag ? 'bg-blue-600 text-white shadow-md' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'}`}>{tag}</button>))}
                  </div>

                  {/* ANUNCIOS EN CUADRÍCULA DENTRO DEL REPRODUCTOR */}
                  <div className="ads-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', margin: '10px 0', width: '100%' }}>
                    <div className="ad-box bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-2 min-h-[100px] shadow-inner">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Patrocinado (Native)</span>
                      <NativeBannerBlock zoneId="df896f70ade366b92d5f509ddfef3a78" />
                    </div>
                    <div className="ad-box bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-2 min-h-[120px] shadow-inner">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Patrocinado</span>
                      <AdsterraBlock zoneId="3837baa3b86f4b03245779a93841cdf8" />
                    </div>
                  </div>

                  {/* CARRUSEL EXCLUSIVO DE VIDEOS RECOMENDADOS (SIN INTERCALAR ANUNCIOS) */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider">Videos Recomendados</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x w-full">
                      {horizontalVideos.filter(v => v.id !== selectedVideo.id).slice(0, 10).map((v) => (
                        <div key={`video-carousel-${v.id}`} onClick={() => handleSelectVideo(v)} className="min-w-[180px] max-w-[180px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer flex flex-col group shadow flex-shrink-0 snap-start">
                          <div className="aspect-video bg-black relative overflow-hidden"><img src={v.cover_url || DEFAULT_COVER_IMAGE} alt={v.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                          <div className="p-2"><h5 className="text-[11px] font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-blue-400">{v.title}</h5></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Comentarios</h3>
                  <form onSubmit={(e) => handleAddComment(selectedVideo.id, e)} className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Añade un comentario..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} className="flex-grow bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-blue-500" />
                      <button type="submit" className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Comentar</button>
                    </div>
                  </form>
                  <div className="space-y-3 pt-2 max-h-48 overflow-y-auto pr-1">
                    {(commentsMap[selectedVideo.id] || commentsMap['default']).map(c => (
                      <div key={c.id} className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/60 text-xs space-y-1">
                        <div className="flex justify-between items-center"><span className="font-bold text-blue-400">@{c.user}</span><span className="text-[10px] text-zinc-500">{c.created_at}</span></div>
                        <p className="text-zinc-300">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {showStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowStore(false)}>
            <div className="bg-[#121212] border border-zinc-800 p-0 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-zinc-800 bg-[#0f0f0f] flex justify-between items-center">
                <h2 className="text-xl font-black text-white">🛍️ Tienda Flixxes</h2>
                <button onClick={() => setShowStore(false)} className="text-xs text-zinc-400 hover:text-white px-3 py-2 bg-zinc-900 rounded-xl">Cerrar</button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="group bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
                      <div className="aspect-square bg-black relative overflow-hidden"><img src={p.image_url || DEFAULT_COVER_IMAGE} alt={p.title} loading="lazy" decoding="async" className="w-full h-full object-cover" /></div>
                      <div className="p-3 flex flex-col flex-1">
                        <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 mb-2">{p.title}</h4>
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800/50">
                          <span className="text-blue-400 font-black text-sm">{p.price}</span>
                          <a href={p.buy_url} target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-blue-500 hover:text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors">COMPRAR</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDonateModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-black text-white">☕ Apóyame con una Donación</h2>
              <p className="text-xs text-zinc-400">Tu apoyo ayuda a mantener los servidores activos.</p>
              <a href="https://paypal.me/TU_USUARIO_PAYPAL" target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-sm transition-all">Donar con PayPal</a>
              <button onClick={() => setShowDonateModal(false)} className="w-full text-xs text-zinc-500 hover:text-white py-2">Cancelar</button>
            </div>
          </div>
        )}

        {showWatchLaterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowWatchLaterModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-2xl w-full space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-xl font-black text-white">⭐ Guardados</h2>
                <button onClick={() => setShowWatchLaterModal(false)} className="text-xs text-zinc-400 hover:text-white">CERRAR</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {watchLater.map(v => (
                  <div key={v.id} className="bg-zinc-900 p-2 rounded-xl flex gap-3 items-center border border-zinc-800">
                    <img src={v.cover_url || DEFAULT_COVER_IMAGE} alt={v.title} loading="lazy" decoding="async" className="w-20 aspect-video rounded-lg object-cover bg-black" />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{v.title}</h4>
                      <button onClick={() => { handleSelectVideo(v); setShowWatchLaterModal(false); }} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded font-bold mt-2">Ver</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <form onSubmit={handleAdminSubmit} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Panel Admin</h2>
                <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl text-xs font-bold">
                  <button type="button" onClick={() => setAdminTab('video')} className={`px-2.5 py-1 rounded-lg ${adminTab === 'video' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Video</button>
                  <button type="button" onClick={() => setAdminTab('photo')} className={`px-2.5 py-1 rounded-lg ${adminTab === 'photo' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Foto</button>
                  <button type="button" onClick={() => setAdminTab('afiliado')} className={`px-2.5 py-1 rounded-lg ${adminTab === 'afiliado' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Afiliado</button>
                </div>
              </div>

              <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
              
              {adminTab === 'afiliado' ? (
                <>
                  <input type="text" placeholder="Título del producto" value={prodTitle} onChange={e => setProdTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                  <input type="text" placeholder="Precio ($29.99)" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                  <input type="text" placeholder="URL imagen" value={prodImage} onChange={e => setProdImage(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                  <input type="text" placeholder="URL compra" value={prodUrl} onChange={e => setProdUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                </>
              ) : adminTab === 'photo' ? (
                <>
                  <input type="text" placeholder="Título de la foto" value={photoTitleInput} onChange={e => setPhotoTitleInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                  <input type="text" placeholder="URL de la foto" value={photoUrlInput} onChange={e => setPhotoUrlInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                </>
              ) : (
                <>
                  <input type="text" placeholder="Título del video" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                  <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-300 font-bold">Tipo de video:</span>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg">
                      <button type="button" onClick={() => setIsShortVideo(false)} className={`px-3 py-1 rounded text-xs font-bold transition-all ${!isShortVideo ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Horizontal</button>
                      <button type="button" onClick={() => setIsShortVideo(true)} className={`px-3 py-1 rounded text-xs font-bold transition-all ${isShortVideo ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Vertical (Short)</button>
                    </div>
                  </div>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-zinc-300 outline-none">
                    {defaultTags.filter(t => t !== 'Todos' && t !== 'Fotos').map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none resize-none" />
                  <input type="text" placeholder="URL del video embed" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                  <input type="text" placeholder="URL Miniatura (Opcional)" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none" />
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold">Cancelar y Cerrar</button>
                <button type="submit" className="w-full p-3 rounded-xl bg-blue-600 text-white font-black">Publicarendif</button>
              </div>
            </form>
          </div>
        )}

      </div>

      <footer className="bg-black border-t border-zinc-900 py-10 px-4 mt-12 text-center text-xs text-zinc-500 space-y-6 w-full max-w-[100vw] overflow-x-hidden">
        <div className="max-w-3xl mx-auto space-y-3">
          <h3 className="text-zinc-300 font-bold uppercase tracking-widest text-sm">AVISO LEGAL</h3>
          <p className="leading-relaxed text-[11px] text-zinc-400">Todo el material alojado en esta web es recolectado de sitios públicos. Prohibido el acceso a menores de 18 años.</p>
        </div>
        
        <div className="w-full flex justify-center items-center my-4">
          <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `atOptions = {'key' : '3149b600641b759a380a3da4a64eeca9','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};` }} />
          <script type="text/javascript" src="https://www.highperformanceformat.com/3149b600641b759a380a3da4a64eeca9/invoke.js"></script>
        </div>

        <script type="text/javascript" src="https://pl30901736.effectivecpmnetwork.com/e8/63/89/e86389099da35424bf779dd5f57a8a9f.js"></script>
        <p className="text-zinc-600 text-[10px]">© FLIXXES.COM 2016-2026</p>
      </footer>
    </main>
  );
}
