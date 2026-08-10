'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [videos, setVideos] = useState<any[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos')
  const [busqueda, setBusqueda] = useState<string>('')
  const [videoActivo, setVideoActivo] = useState<any | null>(null)
  const [mostrarSubir, setMostrarSubir] = useState<boolean>(false)

  // Estado para editar portada de un video específico
  const [videoAEditar, setVideoAEditar] = useState<any | null>(null)
  const [passwordEdicion, setPasswordEdicion] = useState('')
  const [cargandoImagen, setCargandoImagen] = useState(false)

  // Campos del formulario de subida
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevaCategoria, setNuevaCategoria] = useState('Amateur')
  const [nuevoEmbedUrl, setNuevoEmbedUrl] = useState('')
  const [nuevaPortadaUrl, setNuevaPortadaUrl] = useState('')
  const [passwordAdmin, setPasswordAdmin] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setVideos(data)
      
      const searchParams = new URLSearchParams(window.location.search)
      const videoId = searchParams.get('v')
      if (videoId) {
        const videoEncontrado = data.find((v) => String(v.id) === String(videoId))
        if (videoEncontrado) {
          setVideoActivo(videoEncontrado)
        }
      }
    }
  }

  const categorias = ['Todos', 'Amateur', 'Anal', 'Hentai', 'HD', 'VR', 'Trio', 'Latina']

  const videosFiltrados = videos.filter((video) => {
    const coincideCategoria =
      categoriaSeleccionada === 'Todos' ||
      (video.categoria && video.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase())

    const coincideBusqueda =
      !busqueda ||
      (video.titulo && video.titulo.toLowerCase().includes(busqueda.toLowerCase()))

    return coincideCategoria && coincideBusqueda
  })

  const compartirVideo = (video: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const videoUrl = `https://flixes.vercel.app/?v=${video.id}`
    if (navigator.share) {
      navigator.share({ title: 'Flixes', text: '¡Mira este video en Flixes!', url: videoUrl }).catch(() => {})
    } else {
      navigator.clipboard.writeText(videoUrl)
      alert('¡Enlace copiado al portapapeles!')
    }
  }

  // Función para procesar la imagen seleccionada de la galería local
  const handleArchivoGaleria = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    setCargandoImagen(true)
    const lector = new FileReader()
    lector.onloadend = async () => {
      const base64String = lector.result as string
      
      if (!videoAEditar) {
        setNuevaPortadaUrl(base64String)
      } else {
        // Actualizar directamente en Supabase si está editando
        const { error } = await supabase
          .from('videos')
          .update({ thumbnail: base64String })
          .eq('id', videoAEditar.id)

        if (error) {
          alert('Error al guardar la imagen: ' + error.message)
        } else {
          alert('¡Portada de galería cargada con éxito!')
          setVideoAEditar(null)
          fetchVideos()
        }
      }
      setCargandoImagen(false)
    }
    lector.readAsDataURL(archivo)
  }

  const handleSubirVideo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordAdmin !== 'flixes2026#Admin#Pass') {
      alert('❌ Contraseña de administrador incorrecta')
      return
    }

    if (!nuevoTitulo || !nuevoEmbedUrl) {
      alert('Por favor completa el título y la URL de inserción (Embed URL)')
      return
    }

    setSubiendo(true)
    const { error } = await supabase.from('videos').insert([
      {
        titulo: nuevoTitulo,
        categoria: nuevaCategoria,
        embed_url: nuevoEmbedUrl,
        thumbnail: nuevaPortadaUrl || null,
        created_at: new Date().toISOString()
      }
    ])

    setSubiendo(false)

    if (error) {
      alert('Error al guardar el video: ' + error.message)
    } else {
      alert('¡Video agregado con éxito!')
      setNuevoTitulo('')
      setNuevoEmbedUrl('')
      setNuevaPortadaUrl('')
      setPasswordAdmin('')
      setMostrarSubir(false)
      fetchVideos()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 font-sans pb-24">
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b border-neutral-800 mb-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-pink-600 font-bold px-2 py-0.5 rounded text-white">18+</span>
          <h1 className="text-xl font-black tracking-wider text-pink-500">FLIXES</h1>
        </div>
        <button
          onClick={() => setMostrarSubir(true)}
          className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          ➕ Subir Video
        </button>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 text-center space-y-3">
          <h2 className="text-2xl font-bold">Catálogo Exclusivo</h2>
          <p className="text-sm text-neutral-400">Encuentra el contenido que buscas al instante.</p>
          <input
            type="text"
            placeholder="🔍 Buscar videos o categorías..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaSeleccionada === cat
                  ? 'bg-pink-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videosFiltrados.map((video) => {
            const hasThumbnail = video.thumbnail && video.thumbnail.trim() !== ''

            return (
              <div
                key={video.id}
                onClick={() => setVideoActivo(video)}
                className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl overflow-hidden cursor-pointer hover:border-pink-500/50 transition-all group flex flex-col justify-between relative"
              >
                {/* Botón flotante para cambiar la portada desde la galería */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setVideoAEditar(video)
                  }}
                  title="Cambiar portada desde galería"
                  className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-pink-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 transition-all shadow-md"
                >
                  🖼️
                </button>

                <div className="relative aspect-video bg-gradient-to-br from-neutral-900 via-pink-950/40 to-neutral-900 flex items-center justify-center overflow-hidden">
                  {hasThumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="p-4 text-center">
                      <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest block mb-1">
                        {video.categoria || 'VIDEO'}
                      </span>
                      <p className="text-xs text-neutral-300 font-medium line-clamp-2 px-2">
                        {video.titulo}
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-pink-600/90 group-hover:bg-pink-600 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                      <span className="text-white text-lg ml-0.5">▶</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <h3 className="font-medium text-sm line-clamp-1 group-hover:text-pink-400 transition-colors">
                    {video.titulo || 'Sin título'}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px]">
                      {video.categoria || 'General'}
                    </span>
                    <button
                      onClick={(e) => compartirVideo(video, e)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition-colors"
                    >
                      🔗 Compartir
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* MODAL EDITAR PORTADA DESDE GALERÍA */}
      {videoAEditar && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-lg text-white">Elegir Portada de Galería</h3>
              <button
                onClick={() => setVideoAEditar(null)}
                className="text-neutral-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 line-clamp-1">Video: <strong className="text-white">{videoAEditar.titulo}</strong></p>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs text-neutral-400 mb-2">Selecciona una imagen desde tu dispositivo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArchivoGaleria}
                  disabled={cargandoImagen}
                  className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-500 cursor-pointer"
                />
              </div>

              {cargandoImagen && (
                <p className="text-xs text-pink-400 text-center animate-pulse">Cargando imagen a la base de datos...</p>
              )}

              <button
                onClick={() => setVideoAEditar(null)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 font-bold text-white py-2.5 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPRODUCTOR */}
      {videoActivo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800">
              <h3 className="font-bold text-lg text-white line-clamp-1">{videoActivo.titulo}</h3>
              <button
                onClick={() => setVideoActivo(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video bg-black w-full">
              {videoActivo.embed_url ? (
                <iframe
                  src={videoActivo.embed_url}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : videoActivo.url ? (
                <video src={videoActivo.url} controls autoPlay className="w-full h-full" />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No hay enlace de video disponible.
                </div>
              )}
            </div>

            <div className="p-4 flex justify-between items-center text-xs text-neutral-400">
              <span>Categoría: <strong className="text-white">{videoActivo.categoria || 'General'}</strong></span>
              <button
                onClick={(e) => compartirVideo(videoActivo, e)}
                className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
              >
                Compartir Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUBIR VIDEO */}
      {mostrarSubir && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-lg text-white">Panel Admin: Subir Video</h3>
              <button
                onClick={() => setMostrarSubir(false)}
                className="text-neutral-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubirVideo} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Contraseña de Administrador</label>
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
                <label className="block text-xs text-neutral-400 mb-1">Título del Video</label>
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
                <label className="block text-xs text-neutral-400 mb-1">Categoría</label>
                <select
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  {categorias.filter((c) => c !== 'Todos').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">URL de Inserción (Doodstream Embed)</label>
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
                <label className="block text-xs text-neutral-400 mb-1">Portada desde Galería (Opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArchivoGaleria}
                  className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-500 cursor-pointer"
                />
                {nuevaPortadaUrl && <p className="text-[10px] text-green-400 mt-1">✓ Imagen de galería cargada correctamente</p>}
              </div>

              <button
                type="submit"
                disabled={subiendo}
                className="w-full bg-pink-600 hover:bg-pink-500 font-bold text-white py-2.5 rounded-xl transition-colors disabled:opacity-50"
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
