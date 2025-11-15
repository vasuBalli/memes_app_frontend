import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FeedTabs } from './components/FeedTabs';
import { MemeCard } from './components/MemeCard';
import { MasonryCard } from './components/MasonryCard';
import { ReelsView } from './components/ReelsView';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';

interface Meme {
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
  created_at: string;
  type: "image" | "video" ;
  language: string | null;
}

export default function App() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<'feed' | 'masonry'>('feed');
  const [showReels, setShowReels] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);

  // NEW: video refs - index corresponds to memes array index
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  // Initial load
  useEffect(() => {
    loadMoreMemes();
  }, []);

  const loadMoreMemes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memes/", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch memes");
      const result = await res.json();
      const data: Meme[] = result.data;

      setMemes((prev) => {
        const currentLength = prev.length;
        const newMemes = data.map((meme, index) => ({
          ...meme,
          id: `${currentLength + index}`,
        }));

        // Ensure videoRefs length matches updated memes length
        // (we'll set actual refs when elements mount)
        videoRefs.current.length = currentLength + newMemes.length;

        const updated = [...prev, ...newMemes];
        if (updated.length >= data.length) {
          setHasMore(false);
        }
        return updated;
      });
    } catch (error) {
      console.error("Error fetching memes:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 400
      ) {
        if (!loading && hasMore) {
          loadMoreMemes();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, memes]);

  // UPDATED: toggle mute for the clicked card's video
  const handleCardClick = (index: number, type: 'image' | 'video') => {
    if (type === 'video') {
      // Toggle mute on the *actual* video element at this index (if present)
      const videoEl = videoRefs.current[index];
      if (videoEl) {
        videoEl.muted = !videoEl.muted;
        // ensure it plays when clicked
        if (videoEl.paused) {
          videoEl.play().catch(() => {});
        }
      }

      // existing reel open logic (find position among videos)
      const videoIndex = memes
        .slice(0, index + 1)
        .filter(meme => meme.type === 'video').length - 1;

      setReelIndex(videoIndex);
      setShowReels(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <FeedTabs viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className={`${viewMode === 'masonry' ? 'max-w-7xl' : 'max-w-2xl'} mx-auto px-4 py-6`}>
            {/* Feed View */}
            {viewMode === 'feed' && (
              <div className="space-y-6">
                {memes.map((meme, index) => (
                  <div key={meme.id} onClick={() => handleCardClick(index, meme.type)}>
                    {/* PASS a setter for the video ref down to the card */}
                    <MemeCard
                      {...meme}
                      // a prop the card should use to attach to the actual <video> element
                      videoRef={(el: HTMLVideoElement | null) => (videoRefs.current[index] = el)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Masonry View */}
            {viewMode === 'masonry' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {memes.map((meme, index) => (
                  <MasonryCard
                    key={meme.id}
                    {...meme}
                    onClick={() => handleCardClick(index, meme.type)}
                    videoRef={(el: HTMLVideoElement | null) => (videoRefs.current[index] = el)}
                  />
                ))}
              </div>
            )}

            {/* Loading / End / Load more (unchanged) */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <p className="text-sm text-zinc-500">Loading more memes...</p>
                </div>
              </div>
            )}

            {!hasMore && memes.length > 0 && (
              <div className="text-center py-12">
                <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-zinc-900 dark:text-white">You've reached the end!</p>
                  <p className="text-sm text-zinc-500">Come back later for more memes 🎉</p>
                </div>
              </div>
            )}

            {hasMore && !loading && memes.length > 0 && (
              <div className="flex justify-center py-8">
                <Button
                  onClick={loadMoreMemes}
                  variant="outline"
                  className="rounded-full"
                >
                  Load More Memes
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reels View - Only show videos */}
      {showReels && (
        <ReelsView
          reels={memes.filter(meme => meme.type === 'video')}
          initialIndex={reelIndex}
          onClose={() => setShowReels(false)}
        />
      )}
    </div>
  );
}
