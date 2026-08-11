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
  
  // Modales de control para las nuevas funciones
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [requestText, setRequestText] = useState('');

  useEffect(() => {
    const savedFavs = localStorage.getItem('flixora_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passInput });
    if (error) {
      // Si no existe, intentamos registrarlo automáticamente
      const { data: regData, error: regError } = await supabase.auth.signUp({ email: emailInput, password: passInput });
      if (regError) {
        alert('Error: ' + regError.message);
      } else {
        alert('¡Registro exitoso! Revisa tu correo o ya puedes iniciar sesión.');
      }
    } else if (data?.user) {
      setUser(data.user);
      setActiveModal(null);
      alert('¡Bienvenido de nuevo!');
    }
  };

  const handleVideoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:umbrellaholdings.global@gmail.com?subject=Solicitud%20de%20Video%20-%20Flixora&body=${encodeURIComponent(requestText)}`;
    window.location.href = mailtoLink;
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
      {/* Barra superior con Logo, Botón de Subida y Donación PayPal */}
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(true)} className="text-2xl focus:outline-none">☰</button>
          <h1 className="font-black text-xl tracking-wider">FLIX<span className="text-amber-500">ORA</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin" className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-amber-400 text-xs px-3 py-1.5 rounded-full font-bold">📤 Subir Video</a>
          <a href="https://paypal.me/TU_USUARIO" target="_blank" className="bg-amber-500/10 text-amber-500 text-xs px-3 py-1.5 rounded-full font-bold border border-amber-500/20 flex items-center gap-1">☕ Apóyame</a>
        </div>
      </nav>

      {/* Menú Pro Completo */}
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
                <a href="/admin" className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-sm flex items-center gap-2">📤 Subir y Administrar Vídeos</a>
                
                {/* 1. Contenido VIP */}
                <button onClick={() => { setMenuOpen(false); setActiveModal('vip'); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm text-amber-400 flex items-center gap-2">💎 Contenido VIP (Validación)</button>
                
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Sección Patrocinada activa'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">⭐ Secciones Patrocinadas</a>
                
                {/* 2. Solicitar Video */}
                <button onClick={() => { setMenuOpen(false); setActiveModal('request'); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">💸 Solicitar Video</button>
                
                {/* 3. Mi Tienda */}
                <button onClick={() => { setMenuOpen(false); setActiveModal('store'); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm text-pink-400 flex items-center gap-2">🛍️ Mi Tienda (Productos)</button>
                
                <a href="https://paypal.me/TU_USUARIO" target="_blank" className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 font-bold text-sm flex items-center gap-2">☕ Apóyame (PayPal)</a>
                
                {/* 4. Registro y Perfil */}
                <button onClick={() => { setMenuOpen(false); setActiveModal('auth'); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">👤 {user ? 'Mi Perfil (' + user.email + ')' : 'Registro / Iniciar Sesión'}</button>
                
                {/* 5. Contacto y Publicidad */}
                <a href="mailto:umbrellaholdings.global@gmail.com?subject=Propuesta%20de%20Publicidad" className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">📢 Contacto y Publicidad</a>
                
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Filtros avanzados activos'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">🔍 Filtros Premium</a>
                <button onClick={() => { setShowFavoritesOnly(true); setMenuOpen(false); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm text-red-400 flex items-center gap-2">❤️ Mis Favoritos ({favorites.length})</button>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Próximamente: Estrenos y Agenda'); }} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm flex items-center gap-2">📅 Estrenos (Agenda)</a>
                
                {/* 6. Enlaces de Afiliados / Apps Dinámicas */}
                <button onClick={() => { setMenuOpen(false); setActiveModal('affiliates'); }} className="text-left p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-bold text-sm text-emerald-400 flex items-center gap-2">🔥 Apps / Enlaces Afiliados</button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
              FLIXORA PRO © 2026
            </div>
          </div>
          <div className="flex-1 bg-black/60"></div>
        </div>
      )}

      {/* MODALES INTERACTIVOS PARA LAS FUNCIONES */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 rounded-3xl space-y-4" onClick={e => e.stopPropagation()}>
            
            {/* Modal Autenticación / Perfil */}
            {activeModal === 'auth' && (
              <div>
                <h3 className="text-lg font-black mb-2">👤 Cuenta y Validación</h3>
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-400">Sesión activa como: <b className="text-white">{user.email}</b></p>
                    <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setActiveModal(null); }} className="w-full bg-red-500/20 text-red-400 py-2 rounded-xl font-bold text-sm">Cerrar Sesión</button>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <input type="email" placeholder="Correo electrónico" value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm outline-none focus:border-amber-500" required />
                    <input type="password" placeholder="Contraseña" value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm outline-none focus:border-amber-500" required />
                    <button type="submit" className="w-full bg-amber-500 text-black py-3 rounded-xl font-bold text-sm">Iniciar Sesión / Registrarse</button>
                  </form>
                )}
              </div>
            )}

            {/* Modal Solicitar Video */}
            {activeModal === 'request' && (
              <div>
                <h3 className="text-lg font-black mb-2">💸 Solicitar Video</h3>
                <p className="text-xs text-zinc-400 mb-3">Escribe los detalles del video que buscas. Se enviará a nuestro correo de gestión.</p>
                <form onSubmit={handleVideoRequest} className="space-y-3">
                  <textarea placeholder="Título, actor o categoría que deseas solicitar..." value={requestText} onChange={e => setRequestText(e.target.value)} className="w-full h-28 bg-black border border-zinc-800 p-3 rounded-xl text-sm outline-none focus:border-amber-500 resize-none" required />
                  <button type="submit" className="w-full bg-amber-500 text-black py-3 rounded-xl font-bold text-sm">Enviar Solicitud por Correo</button>
                </form>
              </div>
            )}

            {/* Modal Contenido VIP */}
            {activeModal === 'vip' && (
              <div className="text-center space-y-3">
                <h3 className="text-lg font-black text-amber-400">💎 Acceso Contenido VIP</h3>
                <p className="text-sm text-zinc-300">Esta sección requiere validación de membresía o usuario de pago.</p>
                {user ? (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-xs text-amber-300">
                    Tu cuenta está activa, pero no tienes un pase VIP registrado. Contacta por publicidad o soporte para activarlo.
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">Inicia sesión primero en el menú de cuenta para verificar tus privilegios.</p>
                )}
              </div>
            )}

            {/* Modal Mi Tienda (Creativo con imágenes y productos) */}
            {activeModal === 'store' && (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                <h3 className="text-lg font-black text-pink-400">🛍️ Mi Tienda y Productos</h3>
                <p className="text-xs text-zinc-400">Artículos exclusivos y ofertas recomendadas:</p>
                
                {/* Producto de Ejemplo 1 */}
                <div className="bg-black border border-zinc-800 rounded-2xl p-3 flex gap-3 items-center">
                  <img src="https://i.ibb.co/68Z44pQ/placeholder.png" alt="Producto" className="w-16 h-16 object-cover rounded-xl bg-zinc-800" />
                  <div className="flex-1">
                    <h4 className="font-bold text-xs">Pack Exclusivo / Acceso Total</h4>
                    <p className="text-[10px] text-zinc-400">Obtén beneficios directos y soporte prioritario.</p>
                    <a href="https://t.me/TuCanal" target="_blank" className="inline-block mt-2 bg-pink-500 text-black text-[10px] font-bold px-3 py-1 rounded-lg">Adquirir</a>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Afiliados / CPA */}
            {activeModal === 'affiliates' && (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-emerald-400">🔥 Apps / Enlaces Afiliados</h3>
                <p className="text-xs text-zinc-400">Explora nuestras aplicaciones y ofertas recomendadas:</p>
                <div className="bg-black border border-zinc-800 p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-white">Oferta Destacada CPA</h4>
                    <p className="text-[10px] text-zinc-500">Regístrate y apoya la plataforma.</p>
                  </div>
                  <a href="#" target="_blank" className="bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg">Ver App</a>
                </div>
              </div>
            )}

            <button onClick={() => setActiveModal(null)} className="w-full bg-zinc-800 text-zinc-300 py-2 rounded-xl text-xs font-bold mt-2">Cerrar Ventana</button>
          </div>
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

      {/* Espacio Publicitario */}
      <section className="px-4 pb-4">
        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed h-20 rounded-2xl flex items-center justify-center">
          <span className="text-zinc-500 text-xs font-bold tracking-wider">ESPACIO PATROCINADO / ANUNCIOS</span>
        </div>
      </section>

      {/* Cuadrícula de Videos (Compatible con Voe.sx e ImgBB) */}
      <section className="px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredVideos.map(v => (
            <a key={v.id} href={v.video_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 rounded-2xl overflow-hidden relative group border border-zinc-800/50 block">
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
            </a>
          ))}
        </div>
      </section>

      {/* Footer con Contacto Directo */}
      <footer className="py-8 border-t border-zinc-900 text-center text-xs text-zinc-500 space-y-2">
        <p>Contacto y Publicidad: <a href="mailto:umbrellaholdings.global@gmail.com" className="text-amber-500 underline">umbrellaholdings.global@gmail.com</a></p>
        <p>FLIXORA PRO © 2026</p>
      </footer>
    </main>
  );
}
