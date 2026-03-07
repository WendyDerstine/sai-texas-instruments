'use client';

import { useEffect, useRef, useState, ComponentType } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/**
 * Re-renders a React component when styling is changed in the XM Cloud Pages editor
 * right-hand panel, so changes appear without manually clicking "Reload Canvas".
 *
 * Uses a hidden div with the "component" class so the editor can mutate its class
 * attribute; a MutationObserver syncs those changes into React state and passes
 * updated params.styles to the wrapped component.
 *
 * Based on the approach by David Ly, shared in the Sitecore community.
 *
 * @see https://contentinsights.dev/2024/09/content-insights-tip-67-changing-style.html
 */

const COMPONENT_CLASS = 'component';

function getStyleClassesFromClassList(classListValue: string): string {
  const classes = (classListValue ?? '').split(/\s+/).filter((c) => c && c !== COMPONENT_CLASS);
  return classes.join(' ').trim();
}

export function withPagesStyleChangeWatcher<P extends ComponentProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  function WatcherComponent(props: P) {
    const ref = useRef<HTMLDivElement>(null);
    const initialStyles = props.params?.styles ?? '';
    const [styles, setStyles] = useState(initialStyles);
    const { page } = useSitecore();
    const isEditing = page?.mode?.isEditing ?? false;

    // Sync when props.params.styles changes from server (e.g. initial load or canvas reload)
    useEffect(() => {
      const next = props.params?.styles ?? '';
      setStyles((prev) => (next !== prev ? next : prev));
    }, [props.params?.styles]);

    useEffect(() => {
      if (!ref.current || !isEditing) {
        return;
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class' && ref.current) {
            const next = getStyleClassesFromClassList(ref.current.classList.value);
            setStyles(next);
          }
        });
      });

      observer.observe(ref.current, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }, [isEditing]);

    if (!isEditing) {
      return <WrappedComponent {...props} />;
    }

    const paramsWithStyles = {
      ...props.params,
      styles,
    };
    const propsWithUpdatedStyles = { ...props, params: paramsWithStyles } as P;

    return (
      <>
        {/* Hidden element for the Pages editor to mutate; observer syncs to React state */}
        <div
          ref={ref}
          className={`${COMPONENT_CLASS} ${styles}`.trim()}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        <WrappedComponent {...propsWithUpdatedStyles} />
      </>
    );
  }

  WatcherComponent.displayName = `WithPagesStyleChangeWatcher(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return WatcherComponent as ComponentType<P>;
}
