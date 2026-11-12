'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DeferredMountProps {
  children: React.ReactNode;
  minHeight?: number;
  id?: string;
}

/**
 * Delays mounting heavy below-the-fold client sections and their dynamic JS chunks
 * until scrolled near the viewport or after explicit scroll interaction.
 */
export function DeferredMount({ children, minHeight = 160, id }: DeferredMountProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) return;
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(node);

    const onScrollOrMove = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight + 480) {
        setShouldMount(true);
        observer.disconnect();
      }
    };

    window.addEventListener('scroll', onScrollOrMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollOrMove);
    };
  }, [shouldMount]);

  if (shouldMount) {
    return <>{children}</>;
  }

  return <div id={id} ref={hostRef} style={{ minHeight: `${minHeight}px` }} aria-hidden="true" />;
}

/**
 * Wraps a lazy/dynamic section component in DeferredMount so its bundle
 * only downloads and hydrates as the visitor scrolls near the section.
 */
export function withDeferredMount<P extends object>(
  Component: React.ComponentType<P>,
  minHeight = 200,
  id?: string
) {
  return function DeferredSection(props: P) {
    return (
      <DeferredMount id={id} minHeight={minHeight}>
        <Component {...props} />
      </DeferredMount>
    );
  };
}
