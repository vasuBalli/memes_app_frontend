import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FeedTabs } from './components/FeedTabs';
import { MemeCard } from './components/MemeCard';
import { MasonryCard } from './components/MasonryCard';
import { ReelsView } from './components/ReelsView';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';

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


// Expanded mock data with more variety
// const mockMemes: Meme[] = [
//   {
//     id: '1',
//     type: 'video',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     caption: 'This video never gets old 🤣 The internet needs more of this energy!',
//     user_name: 'viral_vids',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viral_vids',
//     likes: 45678,
//     comments: 892,
//     views: 125000,
//     category: 'Trending',
//   },
//   {
//     id: '2',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBmdW5ueXxlbnwxfHx8fDE3NjExNjAxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Cats are the real rulers of the internet 🐱👑 No debate',
//     user_name: 'cat_enthusiast',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cat_enthusiast',
//     likes: 23456,
//     comments: 456,
//     views: 78000,
//     category: 'Animals',
//   },
//   {
//     id: '3',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1684146327444-5506c849aa53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaWNpb3VzfGVufDF8fHx8MTc2MTEyNzA3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Food so good it made me forget my diet 😋🍔',
//     user_name: 'foodie_life',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie_life',
//     likes: 34890,
//     comments: 567,
//     views: 92000,
//     category: 'Food',
//   },
//   {
//     id: '4',
//     type: 'video',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//     caption: 'POV: You when Monday hits 💀 We all felt that',
//     user_name: 'relateable_content',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=relateable_content',
//     likes: 56789,
//     comments: 1234,
//     views: 234000,
//     category: 'Relatable',
//   },
//   {
//     id: '5',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1672044631233-22b268dc6416?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTEwNzIzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'When the setup is just right 🎮✨ #gaminglife',
//     user_name: 'gamer_zone',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer_zone',
//     likes: 41234,
//     comments: 678,
//     views: 145000,
//     category: 'Gaming',
//   },
//   {
//     id: '6',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1651777518402-c83815a9ed86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBzaWxseXxlbnwxfHx8fDE3NjExNjAxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Dogs > Everything else. Fight me. 🐶💙',
//     user_name: 'doggo_lover',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doggo_lover',
//     likes: 34567,
//     comments: 678,
//     views: 112000,
//     category: 'Animals',
//   },
//   {
//     id: '7',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1700319021396-95aec8e168ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhY3Rpb258ZW58MXx8fHwxNzYxMTEwOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'That adrenaline rush! 🔥⚡ Nothing beats it',
//     user_name: 'sports_action',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sports_action',
//     likes: 28900,
//     comments: 445,
//     views: 87000,
//     category: 'Sports',
//   },
//   {
//     id: '8',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnR8ZW58MXx8fHwxNzYxMTE3NzA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Live music hits different 🎵🎤 Who else was here?',
//     user_name: 'music_vibes',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music_vibes',
//     likes: 52100,
//     comments: 890,
//     views: 198000,
//     category: 'Music',
//   },
//   {
//     id: '9',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1614088459293-5669fadc3448?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NjEwOTg3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Wanderlust calling 🌍✈️ Where to next?',
//     user_name: 'travel_tales',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel_tales',
//     likes: 38900,
//     comments: 723,
//     views: 156000,
//     category: 'Travel',
//   },
//   {
//     id: '10',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1611087966028-bc70bc75d5f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NjEwNzIxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Art that speaks volumes 🎨💭',
//     user_name: 'art_collective',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=art_collective',
//     likes: 27650,
//     comments: 512,
//     views: 94000,
//     category: 'Art',
//   },
//   {
//     id: '11',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzYxMDU5MjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Fashion is art you live in 👗✨',
//     user_name: 'style_icon',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=style_icon',
//     likes: 44500,
//     comments: 801,
//     views: 178000,
//     category: 'Fashion',
//   },
//   {
//     id: '12',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1587522630593-3b9e5f3255f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc3BhY2UlMjBtaW5pbWFsfGVufDF8fHx8MTc2MTE0NzUzNXww&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Minimal workspace, maximum productivity 💻🌱',
//     user_name: 'workspace_goals',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=workspace_goals',
//     likes: 31200,
//     comments: 445,
//     views: 103000,
//     category: 'Lifestyle',
//   },
//   {
//     id: '13',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1740950024560-3399bda3a098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdW5ueSUyMG1lbWV8ZW58MXx8fHwxNzYxMTU3NDA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'When you finally understand the meme 😂💡',
//     user_name: 'meme_lord',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meme_lord',
//     likes: 12453,
//     comments: 234,
//     views: 67000,
//     category: 'Funny',
//   },
//   {
//     id: '14',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYxMDY0MjE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'Nature is healing 🌿🌄 Take a moment',
//     user_name: 'nature_memes',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature_memes',
//     likes: 18900,
//     comments: 345,
//     views: 72000,
//     category: 'Wholesome',
//   },
//   {
//     id: '15',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1495407123977-951ef41c11fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGNpdHl8ZW58MXx8fHwxNzYxMDc2Nzc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'City vibes hit different at night 🌃🌟',
//     user_name: 'urban_explorer',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=urban_explorer',
//     likes: 29876,
//     comments: 567,
//     views: 108000,
//     category: 'Top Rated',
//   },
//   {
//     id: '16',
//     type: 'image',
//     imageUrl: 'https://images.unsplash.com/photo-1659905323699-7d7c8e0328d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MTA4NjU1MXww&ixlib=rb-4.1.0&q=80&w=1080',
//     caption: 'When your code finally compiles 🎨✨ Developers will understand',
//     user_name: 'dev_humor',
//     userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev_humor',
//     likes: 42069,
//     comments: 999,
//     views: 187000,
//     category: 'Funny',
//   },
// ];

export default function App() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<'feed' | 'masonry'>('feed');
  const [showReels, setShowReels] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);

  // Initial load
  useEffect(() => {
    loadMoreMemes();
  }, []);

  // Simulate loading more memes
  // const loadMoreMemes = async() => {
  //   setLoading(true);
  //   setTimeout(async() => {
  //     const currentLength = memes.length;
  //     let mockMemes: Meme[] = [];
  //     const res = await fetch("/api/memes/")
  //      const data: Meme[] = await res.json();
  //      mockMemes = data;
  //     const newMemes = mockMemes.map((meme, index) => ({
  //       ...meme,
  //       id: `${currentLength + index}`,
  //     }));
  //     setMemes([...memes, ...newMemes]);
  //     setLoading(false);
      
  //     // Stop loading after 2 iterations
  //     if (memes.length >= mockMemes.length * 1) {
  //       setHasMore(false);
  //     }
  //   }, 1000);
  // };
  const loadMoreMemes = async () => {
  setLoading(true);

  try {
    const res = await fetch("/api/memes/", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch memes");
    console.log("useeffect triggered",res)

    const result = await res.json();
    const data:Meme[] = result.data
    console.log(data,"data")
    

    setMemes((prev) => {
      const currentLength = prev.length;
      const newMemes = data.map((meme, index) => ({
        ...meme,
        id: `${currentLength + index}`,
      }));

      const updated = [...prev, ...newMemes];

      if (updated.length >= data.length) {
        setHasMore(false);
      }
      console.log(memes)
      
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

  const handleCardClick = (index: number, type: 'image' | 'video') => {
    if (type === 'video') {
      // Filter only videos and find the correct index
      const videoMemes = memes.filter(meme => meme.type === 'video');
      const videoIndex = memes.slice(0, index + 1).filter(meme => meme.type === 'video').length - 1;
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
                    <MemeCard {...meme} />
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
                  />
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <p className="text-sm text-zinc-500">Loading more memes...</p>
                </div>
              </div>
            )}

            {/* End message */}
            {!hasMore && memes.length > 0 && (
              <div className="text-center py-12">
                <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-zinc-900 dark:text-white">You've reached the end!</p>
                  <p className="text-sm text-zinc-500">Come back later for more memes 🎉</p>
                </div>
              </div>
            )}

            {/* Load more button (fallback) */}
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