import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ReelCard } from "./ReelCard";

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
  created_at: string; // ISO date string
  type: "image" | "video";
  language: string | null;
}

interface ReelsViewProps {
  reels: Meme[];
  initialIndex?: number;
  onClose: () => void;
}

export function ReelsView({ reels, initialIndex = 0, onClose }: ReelsViewProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to initial reel after mount/layout
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const element = container.children[initialIndex] as HTMLElement | undefined;
      element?.scrollIntoView({ behavior: "auto", block: "start" });
      container.focus?.();
    });
    return () => cancelAnimationFrame(id);
  }, [initialIndex]);

  // IntersectionObserver to update activeIndex
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options: IntersectionObserverInit = {
      root: container,
      rootMargin: "0px",
      threshold: 0.6, // at least 60% visible to be active
    };

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(container.children).indexOf(entry.target as HTMLElement);
          if (index >= 0) setActiveIndex(index);
        }
      });
    }, options);

    // observe only direct children (snap slides)
    Array.from(container.children).forEach((child) => obs.observe(child));

    return () => obs.disconnect();
  }, [reels]);

  // Helper to scroll to a specific index
  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({ behavior, block: "start" });
    // optimistic update
    setActiveIndex(index);
  };

  // Toggle play/pause of media (video or audio) inside currently active reel
  const togglePlayOnActive = () => {
    const container = containerRef.current;
    if (!container) return;
    const activeChild = container.children[activeIndex] as HTMLElement | undefined;
    if (!activeChild) return;
    const media = activeChild.querySelector("video, audio") as HTMLMediaElement | null;
    if (!media) {
      console.warn("No media element found in active reel to toggle play/pause.");
      return;
    }
    if (media.paused) {
      media.play().catch((err) => {
        console.warn("Unable to play media programmatically:", err);
      });
    } else {
      media.pause();
    }
  };

  // Keyboard handling: arrows + space
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ignore when user is typing in an input/textarea/contenteditable area
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName?.toLowerCase();
        const isEditable =
          tag === "input" ||
          tag === "textarea" ||
          target.getAttribute("contenteditable") === "true" ||
          (target as HTMLInputElement).isContentEditable;
        if (isEditable) return;
      }

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          if (activeIndex < reels.length - 1) scrollToIndex(activeIndex + 1);
          break;

        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          if (activeIndex > 0) scrollToIndex(activeIndex - 1);
          break;

        case " ":
        case "Spacebar":
          e.preventDefault();
          togglePlayOnActive();
          break;

        default:
          return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, reels.length]);

  const goPrev = () => {
    if (activeIndex > 0) scrollToIndex(activeIndex - 1);
  };
  const goNext = () => {
    if (activeIndex < reels.length - 1) scrollToIndex(activeIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Top-left: Close */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 rounded-full h-10 w-10"
          aria-label="Close reels"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Prev / Next controls (center-left & center-right) */}
      <div className="absolute inset-y-0 left-2 z-40 flex items-center pointer-events-none">
        <button
          onClick={goPrev}
          aria-label="Previous reel"
          disabled={activeIndex === 0}
          className={`pointer-events-auto rounded-full p-2 transition ${
            activeIndex === 0 ? "opacity-40" : "opacity-90 hover:scale-105"
          } bg-black/40 backdrop-blur-sm text-white`}
          style={{ marginLeft: 4 }}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-2 z-40 flex items-center pointer-events-none">
        <button
          onClick={goNext}
          aria-label="Next reel"
          disabled={activeIndex === reels.length - 1}
          className={`pointer-events-auto rounded-full p-2 transition ${
            activeIndex === reels.length - 1 ? "opacity-40" : "opacity-90 hover:scale-105"
          } bg-black/40 backdrop-blur-sm text-white`}
          style={{ marginRight: 4 }}
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>

      {/* Reels Container: full-height snap, gesture/swipe driven */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory touch-pan-y"
        style={{ WebkitOverflowScrolling: "touch" }}
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="snap-start h-screen w-full flex items-center justify-center"
            aria-hidden={activeIndex !== index}
          >
            <ReelCard {...reel} isActive={activeIndex === index} />
          </div>
        ))}
      </div>

      {/* footer status (small) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="text-xs text-white/80 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {activeIndex + 1} / {reels.length}
        </div>
      </div>

      {/* helper styles */}
      <style>{`
        .snap-y { scrollbar-width: none; -ms-overflow-style: none; }
        .snap-y::-webkit-scrollbar { display: none; width: 0; height: 0; }

        /* hide prev/next on very small screens (so they don't block content) */
        @media (max-width: 480px) {
          .absolute.inset-y-0.left-2,
          .absolute.inset-y-0.right-2 {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
