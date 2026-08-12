'use client';

import Script from 'next/script';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Video {
  id: string;
  title: string;
  category: string;
  tags?: string;
  voe_url: string;
  cover_url: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  // Estados para Monetización con Adsterra
  const [adWatched, setAdWatched] = useState(false);
  const nativeAdRef = useRef<HTMLDivElement>(null);

  // Formulario Admin
  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HD');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    if (localStorage.getItem('age_verified') === 'true') setAgeAccepted(true);
    fetchVideos();
  }, []);

  // Carga script del banner nativo cuando el usuario selecciona un video
  useEffect(() => {
    if (selectedVideo && nativeAdRef.current && !nativeAdRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://pl30814143.effectivecpmnetwork.com/df896f70ade366b92d5f509ddfef3a78/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      nativeAdRef.current.appendChild(script);
    }
  }, [selectedVideo]);

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (data) setVideos(data);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }

    const { error } = await supabase.from('videos').insert([
      { title, category, voe_url: voeUrl, cover_url: coverUrl }
    ]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setAdminPassword('');
      fetchVideos();
    }
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setAdWatched(false); // Reinicia el bloqueo de anuncio para el nuevo video
  };

  const defaultTags = ['Todos', 'Destacados', 'HD', 'Amateur', 'Latino', 'Parodia'];
  const filteredVideos = videos.filter((v) => {
    const matchesTag = activeTag === 'Todos' || v.category === activeTag;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-white">FLIXES</h1>
          <div className="text-red-500 border border-red-500/20 bg-red-950/20 py-1 px-3 rounded-full text-xs inline-block font-semibold">
            +18 AÑOS
          </div>
          <p className="text-zinc-400 text-sm">Este sitio es exclusivo para adultos. Confirma tu edad para continuar.</p>
          <button 
            onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }}
            className="w-full bg-white text-black font-bold py-3 rounded-2xl hover:bg-zinc-200 transition-colors"
          >
            Soy mayor de edad
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200">
      {/* BARRA SUPERIOR */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-black text-white cursor-pointer" onClick={() => setSelectedVideo(null)}>FLIXES</h1>
        <div className="flex items-center gap-3">
          <a href="https://paypal.me/TU_USUARIO_PAYPAL" target="_blank" rel="noreferrer" className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full font-medium">
            Apoyar
          </a>
          <button onClick={() => setShowAdminModal(true)} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-full font-medium text-zinc-300">
            Admin
          </button>
        </div>
      </nav>

      {/* BUSCADOR Y ETIQUETAS */}
      <section className="px-4 pt-6 pb-2 max-w-6xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Buscar contenido..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-white outline-none focus:border-zinc-600 transition-colors"
        />
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {defaultTags.map(tag => (
            <button 
              key={tag} 
              onClick={() => setActiveTag(tag)} 
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeTag === tag ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* GRILLA DE VIDEOS */}
      <div className="px-4 pb-12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredVideos.map((video) => (
          <div key={video.id} onClick={() => handleSelectVideo(video)} className="group cursor-pointer">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                {video.category}
              </div>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-zinc-300 group-hover:text-white line-clamp-1">{video.title}</h3>
          </div>
        ))}
      </div>

      {/* MODAL DE REPRODUCCIÓN + MONETIZACIÓN ADSTERRA */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Contenedor Iframe con Capa de Anuncio */}
            <div className="relative aspect-video w-full bg-black">
              {!adWatched ? (
                <div className="absolute inset-0 z-10 bg-zinc-950/95 flex flex-col justify-center items-center text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">Anuncio patrocinado</h3>
                  <p className="text-sm text-zinc-400 mb-6">
                    Haz clic abajo para iniciar la reproducción limpia del video.
                  </p>
                  <button
                    onClick={() => {
                      window.open('https://www.effectivecpmnetwork.com/u9xtrrbj?key=5e1242fb44358ba404f094359ad59a45', '_blank');
                      setAdWatched(true);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full cursor-pointer transition-transform active:scale-95 shadow-lg flex items-center gap-2"
                  >
                    ▶ Ver Video
                  </button>
                </div>
              ) : (
                <iframe 
                  src={selectedVideo.voe_url} 
                  className="w-full h-full border-0" 
                  allowFullScreen 
                  scrolling="no"
                  title={selectedVideo.title}
                />
              )}
            </div>

            {/* Título y botón cerrar */}
            <div className="p-4 flex justify-between items-center border-b border-zinc-800">
              <h2 className="font-bold text-white text-lg">{selectedVideo.title}</h2>
              <button onClick={() => setSelectedVideo(null)} className="text-zinc-400 hover:text-white text-sm font-semibold bg-zinc-800 px-3 py-1 rounded-full">
                Cerrar ✕
              </button>
            </div>

            {/* Banner Nativo Adsterra */}
            <div className="p-4 flex justify-center items-center min-h-[100px] bg-zinc-950">
              <div id="container-df896f70ade366b92d5f509ddfef3a78" ref={nativeAdRef} />
            </div>

          </div>
        </div>
      )}

      {/* MODAL ADMINISTRADOR */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveVideo} className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-3">
            <h2 className="text-xl font-bold text-white mb-2">Panel Admin</h2>
            <input type="password" placeholder="Clave" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none" />
            <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none">
              {defaultTags.filter(t => t !== 'Todos').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" placeholder="URL VOE" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none" />
            <input type="text" placeholder="URL Portada" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none" />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold">
                Cancelar
              </button>
              <button type="submit" className="w-full p-3 rounded-xl bg-amber-500 text-black font-bold">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

