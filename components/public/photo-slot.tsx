"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { PhotoAsset } from "./photo-assets";

export function PhotoSlot({
  asset,
  className = "",
  priority = false,
  sizes = asset.sizes,
}: {
  asset: PhotoAsset;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const position = {
    "--photo-ratio": asset.width / asset.height,
    "--photo-focus": asset.focus,
    "--photo-focus-mobile": asset.mobileFocus ?? asset.focus,
  } as CSSProperties;

  return (
    <span className={`photo ${className}`} style={position}>
      {failedSrc === asset.src ? (
        <span className="photo__fallback" role="img" aria-label={`${asset.alt}. Фотография недоступна`}>
          Фотография недоступна
        </span>
      ) : (
        <Image
          key={asset.src}
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          preload={priority}
          onError={() => setFailedSrc(asset.src)}
        />
      )}
    </span>
  );
}
