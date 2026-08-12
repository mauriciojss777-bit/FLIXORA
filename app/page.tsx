'use client';

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

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showAdminProd, setShowAdminProd] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);
  const [history, setHistory] = useState<Video[]>([]);

  // Estados para Monetización con Adsterra
  const [adWatched, setAdWatched] = useState(false);
  const nativeAdRef = useRef<HTMLDivElement>(null);

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

  // Carga script del banner nativo cuando el usuario selecciona un video
  useEffect(() => {
    if (selectedVideo && nativeAdRef.current && !nativeAdRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://pl30814143.effectivecpmnetwork.com/df896f70ade366b92d50697ad57088aa/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      nativeAdRef.current.appendChild(script);
    }
  }, [selectedVideo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('v');
    if (vId && videos.length > 0) {
      const video = videos.find(v => v.id === vId);
      if (video) {
        setSelectedVideo(video);
        setAdWatched(false);
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
    setAdWatched(false); // Reinicia anuncio para requerir clic y activar monetización por reproducción
    window.history.pushState(null, '', `?v=${video.id}`);
    
    const updatedHistory = [video, ...history.filter(h => h.id !== video.id)].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('flixes_history', JSON.stringify(updatedHistory));
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setAdWatched(false);
    window.history.pushState(null, '', '/');
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
      alert('¡Producto de afiliado agregado con éxito!');
    }
  };

  const handleShare = (video: Video) => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: video.title, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace directo copiado al portapapeles!');
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
          <h1 className="text-4xl font-black text-white">FLI<span className="text-amber-500">XES</span></h1>
          <p className="text-xs text-zinc-400">Este sitio contiene material para adultos. Debes ser mayor de edad para ingresar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-amber-500 transition-colors">INGRESAR</button>
        </div>
      </div>
    );
  }

  const filteredVideos = videos.filter(v => {
    const matchesTag = activeTag === 'Todos' || v.category === activeTag || (v.tags && v.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));
    const query = searchQuery.toLowerCase();
    const matchesSearch = v.title.toLowerCase().includes(query) || 
                          (v.category && v.category.toLowerCase().includes(query)) ||
                          (v.tags && v.tags.some(t => t.toLowerCase().includes(query)));
    return matchesTag && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200 flex flex-col justify-between">
      <div>
        <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMenu(true)} className="text-zinc-200 focus:outline-none p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-black text-white cursor-pointer" onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); }}>FLI<span className="text-amber-500">XES</span></h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { setShowStore(true); fetchProducts(); }} className="bg-amber-500/10 text-amber-500 text-xs px-3 py-1.5 rounded-full font-bold border border-amber-500/20">🛍️ Tienda</button>
            <button onClick={() => setShowAdminModal(true)} className="text-xs bg-zinc-900 text-zinc-200 px-3 py-1.5 rounded-full border border-zinc-800 font-bold hover:border-amber-500">+ SUBIR</button>
          </div>
        </nav>

        {showMenu && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
            <div className="relative bg-zinc-950 border-r border-zinc-800 w-80 h-full p-6 flex flex-col z-10 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                <h2 className="text-lg font-black text-white tracking-wider">MENÚ PRO</h2>
                <button onClick={() => setShowMenu(false)} className="text-zinc-400 hover:text-white p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-2 text-sm font-semibold">
                <button onClick={() => { setActiveTag('Todos'); setSearchQuery(''); handleCloseVideo(); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🏠 Inicio</button>
                <button onClick={() => { setShowStore(true); setShowMenu(false); fetchProducts(); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🛍️ Mi Tienda / Afiliados</button>
                <a href="https://paypal.me/TU_USUARIO_PAYPAL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">☕ Apóyame (PayPal)</a>
                <button onClick={() => { alert(history.length > 0 ? `Tienes ${history.length} videos en tu historial reciente.` : 'No hay historial reciente.'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">⏱️ Historial Reciente ({history.length})</button>
                <a href="mailto:umbrellaholdings.global@gmail.com" className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📢 Contacto y Publicidad</a>
                
                <div className="pt-2 border-t border-zinc-900 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 px-3 tracking-wider">Categorías</span>
                  {defaultTags.filter(t => t !== 'Todos').map(t => (
                    <button key={t} onClick={() => { setActiveTag(t); setShowMenu(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white">
                      #{t}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button onClick={() => { setShowMenu(false); setShowAdminModal(true); }} className="w-full py-3 rounded-2xl bg-amber-500 text-black font-black text-center">+ Subir Video (Admin)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="px-4 pt-6 pb-2">
          <input 
            type="text" 
            placeholder="Buscar por título, categoría o etiqueta..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-sm focus:border-amber-500 outline-none mb-4 text-zinc-200" 
          />
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {defaultTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeTag === tag ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'}`}>
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <div key={n} className="animate-pulse flex flex-col space-y-2">
                  <div className="aspect-video rounded-2xl bg-zinc-900 border border-zinc-800/50"></div>
                  <div className="h-4 bg-zinc-900 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-900 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredVideos.map((video) => (
                <div key={video.id} onClick={() => handleSelectVideo(video)} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50">
                    <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 left-2 bg-black/75 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {video.category}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-zinc-200 line-clamp-2">{video.title}</h3>
                </div>
              ))}
            </div>
          )}
        </section>

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

        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md overflow-y-auto" onClick={handleCloseVideo}>
            <div id="modal-content-wrapper" className="bg-zinc-900 w-full min-h-screen md:min-h-0 md:max-w-4xl md:rounded-3xl overflow-hidden flex flex-col my-auto" onClick={e => e.stopPropagation()}>
              
              {/* REPRODUCTOR CON KEY ÚNICA PARA FORZAR RECARGA AUTOMÁTICA AL CAMBIAR DE VIDEO */}
              <div className="relative aspect-video w-full bg-black">
                {!adWatched ? (
                  <div className="absolute inset-0 z-10 bg-zinc-950/95 flex flex-col justify-center items-center text-white p-6 text-center">
                    <h3 className="text-2xl font-black mb-2">ANUNCIO PATROCINADO</h3>
                    <p className="text-xs text-zinc-400 mb-6 max-w-xs">
                      Haz clic abajo para iniciar la reproducción limpia del video.
                    </p>
                    <button
                      onClick={() => {
                        window.open('https://www.effectivecpmnetwork.com/u9xtrrbj?key=5e1242fb44358ba404f094359ad59a45', '_blank');
                        setAdWatched(true);
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 px-8 rounded-full cursor-pointer transition-transform active:scale-95 shadow-lg flex items-center gap-2 text-sm"
                    >
                      ▶ Ver Video
                    </button>
                  </div>
                ) : (
                  <iframe 
                    key={selectedVideo.id}
                    src={selectedVideo.voe_url} 
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    scrolling="no"
                    title={selectedVideo.title}
                  />
                )}
              </div>
              
              <div className="p-4 bg-zinc-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-zinc-800">
                <h2 className="font-bold text-white text-base sm:text-lg truncate w-full sm:w-1/2">{selectedVideo.title}</h2>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                  <a 
                    href="https://paypal.me/TU_USUARIO_PAYPAL" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-amber-500 text-black hover:bg-amber-400 text-xs px-4 py-2 rounded-xl font-black"
                  >
                    ☕ Donar
                  </a>

                  <button 
                    type="button" 
                    onClick={() => handleShare(selectedVideo)} 
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-2 rounded-xl font-bold"
                  >
                    🔗 Compartir
                  </button>

                  <button 
                    type="button" 
                    onClick={handleCloseVideo} 
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-4 py-2 rounded-xl font-bold"
                  >
                    CERRAR
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 text-xs text-zinc-300 space-y-3">
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

              {/* CARRUSEL DE VIDEOS RELACIONADOS TOTALMENTE FUNCIONAL */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Videos Relacionados</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {videos.filter(v => v.id !== selectedVideo.id).map(v => (
                    <button 
                      key={v.id} 
                      type="button"
                      onClick={() => {
                        handleSelectVideo(v);
                        const wrapper = document.getElementById('modal-content-wrapper');
                        if (wrapper) wrapper.parentElement?.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="min-w-[160px] max-w-[160px] text-left cursor-pointer group flex-shrink-0 focus:outline-none"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-amber-500/50 transition-colors">
                        <img src={v.cover_url} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-zinc-300 line-clamp-1 group-hover:text-amber-400 transition-colors">{v.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-4">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Comentarios ({(commentsMap[selectedVideo.id] || commentsMap['default']).length})
                </h3>

                <form onSubmit={(e) => handleAddComment(selectedVideo.id, e)} className="space-y-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Tu nombre o usuario..." 
                      value={newCommentUser} 
                      onChange={(e) => setNewCommentUser(e.target.value)} 
                      className="w-1/3 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-amber-500" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Añade un comentario público..." 
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

              {/* BANNER NATIVO DE ADSTERRA */}
              <div className="p-4 bg-black flex justify-center border-t border-zinc-900">
                <div ref={nativeAdRef} id="container-adsterra-native" className="w-full flex justify-center items-center min-h-[100px]"></div>
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
              <input type="text" placeholder="URL VOE del video" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
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
          <h3 className="text-zinc-300 font-bold uppercase tracking-widest text-sm">AVISO</h3>
          <p className="leading-relaxed text-[11px] text-zinc-400">
            Todo el material alojado en esta web es recolectado de sitios web públicos, por lo tanto Flixes desconoce a las personas expuestas aquí. El equipo de Flixes siempre está actualizando y agregando videos XXX cada día. Flixes es un sitio donde usted encontrará videos caseros, HD, latinos, entre otros. Solo se recomienda a personas mayores de edad visitar este sitio por lo tanto, todo aquel que tenga la edad mínima de los 18 años la entrada a Flixes es totalmente prohibida.
          </p>
        </div>

        <div className="flex justify-center gap-6 font-semibold text-zinc-400 flex-wrap">
          <a href="#" className="hover:text-amber-500">Política Y privacidad</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500">DMCA</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500">2257</a>
          <span>•</span>
          <a href="mailto:umbrellaholdings.global@gmail.com" className="hover:text-amber-500">Contact</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500">RTA</a>
        </div>

        <p className="text-zinc-600 text-[10px]">© FLIXES.COM 2016-2026</p>
      </footer>
    </main>
  );
}
