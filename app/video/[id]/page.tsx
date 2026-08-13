import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params

  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !video) {
    notFound()
  }

  const embedUrl = video.embed_url || video.video_url || video.url

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-4">
        <a href="/" className="text-sm text-neutral-400 hover:text-white mb-4 inline-block">
          ← Volver al catálogo
        </a>
        
        <h1 className="text-2xl font-bold">{video.titulo}</h1>
        
        <div className={`relative w-full ${video.categoria?.toLowerCase().includes('short') || video.categoria?.toLowerCase().includes('vertical') ? 'aspect-[9/16] max-w-sm mx-auto' : 'aspect-video'} bg-black rounded-lg overflow-hidden border border-neutral-800`}>

          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              No hay reproductor disponible
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-neutral-400 pt-2">
          <span>Categoría: <strong className="text-white">{video.categoria || 'Sin categoría'}</strong></span>
          <span>Calidad: <strong className="text-white">{video.duracion || 'HD'}</strong></span>
        </div>
      </div>
    </main>
  )
}
