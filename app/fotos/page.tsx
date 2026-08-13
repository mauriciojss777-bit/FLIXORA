'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FotosPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      const { data, error } = await supabase.from('albums').select('*');
      if (data) setAlbums(data);
      setLoading(false);
    }
    fetchAlbums();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Álbumes de Fotos</h1>
      
      {loading ? (
        <p className="text-gray-400">Cargando álbumes...</p>
      ) : albums.length === 0 ? (
        <p className="text-gray-400">No hay álbumes creados aún.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {albums.map((album) => (
            <a key={album.id} href={`/fotos/${album.id}`} className="block group">
              <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 aspect-square">
                <img 
                  src={album.portada_url} 
                  alt={album.titulo} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <h2 className="mt-2 font-medium text-base truncate">{album.titulo}</h2>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
