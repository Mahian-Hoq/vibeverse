'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface SubcategorySpyNavProps {
  subcategoryNames: string[];
}

function toSectionId(subcategoryName: string): string {
  return `subcategory-${subcategoryName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;
}

export default function SubcategorySpyNav({ subcategoryNames }: SubcategorySpyNavProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const navRef = useRef<HTMLElement | null>(null);

  const sectionIds = useMemo(
    () => subcategoryNames.map((name) => toSectionId(name)),
    [subcategoryNames]
  );

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSectionId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));

    setActiveSectionId((prev) => prev || elements[0].id);

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  useEffect(() => {
    if (!activeSectionId || !navRef.current) return;

    const container = navRef.current;
    const activeLink = container.querySelector<HTMLAnchorElement>(
      `[data-section-id="${activeSectionId}"]`
    );

    if (activeLink) {
      const targetTop =
        activeLink.offsetTop - container.clientHeight / 2 + activeLink.clientHeight / 2;

      const clampedTop = Math.max(
        0,
        Math.min(targetTop, container.scrollHeight - container.clientHeight)
      );

      container.scrollTo({
        top: clampedTop,
        behavior: 'smooth',
      });
    }
  }, [activeSectionId]);

  return (
    <nav ref={navRef} className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {subcategoryNames.map((subcategoryName) => {
        const sectionId = toSectionId(subcategoryName);
        const isActive = activeSectionId === sectionId;

        return (
          <a
            key={subcategoryName}
            href={`#${sectionId}`}
            data-section-id={sectionId}
            className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 font-bold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-pink-700'
            }`}
            aria-current={isActive ? 'location' : undefined}
          >
            {subcategoryName}
          </a>
        );
      })}
    </nav>
  );
}
