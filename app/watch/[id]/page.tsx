'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Video {
  id: string;
  title: string;
  category: string;
  voe_url: string;
  cover_url: string;
  description?: string;
  tags?: string[];
  views?: number;
  likes?: number;
}

  export default function WatchPage() {
  const params = useParams();
  const videoid = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : '';

  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [adWatched, setAdWatched] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const nativeAdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (videoid) {
    fetchVideoData(videoid);
  }
}, [videoid]);


  // Carga Banner Nativo de Adsterra
  useEffect(() => {
    if (video && nativeAdRef.current && !nativeAdRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://pl30814143.effectivecpmnetwork.com/df896f70ade366b92d50697ad57088aa/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      nativeAdRef.current.appendChild(script);
    }
  }, [video]);

  const fetchVideoData = async (id: string) => {
    try {
      setLoading(true);
      const { data: currentVideo, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !currentVideo) {
        console.error('Video no encontrado:', error);
        setVideo(null);
      } else {
        setVideo(currentVideo);
        setLikes(currentVideo.likes || 0);
        document.title = `${currentVideo.title} | Flixes`;

        const { data: related } = await supabase
          .from('videos')
          .select('*')
          .neq('id', id)
          .limit(8);

        if (related) setRelatedVideos(related);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: video?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">Video no encontrado</h2>
        <Link href="/" className="bg-amber-500 text-black px-6 py-2 rounded-full font-bold">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-zinc-200">
      <nav className="sticky top-0 z-40 bg-[#0f0f0f]/95 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white">
          FLI<span className="text-amber-500">XES</span>
        </Link>
        <Link href="/" className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-full font-bold">
          ← Volver
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-zinc-800">
            {!adWatched ? (
              <div className="absolute inset-0 z-10 bg-zinc-950/95 flex flex-col justify-center items-center text-white p-6 text-center">
                <h3 className="text-xl font-black mb-2">ANUNCIO PATROCINADO</h3>
                <p className="text-xs text-zinc-400 mb-6">Haz clic para reproducir el contenido.</p>
                <button
                  onClick={() => {
                    window.open('https://www.effectivecpmnetwork.com/u9xtrrbj?key=5e1242fb44358ba404f094359ad59a45', '_blank');
                    setAdWatched(true);
                  }}
                  className="bg-amber-500 text-black font-black py-3 px-8 rounded-full text-sm hover:bg-amber-400 transition-transform active:scale-95"
                >
                  ▶ Ver Video
                </button>
              </div>
            ) : (
              <iframe
                src={video.voe_url}
                className="w-full h-full border-0"
                allowFullScreen
                scrolling="no"
                title={video.title}
              />
            )}
          </div>

          <h1 className="text-xl font-bold text-white">{video.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-sm">F</div>
              <div>
                <p className="text-xs font-bold text-white">Flixes Official</p>
                <p className="text-[10px] text-zinc-400">Canal verificado</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full font-bold transition-colors ${
                  hasLiked ? 'bg-amber-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                👍 {likes}
              </button>
              <button onClick={handleShare} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-4 py-2 rounded-full font-bold">
                🔗 Compartir
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80 text-xs space-y-3">
            <p className="text-zinc-300 leading-relaxed">{video.description || 'Disfruta de este video exclusivo en Flixes.'}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(video.tags || [video.category, 'HD']).map(t => (
                <span key={t} className="bg-zinc-800 text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-black p-4 rounded-2xl border border-zinc-900 flex justify-center">
            <div ref={nativeAdRef} className="w-full flex justify-center items-center min-h-[100px]"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Más recomendados</h3>
          <div className="space-y-3">
            {relatedVideos.map(rel => (
              <Link key={rel.id} href={`/watch/${rel.id}`} className="flex gap-3 group bg-zinc-900/40 p-2 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all">
                <div className="relative aspect-video w-32 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                  <img src={rel.cover_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-xs font-semibold text-zinc-200 line-clamp-2 group-hover:text-amber-400 transition-colors">{rel.title}</h4>
                  <span className="text-[10px] text-zinc-500 mt-1">{rel.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
