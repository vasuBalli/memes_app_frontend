import { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AvatarWithIdenticon } from "../components/AvatarWithIdenticon";

interface ReelCardProps {
  id: string;
  title: string;
  file_url: string;
  caption: string;
  user_name: string;
  userAvatar: string;
  likes: number;
  comments: number;
  views: number;
  category: string;
  tags: string;
  downloads: number;
  created_at: string; // ISO date string
  type: 'image' | 'video';
  language: string | null;
  isActive: boolean;
}

/** ---------- Global mute helpers ---------- */
const GLOBAL_MUTE_KEY = '__reel_global_muted__';
const GLOBAL_MUTE_EVENT = 'reel:mutechange';

function readGlobalMuted(): boolean {
  try {
    const raw = localStorage.getItem(GLOBAL_MUTE_KEY);
    return raw == null ? true : JSON.parse(raw);
  } catch {
    return true; // default muted (mobile-friendly autoplay)
  }
}
function writeGlobalMuted(next: boolean) {
  try {
    localStorage.setItem(GLOBAL_MUTE_KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new CustomEvent(GLOBAL_MUTE_EVENT, { detail: next }));
}

export function ReelCard({
  type,
  file_url,
  caption,
  user_name,
  likes: initialLikes,
  comments,
  isActive,
}: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isPlaying, setIsPlaying] = useState(false);

  // GLOBAL mute state (shared with all ReelCards)
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const [showCenterIcon, setShowCenterIcon] = useState(true);
  const [showTapHeart, setShowTapHeart] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const tapTimeoutRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);

  // ---- init + sync global mute across instances/tabs ----
  useEffect(() => {
    const initial = readGlobalMuted();
    setIsMuted(initial);
    if (videoRef.current) videoRef.current.muted = initial;

    const onGlobalMute = (e: Event) => {
      const next = (e as CustomEvent<boolean>).detail;
      setIsMuted(next);
      if (videoRef.current) videoRef.current.muted = next;
    };
    window.addEventListener(GLOBAL_MUTE_EVENT, onGlobalMute);

    // cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === GLOBAL_MUTE_KEY && e.newValue != null) {
        const val = JSON.parse(e.newValue);
        window.dispatchEvent(new CustomEvent(GLOBAL_MUTE_EVENT, { detail: val }));
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(GLOBAL_MUTE_EVENT, onGlobalMute);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const likeOnce = () => {
    if (!isLiked) {
      setLikes(l => l + 1);
      setIsLiked(true);
    }
  };

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes(l => Math.max(0, l - 1));
      setIsLiked(false);
    } else {
      setLikes(l => l + 1);
      setIsLiked(true);
    }
  };

  // Double-tap anywhere to like + heart burst + single-tap toggles play/pause
  const handleTapAreaClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      likeOnce();
      setShowTapHeart(true);
      window.setTimeout(() => setShowTapHeart(false), 600);
    }
    lastTapRef.current = now;
    togglePlayPause();
  };

  // Keep component state in sync with actual media playback (important if parent controls media)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => {
      setIsPlaying(true);
      setShowCenterIcon(false);
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowCenterIcon(true);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setShowCenterIcon(true);
    };

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);

    // ensure state matches current element state initially
    setIsPlaying(!v.paused && !v.ended);

    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
    };
  }, []); // run only once (listeners are per-element instance)

  // Auto-play/pause on isActive (respect global mute)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // ensure muted state matches global preference
    v.muted = isMuted;

    if (isActive) {
      v.play()
        .then(() => {
          setIsPlaying(true);
          setShowCenterIcon(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setShowCenterIcon(true);
        });
    } else {
      v.pause();
      setIsPlaying(false);
      setShowCenterIcon(true);
    }
  }, [isActive, isMuted]);

  const togglePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!v.paused) {
      v.pause();
      setIsPlaying(false);
      setShowCenterIcon(true);
    } else {
      v.play()
        .then(() => {
          setIsPlaying(true);
          setShowCenterIcon(true);
          if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);
          tapTimeoutRef.current = window.setTimeout(() => setShowCenterIcon(false), 300);
        })
        .catch((err) => {
          console.warn('Failed to play media programmatically:', err);
        });
    }
  };

  // Toggle **global** mute (updates all cards)
  const toggleMute = () => {
    const next = !isMuted;
    writeGlobalMuted(next);   // dispatch event + persist
    setIsMuted(next);         // optimistic update
    if (videoRef.current) videoRef.current.muted = next;
  };

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black snap-start snap-always">
      <div className="relative w-full h-full max-w-[900px] mx-auto overflow-hidden">
        {/* MEDIA WRAPPER: centers media, ensures top/bottom breathing room on mobile */}
        <div
          className="w-full flex items-center justify-center"
          style={{
            // leave some space above/below the visible media on mobile
            paddingTop: 16,
            paddingBottom: 16,
            // ensure wrapper won't exceed viewport height
            maxHeight: '100vh',
          }}
        >
          {type === 'video' && file_url ? (
            <video
              ref={videoRef}
              src={file_url}
              // make video fully visible and centered, not cropped
              className="max-w-full max-h-[calc(100vh-120px)] object-contain"
              loop
              playsInline
              preload="metadata"
              muted={isMuted}   // global
              data-reel-media
              aria-label={caption || 'Reel video'}
              // inline style fallback for older environments
              style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
            />
          ) : (
            <ImageWithFallback
              src={file_url || ''}
              alt={caption}
              className="max-w-full max-h-[calc(100vh-120px)] object-contain"
              // ensure image is centered and visible
              style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
            />
          )}
        </div>

        {/* dark gradient overlay (keeps edges readable) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/60 pointer-events-none" />

        {/* Tap zone (play/pause + double-tap like) - keep large hit area for mobile */}
        {type === 'video' && (
          <button
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            onClick={handleTapAreaClick}
            className="absolute inset-0 touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          />
        )}

        {/* Center play/pause visual cue (slightly larger on mobile) */}
        {type === 'video' && showCenterIcon && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 md:p-4">
              {isPlaying ? (
                <Pause className="h-12 w-12 text-white" />
              ) : (
                <Play className="h-12 w-12 text-white ml-1" />
              )}
            </div>
          </div>
        )}

        {/* Double-tap heart burst */}
        {showTapHeart && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center animate-ping">
            <Heart className="h-24 w-24 text-white fill-current drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-4 pointer-events-none">
          <div className="flex-1 space-y-2">
            <p className="text-white text-sm">
              <span className="mr-2 font-semibold">@{user_name}</span>
              {caption}
            </p>
          </div>

          {/* Right action rail */}
          <div className="flex flex-col bottom-0 items-center gap-4 pointer-events-auto">
            <button
              onClick={handleLikeClick}
              aria-label={isLiked ? 'Unlike' : 'Like'}
              className="flex flex-col items-center gap-1"
            >
              <div className={`rounded-full p-3 transition ${isLiked ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}>
                <Heart className={`h-6 w-6 text-white ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs text-white">
                {likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}
              </span>
            </button>

            <button
              aria-label="Comments"
              className="flex flex-col items-center gap-1"
            >
              <div className="rounded-full p-3 bg-white/20 hover:bg-white/30">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs text-white">
                {comments > 999 ? `${(comments / 1000).toFixed(1)}K` : comments}
              </span>
            </button>

            {/* Share */}
            <button
              aria-label="Share"
              className="flex flex-col items-center gap-1"
            >
              <div className="rounded-full p-3 bg-white/20 hover:bg-white/30">
                <Share2 className="h-6 w-6 text-white" />
              </div>
            </button>

            {/* Global Mute / Unmute */}
            {type === 'video' && (
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute (global)' : 'Mute (global)'}
                className="flex flex-col items-center gap-1"
              >
                <div className="rounded-full p-3 bg-white/20 hover:bg-white/30">
                  {isMuted ? (
                    <VolumeX className="h-6 w-6 text-white" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-white" />
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* small inline styles to help mobile rendering (no stylesheet required) */}
      <style>{`
        /* prefer contain so the full video is visible, plus keep it centered */
        .object-contain { object-fit: contain; object-position: center; }
        /* helper for better touch handling on mobile */
        .touch-manipulation { -webkit-tap-highlight-color: transparent; }
        @media (max-width: 640px) {
          /* give slightly more breathing room on smaller screens */
          .max-h-\\[calc\\(100vh-120px\\)\\] { max-height: calc(100vh - 120px); }
        }
      `}</style>
    </div>
  );
}
