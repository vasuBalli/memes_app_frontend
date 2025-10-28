import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, Pause } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReelCardProps {
 
  
  id: string;
  title: string;
  file_url: string;
  caption: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  views: number;
  category: string;
  tags: string;
  downloads: number;
  created_at: string; // ISO date string
  type: "image" | "video" ;
  language: string | null;
  isActive: boolean;
}

export function ReelCard({
  type,
  file_url,
  caption,
  username,
  likes: initialLikes,
  comments,
  isActive,
}: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  // Auto-play/pause based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black snap-start snap-always">
      <div className="relative w-full h-full max-w-[640px] mx-auto">
        {type === 'video' && file_url ? (
          <video
            ref={videoRef}
            src={file_url}
            controls
            className="w-full h-full object-cover"
            loop
            playsInline
          />
        ) : (
          <ImageWithFallback
            src={file_url || ''}
            alt={caption}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className={`transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            {isPlaying ? (
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                <Pause className="h-12 w-12 text-white fill-current" />
              </div>
            ) : (
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                <Play className="h-12 w-12 text-white fill-current ml-1" />
              </div>
            )}
          </div>
        </button>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-4 pointer-events-none">
          <div className="flex-1 space-y-2">
            <p className="text-white text-sm">
              <span className="mr-2">{username}</span>
              {caption}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 pointer-events-auto">
            <button onClick={handleLike} className="flex flex-col items-center gap-1">
              <div className={`rounded-full p-3 ${isLiked ? 'bg-red-500' : 'bg-white/20'}`}>
                <Heart className={`h-6 w-6 text-white ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs text-white">{likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="rounded-full p-3 bg-white/20">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs text-white">{comments > 999 ? `${(comments / 1000).toFixed(1)}K` : comments}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="rounded-full p-3 bg-white/20">
                <Share2 className="h-6 w-6 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
