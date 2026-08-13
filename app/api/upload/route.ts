import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { supabase } from '@/lib/supabase';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const titulo = formData.get('titulo') as string;
    const categoria = formData.get('categoria') as string;
    const duracion = formData.get('duracion') as string;

    if (!file) {
      return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });
    }

    // Convertir el archivo a buffer para Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'flixora_videos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Guardar en Supabase
    const { data, error: dbError } = await supabase
      .from('videos')
      .insert([
        {
          titulo: titulo || file.name,
          categoria: categoria || 'Amateur',
          url: uploadResult.secure_url,
          duracion: duracion || '780p',
        },
      ])
      .select();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error en upload:', error);
    return NextResponse.json({ error: error.message || 'Error al procesar la subida' }, { status: 500 });
  }
}
