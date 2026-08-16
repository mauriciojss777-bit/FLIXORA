'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
const ADMIN_PASSWORD = 'flixes2026#Admin#Pass';
const BUNNY_BASE_URL = 'https://flixxes.b-cdn.net/';

interface Comment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

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
  comments?: Comment[];
}

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  buy_url: string;
  affiliate_link?: string;
  description?: string;
  category?: string;
}

function DonateModal({ onClose }: { onClose: () => void }) {
  const [selectedAmount, setSelectedAmount] = useState('5.00');
  const [customAmount, setCustomAmount] = useState('');

  const finalAmount = customAmount ? customAmount : selectedAmount;

  const handlePayPalDirectPay = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(finalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }

    const paypalMeUrl = `https://paypal.me/tu-usuario-paypal/${amountNum}USD`;
    window.open(paypalMeUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-5 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h2 className="text-xl font-black text-white">☕ Apóyame con una Propina</h2>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white cursor-pointer">✕</button>
        </div>
        <p className="text-xs text-zinc-400">Selecciona o escribe el monto. Paga de forma 100% segura mediante PayPal o tarjeta.</p>
        <div className="grid grid-cols-3 gap-2">
          {['3.00', '5.00', '10.00'].map((amt) => (
            <button
              key={amt}
              onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${selectedAmount === amt && !customAmount ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}
            >
              ${amt} USD
            </button>
          ))}
        </div>
        <input 
          type="number" 
          placeholder="Otro monto (USD)" 
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs text-white text-center focus:border-blue-500 outline-none"
        />
        <div className="pt-2">
          <button 
            onClick={handlePayPalDirectPay}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Pagar ${finalAmount} USD con PayPal</span>
          </button>
        </div>
        <button onClick={onClose} className="w-full text-xs text-zinc-500 hover:text-white py-1 cursor-pointer">Cancelar</button>
      </div>
    </div>
  );
}

function InterstitialAdModal({ 
  onAdFinished, 
  onClose 
}: { 
  videoUrl: string; 
  onAdFinished: () => void; 
  onClose: () => void; 
}) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col justify-between p-4 sm:p-6 shadow-2xl">
        <div className="flex justify-between items-center w-full">
          <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
            Anuncio Patrocinado
          </span>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-xs font-semibold">
              {canSkip ? 'Puedes saltar el anuncio' : `El video se desbloquea en ${timeLeft}s`}
            </span>
            <button onClick={onClose} className="text-zinc-400 hover:text-white text-xs bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 cursor-pointer">
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center my-3 relative overflow-hidden rounded-xl border border-zinc-800 bg-black">
          <img 
            src={DEFAULT_COVER_IMAGE} 
            alt="Anuncio publicitario" 
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
          />
        </div>
        <div className="flex justify-end items-center w-full">
          {canSkip ? (
            <button 
              onClick={onAdFinished}
              className="bg-white hover:bg-zinc-200 text-black font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Saltar Anuncio ⏭
            </button>
          ) : (
            <div className="bg-zinc-900 text-zinc-500 text-xs font-bold px-5 py-2.5 rounded-xl border border-zinc-800 cursor-not-allowed select-none">
              Saltar en {timeLeft}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdsterraBlock({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

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

    container.appendChild(confScript);
    container.appendChild(invokeScript);
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
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://pl30814143.effectivecpmnetwork.com/${zoneId}/invoke.js`;

    const innerDiv = document.createElement('div');
    innerDiv.id = `container-${zoneId}`;

    container.appendChild(script);
    container.appendChild(innerDiv);
  }, [zoneId]);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden bg-transparent my-3">
      <div ref={containerRef} className="w-full flex justify-center items-center" />
    </div>
  );
}

function HorizontalVideoCard({ 
  video, 
  isSaved, 
  onToggleSave, 
  onDonateClick,
  onPlayClick,
  onOpenSocial,
  likesCount 
}: { 
  video: Video; 
  isSaved: boolean; 
  onToggleSave: (v: Video, e: React.MouseEvent) => void; 
  onDonateClick: () => void;
  onPlayClick: (videoUrl: string) => void;
  onOpenSocial: (video: Video) => void;
  likesCount: number; 
}) {
  const coverImage = (video.cover_url && video.cover_url.trim() !== '' && video.cover_url !== DEFAULT_COVER_IMAGE) 
    ? video.cover_url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(video.title)}&background=09090b&color=3b82f6&size=500&bold=true`;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: '¡Mira este video en Flixxes!',
        url: video.voe_url || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(video.voe_url || window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-zinc-900/40 rounded-2xl border border-zinc-800/85 hover:border-blue-500/50 transition-all shadow-md group relative">
      <div 
        onClick={() => onPlayClick(video.voe_url || '#')}
        className="flex flex-col h-full w-full cursor-pointer"
      >
        <div className="relative aspect-video rounded-t-2xl overflow-hidden bg-black w-full flex items-center justify-center">
          <img 
            src={coverImage} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_COVER_IMAGE;
            }}
          />
          <span className="absolute bottom-2 left-2 bg-black/85 backdrop-blur-sm text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-zinc-700/50">
            {video.is_photo ? '📷 Foto' : video.category}
          </span>
        </div>
        <div className="p-3 flex gap-2.5 w-full items-start">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black flex items-center justify-center flex-shrink-0 text-xs">
            F
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{video.title}</h3>
            <div className="flex items-center justify-between mt-1.5 w-full">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
                <span>Flixxes</span>
                <span>•</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenSocial(video); }}
                  className="text-blue-400 hover:underline font-bold"
                >
                  💬 ({video.comments?.length || 0})
                </button>
                <span>•</span>
                <span>👍 {likesCount}</span>
              </div>
              <div className="flex items-center gap-1.5 z-30" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <button 
                  onClick={handleShare}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-1.5 rounded-lg transition-all border border-zinc-700/50 cursor-pointer"
                  title="Compartir"
                >
                  🔗
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDonateClick(); }}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg text-xs cursor-pointer"
                  title="Donar"
                >
                  ☕
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(video, e); }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${isSaved ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                  title="Guardar"
                >
                  ⭐
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialModal({
  video,
  onClose,
  onAddComment,
  onLike,
  likesCount
}: {
  video: Video;
  onClose: () => void;
  onAddComment: (videoId: string, text: string) => void;
  onLike: (videoId: string) => void;
  likesCount: number;
}) {
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(video.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-lg w-full space-y-5 shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h2 className="text-base font-black text-white">💬 Comunidad & Comentarios</h2>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <div>
          <h3 className="text-xs font-bold text-blue-400">{video.title}</h3>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => onLike(video.id)} 
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-1.5 cursor-pointer"
            >
              <span>👍 Me gusta ({likesCount})</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {(!video.comments || video.comments.length === 0) ? (
            <p className="text-xs text-zinc-500 text-center py-6">Sé el primero en comentar.</p>
          ) : (
            video.comments.map((c) => (
              <div key={c.id} className="bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-blue-400">{c.user_name || 'Anónimo'}</span>
                  <span className="text-[9px] text-zinc-500">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-zinc-200">{c.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-zinc-800">
          <input 
            type="text" 
            placeholder="Tu nombre (opcional)" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs text-white outline-none"
          />
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Escribe un comentario..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs text-white outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer">
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VerticalShortModal({ 
  short, 
  onClose, 
  onNext 
}: { 
  short: Video; 
  onClose: () => void; 
  onNext: () => void; 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 25000); 
    return () => clearTimeout(timer);
  }, [short, onNext]);

  const getAutoplayUrl = (url: string) => {
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    if (!url.includes('autoplay=')) {
      return `${url}${separator}autoplay=1&muted=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-0 sm:p-4" onClick={onClose}>
      <div className="relative w-full max-w-sm h-full sm:h-[85vh] bg-black rounded-none sm:rounded-3xl overflow-hidden border border-zinc-800 flex flex-col justify-center items-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black text-white p-2.5 rounded-full cursor-pointer">
          ✕
        </button>
        <iframe 
          src={getAutoplayUrl(short.voe_url)} 
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none bg-gradient-to-t from-black/80 to-transparent p-4">
          <h4 className="text-white font-black text-sm line-clamp-2">{short.title}</h4>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'random' | 'popular' | 'likes'>('random');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminTab, setAdminTab] = useState<'video' | 'photo' | 'embed' | 'product'>('video');
  const [showStore, setShowStore] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showWatchLaterModal, setShowWatchLaterModal] = useState(false);
  const [activeSocialVideo, setActiveSocialVideo] = useState<Video | null>(null);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('Todas');
  const [storeLoading, setStoreLoading] = useState(false);

  const [pendingVideoUrl, setPendingVideoUrl] = useState<string | null>(null);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [activeShortIndex, setActiveShortIndex] = useState<number | null>(null);

  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

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
  
  const [rawEmbedCode, setRawEmbedCode] = useState('');
  const [embedTitle, setEmbedTitle] = useState('');
  const [embedCategory, setEmbedCategory] = useState('HD');

  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodUrl, setProdUrl] = useState('');
  const [prodAffiliateLink, setProdAffiliateLink] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodCategory, setProdCategory] = useState('General');

  const defaultTags = useMemo(() => ['Todos', 'Destacados', 'Fotos', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR', 'Rubias', 'Morochas', 'Caseros'], []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('age_verified') === 'true') {
        setAgeAccepted(true);
      }
      const savedWatchLater = localStorage.getItem('flixora_watch_later');
      if (savedWatchLater) {
        try { setWatchLater(JSON.parse(savedWatchLater)); } catch (e) { console.error(e); }
      }
      const savedLikes = localStorage.getItem('flixora_likes');
      if (savedLikes) {
        try { setLikesMap(JSON.parse(savedLikes)); } catch (e) { console.error(e); }
      }
    }
    fetchVideos();
    fetchProducts();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('videos').select('*').limit(50);
      if (data) setVideos(data);
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setStoreLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      if (data) setProducts(data);
    } catch (e) { 
      console.error(e); 
    } finally {
      setStoreLoading(false);
    }
  };

  const toggleWatchLater = useCallback((video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchLater(prev => {
      const exists = prev.some(v => v.id === video.id);
      const updated = exists ? prev.filter(v => v.id !== video.id) : [video, ...prev];
      localStorage.setItem('flixora_watch_later', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleLike = useCallback((videoId: string) => {
    setLikesMap(prev => {
      const currentLikes = prev[videoId] || 0;
      const updated = { ...prev, [videoId]: currentLikes + 1 };
      localStorage.setItem('flixora_likes', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleAddComment = useCallback((videoId: string, text: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      user_name: 'Miembro Flixxes',
      content: text,
      created_at: new Date().toISOString()
    };

    setVideos(prevVideos => 
      prevVideos.map(v => {
        if (v.id === videoId) {
          const updatedComments = [newComment, ...(v.comments || [])];
          return { ...v, comments: updatedComments };
        }
        return v;
      })
    );
  }, []);

  const extractSrcFromIframe = (input: string) => {
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : input.trim();
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== ADMIN_PASSWORD) {
      alert('Contraseña incorrecta');
      return;
    }

    const finalCoverUrl = coverUrl.trim();

    if (adminTab === 'product') {
      if (!prodTitle.trim() || (!prodUrl.trim() && !prodAffiliateLink.trim())) {
        alert('Completa al menos el título y el enlace.');
        return;
      }
      const finalBuyUrl = prodUrl.trim() || prodAffiliateLink.trim();
      const { error } = await supabase.from('products').insert([{
        title: prodTitle,
        price: prodPrice || '$0.00',
        image_url: prodImage || DEFAULT_COVER_IMAGE,
        buy_url: finalBuyUrl,
        affiliate_link: prodAffiliateLink.trim() || finalBuyUrl,
        description: prodDescription || 'Producto exclusivo recomendado en Flixxes.',
        category: prodCategory || 'General'
      }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowAdminModal(false);
        setProdTitle(''); setProdPrice(''); setProdImage(''); setProdUrl(''); setProdAffiliateLink(''); setProdDescription(''); setAdminPassword('');
        fetchProducts();
      }
      return;
    }

    if (adminTab === 'photo') {
      if (!photoUrlInput.trim() || !photoTitleInput.trim()) {
        alert('Completa el título y la URL de la foto.');
        return;
      }
      const { error } = await supabase.from('videos').insert([{
        title: photoTitleInput,
        category: 'Fotos',
        voe_url: '',
        cover_url: finalCoverUrl || photoUrlInput,
        description: 'Fotografía exclusiva en alta resolución.',
        tags: ['Fotos', 'HD'],
        is_photo: true,
        is_short: false
      }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowAdminModal(false);
        setPhotoTitleInput(''); setPhotoUrlInput(''); setCoverUrl(''); setAdminPassword('');
        fetchVideos();
      }
      return;
    }

    if (adminTab === 'embed') {
      if (!rawEmbedCode.trim() || !embedTitle.trim()) {
        alert('Ingresa el título y el iframe.');
        return;
      }
      const cleanUrl = extractSrcFromIframe(rawEmbedCode);
      const { error } = await supabase.from('videos').insert([{
        title: embedTitle,
        category: embedCategory,
        voe_url: cleanUrl,
        cover_url: finalCoverUrl,
        description: 'Video incrustado.',
        tags: [embedCategory, 'HD', 'Incrustado'],
        is_photo: false,
        is_short: false
      }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowAdminModal(false);
        setEmbedTitle(''); setRawEmbedCode(''); setCoverUrl(''); setAdminPassword('');
        fetchVideos();
      }
      return;
    }

    const parsedTags = videoTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    let cleanVoeUrl = extractSrcFromIframe(voeUrl);

    if (cleanVoeUrl && !cleanVoeUrl.startsWith('http://') && !cleanVoeUrl.startsWith('https://')) {
      cleanVoeUrl = `${BUNNY_BASE_URL}${cleanVoeUrl}`;
    }

    const { error } = await supabase.from('videos').insert([{ 
      title, 
      category, 
      voe_url: cleanVoeUrl, 
      cover_url: finalCoverUrl,
      description: description || 'Disfruta de este contenido en alta definición.',
      tags: parsedTags.length > 0 ? parsedTags : [category, 'HD'],
      is_short: isShortVideo,
      is_photo: false
    }]);

    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setIsShortVideo(false); setAdminPassword('');
      fetchVideos();
    }
  };

  const handleTriggerVideo = useCallback((url: string) => {
    if (!url || url === '#') return;
    setPendingVideoUrl(url);
    setShowInterstitialAd(true);
  }, []);

  const handleAdFinished = useCallback(() => {
    setShowInterstitialAd(false);
    if (pendingVideoUrl) {
      window.open(pendingVideoUrl, '_blank', 'noopener,noreferrer');
      setPendingVideoUrl(null);
    }
  }, [pendingVideoUrl]);

  // Uso de useMemo para optimizar los filtros pesados y evitar tirones en UI
  const filteredVideos = useMemo(() => {
    return videos
      .filter(v => {
        const vTags = Array.isArray(v.tags) ? v.tags : (v.tags ? [String(v.tags)] : []);
        const matchesTag = activeTag === 'Todos' || (activeTag === 'Fotos' ? v.is_photo : (v.category === activeTag || vTags.some(t => t.toLowerCase() === activeTag.toLowerCase())));
        const query = searchQuery.toLowerCase();
        const matchesSearch = v.title.toLowerCase().includes(query) || 
                              (v.category && v.category.toLowerCase().includes(query)) ||
                              vTags.some(t => t.toLowerCase().includes(query));
        return matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
        if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
        return 0; // Orden estable o por defecto sin sobrecargar Math.random en cada render
      });
  }, [videos, activeTag, searchQuery, sortBy, likesMap]);

  const horizontalVideos = useMemo(() => filteredVideos.filter(v => !v.is_short && !v.is_photo), [filteredVideos]);
  const photoGallery = useMemo(() => filteredVideos.filter(v => v.is_photo), [filteredVideos]);
  const verticalShorts = useMemo(() => filteredVideos.filter(v => v.is_short), [filteredVideos]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = (product.title || '').toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
                            (product.description || '').toLowerCase().includes(storeSearchQuery.toLowerCase());
      const matchesCategory = selectedStoreCategory === 'Todas' || product.category === selectedStoreCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, storeSearchQuery, selectedStoreCategory]);

  const storeCategories = useMemo(() => ['Todas', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 w-full">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
          <h1 className="text-4xl font-black text-white tracking-tight">FLIX<span className="text-blue-500">XES</span></h1>
          <p className="text-xs text-zinc-400">Este sitio contiene material para adultos. Debes ser mayor de edad para ingresar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl cursor-pointer">INGRESAR</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-zinc-200 flex flex-col justify-between w-full max-w-[100vw] overflow-x-hidden">
      <div className="w-full max-w-[100vw]">
        <nav className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-800 px-3 py-3 flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setShowMenu(true)} className="text-zinc-200 hover:bg-zinc-800 p-2 rounded-xl cursor-pointer">
              ☰
            </button>
            <h1 className="text-xl font-black text-white cursor-pointer tracking-tight truncate" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); }}>
              FLIX<span className="text-blue-500">XES</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
            <input 
              type="text" 
              placeholder="Buscar en Flixxes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#141414] border border-zinc-700 pl-4 pr-10 py-2 rounded-full text-sm text-zinc-200 outline-none focus:border-blue-500" 
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowDonateModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] px-2.5 py-1.5 rounded-full font-black cursor-pointer">☕ Donar</button>
            <button onClick={() => { setShowStore(true); fetchProducts(); }} className="bg-zinc-800 text-blue-400 text-[11px] px-2.5 py-1.5 rounded-full font-bold border border-zinc-700 cursor-pointer">🛍️ Tienda</button>
          </div>
        </nav>

        {showMenu && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
            <div className="relative bg-[#181818] border-r border-zinc-800 w-80 max-w-[85vw] h-full p-6 flex flex-col z-10 overflow-y-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h2 className="text-lg font-black text-white">MENÚ</h2>
                <button onClick={() => setShowMenu(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
              </div>
              <div className="flex flex-col space-y-2 text-sm font-semibold">
                <button onClick={() => { setActiveTag('Todos'); setSearchQuery(''); setShowMenu(false); }} className="p-3 rounded-2xl bg-zinc-900 text-left text-zinc-200 cursor-pointer">🏠 Inicio</button>
                <button onClick={() => { setShowStore(true); fetchProducts(); setShowMenu(false); }} className="p-3 rounded-2xl bg-zinc-900 text-left text-blue-400 cursor-pointer">🛍️ Tienda</button>
                <button onClick={() => { setActiveTag('Fotos'); setShowMenu(false); }} className="p-3 rounded-2xl bg-zinc-900 text-left text-zinc-200 cursor-pointer">📷 Fotos</button>
                <button onClick={() => { setShowWatchLaterModal(true); setShowMenu(false); }} className="p-3 rounded-2xl bg-zinc-900 text-left text-zinc-200 cursor-pointer">⭐ Guardados ({watchLater.length})</button>
                <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full py-3 rounded-2xl bg-blue-600 text-white font-black cursor-pointer">+ Admin Panel</button>
              </div>
            </div>
          </div>
        )}

        {/* Categorías y filtros */}
        <section className="px-3 pt-3 pb-2 w-full">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-800/60">
            <span className="text-[11px] font-bold text-zinc-400 uppercase">Ordenar:</span>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-[11px]">
              <button onClick={() => setSortBy('random')} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${sortBy === 'random' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Normal</button>
              <button onClick={() => setSortBy('likes')} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${sortBy === 'likes' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Likes</button>
            </div>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full">
            {defaultTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer ${activeTag === tag ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Shorts */}
        {verticalShorts.length > 0 && (
          <section className="px-3 py-4 w-full">
            <h3 className="text-xs font-black text-blue-400 uppercase mb-3">⚡ Shorts ({verticalShorts.length})</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {verticalShorts.map((v, index) => (
                <div key={v.id} onClick={() => setActiveShortIndex(index)} className="min-w-[140px] max-w-[140px] h-[250px] bg-zinc-950 rounded-2xl overflow-hidden relative flex-shrink-0 border border-zinc-800 cursor-pointer flex items-center justify-center">
                  <img src={v.cover_url || DEFAULT_COVER_IMAGE} alt={v.title} className="w-full h-full object-cover bg-black" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2.5">
                    <h4 className="text-[11px] font-bold text-white line-clamp-2">{v.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeShortIndex !== null && verticalShorts[activeShortIndex] && (
          <VerticalShortModal 
            short={verticalShorts[activeShortIndex]}
            onClose={() => setActiveShortIndex(null)}
            onNext={() => setActiveShortIndex((activeShortIndex + 1) % verticalShorts.length)}
          />
        )}

        {/* Videos horizontales */}
        {horizontalVideos.length > 0 && activeTag !== 'Fotos' && (
          <section className="px-3 pb-12 pt-2 w-full">
            <h3 className="text-xs font-black text-zinc-300 uppercase mb-3 pt-4 border-t border-zinc-800/60">📺 Videos ({horizontalVideos.length})</h3>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[1, 2, 3, 4].map(n => <div key={n} className="animate-pulse aspect-video rounded-xl bg-zinc-800"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {horizontalVideos.map((video) => (
                  <HorizontalVideoCard 
                    key={video.id}
                    video={video}
                    isSaved={watchLater.some(v => v.id === video.id)}
                    onToggleSave={toggleWatchLater}
                    onDonateClick={() => setShowDonateModal(true)}
                    onPlayClick={handleTriggerVideo}
                    onOpenSocial={(v) => setActiveSocialVideo(v)}
                    likesCount={likesMap[video.id] || 0}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {showInterstitialAd && pendingVideoUrl && (
          <InterstitialAdModal 
            videoUrl={pendingVideoUrl}
            onAdFinished={handleAdFinished}
            onClose={() => { setShowInterstitialAd(false); setPendingVideoUrl(null); }}
          />
        )}

        {activeSocialVideo && (
          <SocialModal 
            video={activeSocialVideo}
            onClose={() => setActiveSocialVideo(null)}
            onAddComment={handleAddComment}
            onLike={handleLike}
            likesCount={likesMap[activeSocialVideo.id] || 0}
          />
        )}

        {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
        {showWatchLaterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowWatchLaterModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-2xl w-full space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-black text-white">⭐ Guardados</h2>
              {watchLater.map(v => (
                <div key={v.id} className="bg-zinc-900 p-2 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-white font-bold">{v.title}</span>
                  <button onClick={() => toggleWatchLater(v)} className="text-xs bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
            <form onSubmit={handleSaveVideo} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4">
              <h2 className="text-xl font-bold text-white">Panel Admin</h2>
              <input type="password" placeholder="Clave" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white text-xs" />
              <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white text-xs" />
              <input type="text" placeholder="Archivo MP4 / Enlace" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white text-xs" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-white text-xs cursor-pointer">Cancelar</button>
                <button type="submit" className="w-full p-3 rounded-xl bg-blue-600 text-white text-xs cursor-pointer">Guardar</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <footer className="bg-black border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>© FLIXXES.COM 2016-2026</p>
      </footer>
    </main>
  );
}
