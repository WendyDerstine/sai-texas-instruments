'use client';

import React from 'react';
import Link from 'next/link';
import PreviewSearch from '@/components/non-sitecore/search/PreviewSearch';
import { PREVIEW_WIDGET_ID } from '@/constants/search';

/**
 * TI-style header search: inline preview search input with suggestions/results dropdown,
 * plus "Cross-reference search" link below.
 */
export function HeaderSearch(): React.ReactElement {
  return (
    <div className="relative flex w-full max-w-xl flex-col gap-1.5 pt-2 pb-2">
      <PreviewSearch rfkId={PREVIEW_WIDGET_ID} />
      <Link href="/search" className="text-xs text-[#0d9488] hover:underline">
        Cross-reference search
      </Link>
    </div>
  );
}
