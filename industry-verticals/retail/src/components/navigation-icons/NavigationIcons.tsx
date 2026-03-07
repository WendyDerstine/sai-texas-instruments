import React, { JSX, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Heart, ShoppingCart, X, Search } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { isParamEnabled } from '@/helpers/isParamEnabled';
import { useI18n } from 'next-localization';
import { usePathname, useSearchParams } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { MiniCart } from '../non-sitecore/MiniCart';
import { LinkField } from '@sitecore-content-sdk/nextjs';
import PreviewSearch from '../non-sitecore/search/PreviewSearch';
import { PREVIEW_WIDGET_ID } from '@/constants/search';
import { HEADER_RED_BAR_CART_ID } from '@/constants/header';

export type NavigationIconsProps = ComponentProps & {
  fields: {
    CheckoutPage: LinkField;
    AccountPage: LinkField;
    WishlistPage: LinkField;
  };
  params: { [key: string]: string };
};

const IconDropdown = ({
  icon,
  label,
  children,
}: {
  icon: JSX.Element;
  label: string;
} & React.PropsWithChildren) => (
  <Popover>
    <PopoverTrigger
      className="flex items-center gap-1.5 rounded p-2 text-sm font-medium text-[#4a4a4a] transition-colors hover:bg-[#f5f5f5] hover:text-[#002754] data-[state=open]:text-[#002754]"
      aria-label={label}
    >
      {icon}
    </PopoverTrigger>
    <PopoverContent className="flex w-xl flex-col rounded border-[#e5e7eb] bg-white shadow-lg">
      <PopoverClose className="surface-btn shrink-0 self-end p-2 text-[#4a4a4a] hover:text-[#002754]">
        <X className="size-4" />
      </PopoverClose>
      <div className="">{children}</div>
    </PopoverContent>
  </Popover>
);

export const Default = (props: NavigationIconsProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const showWishlistIcon = !isParamEnabled(props.params.HideWishlistIcon);
  const showAccountIcon = !isParamEnabled(props.params.HideAccountIcon);
  const showCartIcon = !isParamEnabled(props.params.HideCartIcon);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [redBarCartSlot, setRedBarCartSlot] = useState<HTMLElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { t } = useI18n();

  // Close search when route changes
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname, searchParams]);

  // Portal cart into header red bar when slot exists (TI-style two-tier header)
  useEffect(() => {
    setRedBarCartSlot(document.getElementById(HEADER_RED_BAR_CART_ID));
  }, []);

  const cartContent = showCartIcon ? (
    <IconDropdown icon={<ShoppingCart className="size-5 text-white" />} label="Cart">
      <MiniCart showWishlist={showWishlistIcon} checkoutPage={props.fields?.CheckoutPage} />
    </IconDropdown>
  ) : null;

  return (
    <>
      <div
        className={`component navigation-icons flex items-center ${props?.params?.styles?.trimEnd() || ''}`}
        id={id}
      >
        <div className="flex items-center gap-0 [.component.header_&]:justify-end [.component.header_&]:px-0">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center justify-center rounded p-2 text-[#4a4a4a] transition-colors hover:bg-[#f5f5f5] hover:text-[#002754]"
            aria-label="Search"
          >
            <Search className="size-5" />
          </button>
          {showAccountIcon && (
            <>
              <span
                className="mx-0.5 h-4 w-px bg-[#e5e7eb] [.component.header_&]:mx-1"
                aria-hidden
              />
              <IconDropdown icon={<User className="size-5" />} label="Account">
                <p className="p-4 text-sm text-[#4a4a4a]">
                  {t('account-empty') || 'You are not logged in.'}
                </p>
              </IconDropdown>
            </>
          )}
          {showWishlistIcon && (
            <>
              <span
                className="mx-0.5 h-4 w-px bg-[#e5e7eb] [.component.header_&]:mx-1"
                aria-hidden
              />
              <IconDropdown icon={<Heart className="size-5" />} label="Wishlist">
                <p className="p-4 text-sm text-[#4a4a4a]">
                  {t('wishlist-empty') || 'Your wishlist is empty.'}
                </p>
              </IconDropdown>
            </>
          )}
          {/* Cart: inline on mobile; portaled to red bar on desktop when slot exists */}
          {showCartIcon && (
            <>
              <span
                className="mx-0.5 h-4 w-px bg-[#e5e7eb] lg:hidden [.component.header_&]:mx-1"
                aria-hidden
              />
              <div className="lg:hidden">
                <IconDropdown icon={<ShoppingCart className="size-5" />} label="Cart">
                  <MiniCart
                    showWishlist={showWishlistIcon}
                    checkoutPage={props.fields?.CheckoutPage}
                  />
                </IconDropdown>
              </div>
            </>
          )}
        </div>
      </div>
      {showCartIcon && redBarCartSlot && createPortal(cartContent, redBarCartSlot)}
      {isSearchOpen && (
        <div className="absolute top-full right-0 left-0 z-50 border-b border-[#e5e7eb] bg-white shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-2">
              <PreviewSearch
                rfkId={PREVIEW_WIDGET_ID}
                isOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />

              <button
                onClick={() => setIsSearchOpen(false)}
                className="rounded p-3 text-[#4a4a4a] transition-colors hover:bg-[#f5f5f5] hover:text-[#002754]"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
