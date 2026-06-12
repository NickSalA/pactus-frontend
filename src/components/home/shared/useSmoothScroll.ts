'use client';

import { useCallback } from 'react';

export function useSmoothScroll(offset = 132) {
  const scrollToSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault();

      const section = document.querySelector(href);

      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionTop - offset,
        behavior: 'smooth',
      });

      window.history.pushState(null, '', href);
    },
    [offset],
  );

  return scrollToSection;
}
