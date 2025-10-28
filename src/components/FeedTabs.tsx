import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Flame, Clock, TrendingUp, Sparkles, Grid3x3, Film } from 'lucide-react';

interface FeedTabsProps {
  viewMode: 'feed' | 'masonry';
  onViewModeChange: (mode: 'feed' | 'masonry') => void;
}

export function FeedTabs({ viewMode, onViewModeChange }: FeedTabsProps) {
  return (
    <div className="sticky top-16 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <Tabs defaultValue="foryou" className="flex-1">
          <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1">
            <TabsTrigger value="foryou" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">For You</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Recent</span>
            </TabsTrigger>
            <TabsTrigger value="top" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Top</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange('feed')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'feed'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Film className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('masonry')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'masonry'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
