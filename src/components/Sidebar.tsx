import { Home, TrendingUp, Clock, Bookmark, Hash, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

const navigation = [
  { icon: Home, label: 'Home', active: true },
  { icon: TrendingUp, label: 'Trending', badge: '🔥' },
  { icon: Clock, label: 'Recent' },
  { icon: Bookmark, label: 'Saved' },
];

const categories = [
  { icon: Crown, label: 'Top Rated', color: 'text-yellow-500' },
  { icon: Hash, label: 'Funny', color: 'text-blue-500' },
  { icon: Hash, label: 'Wholesome', color: 'text-green-500' },
  { icon: Hash, label: 'Relatable', color: 'text-purple-500' },
  { icon: Hash, label: 'Animals', color: 'text-orange-500' },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && <span className="ml-auto">{item.badge}</span>}
            </Button>
          ))}
        </nav>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="px-3 text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category.label}
                variant="ghost"
                className="w-full justify-start gap-3"
              >
                <category.icon className={`h-4 w-4 ${category.color}`} />
                <span>{category.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <Separator />

        {/* Stats */}
        <div className="space-y-3 px-3">
          <h3 className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Community
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Total Memes</span>
              <span className="text-zinc-900 dark:text-white">1.2M</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Active Users</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                45.2K
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
