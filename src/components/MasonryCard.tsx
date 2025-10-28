import { useState } from 'react';
import { Heart, MessageCircle, Eye, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface MasonryCardProps {
  type: 'image' | 'video';
  imageUrl?: string;
  caption: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  views?: number;
  category?: string;
  onClick?: () => void;
}

export function MasonryCard({
  type,
  imageUrl,
  caption,
  username,
  userAvatar,
  likes: initialLikes,
  comments,
  views,
  category,
  onClick,
}: MasonryCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-sm hover:shadow-xl transition-all"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={imageUrl || ''}
          alt={caption}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4"
        >
          <div className="flex items-center gap-4 text-white w-full">
            <div className="flex items-center gap-2">
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              <span className="text-sm">{likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{comments}</span>
            </div>
            {views && (
              <div className="flex items-center gap-2 ml-auto">
                <Eye className="h-5 w-5" />
                <span className="text-sm">{views > 999 ? `${(views / 1000).toFixed(1)}K` : views}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Video Badge */}
        {type === 'video' && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2">
            <Play className="h-4 w-4 text-white fill-current" />
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
          {caption}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={userAvatar} alt={username} />
              <AvatarFallback className="text-xs">{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">{username}</span>
          </div>
          
          <button
            onClick={handleLike}
            className={`transition-colors ${isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
