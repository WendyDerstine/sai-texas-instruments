import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  useSitecore,
  Placeholder,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import AccentLine from '@/assets/icons/accent-line/AccentLine';
import { CommonStyles, HeroBannerStyles, LayoutStyles } from '@/types/styleFlags';
import clsx from 'clsx';

interface Fields {
  Image: ImageField;
  Video: ImageField;
  Title: Field<string>;
  Description: Field<string>;
  CtaLink: LinkField;
}

interface HeroBannerProps extends ComponentProps {
  fields: Fields;
}

const DARK_REVERSED_HERO_STYLE = 'container-dark-background';
const CLEAN_BACKGROUND_STYLE = 'container-clean-background';

const HeroBannerCommon = ({
  params,
  fields,
  children,
}: HeroBannerProps & {
  children: React.ReactNode;
}) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;
  const hideGradientOverlay = styles?.includes(HeroBannerStyles.HideGradientOverlay);
  const isDarkReversedHero =
    styles?.includes(DARK_REVERSED_HERO_STYLE) &&
    styles?.includes(LayoutStyles.Reversed) &&
    styles?.includes(CommonStyles.HideAccentLine);
  const isDarkBackground =
    styles?.includes(DARK_REVERSED_HERO_STYLE) && !styles?.includes(CLEAN_BACKGROUND_STYLE);

  const renderingId = id?.trim() || undefined;

  if (!fields) {
    return isPageEditing ? (
      <div
        className={`component hero-banner ${styles}`}
        id={renderingId}
        data-rendering-id={renderingId}
      >
        [HERO BANNER]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <div
      className={clsx(
        'component hero-banner relative flex min-h-[483px] w-full items-center',
        styles
      )}
      id={renderingId}
      data-rendering-id={renderingId}
    >
      {/* Background Media – image must stay clickable for inline editing */}
      <div className="absolute inset-0 z-0">
        {!isPageEditing && fields?.Video?.value?.src ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={fields.Image?.value?.src}
            src={fields.Video?.value?.src}
          />
        ) : (
          <>
            <ContentSdkImage
              field={fields.Image}
              className={clsx(
                'h-full w-full object-cover',
                isDarkReversedHero ? 'object-right' : 'md:object-bottom'
              )}
              priority
              editable={isPageEditing}
            />
          </>
        )}
        {/* Gradient: non-reversed = dark left / light right (desired); reversed = light left / dark right. Respect HideGradientOverlay. */}
        {!hideGradientOverlay && isDarkReversedHero && (
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 z-[1]',
              isDarkBackground
                ? 'bg-[linear-gradient(90deg,rgba(51,51,51,0)_0%,rgba(34,34,34,0.5)_35%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,0.9)_65%)]'
                : 'bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.5)_35%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0.9)_65%)]'
            )}
            aria-hidden
          />
        )}
        {!hideGradientOverlay && !isDarkReversedHero && (
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 z-[1]',
              isDarkBackground
                ? 'bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_30%,rgba(0,0,0,0.7)_40%,rgba(34,34,34,0.5)_50%,rgba(51,51,51,0)_65%)]'
                : 'bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_30%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0)_65%)]'
            )}
            aria-hidden
          />
        )}
      </div>

      {children}
    </div>
  );
};

export const Default = ({ params, fields, rendering }: HeroBannerProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const reverseLayout = styles.includes(LayoutStyles.Reversed);
  const screenLayer = styles.includes(HeroBannerStyles.ScreenLayer);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[1184px] px-4">
          <div
            className={clsx(
              'flex min-h-[483px] w-full py-10 lg:items-center',
              reverseLayout ? 'lg:mr-auto lg:justify-end' : 'lg:ml-auto lg:justify-start'
            )}
          >
            <div className="max-w-[440px]">
              <div className={clsx({ shim: screenLayer })}>
                <h1 className="text-center text-3xl leading-tight font-bold md:text-4xl lg:text-left lg:text-4xl xl:leading-[1.25]">
                  <ContentSdkText field={fields.Title} editable={editable} />
                  {!hideAccentLine && <AccentLine className="mx-auto w-[9ch] lg:mx-0" />}
                </h1>

                <div className="mt-4 max-w-[400px] text-base md:text-lg">
                  <ContentSdkRichText
                    field={fields.Description}
                    className="text-center lg:text-left"
                    editable={editable}
                  />
                </div>

                <div className="mt-5 flex w-full justify-center lg:justify-start">
                  {withPlaceholder ? (
                    <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                  ) : (
                    <Link
                      field={fields.CtaLink}
                      className="arrow-btn hero-cta-btn"
                      editable={editable}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};

export const TopContent = ({ params, fields, rendering }: HeroBannerProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const styles = params.styles || '';
  const hideAccentLine = styles.includes(CommonStyles.HideAccentLine);
  const withPlaceholder = styles.includes(HeroBannerStyles.WithPlaceholder);
  const reverseLayout = styles.includes(LayoutStyles.Reversed);
  const screenLayer = styles.includes(HeroBannerStyles.ScreenLayer);
  const searchBarPlaceholderKey = `hero-banner-search-bar-${params.DynamicPlaceholderId}`;

  return (
    <HeroBannerCommon params={params} fields={fields} rendering={rendering}>
      <div className="relative z-10 w-full">
        <div className="mx-auto flex min-h-[483px] w-full max-w-[1184px] justify-center px-4">
          <div
            className={clsx(
              'flex flex-col items-center py-10 lg:py-44',
              reverseLayout ? 'justify-end' : 'justify-start'
            )}
          >
            <div className={clsx('w-full max-w-[440px]', { shim: screenLayer })}>
              <h1 className="text-center text-3xl leading-tight font-bold md:text-4xl xl:text-4xl xl:leading-[1.25]">
                <ContentSdkText field={fields.Title} editable={editable} />
                {!hideAccentLine && <AccentLine className="mx-auto w-[9ch]" />}
              </h1>

              <div className="mx-auto mt-4 max-w-[400px] text-base md:text-lg">
                <ContentSdkRichText
                  field={fields.Description}
                  className="text-center"
                  editable={editable}
                />
              </div>

              <div className="mt-5 flex w-full justify-center">
                {withPlaceholder ? (
                  <Placeholder name={searchBarPlaceholderKey} rendering={rendering} />
                ) : (
                  <Link
                    field={fields.CtaLink}
                    className="arrow-btn hero-cta-btn"
                    editable={editable}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroBannerCommon>
  );
};
