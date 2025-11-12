// components/Identicon.tsx
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";

export function Identicon({
  seed,
  size = 40,
  className = "",
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const svg = useMemo(
    () =>
      createAvatar(identicon, {
        seed: seed || "anonymous",
        size,
        backgroundColor: ["transparent"],
        // tweak options if you like:
        // scale: 80, radius: 10
      }).toString(),
    [seed, size]
  );

  return (
    <div
      className={className}
      style={{ width: size, height: size, lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="identicon"
    />
  );
}
