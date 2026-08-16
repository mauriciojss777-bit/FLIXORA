'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
const ADMIN_PASSWORD = 'flixes2026#Admin#Pass';

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
}

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  buy_url: string;
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

function HorizontalVideoCard({ 
  video, 
  isSaved, 
  onToggleSave, 
  onDonateClick,
  likesCount 
}: { 
  video: Video; 
  isSaved: boolean; 
  onToggleSave: (v: Video, e: React.MouseEvent) => void; 
  onDonateClick: () => void;
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
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-zinc-900/40 rounded-2xl border border-zinc-800/80 hover:border-blue-500/50 transition-all shadow-md group relative">
      
      <a 
        href={video.voe_url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
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
          <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-zinc-700/50">
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
                <span>{video.is_photo ? 'Foto HD' : 'HD'}</span>
                <span>•</span>
                <span>👍 {likesCount}</span>
              </div>

              {/* Botones externos situados abajo a la derecha de la tarjeta, fuera del reproductor */}
              <div className="flex items-center gap-1.5 z-30" onClick={(e) => e.preventDefault()}>
                <button 
                  onClick={handleShare}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-1.5 rounded-lg transition-all border border-zinc-700/50 shadow-sm"
                  title="Compartir video"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDonateClick();
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg transition-all shadow-sm text-xs"
                  title="Donar cafecito"
                >
                  ☕
                </button>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleSave(video, e);
                  }}
                  className={`p-1.5 rounded-lg transition-all shadow-sm ${isSaved ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/50'}`}
                  title={isSaved ? "Quitar de guardados" : "Guardar para después"}
                >
                  ⭐
                </button>
              </div>
            </div>
          </div>
        </div>
      </a>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-0 sm:p-4" onClick={onClose}>
      <div className="relative w-full max-w-sm h-full sm:h-[85vh] bg-black rounded-none sm:rounded-3xl overflow-hidden border border-zinc-800 flex flex-col justify-center items-center shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black text-white p-2.5 rounded-full backdrop-blur-md transition-all"
        >
          ✕
        </button>

        <iframe 
          src={short.voe_url} 
          className="w-full h-full border-0 pointer-events-auto"
          allow="autoplay; fullscreen"
          allowFullScreen
        />

        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-3xl">
          <h4 className="text-white font-black text-sm line-clamp-2">{short.title}</h4>
          <span className="text-[10px] text-blue-400 font-bold mt-1 inline-block">Cambio automático a 5s del final ⚡</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'likes'>('recent');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminTab, setAdminTab] = useState<'video' | 'photo' | 'embed'>('video');
  const [, setShowStore] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showWatchLaterModal, setShowWatchLaterModal] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [activeShortIndex, setActiveShortIndex] = useState<number | null>(null);

  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [likesMap] = useState<Record<string, number>>({});

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

  const defaultTags = ['Todos', 'Destacados', 'Fotos', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR', 'Rubias', 'Morochas', 'Caseros'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('age_verified') === 'true') {
        setAgeAccepted(true);
      }
      const savedWatchLater = localStorage.getItem('flixora_watch_later');
      if (savedWatchLater) {
        try { setWatchLater(JSON.parse(savedWatchLater)); } catch (e) { console.error(e); }
      }
    }
    fetchVideos();
    fetchProducts();
  }, []);

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

  const toggleWatchLater = (video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = watchLater.some(v => v.id === video.id);
    const updated = exists ? watchLater.filter(v => v.id !== video.id) : [video, ...watchLater];
    setWatchLater(updated);
    localStorage.setItem('flixora_watch_later', JSON.stringify(updated));
  };

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

    if (adminTab === 'photo') {
      if (!photoUrlInput.trim() || !photoTitleInput.trim()) {
        alert('Por favor completa el título y la URL de la foto.');
        return;
      }
      const { error } = await supabase.from('videos').insert([{
        title: photoTitleInput,
        category: 'Fotos',
        voe_url: '',
        cover_url: finalCoverUrl || photoUrlInput,
        description: 'Fotografía exclusiva en alta resolución disponible en Flixxes.',
        tags: ['Fotos', 'HD'],
        is_photo: true,
        is_short: false
      }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowAdminModal(false);
        setPhotoTitleInput('');
        setPhotoUrlInput('');
        setCoverUrl('');
        setAdminPassword('');
        fetchVideos();
      }
      return;
    }

    if (adminTab === 'embed') {
      if (!rawEmbedCode.trim() || !embedTitle.trim()) {
        alert('Por favor ingresa el título y el código iframe o enlace embed.');
        return;
      }
      const cleanUrl = extractSrcFromIframe(rawEmbedCode);
      const { error } = await supabase.from('videos').insert([{
        title: embedTitle,
        category: embedCategory,
        voe_url: cleanUrl,
        cover_url: finalCoverUrl,
        description: 'Video incrustado de alta calidad disponible en Flixxes.',
        tags: [embedCategory, 'HD', 'Incrustado'],
        is_photo: false,
        is_short: false
      }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        setShowAdminModal(false);
        setEmbedTitle('');
        setRawEmbedCode('');
        setCoverUrl('');
        setAdminPassword('');
        fetchVideos();
      }
      return;
    }

    const parsedTags = videoTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const cleanVoeUrl = extractSrcFromIframe(voeUrl);

    const { error } = await supabase.from('videos').insert([{ 
      title, 
      category, 
      voe_url: cleanVoeUrl, 
      cover_url: finalCoverUrl,
      description: description || 'Disfruta de este contenido en alta definición disponible en Flixxes.',
      tags: parsedTags.length > 0 ? parsedTags : [category, 'HD'],
      is_short: isShortVideo,
      is_photo: false
    }]);

    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setVideoTagsInput('HD, Latino, Casero'); setIsShortVideo(false); setAdminPassword('');
      fetchVideos();
    }
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
                            vTags.some(t => t.toLowerCase().includes(query));
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  const horizontalVideos = filteredVideos.filter(v => !v.is_short && !v.is_photo);
  const photoGallery = filteredVideos.filter(v => v.is_photo);
  const verticalShorts = filteredVideos.filter(v => v.is_short);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-zinc-200 flex flex-col justify-between w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300">
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        
        <nav className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-800 px-3 py-3 flex items-center justify-between gap-2 w-full max-w-[100vw]">
          <div className="flex items-center gap-2 min-w-0">
            <button 
              onClick={() => setShowMenu(true)} 
              className="text-zinc-200 hover:bg-zinc-800 p-2 rounded-xl transition-colors focus:outline-none flex-shrink-0"
              aria-label="Abrir Menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-white cursor-pointer tracking-tight truncate flex items-center" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); }}>
              <span className="text-white">FLIX</span><span className="text-blue-500">XES</span>
            </h1>
          </div>

          <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Buscar en Flixxes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-[#141414] border border-zinc-700 pl-4 pr-10 py-2 rounded-full text-sm text-zinc-200 focus:border-blue-500 outline-none" 
              />
              <span className="absolute right-3 top-2.5 text-zinc-400">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setShowWatchLaterModal(true)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] px-2.5 py-1.5 rounded-full font-bold border border-zinc-700 transition-all whitespace-nowrap">
              ⭐ Guardados {watchLater.length > 0 && <span className="ml-0.5 bg-blue-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-black">{watchLater.length}</span>}
            </button>
            <button onClick={() => setShowDonateModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] px-2.5 py-1.5 rounded-full font-black transition-all whitespace-nowrap">☕ Donar</button>
            <button onClick={() => { setShowStore(true); fetchProducts(); }} className="hidden md:inline-block bg-zinc-800 text-blue-400 text-[11px] px-2.5 py-1.5 rounded-full font-bold border border-zinc-700 hover:bg-zinc-700 transition-all">🛍️ Tienda</button>
          </div>
        </nav>

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
                <button onClick={() => { setActiveTag('Todos'); setSearchQuery(''); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🏠 Inicio</button>
                <button onClick={() => { setActiveTag('Fotos'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📷 Galería de Fotos</button>
                <button onClick={() => { setShowWatchLaterModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">⭐ Lista de Guardados ({watchLater.length})</button>
                <button onClick={() => { setShowDonateModal(true); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold">☕ Apóyame con una Donación</button>
                
                <div className="pt-2 border-t border-zinc-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 px-3 tracking-wider">Categorías</span>
                  {defaultTags.filter(t => t !== 'Todos').map(t => (
                    <button key={t} onClick={() => { setActiveTag(t); setShowMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white">
                      #{t}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full py-3 rounded-2xl bg-blue-600 text-white font-black text-center hover:bg-blue-500">+ Publicar / Incrustar (Admin)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="px-3 pt-3 pb-2 w-full max-w-[100vw] overflow-x-hidden box-border">
          <div className="sm:hidden mb-2.5 w-full">
            <input 
              type="text" 
              placeholder="Buscar por título, categoría o etiqueta..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full bg-[#121212] border border-zinc-800 p-2.5 rounded-xl text-xs focus:border-blue-500 outline-none text-zinc-200 box-border" 
            />
          </div>

          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-800/60 w-full">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Ordenar:</span>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-[11px]">
              <button onClick={() => setSortBy('recent')} className={`px-2.5 py-1 rounded-lg font-bold transition-all ${sortBy === 'recent' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Más Recientes</button>
              <button onClick={() => setSortBy('likes')} className={`px-2.5 py-1 rounded-lg font-bold transition-all ${sortBy === 'likes' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Más Gustados</button>
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full max-w-full">
            {defaultTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex-shrink-0 ${activeTag === tag ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                {tag}
              </button>
            ))}
          </div>
        </section>

        {verticalShorts.length > 0 && (
          <section className="px-3 py-4 w-full max-w-[100vw] overflow-x-hidden box-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-blue-400 tracking-wider uppercase flex items-center gap-1.5">
                ⚡ Shorts Verticales ({verticalShorts.length})
              </h3>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
              {verticalShorts.map((v, index) => (
                <div 
                  key={`short-${v.id}`} 
                  onClick={() => setActiveShortIndex(index)}
                  className="min-w-[140px] max-w-[140px] h-[250px] bg-zinc-950 rounded-2xl overflow-hidden relative flex-shrink-0 snap-start border border-zinc-800 shadow-md group cursor-pointer flex items-center justify-center"
                >
                  <img src={v.cover_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(v.title)}&background=09090b&color=3b82f6&size=500&bold=true`} alt={v.title} className="w-full h-full object-cover bg-black group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
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

        {activeShortIndex !== null && verticalShorts[activeShortIndex] && (
          <VerticalShortModal 
            short={verticalShorts[activeShortIndex]}
            onClose={() => setActiveShortIndex(null)}
            onNext={() => {
              const nextIdx = (activeShortIndex + 1) % verticalShorts.length;
              setActiveShortIndex(nextIdx);
            }}
          />
        )}

        {photoGallery.length > 0 && (activeTag === 'Todos' || activeTag === 'Fotos') && (
          <section className="px-3 py-4 w-full max-w-[100vw] overflow-x-hidden box-border">
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
                    className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden group flex flex-col relative"
                  >
                    <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                      <img src={photo.cover_url || DEFAULT_COVER_IMAGE} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                      <button 
                        onClick={(e) => toggleWatchLater(photo, e)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${isSaved ? 'bg-blue-600 text-white' : 'bg-black/60 text-white hover:bg-black'}`}
                      >
                        ⭐
                      </button>
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-bold text-zinc-100 line-clamp-1 group-hover:text-blue-400 transition-colors">{photo.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="px-3 py-2 w-full max-w-[100vw]">
          <div className="bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Publicidad Patrocinada</span>
            <AdsterraBlock zoneId="3837baa3b86f4b03245779a93841cdf8" />
          </div>
        </section>

        <section className="px-3 py-2 w-full max-w-[100vw]">
          <AdsterraNativeBlock zoneId="30814143" />
        </section>

        {horizontalVideos.length > 0 && activeTag !== 'Fotos' && (
          <section className="px-3 pb-12 pt-2 w-full max-w-[100vw] overflow-x-hidden box-border">
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
                      isSaved={isSaved}
                      onToggleSave={toggleWatchLater}
                      onDonateClick={() => setShowDonateModal(true)}
                      likesCount={likesMap[video.id] || 0}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDonateModal(false)}>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-black text-white">☕ Apóyame con una Donación</h2>
              <p className="text-xs text-zinc-400">Si te gusta el contenido de Flixxes, tu apoyo ayuda a mantener los servidores y traer nuevos videos diariamente.</p>
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
                          <a href={v.voe_url} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded font-bold">Ver</a>
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

        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <form onSubmit={handleSaveVideo} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Panel Admin</h2>
                <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl text-xs font-bold">
                  <button type="button" onClick={() => setAdminTab('video')} className={`px-2.5 py-1 rounded-lg transition-colors ${adminTab === 'video' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Video</button>
                  <button type="button" onClick={() => setAdminTab('embed')} className={`px-2.5 py-1 rounded-lg transition-colors ${adminTab === 'embed' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Embed Web</button>
                  <button type="button" onClick={() => setAdminTab('photo')} className={`px-2.5 py-1 rounded-lg transition-colors ${adminTab === 'photo' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Foto</button>
                </div>
              </div>

              <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
              
              <input type="text" placeholder="URL Portada / Miniatura (Opcional)" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />

              {adminTab === 'photo' ? (
                <>
                  <input type="text" placeholder="Título de la foto" value={photoTitleInput} onChange={e => setPhotoTitleInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="URL directa de la foto" value={photoUrlInput} onChange={e => setPhotoUrlInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <p className="text-[11px] text-zinc-500">Sube únicamente el enlace directo de la imagen (ej: .jpg, .png).</p>
                </>
              ) : adminTab === 'embed' ? (
                <>
                  <input type="text" placeholder="Título del video incrustado" value={embedTitle} onChange={e => setEmbedTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <select value={embedCategory} onChange={e => setEmbedCategory(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-zinc-300 outline-none focus:border-blue-500">
                    {defaultTags.filter(t => t !== 'Todos' && t !== 'Fotos').map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <textarea placeholder="Pega aquí el código completo <iframe ...> o el enlace embed de la otra web" value={rawEmbedCode} onChange={e => setRawEmbedCode(e.target.value)} rows={4} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500 resize-none" />
                  <p className="text-[11px] text-zinc-400">💡 <strong className="text-blue-400">Protección Antifuga Activa:</strong> El sistema extraerá automáticamente el enlace y mantendrá al usuario dentro de tu web maximizando tu CPM en Adsterra.</p>
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
                    />
                    <label htmlFor="shortCheckbox" className="text-xs font-bold text-white cursor-pointer select-none">
                      ¿Es un Video Vertical / Short?
                    </label>
                  </div>

                  <input type="text" placeholder="Etiquetas (separadas por coma)" value={videoTagsInput} onChange={e => setVideoTagsInput(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                  <input type="text" placeholder="URL del video (o código iframe completo)" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-blue-500" />
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700">Cancelar</button>
                <button type="submit" className="w-full p-3 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-500">Guardar</button>
              </div>
            </form>
          </div>
        )}

      </div>

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
