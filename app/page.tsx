



'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Estado de Admin
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Campos del formulario
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Amateur');
  const [duracion, setDuracion] = useState('1080p');
  const [file, setFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const ADMIN_SECRET = 'flixes2026#Admin#Pass';

  // Categorías personalizadas para contenido de adultos
  const categoriasAdultos = ['Todos', 'Amateur', 'Anal', 'Hentai', 'HD', 'VR', 'Trío', 'Latina'];

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('id', { ascending: false });



      if (error) {
        console.error('Error Supabase:', error);
      } else if (data) {
        setVideos(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);
  const compartirVideo = (videoId: string) => {
    const videoUrl = `https://flixes.vercel.app/video/${videoId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Flixes',
        text: '¡Mira este video en Flixes!',
        url: videoUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(videoUrl);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === ADMIN_SECRET) {
      setIsAdmin(true);
      setAdminPass('');
    } else {
      alert('Contraseña de administrador incorrecta');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !titulo) {
      alert('Por favor selecciona un video e ingresa un título.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
     
formData.append('upload_preset','flixora_preset');



const cloudName ='hgo8sfia';



     const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body: formData,
      });

      const cloudData = await res.json();

      if (!res.ok) {
        throw new Error(cloudData.error?.message || 'Error en Cloudinary');
      }

      const { error: dbError } = await supabase.from('videos').insert([
        {
          titulo,
          categoria,
          duracion,
          url: cloudData.secure_url,
        },
      ]);

      if (dbError) throw dbError;

      alert('¡Video publicado exitosamente!');
      setTitulo('');
      setFile(null);
      fetchVideos();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtro de búsqueda y categoría
  const filteredVideos = videos.filter((vid) => {
    const matchesSearch = vid.titulo.toLowerCase().includes(search.toLowerCase()) ||
                          vid.categoria.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || vid.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-rose-600 selection:text-white">
      {/* Navbar Superior */}
      <nav className="sticky top-0 z-50 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded">18+</span>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-wider">
              FLIXES
            </h1>
          </div>

          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-xs px-3 py-1.5 rounded-full border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-rose-400 transition"
          >
            {isAdmin ? '⚙️ Panel Activo' : '🔐 Admin'}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* Banner de Bienvenida y Búsqueda */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950/40 p-6 md:p-10 border border-neutral-800/80 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Catálogo Exclusivo
            </h2>
            <p className="text-sm text-neutral-400">
              Encuentra el contenido que buscas al instante filtrando por categoría o título.
            </p>

            {/* Buscador */}
            <div className="relative pt-2">
              <input
                type="text"
                placeholder="🔍 Buscar videos o categorías..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-rose-500 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* Modal Login Admin */}
        {showAdmin && !isAdmin && (
          <form onSubmit={handleAdminLogin} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex gap-2 max-w-md mx-auto shadow-xl">
            <input
              type="password"
              placeholder="Contraseña de Admin"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-sm flex-1 text-white focus:outline-none focus:border-rose-500"
            />
            <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition">
              Entrar
            </button>
          </form>
        )}

        {/* Panel de Publicación Admin */}
        {isAdmin && (
          <section className="bg-neutral-900 p-6 rounded-2xl border border-rose-500/40 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-rose-400 flex items-center gap-2">
                <span>📤</span> Panel de Publicación
              </h3>
              <button onClick={() => setIsAdmin(false)} className="text-xs text-red-400 hover:underline">
                Cerrar Sesión
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Título del Video</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Video de prueba HD"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    {categoriasAdultos.filter(c => c !== 'Todos').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Calidad/Duración</label>
                  <input
                    type="text"
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Imagen de Portada (Opcional)</label>
<input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-300 mb-3" />
<label className="text-xs text-neutral-400 block mb-1">Archivo de Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-800 file:text-rose-400 hover:file:bg-neutral-700 cursor-pointer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-2.5 rounded-lg transition text-sm disabled:opacity-50 shadow-lg shadow-rose-600/20"
              >
                {loading ? 'Subiendo Video...' : 'Publicar Video'}
              </button>
            </form>
          </section>
        )}

        {/* Categorías Rápidas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriasAdultos.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de Videos */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🔥 Tendencias <span className="text-xs font-normal text-neutral-500">({filteredVideos.length} resultados)</span>
            </h3>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-12 text-center space-y-2">
              <p className="text-neutral-400 text-sm">No hay videos en esta categoría.</p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs text-rose-400 underline hover:text-rose-300"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="group bg-neutral-900/80 border border-neutral-800/90 hover:border-rose-900/50 rounded-2xl overflow-hidden p-3 transition duration-300 shadow-md hover:shadow-xl hover:shadow-rose-950/30 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <video
  controls
  preload="metadata"
  poster={vid.poster_url || vid.poster || vid.thumbnail || ""}
  src={vid.url}
  className="w-full rounded-xl bg-black aspect-video object-cover"
/>



                    
                   
          
                           

                    <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-rose-400 transition line-clamp-1">
                      {vid.titulo}
                    </h4>
<button
  onClick={() => compartirVideo(vid.url)}
  className="mt-2 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
>
  🔗 Compartir
</button>

                  </div>

                  <div className="flex justify-between items-center text-xs text-neutral-400 pt-3 mt-2 border-t border-neutral-800/60">
                    <span className="bg-rose-950/80 text-rose-400 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-rose-800/40">
                      {vid.categoria}
                    </span>
                    <span className="text-neutral-500">{vid.duracion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
