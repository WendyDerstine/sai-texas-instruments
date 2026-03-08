import { generateIndexes } from '@/helpers/generateIndexes';
import { IGQLTextField } from '@/types/igql';
import {
  ComponentParams,
  ComponentRendering,
  Image,
  Link,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';
import AccentLine from '@/assets/icons/accent-line/AccentLine';
import { CommonStyles } from '@/types/styleFlags';

interface Fields {
  data: {
    datasource: {
      children: {
        results: Feature[];
      };
      title: IGQLTextField;
    };
  };
}

interface Feature {
  featureImage: { jsonValue: { value: { src: string; alt?: string } } };
  featureTitle: { jsonValue: { value: string } };
  featureDescription: { jsonValue: { value: string } };
  featureLink: { jsonValue: { value: { href: string } } };
}

type FeaturesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

type FeatureWrapperProps = {
  props: FeaturesProps;
  children: React.ReactNode;
};

const FeatureWrapper = (wrapperProps: FeatureWrapperProps) => {
  // rendering item id
  const id = wrapperProps.props.params.RenderingIdentifier;

  return (
    <section className={`${wrapperProps.props.params.styles}`} id={id ? id : undefined}>
      {wrapperProps.children}
    </section>
  );
};

export const Default = (props: FeaturesProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const results = props.fields.data.datasource.children.results;
  const hideAccentLine = props.params.styles?.includes(CommonStyles.HideAccentLine);
  const featureSectionTitle = props.fields.data.datasource.title;

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 py-20 lg:grid-cols-[1fr_2fr] lg:gap-10">
        <div className="mb-20 lg:mb-0">
          <h2 className="inline-block max-w-md font-bold max-lg:text-[42px]">
            <Text field={featureSectionTitle.jsonValue} editable={editable} />
            {!hideAccentLine && <AccentLine className="w-full max-w-xs" />}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {results.map((item, index) => {
            const title = item.featureTitle.jsonValue;
            const description = item.featureDescription.jsonValue;
            const link = item.featureLink.jsonValue;
            return (
              <div className="flex flex-col" key={index}>
                <div className="mb-5 text-2xl font-bold">
                  <Text field={title} editable={editable} />
                </div>
                <div className="text-foreground mb-3.5 flex-auto leading-7">
                  <Text field={description} editable={editable} />
                </div>
                <div>
                  <Link field={link} className="arrow-btn" editable={editable} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FeatureWrapper>
  );
};

export const ImageGrid = (props: FeaturesProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 gap-4 py-9 md:grid-cols-2 lg:grid-cols-5">
        {results.map((item, index) => {
          const imageField = item?.featureImage.jsonValue;
          return (
            <div className="flex items-center justify-center py-9 lg:py-2" key={index}>
              {imageField && (
                <Image field={imageField} className="max-h-20 object-contain" editable={editable} />
              )}
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const ThreeColGridCentered = (props: FeaturesProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="container flex flex-col flex-wrap justify-evenly gap-20 md:flex-row lg:gap-20">
        {results.map((item, index) => {
          const title = item.featureTitle.jsonValue;
          const description = item.featureDescription.jsonValue;
          const image = item.featureImage.jsonValue;
          return (
            <div className="flex flex-col items-center justify-start 2xl:w-80" key={index}>
              <div className="bg-accent mb-7 flex h-20 w-20 items-center justify-center rounded-full">
                <Image field={image} editable={editable} />
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 leading-0.5">
                  <Text tag="h5" className="text-accent" field={title} editable={editable} />
                </div>
                <div className="text-background-muted-light text-center">
                  <Text field={description} editable={editable} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const NumberedGrid = (props: FeaturesProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="container grid grid-cols-1 gap-4 py-24 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item, index) => {
          const title = item?.featureTitle.jsonValue;
          const description = item?.featureDescription.jsonValue;
          return (
            <div
              className="group text-background hover:bg-accent cursor-pointer rounded-xl p-6"
              key={index}
            >
              <h1 className="group-hover:text-background text-background-muted-dark mb-2 text-7xl leading-24">
                {generateIndexes(index)}
              </h1>
              <div>
                <div className="text-accent group-hover:text-background mb-4 text-2xl leading-8 font-bold">
                  <Text field={title} editable={editable} />
                </div>
                <div className="text-background-muted-dark group-hover:text-background leading-7">
                  <Text field={description} editable={editable} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const FourColGrid = (props: FeaturesProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="features-fourcolgrid container grid grid-cols-1 gap-8 py-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:py-6">
        {results.map((item, index) => {
          const title = item.featureTitle.jsonValue;
          const description = item.featureDescription.jsonValue;
          const image = item.featureImage.jsonValue;
          return (
            <div className="flex flex-row items-center gap-3" key={index}>
              <div className="features-fourcolgrid__item-icon flex h-7 w-7 flex-shrink-0 items-center justify-center">
                <Image field={image} className="h-full w-full object-contain" editable={editable} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="features-fourcolgrid__item-title text-foreground text-base leading-snug font-normal">
                  <Text field={title} editable={editable} />
                </div>
                <div className="features-fourcolgrid__item-description text-foreground-muted mt-0.5 text-sm leading-snug">
                  <Text field={description} editable={editable} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};

export const ImageCardGrid = (props: FeaturesProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const results = props.fields.data.datasource.children.results;

  return (
    <FeatureWrapper props={props}>
      <div className="outline-non container grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item, index) => {
          const title = item.featureTitle.jsonValue;
          const description = item.featureDescription.jsonValue;
          const image = item.featureImage.jsonValue;
          return (
            <div key={index}>
              <div className="mb-7 aspect-4/3 w-full overflow-hidden rounded-lg bg-white">
                <Image field={image} className="h-full w-full object-cover" editable={editable} />
              </div>
              <h6>
                <Text field={title} editable={editable} />
              </h6>
              <p className="text-foreground-muted mt-1 text-lg">
                <Text field={description} editable={editable} />
              </p>
            </div>
          );
        })}
      </div>
    </FeatureWrapper>
  );
};
