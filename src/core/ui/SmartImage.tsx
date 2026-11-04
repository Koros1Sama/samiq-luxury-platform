'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export interface SmartImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  wrapperClassName?: string;
  aspectRatioClass?: string;
}

export function SmartImage({
  src,
  alt,
  fill = true,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className = '',
  wrapperClassName = '',
  aspectRatioClass,
  fallbackSrc,
  ...rest
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 text-neutral-500 text-xs p-2 select-none ${
          aspectRatioClass || ''
        } ${wrapperClassName}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-6 h-6 mb-1 text-neutral-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="truncate max-w-[90%] text-[10px] text-neutral-400">{alt || 'صورة غير متوفرة'}</span>
      </div>
    );
  }

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={fill ? sizes : undefined}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) {
          // If fallback provided, try that
          setHasError(false);
        } else {
          setHasError(true);
        }
      }}
      {...rest}
    />
  );

  if (aspectRatioClass || wrapperClassName) {
    return (
      <div className={`relative overflow-hidden bg-neutral-900/60 ${aspectRatioClass || ''} ${wrapperClassName}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-900/40 animate-pulse pointer-events-none" />
        )}
        {imageElement}
      </div>
    );
  }

  return imageElement;
}
