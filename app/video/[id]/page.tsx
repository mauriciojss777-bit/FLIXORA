import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  params: { id: string };
};

// Generación automática de metadatos para la tarjeta de compartir
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: video } = await supabase
    .from('videos')
    .select('titulo, embed_url, poster_url')
    .eq('id', params.id)
    .single();

  if (!video) {
    return {
      title: 'Video no encontrado - Flixes',
    };
  }

  const imageUrl = video.poster_url || 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

  return {
    title: `${video.titulo} - Flixes`,
    description: 'Mira este video exclusivo en Flixes',
    openGraph: {
      title: video.titulo,
      description: 'Haz clic para reproducir en Flixes',
      url: `https://flixes.vercel.app/video/${params.id}`,
      siteName: 'Flixes',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: video.titulo,
        },
      ],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: video.titulo,
      images: [imageUrl],
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { data: video } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!video) {
    return <div className="p-8 text-center text-white min-h-screen bg-neutral-950">Video no encontrado.</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">{video.titulo}</h1>
        
        {/* Contenedor responsivo 16:9 con Iframe */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-neutral-800">
          {video.embed_url ? (
            <iframe
              src={video.embed_url}
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              scrolling="no"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              No hay enlace de reproductor configurado.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

