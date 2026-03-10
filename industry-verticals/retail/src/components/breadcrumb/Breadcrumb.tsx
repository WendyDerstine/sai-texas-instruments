import type React from 'react';
import { Link, LinkFieldValue, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { Home } from 'lucide-react';

type BreadcrumbPage = {
  id: string;
  name: string;
  title: { jsonValue: { value: string } };
  navigationTitle: { jsonValue: { value: string } };
  url: LinkFieldValue;
  navigationFilter: {
    jsonValue: {
      name: string;
    }[];
  };
};

type BreadcrumbProps = ComponentProps & {
  fields: {
    data: {
      datasource: BreadcrumbPage & {
        ancestors: BreadcrumbPage[];
      };
    };
  };
};

const hasNavFilter = (page: BreadcrumbPage, filterName: string): boolean => {
  return page?.navigationFilter?.jsonValue?.some((filter) => filter?.name === filterName) ?? false;
};

const getNavItemTitle = (item: BreadcrumbPage, truncate: boolean = true): string => {
  const MAX_TITLE_LENGTH = 20;
  const title = item.navigationTitle?.jsonValue.value || item.title?.jsonValue.value || item.name;
  return truncate && title.length > MAX_TITLE_LENGTH
    ? title.slice(0, MAX_TITLE_LENGTH) + '…'
    : title;
};

export const Default = (props: BreadcrumbProps) => {
  const { fields, params } = props;
  const { styles, RenderingIdentifier: id, NavigationFilter: filterName } = params;
  const item = fields?.data?.datasource ?? {};

  const { page } = useSitecore();

  const visibleAncestors = item.ancestors.filter((ancestor) => !hasNavFilter(ancestor, filterName));
  const showItem = !hasNavFilter(item, filterName);

  const isTemplateEditing =
    page.mode?.isEditing &&
    (page.layout.sitecore.route?.templateName === 'Partial Design' ||
      page.layout.sitecore.route?.templateName === 'Page Design');

  if (!showItem || !visibleAncestors.length) {
    if (isTemplateEditing) {
      return (
        <div
          className={`component breadcrumb border-b border-[#e5e7eb] bg-[#fafafa] ${styles}`}
          id={id}
        >
          [BREADCRUMB NAVIGATION]
        </div>
      );
    }
    return null;
  }

  const reversedAncestors = [...visibleAncestors].reverse();
  const homeAncestor = reversedAncestors[0];
  const intermediateAncestors = reversedAncestors.slice(1, -1);
  const lastAncestor = reversedAncestors[reversedAncestors.length - 1];

  const hasIntermediateAncestors = !!intermediateAncestors.length;
  const hasLastAncestor = !!lastAncestor && lastAncestor?.id !== homeAncestor?.id;

  return (
    <nav
      aria-label="breadcrumb"
      className={`component breadcrumb border-b border-[#e5e7eb] bg-[#fafafa] ${styles}`}
      id={id}
    >
      <ol className="mx-auto flex w-full max-w-[1184px] items-center gap-2 overflow-auto px-4 py-2.5 text-sm lg:gap-3">
        {homeAncestor && (
          <li key={homeAncestor.id} className="flex items-center gap-2 text-[#6b7280] lg:gap-3">
            <Link
              field={homeAncestor.url}
              className="whitespace-nowrap transition-colors hover:text-[#002754]"
              title={getNavItemTitle(homeAncestor, false)}
            >
              <span className="hidden max-md:inline">
                <Home className="size-3.5" aria-label="Home" />
              </span>
              <span className="inline max-md:hidden">{getNavItemTitle(homeAncestor)}</span>
            </Link>
            <ChevronRight className="size-3.5 text-[#d1d5db]" />
          </li>
        )}

        {hasIntermediateAncestors && (
          <li className="flex items-center gap-2 text-[#6b7280] md:hidden lg:gap-3">
            <MoreHorizontal className="size-3.5" />
            <ChevronRight className="size-3.5 text-[#d1d5db]" />
          </li>
        )}

        {intermediateAncestors.map((ancestor: BreadcrumbPage) => (
          <li
            key={ancestor.id}
            className="flex items-center gap-2 text-[#6b7280] max-md:hidden lg:gap-3"
          >
            <Link
              field={ancestor.url}
              className="whitespace-nowrap transition-colors hover:text-[#002754]"
              title={getNavItemTitle(ancestor, false)}
            >
              {getNavItemTitle(ancestor)}
            </Link>
            <ChevronRight className="size-3.5 text-[#d1d5db]" />
          </li>
        ))}

        {hasLastAncestor && (
          <li key={lastAncestor.id} className="flex items-center gap-2 text-[#6b7280] lg:gap-3">
            <Link
              field={lastAncestor.url}
              className="whitespace-nowrap transition-colors hover:text-[#002754]"
              title={getNavItemTitle(lastAncestor, false)}
            >
              {getNavItemTitle(lastAncestor)}
            </Link>
            <ChevronRight className="size-3.5 text-[#d1d5db]" />
          </li>
        )}

        <li
          className="border-l border-[#e5e7eb] py-1 pl-3 font-medium whitespace-nowrap text-[#374151] lg:ml-3 lg:pl-6"
          title={getNavItemTitle(item, false)}
        >
          {getNavItemTitle(item)}
        </li>
      </ol>
    </nav>
  );
};
