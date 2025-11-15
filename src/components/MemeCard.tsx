import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { AvatarWithIdenticon } from "../components/AvatarWithIdenticon";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

/** ---------- Global Mute Bus (single-file, no extra Provider needed) ---------- */
const GLOBAL_MUTE_KEY = "__meme_global_muted__";
const GLOBAL_EVENT = "meme:mutechange";

// Read global muted preference (default: true)
function readGlobalMuted(): boolean {
  try {
    const raw = localStorage.getItem(GLOBAL_MUTE_KEY);
    return raw == null ? true : JSON.parse(raw);
  } catch {
    return true;
  }
}

// Write global muted preference and notify all listeners on the page
function writeGlobalMuted(next: boolean) {
  try {
    localStorage.setItem(GLOBAL_MUTE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors (private mode etc.)
  }
  window.dispatchEvent(new CustomEvent(GLOBAL_EVENT, { detail: next }));
}

interface MemeCardProps {
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
  type: "image" | "video" | string; // tolerant at runtime
  language: string | null;
  // NEW: optional prop so parent can get the actual <video> element
  videoRef?: (el: HTMLVideoElement | null) => void;
}

export function MemeCard({
  id,
  title,
  file_url,
  caption,
  user_name,
  userAvatar,
  likes: initialLikes,
  comments,
  category,
  type,
  tags,
  videoRef: externalVideoRef,
}: MemeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  // video wiring
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideo = (type?.toString?.().toLowerCase?.() ?? "") === "video";
  const hasVideo = isVideo && !!file_url;

  // Global muted state (synced across all cards)
  const [isMuted, setIsMuted] = useState(true);

  // Initialize from global on first client render and wire up listener
  useEffect(() => {
    const initial = readGlobalMuted();
    setIsMuted(initial);

    const onGlobalMute = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setIsMuted(detail);
      // sync the actual video element
      if (videoRef.current) videoRef.current.muted = detail;
    };

    window.addEventListener(GLOBAL_EVENT, onGlobalMute);
    // Cross-tab sync (optional): respond to storage events from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === GLOBAL_MUTE_KEY && e.newValue != null) {
        const val = JSON.parse(e.newValue);
        window.dispatchEvent(new CustomEvent(GLOBAL_EVENT, { detail: val }));
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(GLOBAL_EVENT, onGlobalMute);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Keep the DOM <video> muted flag in sync with state
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Autoplay/pause based on visibility; also pause other videos
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !hasVideo) return;

    videoEl.muted = isMuted;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const mostlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
          if (mostlyVisible) {
            // Pause all other videos on the page
            document.querySelectorAll("video").forEach((vid) => {
              if (vid !== videoEl) vid.pause();
            });
            // Play this one (muted autoplay works on mobile)
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: [0.6] }
    );

    if (containerRef.current) io.observe(containerRef.current);
    return () => io.disconnect();
  }, [hasVideo, isMuted]);

  const toggleGlobalMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    writeGlobalMuted(next); // updates localStorage + dispatches event
    // optimistic local update (listeners will also update)
    setIsMuted(next);
  };

  const handleLike = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLiked((prev) => {
      const next = !prev;
      setLikes((l) => Math.max(0, l + (next ? 1 : -1)));
      return next;
    });
  };

  // helper to attach refs: keep local ref + notify parent
  const handleVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (externalVideoRef) externalVideoRef(el);
  };

  return (
    <motion.article
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm hover:shadow-md cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <AvatarWithIdenticon
            user_name={user_name}
            src={userAvatar}
            size={40}
            className="ring-2 ring-zinc-100 dark:ring-zinc-800"
          />
          <div className="flex flex-col">
            <span className="text-sm text-zinc-900 dark:text-white">{user_name}</span>
            {category && (
              <Badge variant="secondary" className="w-fit text-xs mt-1">
                {category}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Hide</DropdownMenuItem>
            <DropdownMenuItem>Copy Link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media */}
      <div className="relative bg-zinc-950">
        {!hasVideo && file_url && (
          <ImageWithFallback
            src={file_url}
            alt={caption}
            className="w-full h-auto max-h-[700px] object-contain"
          />
        )}

        {hasVideo && (
          <div className="relative">
            <video
              ref={handleVideoRef}
              src={file_url}
              className="w-full h-auto max-h-[700px] object-contain"
              loop
              autoPlay
              muted={isMuted}
              playsInline
            >
              Your browser does not support the video tag.
            </video>

            {/* Global mute/unmute button (bottom-right on video) */}
            <button
              onClick={toggleGlobalMute}
              aria-label={isMuted ? "Unmute video (global)" : "Mute video (global)"}
              className="absolute bottom-0 right-0 z-20 pointer-events-auto rounded-full bg-black/60 hover:bg-black/70 p-2 transition"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={`h-9 w-9 transition-colors ${
                isLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-blue-500">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-green-500">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className={`h-9 w-9 transition-colors ${
              isSaved ? "text-blue-500 hover:text-blue-600" : "hover:text-blue-500"
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Likes */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              /* optionally open likes modal */
            }}
            className="text-sm text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            {likes ? likes.toLocaleString() : ""} likes
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <p className="text-sm text-zinc-900 dark:text-white">
            <span className="mr-2">{title}</span>
          </p>
        </div>

        {/* Comments */}
        {comments > 0 && (
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            View all {comments.toLocaleString()} comments
          </button>
        )}

        {/* Timestamp / tags */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{tags}</p>
      </div>
    </motion.article>
  );
}
