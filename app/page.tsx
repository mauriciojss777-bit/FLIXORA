'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Video {
  id: string;
  title: string;
  category: string;
  voe_url: string;
  dood_url?: string;
  cover_url: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [serverSource, setServerSource] = useState<'voe' | 'dood'>('voe');
  const [filterCategory, setFilterCategory] = useState<string>('Todos');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Amateur');
  const [voeUrl, setVoeUrl] = useState('');
  const [doodUrl, setDoodUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isAdult = localStorage.getItem('age_verified');
    if (isAdult === 'true') {
      setAgeAccepted(true);
    }
    fetchVideos();
  }, []);

  const acceptAge = () => {
    localStorage.setItem('age_verified', 'true');
    setAgeAccepted(true);
  };

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener videos:', error);
    } else if (data) {
      setVideos(data);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (adminPassword !== 'ADMIN_SECRET_KEY') {
      alert('Contraseña de administrador incorrecta');
      return;
    }

    if (!title || !voeUrl || !coverUrl) {
      alert('Por favor completa el Título, el Enlace de VOE y la URL de la Portada.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('videos').insert([
      {
        title,
        category,
        voe_url: voeUrl,
        dood_url: doodUrl || null,
        cover_url: coverUrl,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      alert('Error al guardar el video: ' + error.message);
    } else {
      alert('¡Video guardado con éxito!');
      setTitle('');
      setVoeUrl('');
      setDoodUrl('');
      setCoverUrl('');
      setShowAdminModal(false);
      fetchVideos();
    }
  };

  const categories = ['Todos', 'Amateur', 'HD', 'Parodia', 'VR'];

  const filteredVideos = filterCategory === 'Todos'
    ? videos
    : videos.filter((v) => v.category === filterCategory);

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 max-w-sm w-full space-y-4 shadow-2xl">
          <h1 className="text-3xl font-black text-pink-500 tracking-wider">FLIXORA</h1>
          <div className="inline-block bg-red-600/20 text-red-500 border border-red-500/30 font-bold px-3 py-1 rounded-full text-xs">
            +18 ADVERTENCIA
          </div>
          <p className="text-zinc-300 text-sm">
            Este sitio contiene material para adultos. Al ingresar confirmas que tienes al menos 18 años de edad.
          </p>
          <button
            onClick={acceptAge}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-pink-600/30"
          >
            Soy mayor de 18 años - Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans pb-12">
      <header className="flex justify-between items-center p-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <h1 className="text-xl font-extrabold tracking-wider text-pink-500">FLIXORA</h1>
        <div className="flex items-center gap-2">
          <a
            href="https://paypal.me/TU_USUARIO_PAYPAL"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            ☕ Apoyar
          </a>
          <button
            onClick={() => setShowAdminModal(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 py-1.5 px-3 rounded-lg border border-zinc-800"
          >
            + Subir
          </button>
        </div>
      </header>

      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-pink-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/80 hover:border-pink-500/50 cursor-pointer transition-all group flex flex-col"
          >
            <div className="relative aspect-video w-full bg-zinc-950">
              <img
                src={video.cover_url}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-9 h-9 bg-pink-600/90 rounded-full flex items-center justify-center pl-0.5 shadow-lg group-hover:scale-110 transition-transform">
                  ▶
                </div>
              </div>
            </div>
            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <h3 className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-tight mb-1">
                {video.title}
              </h3>
              <span className="text-[10px] text-pink-400 font-medium">
                {video.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
            <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-200 truncate pr-4">
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-zinc-400 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={serverSource === 'voe' ? selectedVideo.voe_url : selectedVideo.dood_url}
                className="w-full h-full border-0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            </div>

            <div className="p-3 flex items-center justify-between bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Servidor:</span>
                <button
                  onClick={() => setServerSource('voe')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium ${
                    serverSource === 'voe'
                      ? 'bg-pink-600 text-white'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  VOE
                </button>
                {selectedVideo.dood_url && (
                  <button
                    onClick={() => setServerSource('dood')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium ${
                      serverSource === 'dood'
                        ? 'bg-pink-600 text-white'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    Doodstream
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-base font-bold mb-4 text-white">Subir Video</h2>

            <form onSubmit={handleSaveVideo} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título del video"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="Amateur">Amateur</option>
                  <option value="HD">HD</option>
                  <option value="Parodia">Parodia</option>
                  <option value="VR">VR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Enlace VOE (Embed)
                </label>
                <input
                  type="url"
                  value={voeUrl}
                  onChange={(e) => setVoeUrl(e.target.value)}
                  placeholder="https://voe.sx/e/..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Enlace Doodstream (Opcional)
                </label>
                <input
                  type="url"
                  value={doodUrl}
                  onChange={(e) => setDoodUrl(e.target.value)}
                  placeholder="https://dood.so/e/..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  URL de Portada
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://voe.sx/cache/..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-xs mt-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Video'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
