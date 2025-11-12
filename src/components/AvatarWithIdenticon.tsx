// components/AvatarWithIdenticon.tsx
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Identicon } from "./Identicon";

export function AvatarWithIdenticon({
  user_name,
  src,
  size = 40,              // px
  className = "",
}: {
  user_name?: string | null;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initial =
    (user_name && user_name.trim()[0]?.toUpperCase()) || "U";

  return (
    <Avatar
      className={className}
      // shadcn Avatar usually respects width/height via a wrapper
      style={{ width: size, height: size }}
    >
      {/* If src loads successfully, this shows */}
      <AvatarImage src={src ?? undefined} alt={user_name ?? "user"} />

      {/* Fallback: identicon; if no user_name, show initial */}
      <AvatarFallback className="p-0">
        {user_name ? (
          <Identicon seed={user_name} size={size} className="rounded-full" />
        ) : (
          <span className="text-sm">{initial}</span>
        )}
      </AvatarFallback>
    </Avatar>
  );
}
