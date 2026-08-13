'use client';

export const dynamic = 'force-dynamic';

import Script from 'next/script';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

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
  created_at?: string;
  is_short?: boolean;
}

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  buy_url: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  created_at: string;
}

function AdsterraBlock({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.text = `
      atOptions = {
        'key' : '${zoneId}',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${zoneId}/invoke.js`;

    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, [zoneId]);

  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center overflow-hidden bg-transparent box-border">
      <div ref={containerRef} className="flex justify-center items-center w-full max-w-full h-[250px] overflow-hidden" />
    </div>
  );
}

function AdsterraNativeBlock({ zoneId }: { zoneId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://pl30814143.effectivecpmnetwork.com/${zoneId}/invoke.js`;

    const innerDiv = document.createElement('div');
    innerDiv.id = `container-${zoneId}`;

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(innerDiv);
  }, [zoneId]);

  return (
    <div className="w-full max-w-full flex justify-center items-center overflow-hidden bg-transparent my-2 box-border">
      <div ref={containerRef} className="w-full max-w-full flex justify-center items-center overflow-hidden" />
    </div>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'likes'>('recent');
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showAdminProd, setShowAdminProd] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showWatchLaterModal, setShowWatchLaterModal] = useState(false);
  const [ageAccepted, setAgeAccepted] = useState(false);

  const [history, setHistory] = useState<Video[]>([]);
  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});

  const [adminPassword, setAdminPassword] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HD');
  const [voeUrl, setVoeUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [videoTagsInput, setVideoTagsInput] = useState('HD, Latino, Casero');
  const [isShortVideo, setIsShortVideo] = useState(false);

  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBuyUrl, setProdBuyUrl] = useState('');

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    default: [
      { id: '1', user: 'Carlos99', text: 'Excelente calidad de video, gracias por compartir!', created_at: 'Hace 2 horas' },
      { id: '2', user: 'FoxyUser', text: 'Muy buen aporte bro.', created_at: 'Hace 5 horas' }
    ]
  });
  const [newCommentUser, setNewCommentUser] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const defaultTags = ['Todos', 'Destacados', 'HD', 'Amateur', 'Latino', 'Parodia', 'VR', 'Rubias', 'Morochas', 'Jovencitas', 'Caseros'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('age_verified') === 'true') {
        setAgeAccepted(true);
      }
      const savedHistory = localStorage.getItem('flixora_history');
      if (savedHistory) {
        try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
      }
      const savedWatchLater = localStorage.getItem('flixora_watch_later');
      if (savedWatchLater) {
        try { setWatchLater(JSON.parse(savedWatchLater)); } catch (e) {}
      }
    }
    fetchVideos();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      document.title = `${selectedVideo.title} | Flixes`;
    } else {
      document.title = 'Flixes - Streaming Pro';
    }
  }, [selectedVideo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('v');
    if (vId && videos.length > 0) {
      const video = videos.find(v => v.id === vId);
      if (video) {
        setSelectedVideo(video);
      }
    }
  }, [videos]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(24);
      if (data) setVideos(data);
    } catch (e) { 
      console.error(e); 
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } catch (e) { console.error(e); }
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPipActive(false);
    window.history.pushState(null, '', `?v=${video.id}`);
    
    const updatedHistory = [video, ...history.filter(h => h.id !== video.id)].slice(0, 15);
    setHistory(updatedHistory);
    localStorage.setItem('flixora_history', JSON.stringify(updatedHistory));
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setIsPipActive(false);
    setIsCinemaMode(false);
    window.history.pushState(null, '', '/');
  };

  const toggleWatchLater = (video: Video, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = watchLater.some(v => v.id === video.id);
    let updated: Video[];
    if (exists) {
      updated = watchLater.filter(v => v.id !== video.id);
    } else {
      updated = [video, ...watchLater];
    }
    setWatchLater(updated);
    localStorage.setItem('flixora_watch_later', JSON.stringify(updated));
  };

  const handleNextVideo = () => {
    if (!selectedVideo || videos.length === 0) return;
    const currentIndex = videos.findIndex(v => v.id === selectedVideo.id);
    const nextVideo = videos[(currentIndex + 1) % videos.length];
    handleSelectVideo(nextVideo);
  };

  const handleLike = (videoId: string) => {
    const currentLikes = likesMap[videoId] || 0;
    const isLiked = userLikedMap[videoId];
    setLikesMap({ ...likesMap, [videoId]: isLiked ? currentLikes - 1 : currentLikes + 1 });
    setUserLikedMap({ ...userLikedMap, [videoId]: !isLiked });
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }
    const parsedTags = videoTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from('videos').insert([{ 
      title, 
      category, 
      voe_url: voeUrl, 
      cover_url: coverUrl,
      description: description || 'Disfruta de este contenido en alta definición disponible in Flixora.',
      tags: parsedTags.length > 0 ? parsedTags : [category, 'HD'],
      is_short: isShortVideo
    }]);
    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminModal(false);
      setTitle(''); setVoeUrl(''); setCoverUrl(''); setDescription(''); setVideoTagsInput('HD, Latino, Casero'); setIsShortVideo(false); setAdminPassword('');
      fetchVideos();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'flixes2026#Admin#Pass') {
      alert('Contraseña incorrecta');
      return;
    }
    const { error } = await supabase.from('products').insert([{ 
      title: prodTitle, 
      price: prodPrice, 
      image_url: prodImage, 
      buy_url: prodBuyUrl 
    }]);
    
    if (error) { 
      alert('Error: ' + error.message); 
    } else {
      setShowAdminProd(false);
      setProdTitle(''); setProdPrice(''); setProdImage(''); setProdBuyUrl(''); setAdminPassword('');
      fetchProducts();
      alert('¡Producto agregado con éxito!');
    }
  };

  const handleShare = (video: Video) => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: video.title, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleAddComment = (videoId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const commentItem: Comment = {
      id: Date.now().toString(),
      user: newCommentUser.trim() || 'Anónimo',
      text: newCommentText.trim(),
      created_at: 'Justo ahora'
    };
    const currentList = commentsMap[videoId] || commentsMap['default'];
    setCommentsMap({
      ...commentsMap,
      [videoId]: [commentItem, ...currentList]
    });
    setNewCommentText('');
    setNewCommentUser('');
  };

  if (!ageAccepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 w-full max-w-[100vw] overflow-x-hidden box-border">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6">
          <h1 className="text-4xl font-black text-white tracking-tight">FLI<span className="text-amber-500">XORA</span></h1>
          <p className="text-xs text-zinc-400">Este sitio contiene material para adultos. Debes ser mayor de edad para ingresar.</p>
          <button onClick={() => { localStorage.setItem('age_verified', 'true'); setAgeAccepted(true); }} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl transition-colors">INGRESAR</button>
        </div>
      </div>
    );
  }

  const filteredVideos = videos
    .filter(v => {
      const matchesTag = activeTag === 'Todos' || v.category === activeTag || (Array.isArray(v.tags) && v.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));
      const query = searchQuery.toLowerCase();
      const matchesSearch = v.title.toLowerCase().includes(query) || 
                            (v.category && v.category.toLowerCase().includes(query)) ||
                            (Array.isArray(v.tags) && v.tags.some(t => t.toLowerCase().includes(query)));
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'likes') return (likesMap[b.id] || 0) - (likesMap[a.id] || 0);
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  const horizontalVideos = filteredVideos.filter(v => !v.is_short);
  const verticalShorts = filteredVideos.filter(v => v.is_short);

  return (
    <main className={`min-h-screen ${isCinemaMode ? 'bg-black' : 'bg-[#0f0f

