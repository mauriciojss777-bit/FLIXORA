import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_PASSWORD = 'flixes2026#Admin#Pass';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authKey, title, category, voe_url, cover_url, description, tags } = body;

    if (authKey !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!title || !voe_url || !cover_url) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    const { data, error } = await supabase.from('videos').insert([
      {
        title,
        category: category || 'HD',
        voe_url,
        cover_url,
        description: description || 'Disfruta de este contenido en alta definición disponible en Flixes.',
        tags: tags || [category || 'HD']
      }
    ]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, video: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const authKey = request.headers.get('x-admin-key');

    if (authKey !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de video faltante' }, { status: 400 });
    }

    const { error } = await supabase.from('videos').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Video eliminado' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
