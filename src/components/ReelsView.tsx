import { useState, useEffect, useRef } from 'react';
import { ReelCard } from './ReelCard';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface Meme {
  // id: string;
  // type: 'image' | 'video';
  // imageUrl?: string;
  // videoUrl?: string;
  // caption: string;
  // user_name: string;
  // userAvatar: string;
  // likes: number;
  // comments: number;
  // views?: number;
  // category?: string;
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
  type: "image" | "video" ;
  language: string | null;
}

interface ReelsViewProps {
  reels: Meme[];
  initialIndex?: number;
  onClose: () => void;
}

export function ReelsView({ reels, initialIndex = 0, onClose }: ReelsViewProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to initial reel
    if (containerRef.current) {
      const element = containerRef.current.children[initialIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, [initialIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target as HTMLElement);
            setActiveIndex(index);
          }
        });
      },
      {
        root: null,
        threshold: 0.75,
      }
    );

    Array.from(container.children).forEach((child) => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [reels]);

  const goToPrevious = () => {
    if (activeIndex > 0 && containerRef.current) {
      const element = containerRef.current.children[activeIndex - 1] as HTMLElement;
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToNext = () => {
    if (activeIndex < reels.length - 1 && containerRef.current) {
      const element = containerRef.current.children[activeIndex + 1] as HTMLElement;
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 rounded-full h-10 w-10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Reels Counter */}
      <div className="absolute top-6 right-4 z-50 text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {activeIndex + 1} / {reels.length}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {activeIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="text-white hover:bg-white/10 rounded-full h-12 w-12 bg-black/30 backdrop-blur-sm"
          >
            <ChevronUp className="h-8 w-8" />
          </Button>
        )}
        {activeIndex < reels.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="text-white hover:bg-white/10 rounded-full h-12 w-12 bg-black/30 backdrop-blur-sm"
          >
            <ChevronDown className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* Reels Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory reels-scrollbar"
      >
        {reels.map((reel, index) => (
          <ReelCard
            key={reel.id}
            {...reel}
            isActive={activeIndex === index}
          />
        ))}
      </div>

      {/* Global styles for hiding scrollbar */}
      <style>{`
        .reels-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .reels-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </div>
  );
}
