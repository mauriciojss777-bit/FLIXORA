'use client'

import React, { useState, useEffect } from 'react'
import { Search, Play, X, Share2, Plus } from 'lucide-react'

interface Video {
  id: string
  title: string
  category: string
  embedUrl: string
  thumbnailUrl?: string
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [copiado, setCopiado] = useState(false)

  // Estados del modal para agregar video
  const [mostrarModalSubir, setMostrarModalSubir] = useState(false)
  const [passwordAdmin, setPasswordAdmin] = useState('')
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevaCategoria, setNuevaCategoria] = useState('Amateur')
  const [nuevoEmbedUrl, setNuevoEmbedUrl] = useState('')
  const [nuevaPortadaUrl, setNuevaPortadaUrl] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  const categorias = [
    'Todos', 'Amateur', 'Anal', 'Hentai', 'HD', 'VR', 'Trio', 'Latina'
  ]

  useEffect(() => {
    fetch('/api/videos')
      ? fetch('/api/videos')
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setVideos(data)
          })
          .catch((err) => console.error('Error cargando videos:', err))
      : null
  }, [])

  const handleSubirVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordAdmin !== 'flixes2026#Admin#Pass') {
      alert('Contraseña de Administrador incorrecta')
      return
    }

    setSubiendo(true)

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: nuevoTitulo,
          category: nuevaCategoria,
          embedUrl: nuevoEmbedUrl,
          thumbnailUrl: nuevaPortadaUrl
        })
      })

      if (res.ok) {
        const videoGuardado = await res.json()
        setVideos([videoGuardado, ...videos])
        setMostrarModalSubir(false)
        setNuevoTitulo('')
        setNuevoEmbedUrl('')
        setNuevaPortadaUrl('')
        setPasswordAdmin('')
        alert('¡Video publicado exitosamente!')
      } else {
        alert('Error al guardar el video en la base de datos')
      }
    } catch (error) {
      console.error(error)
      alert('Ocurrió un error al subir el video')
    } finally {
      setSubiendo(false)
    }
  }

  const handleShare = (video: Video, e: React.MouseEvent) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/?v=${video.id}`
    navigator.clipboard.writeText(shareUrl)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Todos' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center font-bold text-xl">
              F
            </div>
            <span className="text-xl font-black tracking-wider text-pink-500">
              FLIXES
            </span>
          </div>

          <button
            onClick={() => setMostrarModalSubir(true)}
            className="flex items-center space-x-1.5 bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-pink-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Video</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Hero */}
        <div className="text-center my-6 space-y-4">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Catálogo Exclusivo
          </h1>
          <p className="text-xs md:text-sm text-neutral-400">
            Encuentra el contenido que buscas al instante
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar videos o categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mt-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer bg-neutral-900/50 rounded-xl overflow-hidden border border-neutral-800/80 hover:border-pink-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video bg-neutral-800 overflow-hidden flex items-center justify-center">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-pink-600/20 text-pink-500 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <h3 className="text-xs font-medium line-clamp-2 text-neutral-200 group-hover:text-pink-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-800/50">
                  <span className="text-[10px] text-neutral-500">
                    {video.category}
                  </span>
                  <button
                    onClick={(e) => handleShare(video, e)}
                    className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Reproductor */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
          <div className="bg-neutral-900 w-full max-w-4xl rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative">
            <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <h2 className="text-xs md:text-sm font-bold text-neutral-200 truncate pr-4">
                {selectedVideo.title}
              </h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <iframe
                src={selectedVideo.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-3 flex items-center justify-between bg-neutral-900">
              <span className="text-xs text-neutral-400">
                Categoría: <strong className="text-neutral-200">{selectedVideo.category}</strong>
              </span>
              <button
                onClick={(e) => handleShare(selectedVideo, e)}
                className="flex items-center space-x-1.5 bg-pink-600/10 text-pink-400 hover:bg-pink-600/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiado ? '¡Copiado!' : 'Compartir Video'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Subir Video Admin */}
      {mostrarModalSubir && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 w-full max-w-md rounded-2xl p-5 border border-neutral-800 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">
                Panel Admin: Subir Video
              </h2>
              <button
                onClick={() => setMostrarModalSubir(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubirVideo} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">
                  Contraseña de Administrador
                </label>
                <input
                  type="password"
                  placeholder="Escribe la clave admin"
                  value={passwordAdmin}
                  onChange={(e) => setPasswordAdmin(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  Título del Video
                </label>
                <input
                  type="text"
                  placeholder="Ej. Mi video nuevo"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  Categoría
                </label>
                <select
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  {categorias
                    .filter((c) => c !== 'Todos')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  URL de Inserción (Doodstream Embed)
                </label>
                <input
                  type="url"
                  placeholder="https://playmogo.com/e/..."
                  value={nuevoEmbedUrl}
                  onChange={(e) => setNuevoEmbedUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  URL de la Portada / Thumbnail (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://i.imgur.com/tu-imagen.jpg"
                  value={nuevaPortadaUrl}
                  onChange={(e) => setNuevaPortadaUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={subiendo}
                className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-white py-2.5 rounded-xl transition-colors disabled:opacity-50 mt-2"
              >
                {subiendo ? 'Guardando...' : 'Guardar Video'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
