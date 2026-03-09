'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { MiniCart } from '@/components/non-sitecore/MiniCart';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

const HOVER_OPEN_DELAY_MS = 100;
const HOVER_CLOSE_DELAY_MS = 150;

/** Minimal link field for hardcoded checkout button in cart. */
const CHECKOUT_LINK: LinkField = {
  value: { href: '/checkout', text: 'Checkout' },
};

/**
 * Hardcoded cart icon in the header red bar. Opens flyout on hover.
 * Does not depend on Sitecore placeholders.
 */
export function HeaderRedBarCart(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleOpen = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    openTimerRef.current = setTimeout(() => setOpen(true), HOVER_OPEN_DELAY_MS);
  }, []);

  const handleClose = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        clearTimers();
        setOpen(v);
      }}
    >
      <PopoverTrigger
        className="flex items-center rounded p-2 text-sm font-medium text-white transition-colors hover:bg-white/15 data-[state=open]:bg-white/15"
        aria-label="Cart"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <ShoppingCart className="size-5 text-white" />
      </PopoverTrigger>
      <PopoverContent
        className="flex w-xl flex-col rounded border-[#e5e7eb] bg-white shadow-lg"
        align="end"
        sideOffset={8}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <PopoverClose className="surface-btn shrink-0 self-end p-2 text-[#4a4a4a] hover:text-[#002754]">
          <X className="size-4" />
        </PopoverClose>
        <div className="">
          <MiniCart showWishlist={false} checkoutPage={CHECKOUT_LINK} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
