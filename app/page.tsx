'use client';

import React, { useState, useEffect } from 'react';

interface Video {
  id: number;
  titulo: string;
  miniaturaUrl: string;
  videoUrl: string;
  categoria: string;
}

const CATEGORIAS_DISPONIBLES = ["Todos", "Tendencia", "HD", "Exclusivo", "Populares"];

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  
  // Estados para subir video
  const [titulo, setTitulo] = useState('');
  const [categoriaVideo, setCategoriaVideo] = useState('Tendencia');
  const [miniaturaFile, setMiniaturaFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Estados de admin
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contrasena, setContrasena] = useState('');
  const [esAdmin, setEsAdmin] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [videoSeleccionado, setVideoSeleccionado] = useState<Video | null>(null);

  useEffect(() => {
    const savedVideos = localStorage.getItem('flixora_videos');
    if (savedVideos) setVideos(JSON.parse(savedVideos));
  }, []);

  useEffect(() => {
    localStorage.setItem('flixora_videos', JSON.stringify(videos));
  }, [videos]);

  // Lógica de filtrado
  const videosFiltrados = videos.filter((vid) => {
    const coincideCategoria = categoriaSeleccionada === 'Todos' || vid.categoria === categoriaSeleccionada;
    const coincideBusqueda = vid.titulo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const verificarAdmin = () => {
    if (contrasena === '777211') {
      setEsAdmin(true);
      setErrorLogin('');
    } else {
      setErrorLogin('Contraseña incorrecta');
    }
  };

  const handleSubirVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !videoFile) return;

    const videoUrl = URL.createObjectURL(videoFile);
    const miniaturaUrl = miniaturaFile ? URL.createObjectURL(miniaturaFile) : 'https://via.placeholder.com/400x225/000/fff?text=Sin+Miniatura';
    
    const nuevoVideo = { id: Date.now(), titulo, miniaturaUrl, videoUrl, categoria: categoriaVideo };
    setVideos([nuevoVideo, ...videos]);
    
    setTitulo(''); setMiniaturaFile(null); setVideoFile(null); setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-widest text-[#87CEEB]">FLIXORA</h1>
          <button onClick={() => setMostrarFormulario(true)} className="bg-[#87CEEB] text-black px-4 py-1.5 rounded text-sm font-bold hover:bg-sky-400">
            Subir Video
          </button>
        </div>
      </header>

      {/* Buscador y Categorías */}
      <div className="max-w-7xl mx-auto p-4 space-y-4 mt-6">
        <input 
          type="text" 
          placeholder="Buscar videos..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:ring-2 focus:ring-[#87CEEB] outline-none"
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIAS_DISPONIBLES.map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${categoriaSeleccionada === cat ? 'bg-[#87CEEB] text-black' : 'bg-neutral-800 hover:bg-neutral-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {videosFiltrados.map((vid) => (
            <div key={vid.id} onClick={() => setVideoSeleccionado(vid)} className="group cursor-pointer">
              <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden relative shadow-lg border border-neutral-700 hover:border-[#87CEEB] transition-all">
                <img src={vid.miniaturaUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <p className="mt-3 text-sm font-medium text-neutral-200 truncate">{vid.titulo}</p>
              <p className="text-xs text-neutral-500">{vid.categoria}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Admin */}
      {mostrarFormulario && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {!esAdmin ? (
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Acceso Autorizado</h2>
              <input type="password" placeholder="Introduce contraseña..." onChange={(e) => setContrasena(e.target.value)} className="w-full p-2.5 rounded bg-neutral-800 mb-2" />
              {errorLogin && <p className="text-red-500 text-xs mb-4">{errorLogin}</p>}
              <div className="flex gap-2">
                <button onClick={verificarAdmin} className="flex-1 bg-[#87CEEB] text-black py-2 rounded font-bold">ENTRAR</button>
                <button onClick={() => setMostrarFormulario(false)} className="px-4 py-2 bg-neutral-800 rounded">Cerrar</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubirVideo} className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-[#87CEEB]">Subir Video (Admin)</h2>
              <input type="text" required placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full p-2.5 rounded bg-neutral-800 mb-3" />
              <select onChange={(e) => setCategoriaVideo(e.target.value)} className="w-full p-2.5 rounded bg-neutral-800 mb-3 text-white">
                {CATEGORIAS_DISPONIBLES.filter(c => c !== "Todos").map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="file" accept="image/*" onChange={(e) => setMiniaturaFile(e.target.files?.[0] || null)} className="w-full mb-3 text-sm" />
              <input type="file" required accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full mb-6 text-sm" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-[#87CEEB] text-black py-2 rounded font-bold">PUBLICAR</button>
                <button type="button" onClick={() => setMostrarFormulario(false)} className="px-4 py-2 bg-neutral-800 rounded">Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {videoSeleccionado && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <button onClick={() => setVideoSeleccionado(null)} className="absolute top-5 right-5 z-50 bg-white/20 p-2 rounded-full">✕</button>
          <video src={videoSeleccionado.videoUrl} controls autoPlay className="w-full max-w-5xl rounded" />
        </div>
      )}
    </div>
  );
}
