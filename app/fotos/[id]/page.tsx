'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AlbumDetalle() {
  const params = useParams();
  const id = params?.id;
  
  const [album, setAlbum] = useState<any>(null);
  const [fotos, setFotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchAlbumData() {
      const { data: albumData } = await supabase.from('albums').select('*').eq('id', id).single();
      if (albumData) setAlbum(albumData);

      const { data: fotosData } = await supabase.from('fotos').select('*').eq('album_id', id);
      if (fotosData) setFotos(fotosData);

      setLoading(false);
    }

    fetchAlbumData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-6">Cargando álbum...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <a href="/fotos" className="text-gray-400 hover:text-white mb-6 inline-block">
        ← Volver a los álbumes
      </a>
      
      <h1 className="text-3xl font-bold mb-6">{album?.titulo || 'Álbum'}</h1>

      {fotos.length === 0 ? (
        <p className="text-gray-400">Este álbum aún no tiene fotos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {fotos.map((foto) => (
            <div key={foto.id} className="overflow-hidden rounded-lg bg-gray-900 aspect-square border border-gray-800">
              <img 
                src={foto.foto_url} 
                alt="Foto del álbum" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
