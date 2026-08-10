'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialización de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Video {
  id: string;
  title: string;
  category: string;
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

  // Estados del formulario
  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    if (localStorage.getItem('age_verified') === 'true') setAgeAccepted(true);
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (data) setVideos(data);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    // Tu contraseña integrada
    if (adminPassword !== 'flixes2026#Admin#Pass') { 
        alert('Contraseña incorrecta'); 
        return; 
    }
    
    const { error } = await supabase.from('videos').insert([
        { title, category: 'HD', voe_url: voeUrl, cover_url: coverUrl }
    ]);
    
    if (error) {
        alert('Error al subir: ' + error.message);
    } else {
        setShowAdminModal(false);
        setTitle(''); setVoeUrl(''); setCoverUrl(''); setAdminPassword('');
        fetchVideos();
    }
  };

  const filteredVideos = videos.filter((v) => 
    (activeTag === 'Todos' || v.category === activeTag) && 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
          <h1 className="text-4xl font-black tracking-tighter text-white">FLIX<span className="text-amber-500">ORA</span></h1>
          <p className="text-zinc-400 text-sm">Este sitio contiene contenido para adultos. Debes ser mayor de 18 años.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-amber-500 transition-colors">ENTRAR</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200">
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white cursor-pointer" onClick={() => setActiveTag('Todos')}>FLIX<span className="text-amber-500">ORA</span></h1>
        <div className="flex items-center gap-3">
          <a href="https://paypal.me/TU_USUARIO" target="_blank" className="bg-amber-500/10 text-amber-500 text-xs px-4 py-2 rounded-full font-bold border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all">☕ DONAR</a>
          <button onClick={() => setShowAdminModal(true)} className="text-xs bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 hover:border-zinc-600 transition-all">+ SUBIR</button>
        </div>
      </nav>

      <section className="px-4 py-6">
        <input type="text" placeholder="Buscar..." onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-sm focus:border-amber-500 outline-none mb-4" />
      </section>

      <div className="px-4 pb-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredVideos.map((video) => (
          <div key={video.id} onClick={() => setSelectedVideo(video)} className="group cursor-pointer">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
              <img src={video.cover_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-zinc-300 line-clamp-1">{video.title}</h3>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
          <div className="bg-zinc-900 w-full max-w-4xl rounded-3xl overflow-hidden border border-zinc-800" onClick={e => e.stopPropagation()}>
            <div className="aspect-video w-full">
              <iframe src={selectedVideo.voe_url} className="w-full h-full" allowFullScreen />
            </div>
            <div className="p-4 flex justify-between items-center">
              <h2 className="font-bold text-white">{selectedVideo.title}</h2>
              <button onClick={() => setSelectedVideo(null)} className="text-zinc-500 hover:text-white">CERRAR</button>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <form onSubmit={handleSaveVideo} className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Panel Admin</h2>
            <input type="password" placeholder="Clave" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800" />
            <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800" />
            <input type="text" placeholder="URL VOE" value={voeUrl} onChange={e => setVoeUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800" />
            <input type="text" placeholder="URL Portada" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdminModal(false)} className="w-full p-3 rounded-xl bg-zinc-800">Cancelar</button>
              <button type="submit" className="w-full p-3 rounded-xl bg-amber-500 text-black font-bold">Publicar</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
