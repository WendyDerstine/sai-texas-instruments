import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { HeaderLogoProvider } from '@/contexts/HeaderLogoContext';
import { HeaderSearch } from './HeaderSearch';
import { HeaderRedBarCart } from './HeaderRedBarCart';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

/**
 * Two-tier TI-style header (matches ti.com):
 * - Row 1 (white): header-left-1 (logo) | hardcoded search | header-right-1 (Login/Language/etc.)
 * - Row 2 (red bar, in-flow): header-nav-1 (nav links) + cart slot. No overlap with content below.
 */
export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;

  return (
    <div
      className={`component header sticky top-0 z-50 w-full bg-white shadow-sm ${styles}`}
      id={id}
    >
      {/* Tier 1 (white): logo left, search center, utilities right — aligned with hero (max-w-[1184px] px-4) */}
      <div className="relative mx-auto flex h-[5.25rem] w-full max-w-[1184px] items-center gap-4 px-4 lg:gap-6">
        <div className="flex shrink-0 items-center max-lg:order-1 lg:min-w-0 lg:flex-[0_1_auto] lg:justify-start">
          <HeaderLogoProvider>
            <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </HeaderLogoProvider>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center max-lg:order-0 max-lg:mr-auto max-lg:justify-start lg:flex-[1_1_auto]">
          <HeaderSearch />
        </div>
        <div className="flex shrink-0 items-center gap-1 max-lg:order-2 lg:flex-[0_1_auto] lg:gap-2">
          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>

      {/* Tier 2 (red bar): same content width as hero for alignment */}
      <div
        className="header-red-bar flex w-full flex-wrap items-center justify-between gap-4 bg-[#CC0000] py-3 lg:gap-6"
        style={{ minHeight: '48px' }}
      >
        <div className="mx-auto flex w-full max-w-[1184px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 xl:gap-x-8">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
          <div className="flex shrink-0 items-center">
            <HeaderRedBarCart />
          </div>
        </div>
      </div>
    </div>
  );
};
