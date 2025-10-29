import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { title } from 'process';

interface MemeCardProps {
  // type: 'image' | 'video';
  // imageUrl?: string;
  // videoUrl?: string;
  // caption: string;
  // username: string;
  // userAvatar: string;
  // likes: number;
  // comments: number;
  // category?: string;
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
}

export function MemeCard({
  title,
  file_url,
  caption,
  username,
  userAvatar,
  likes: initialLikes,
  comments,
  // views,
  category,
  // tags,
  // downloads,
  // created_at,
  type,
  // language,
}: MemeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-zinc-100 dark:ring-zinc-800">
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback>{username?username.charAt(0).toUpperCase():""}</AvatarFallback>
            <AvatarFallback>{title}</AvatarFallback> {/* testing purpose */}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm text-zinc-900 dark:text-white">{username}</span>
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
      <div className="relative bg-zinc-950 group">
        {type === 'image' && file_url && (
          <ImageWithFallback
            src={file_url}
            alt={caption}
            className="w-full h-auto max-h-[700px] object-contain"
          />
        )}
        {type === 'video' && file_url && (
          <video
            src={file_url}
            controls
            className="w-full h-auto max-h-[700px]"
            loop
          >
            Your browser does not support the video tag.
          </video>
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
                isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
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
            onClick={() => setIsSaved(!isSaved)}
            className={`h-9 w-9 transition-colors ${
              isSaved ? 'text-blue-500 hover:text-blue-600' : 'hover:text-blue-500'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Likes */}
        <div>
          <button className="text-sm text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            {likes?likes.toLocaleString():""} likes
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <p className="text-sm text-zinc-900 dark:text-white">
            <span className="mr-2">{username}</span>
            <span className="text-zinc-700 dark:text-zinc-300">{caption}</span>
          </p>
        </div>

        {/* Comments */}
        {comments > 0 && (
          <button className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            View all {comments.toLocaleString()} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500">2 hours ago</p>
      </div>
    </motion.article>
  );
}
