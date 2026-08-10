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

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HD');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const defaultTags = ['Todos', 'Destacados', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR'];

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('age_verified') === 'true') {
      setAgeAccepted(true);
    }
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) setVideos(data);
    } catch (e) { console.error(e); }
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

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6">
          <h1 className="text-4xl font-black text-white">FLIX<span className="text-amber-500">ORA</span></h1>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-amber-500">INGRESAR</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200">
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white cursor-pointer" onClick={() => setActiveTag('Todos')}>FLIX<span className="text-amber-500">ORA</span></h1>
        <div className="flex items-center gap-2">
          <a href="https://paypal.me/TU_USUARIO_PAYPAL" target="_blank" className="bg-amber-500/10 text-amber-500 text-xs px-3 py-1.5 rounded-full font-bold border border-amber-500/20">☕ DONAR</a>
          <button onClick={() => setShowAdminModal(true)} className="text-xs bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">+ SUBIR</button>
        </div>
      </nav>

      <section className="px-4 pt-6 pb-2">
        <input 
          type="text" 
          placeholder="Buscar contenido..." 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-sm focus:border-amber-500 outline-none mb-4" 
        />
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {defaultTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${activeTag === tag ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {videos.filter(v => (activeTag === 'Todos' || v.category === activeTag) && v.title.toLowerCase().includes(searchQuery.toLowerCase())).map((video) => (
            <div key={video.id} onClick={() => setSelectedVideo(video)} className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
                <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="mt-2 text-base font-semibold text-zinc-200 line-clamp-2">{video.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-md" onClick={() => setSelectedVideo(null)}>
          <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-4xl md:rounded-3xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="aspect-video w-full"><iframe src={selectedVideo.voe_url} className="w-full h-full" allowFullScreen /></div>
            <div className="p-4 flex justify-between items-center bg-zinc-950">
              <h2 className="font-bold text-white truncate w-2/3">{selectedVideo.title}</h2>
              <button type="button" onClick={() => setSelectedVideo(null)} className="text-zinc-400 bg-zinc-800 px-4 py-2 rounded-lg">CERRAR</button>
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
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-zinc-300">
              {defaultTags.filter(t => t !== 'Todos').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
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
