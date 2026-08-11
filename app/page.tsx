'use client';

import { useState, useEffect } from 'react';
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
}

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  buy_url: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showAdminProd, setShowAdminProd] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HD');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBuyUrl, setProdBuyUrl] = useState('');

  const defaultTags = ['Todos', 'Destacados', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR'];

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('age_verified') === 'true') {
      setAgeAccepted(true);
    }
    fetchVideos();
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('v');
    if (vId && videos.length > 0) {
      const video = videos.find(v => v.id === vId);
      if (video) setSelectedVideo(video);
    }
  }, [videos]);

  const fetchVideos = async () => {
    try {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) setVideos(data);
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } catch (e) { console.error(e); }
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    window.history.pushState(null, '', `?v=${video.id}`);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    window.history.pushState(null, '', '/');
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }
    const { error } = await supabase.from('videos').insert([{ title, category, voe_url: voeUrl, cover_url: coverUrl }]);
    if (error) { alert('Error: ' + error.message); } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setAdminPassword('');
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
    const shareUrl = 'https://flixes.vercel.app/?v=' + video.id;
    if (navigator.share) {
      navigator.share({ title: video.title, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace directo copiado al portapapeles!');
    }
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

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200">
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMenu(true)} className="text-zinc-200 focus:outline-none p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-black text-white cursor-pointer" onClick={() => { setActiveTag('Todos'); handleCloseVideo(); }}>FLI<span className="text-amber-500">XES</span></h1>
        </div>

        <div className="flex items-center gap-2">
          <a href="https://paypal.me/TU_USUARIO_PAYPAL" target="_blank" rel="noopener noreferrer" className="bg-amber-500/10 text-amber-500 text-xs px-3 py-1.5 rounded-full font-bold border border-amber-500/20">☕ Apoyame</a>
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
              <button onClick={() => { setActiveTag('Todos'); handleCloseVideo(); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🏠 Inicio</button>
              <button onClick={() => { alert('Sección de Fotos y Álbumes próximamente'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📸 Fotos y Álbumes</button>
              <button onClick={() => { alert('Contenido VIP exclusivo'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">💎 Contenido VIP</button>
              <button onClick={() => { setActiveTag('Destacados'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">⭐ Secciones Patrocinadas</button>
              <button onClick={() => { prompt('Escribe el título o detalles del video que deseas solicitar:'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🌿 Solicitar Video</button>
              <button onClick={() => { setShowStore(true); setShowMenu(false); fetchProducts(); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🛍️ Mi Tienda</button>
              <a href="https://paypal.me/TU_USUARIO_PAYPAL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">☕ Apóyame (PayPal)</a>
              <button onClick={() => { alert('Panel de Perfil de Usuario'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">👤 Registro / Mi Perfil</button>
              <a href="mailto:umbrellaholdings.global@gmail.com" className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📢 Contacto y Publicidad</a>
              <button onClick={() => { setActiveTag('HD'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">🔍 Filtros Premium</button>
              <button onClick={() => { alert('No tienes videos favoritos guardados'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">❤️ Mis Favoritos (0)</button>
              <button onClick={() => { alert('Próximos estrenos en cartelera'); setShowMenu(false); }} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200">📅 Estrenos (Agenda)</button>
              
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
          placeholder="Buscar contenido..." 
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {videos.filter(v => (activeTag === 'Todos' || v.category === activeTag) && v.title.toLowerCase().includes(searchQuery.toLowerCase())).map((video) => (
            <div key={video.id} onClick={() => handleSelectVideo(video)} className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50">
                <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 className="mt-2 text-base font-semibold text-zinc-200 line-clamp-2">{video.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {showStore && (
        <div className="fixed inset-0 z-50 bg-black/95 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-900">
              <h2 className="text-2xl font-black text-white">🛍️ Mi Tienda Exclusiva</h2>
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
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-bold">Comprar</span>
                  </div>
                </a>
              ))}
              {products.length === 0 && (
                <p className="col-span-full text-center text-zinc-500 py-12">No hay productos disponibles en la tienda todavía.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showAdminProd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <form onSubmit={handleSaveProduct} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-white">Panel Admin - Nuevo Producto</h2>
            <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <input type="text" placeholder="Nombre del producto" value={prodTitle} onChange={e => setProdTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <input type="text" placeholder="Precio (ej. $10.00 USD)" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <input type="text" placeholder="URL de la imagen del producto" value={prodImage} onChange={e => setProdImage(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <input type="text" placeholder="URL de compra o pago (PayPal, Telegram, etc.)" value={prodBuyUrl} onChange={e => setProdBuyUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAdminProd(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700">Cancelar</button>
              <button type="submit" className="w-full p-3 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400">Guardar Producto</button>
            </div>
          </form>
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md" onClick={handleCloseVideo}>
          <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-4xl md:rounded-3xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="aspect-video w-full"><iframe src={selectedVideo.voe_url} className="w-full h-full" allowFullScreen /></div>
            
            <div className="p-4 bg-zinc-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-zinc-800">
              <h2 className="font-bold text-white text-base sm:text-lg truncate w-full sm:w-1/2">{selectedVideo.title}</h2>
              
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                <button 
                  type="button" 
                  onClick={() => handleShare(selectedVideo)} 
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                >
                  🔗 Compartir
                </button>

                <a 
                  href="https://paypal.me/TU_USUARIO_PAYPAL" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs px-3 py-2 rounded-xl font-bold border border-amber-500/20 flex items-center gap-1"
                >
                  ☕ Donar
                </a>

                <button 
                  type="button" 
                  onClick={handleCloseVideo} 
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-4 py-2 rounded-xl font-bold"
                >
                  CERRAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <form onSubmit={handleSaveVideo} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-white">Panel Admin - Subir Video</h2>
            <input type="password" placeholder="Clave de administrador" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <input type="text" placeholder="Título del video" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-zinc-300 outline-none focus:border-amber-500">
              {defaultTags.filter(t => t !== 'Todos').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" placeholder="URL VOE del video" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <input type="text" placeholder="URL Portada / Miniatura" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-white outline-none focus:border-amber-500" />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700">Cancelar</button>
              <button type="submit" className="w-full p-3 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400">Publicar</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
