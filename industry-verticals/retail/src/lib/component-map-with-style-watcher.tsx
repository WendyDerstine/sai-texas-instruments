'use client';

import type { ComponentType } from 'react';
import type { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';
import components from '../../.sitecore/component-map';
import { withPagesStyleChangeWatcher } from '@/components/content-sdk/withPagesStyleChangeWatcher';
import { ComponentProps } from '@/lib/component-props';

type AnyComponent = ComponentType<unknown>;

function isReactComponent(value: unknown): value is AnyComponent {
  return typeof value === 'function';
}

/** Component key prefixes that must not be wrapped so the Pages editor can select/hover them (no hidden div). */
const SKIP_STYLE_WATCHER_PREFIXES = ['HeroBanner'];

function shouldSkipStyleWatcher(key: string): boolean {
  return SKIP_STYLE_WATCHER_PREFIXES.some(
    (prefix) => key === prefix || key.startsWith(`${prefix}.`)
  );
}

/**
 * Wraps each component in the map with withPagesStyleChangeWatcher so that
 * style changes in the XM Cloud Pages editor apply immediately without a manual refresh.
 * Always returns a Map so the result is assignable to SitecoreProvider's componentMap prop.
 */
function wrapMap(
  map: Map<string, AnyComponent> | Record<string, AnyComponent>
): Map<string, NextjsContentSdkComponent> {
  const wrapped = new Map<string, NextjsContentSdkComponent>();
  if (map instanceof Map) {
    map.forEach((Comp, key) => {
      const skipWrap = shouldSkipStyleWatcher(key);
      wrapped.set(
        key,
        (!skipWrap && isReactComponent(Comp)
          ? withPagesStyleChangeWatcher(Comp as ComponentType<ComponentProps>)
          : Comp) as NextjsContentSdkComponent
      );
    });
  } else {
    for (const [key, Comp] of Object.entries(map)) {
      const skipWrap = shouldSkipStyleWatcher(key);
      wrapped.set(
        key,
        (!skipWrap && isReactComponent(Comp)
          ? withPagesStyleChangeWatcher(Comp as ComponentType<ComponentProps>)
          : Comp) as NextjsContentSdkComponent
      );
    }
  }
  return wrapped;
}

const componentsWithStyleWatcher = wrapMap(
  components as Map<string, AnyComponent> | Record<string, AnyComponent>
);

export default componentsWithStyleWatcher;
