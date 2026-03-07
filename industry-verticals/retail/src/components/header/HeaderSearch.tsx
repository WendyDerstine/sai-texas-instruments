'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import PreviewSearch from '@/components/non-sitecore/search/PreviewSearch';
import { PREVIEW_WIDGET_ID } from '@/constants/search';

/**
 * TI-style header search: input with placeholder "Search", magnifying glass button,
 * and "Cross-reference search" link below. Opens PreviewSearch overlay on focus/click.
 */
export function HeaderSearch(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative flex w-full max-w-xl flex-col gap-1.5 pt-2 pb-2">
      <div className="flex items-center rounded-md border border-[#d1d5db] bg-white shadow-sm">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search"
          aria-label="Search"
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          className="w-full rounded-l-md border-0 bg-transparent px-3 py-2 text-sm text-[#374151] placeholder:text-[#9ca3af] focus:ring-0 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex shrink-0 items-center justify-center rounded-r-md border-l border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-[#374151]"
          aria-label="Search"
        >
          <Search className="size-5" />
        </button>
      </div>
      <Link href="/search" className="text-xs text-[#0d9488] hover:underline">
        Cross-reference search
      </Link>
      {isOpen && (
        <div className="fixed inset-x-0 top-14 z-50 border-b border-[#e5e7eb] bg-white shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-2">
              <PreviewSearch
                rfkId={PREVIEW_WIDGET_ID}
                isOpen={isOpen}
                setIsSearchOpen={setIsOpen}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-2 text-[#6b7280] hover:bg-[#f3f4f6]"
                aria-label="Close search"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
