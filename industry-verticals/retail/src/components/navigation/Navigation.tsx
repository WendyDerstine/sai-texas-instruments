'use client';

import React, { useState, useRef } from 'react';
import { Link, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ChevronDown } from 'lucide-react';
import HamburgerIcon from '@/components/non-sitecore/HamburgerIcon';
import { useClickAway } from '@/hooks/useClickAway';
import { useStopResponsiveTransition } from '@/hooks/useStopResponsiveTransition';
import { extractMediaUrl } from '@/helpers/extractMediaUrl';
import {
  getLinkContent,
  getLinkField,
  isNavLevel,
  isNavRootItem,
  prepareFields,
} from '@/helpers/navHelpers';
import clsx from 'clsx';
import { isParamEnabled } from '@/helpers/isParamEnabled';

export interface NavItemFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children?: Array<NavItemFields>;
  Styles: string[];
}

interface NavigationListItemProps {
  fields: NavItemFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  logoSrc?: string;
  isSimpleLayout?: boolean;
}

export interface NavigationProps extends ComponentProps {
  fields: Record<string, NavItemFields>;
}

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  logoSrc,
  isSimpleLayout,
}) => {
  const { page } = useSitecore();
  const [isActive, setIsActive] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);
  useClickAway(dropdownRef, () => setIsActive(false));

  const isRootItem = isNavRootItem(fields);
  const isTopLevelPage = isNavLevel(fields, 1);

  const hasChildren = !!fields.Children?.length;
  const isLogoRootItem = isRootItem && logoSrc;
  const hasDropdownMenu = hasChildren && isTopLevelPage;

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    handleClick(event);
    setIsActive(false);
  };

  const children = hasChildren
    ? fields.Children!.map((child) => (
        <NavigationListItem
          key={child.Id}
          fields={child}
          handleClick={clickHandler}
          isSimpleLayout={isSimpleLayout}
          logoSrc={logoSrc}
        />
      ))
    : null;

  const isInRedBar = !isLogoRootItem;

  return (
    <li
      ref={dropdownRef}
      tabIndex={0}
      role="menuitem"
      className={clsx(
        fields?.Styles?.join(' '),
        'relative flex flex-col gap-x-6 gap-y-4 xl:gap-x-8',
        isRootItem && 'lg:flex-row',
        isLogoRootItem && 'shrink-0 max-lg:hidden',
        isLogoRootItem && isSimpleLayout && 'lg:mr-auto',
        isInRedBar && 'header-red-bar-item'
      )}
    >
      <div className="flex items-center justify-center gap-0.5">
        <Link
          field={getLinkField(fields)}
          editable={page.mode.isEditing}
          onClick={clickHandler}
          className={clsx(
            'whitespace-nowrap transition-colors',
            isLogoRootItem && 'text-[#002754] hover:opacity-80',
            isInRedBar &&
              'text-sm font-medium text-white hover:opacity-90 lg:px-0 lg:py-2 [.header-red-bar_&]:text-white'
          )}
        >
          {getLinkContent(fields, logoSrc)}
        </Link>
        {hasDropdownMenu && (
          <button
            type="button"
            aria-label="Toggle submenu"
            aria-haspopup="true"
            aria-expanded={isActive}
            className="flex h-6 w-6 cursor-pointer items-center justify-center text-white hover:opacity-90 [.header-red-bar_&]:text-white"
            onClick={() => setIsActive((a) => !a)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsActive((a) => !a);
              }
            }}
          >
            <ChevronDown
              className={clsx(
                'size-3.5 transition-transform duration-200',
                isActive && 'rotate-180',
                'navigation-dropdown-trigger'
              )}
            />
          </button>
        )}
      </div>
      {hasChildren && (
        <ul
          role="menu"
          className={clsx(
            'flex flex-col items-center gap-x-6 gap-y-4 xl:gap-x-8',
            isRootItem && 'lg:flex-row',
            hasDropdownMenu &&
              clsx(
                'z-110 text-sm max-lg:border-b max-lg:border-white/30 max-lg:pb-4 max-lg:text-white',
                'lg:absolute lg:top-full lg:left-1/2 lg:min-w-[12rem] lg:-translate-x-1/2 lg:rounded lg:border lg:border-[#e5e7eb] lg:bg-white lg:py-2 lg:text-[#4a4a4a] lg:shadow-lg lg:transition-all lg:duration-200',
                isActive
                  ? 'max-lg:flex'
                  : 'max-lg:hidden lg:pointer-events-none lg:translate-y-1 lg:opacity-0'
              )
          )}
        >
          {children}
        </ul>
      )}
    </li>
  );
};

export const Default = ({ params, fields }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { page } = useSitecore();
  const {
    styles,
    RenderingIdentifier: id,
    Logo: logoImage,
    SimpleLayout: simpleLayout,
    Display: displayMode,
  } = params;

  /** LogoOnly = logo in white bar (header-left-1). NavLinksOnly = nav links in red bar (header-nav-1). */
  const isLogoOnly = displayMode === 'LogoOnly';
  const isNavLinksOnly = displayMode === 'NavLinksOnly';

  useStopResponsiveTransition();

  if (!Object.values(fields).some((v) => !!v)) {
    return (
      <div className={`component navigation bg-white ${styles}`} id={id}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, forceState?: boolean) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }
    setIsMenuOpen(forceState ?? !isMenuOpen);
  };

  const isSimpleLayout = isParamEnabled(simpleLayout);
  const preparedFields = prepareFields(fields, !isSimpleLayout);
  const rootItem = Object.values(preparedFields).find((item) => isNavRootItem(item));
  const logoSrc = extractMediaUrl(logoImage);
  const hasLogoRootItem = rootItem && logoSrc;

  const allItems = Object.values(preparedFields).filter((item): item is NavItemFields => !!item);
  const redBarItems = hasLogoRootItem
    ? allItems.filter((item) => !(isNavRootItem(item) && logoSrc))
    : allItems;

  const navigationItems = allItems.map((item) => (
    <NavigationListItem
      key={item.Id}
      fields={item}
      handleClick={(event) => handleToggleMenu(event, false)}
      logoSrc={logoSrc}
      isSimpleLayout={!!isSimpleLayout}
    />
  ));

  const redBarNavItems = redBarItems.map((item) => (
    <NavigationListItem
      key={item.Id}
      fields={item}
      handleClick={(event) => handleToggleMenu(event, false)}
      logoSrc={logoSrc}
      isSimpleLayout={!!isSimpleLayout}
    />
  ));

  /** NavLinksOnly: only render the nav links list for the red bar (Header provides the red bar wrapper). */
  if (isNavLinksOnly) {
    return (
      <ul
        role="menubar"
        className={`component navigation flex flex-wrap items-center justify-start gap-x-6 gap-y-2 xl:gap-x-8 ${styles}`}
        id={id}
        aria-label="Main navigation"
      >
        {redBarNavItems}
      </ul>
    );
  }

  /** LogoOnly: logo in white bar + mobile row + mobile overlay. */
  if (isLogoOnly) {
    return (
      <div
        className={`component navigation bg-white ${styles} [.component.header_&]:relative [.component.header_&]:min-h-14`}
        id={id}
      >
        <div
          className={clsx(
            'relative z-150 container flex h-14 items-center lg:hidden',
            !isSimpleLayout &&
              '[.component.header_&]:grid-cols-2 [.component.header_&]:px-0 [.component.header_&]:max-lg:grid',
            !isSimpleLayout ? 'flex-row-reverse' : '',
            isSimpleLayout && !hasLogoRootItem ? 'justify-end' : 'justify-between'
          )}
        >
          {hasLogoRootItem && (
            <Link
              field={getLinkField(rootItem!)}
              editable={page.mode.isEditing}
              className={clsx(
                'navigation-mobile-trigger',
                !isSimpleLayout && '[.component.header_&]:mx-auto'
              )}
            >
              {getLinkContent(rootItem!, logoSrc)}
            </Link>
          )}
          <HamburgerIcon
            isOpen={isMenuOpen}
            onClick={handleToggleMenu}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleMenu();
              }
            }}
            className={clsx(
              'navigation-mobile-trigger',
              !isSimpleLayout && '[.component.header_&]:-order-1'
            )}
          />
        </div>
        {hasLogoRootItem && (
          <div className="hidden lg:flex lg:items-center lg:justify-start">
            <Link
              field={getLinkField(rootItem!)}
              editable={page.mode.isEditing}
              className="flex items-center"
            >
              {getLinkContent(rootItem!, logoSrc)}
            </Link>
          </div>
        )}
        <nav
          className={clsx(
            'z-100 flex bg-white duration-300 lg:hidden',
            'max-lg:fixed max-lg:inset-0 max-lg:bg-white',
            !isMenuOpen && 'max-lg:-translate-y-full max-lg:opacity-0'
          )}
        >
          <ul
            role="menubar"
            className={clsx(
              'container flex flex-col items-center justify-center gap-x-6 gap-y-4 py-6 text-sm font-medium lg:flex-row lg:py-0 xl:gap-x-8',
              isSimpleLayout && !hasLogoRootItem && 'lg:justify-end'
            )}
          >
            {navigationItems}
          </ul>
        </nav>
      </div>
    );
  }

  /**
   * Default (no Display param): when Navigation is in header-nav-1 (red bar), output:
   * - Mobile: logo + hamburger + overlay
   * - Desktop: logo + nav links (red bar content)
   */
  return (
    <div
      className={`component navigation flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 bg-transparent xl:gap-x-8 ${styles}`}
      id={id}
    >
      {/* Mobile: logo + hamburger (in red bar); overlay for full menu */}
      <div
        className={clsx(
          'header-red-bar-mobile relative z-150 flex h-12 flex-1 items-center justify-between lg:hidden',
          '[.header-red-bar_&_span]:!bg-white',
          isSimpleLayout && !hasLogoRootItem && 'justify-end'
        )}
      >
        {hasLogoRootItem && (
          <Link
            field={getLinkField(rootItem!)}
            editable={page.mode.isEditing}
            className="flex items-center [.header-red-bar_&]:text-white"
          >
            {getLinkContent(rootItem!, logoSrc)}
          </Link>
        )}
        <HamburgerIcon
          isOpen={isMenuOpen}
          onClick={handleToggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleMenu();
            }
          }}
          className="[.header-red-bar_&]:text-white"
        />
      </div>
      {/* Desktop: logo (left of links) + nav links */}
      {hasLogoRootItem && (
        <Link
          field={getLinkField(rootItem!)}
          editable={page.mode.isEditing}
          className="flex items-center max-lg:hidden [.header-red-bar_&]:opacity-90 [.header-red-bar_&]:hover:opacity-100"
        >
          {getLinkContent(rootItem!, logoSrc)}
        </Link>
      )}
      <ul
        role="menubar"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 max-lg:hidden xl:gap-x-8"
        aria-label="Main navigation"
      >
        {redBarNavItems}
      </ul>
      {/* Mobile overlay (full-screen menu when hamburger open) */}
      <nav
        className={clsx(
          'z-100 flex bg-white duration-300 lg:hidden',
          'max-lg:fixed max-lg:inset-0 max-lg:bg-white',
          !isMenuOpen && 'max-lg:-translate-y-full max-lg:opacity-0'
        )}
      >
        <ul
          role="menubar"
          className={clsx(
            'container flex flex-col items-center justify-center gap-x-6 gap-y-4 py-6 text-sm font-medium lg:flex-row lg:py-0 xl:gap-x-8',
            isSimpleLayout && !hasLogoRootItem && 'lg:justify-end'
          )}
        >
          {navigationItems}
        </ul>
      </nav>
    </div>
  );
};
