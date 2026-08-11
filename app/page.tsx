'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedFavs = localStorage.getItem('flixora_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    supabase.from('videos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setVideos(data);
    });
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updatedFavs = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    
    setFavorites(updatedFavs);
    localStorage.setItem('flixora_favs', JSON.stringify(updatedFavs));
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (showFavoritesOnly) {
      return matchesSearch && favorites.includes(v.id);
    }
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(true)} className="text-2xl focus:outline-none">☰</button>
          <h1 className="font-black text-xl tracking-wider">FLIX<span className="text-amber-500">ORA</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://paypal.me/TU_USUARIO" target="_blank" className="bg-amber-500/10 text-amber-500 text-xs px-3 py-1.5 rounded-full font-bold border border-amber-500/20">☕ Apoyame</a>
        </div>
      </nav>

      {/* Menú Pro Completo al 100% */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setMenuOpen(false)}>
          <div className="bg-zinc-950 border-r border-zinc-800 w-80 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-xl font-black text-white">MENÚ PRO</h2>
                <button onClick={() => setMenuOpen(false)} className="text-zinc-400 hover:text-white font-bold text-lg">✕</button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button onClick={() => { setShowFavoritesOnly(false); setMenuOpen(false); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">🏠 Inicio</button>
                <a href="/fotos" className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">📸 Fotos y Álbumes</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Próximamente: Contenido VIP'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm text-amber-400 flex items-center gap-2">💎 Contenido VIP</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Sección Patrocinada activa'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">⭐ Secciones Patrocinadas</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Redirigiendo a solicitudes de video'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">💸 Solicitar Video</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Próximamente: Mi Tienda'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">🛍️ Mi Tienda</a>
                <a href="https://paypal.me/TU_USUARIO" target="_blank" className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 font-bold text-sm flex items-center gap-2">☕ Apóyame (PayPal)</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Próximamente: Registro / Perfil'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">👤 Registro / Mi Perfil</a>
                <a href="https://t.me/TuCanal" target="_blank" className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">📢 Contacto y Publicidad</a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Filtros avanzados activos'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">🔍 Filtros Premium</a>
                <button onClick={() => { setShowFavoritesOnly(true); setMenuOpen(false); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm text-red-400 flex items-center gap-2">❤️ Mis Favoritos ({favorites.length})</button>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Próximamente: Estrenos y Agenda'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">📅 Estrenos (Agenda)</a>
                {/* Nueva opción añadida: Programa de Afiliados */}
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Aquí irá tu enlace de Afiliados / CPA'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm text-emerald-400 flex items-center gap-2">🔥 Apps / Enlaces Afiliados</a>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
              FLIXORA PRO © 2026
            </div>
          </div>
          <div className="flex-1 bg-black/60"></div>
        </div>
      )}

      {/* Barra de Búsqueda */}
      <section className="p-4 space-y-3">
        <input 
          type="text" 
          placeholder="Buscar videos..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-sm focus:border-amber-500 outline-none" 
        />
        {showFavoritesOnly && (
          <div className="flex justify-between items-center bg-zinc-900 px-4 py-2 rounded-xl text-xs">
            <span className="text-amber-500 font-bold">Mostrando solo tus Favoritos ❤️</span>
            <button onClick={() => setShowFavoritesOnly(false)} className="underline text-zinc-400">Ver todos</button>
          </div>
        )}
      </section>

      {/* Espacio Publicitario / Sección Patrocinada */}
      <section className="px-4 pb-4">
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed h-20 rounded-2xl flex items-center justify-center">
          <span className="text-zinc-500 text-xs font-bold tracking-wider">ESPACIO PATROCINADO / ANUNCIOS</span>
        </div>
      </section>

      {/* Cuadrícula de Videos */}
      <section className="px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredVideos.map(v => (
            <div key={v.id} className="bg-zinc-900 rounded-2xl overflow-hidden relative group border border-zinc-800/50">
              <div className="aspect-video relative overflow-hidden bg-black">
                <img src={v.cover_url} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <button 
                  onClick={(e) => toggleFavorite(v.id, e)}
                  className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md text-sm transition-colors ${favorites.includes(v.id) ? 'bg-red-500/80 text-white' : 'bg-black/50 text-zinc-300'}`}
                >
                  ❤️
                </button>
              </div>
              <div className="p-3">
                <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 text-zinc-200">{v.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
