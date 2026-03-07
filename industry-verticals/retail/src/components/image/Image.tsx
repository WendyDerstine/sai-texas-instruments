'use client';

import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  LinkField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';
import { ComponentProps } from 'lib/component-props';
import { useHeaderLogo } from '@/contexts/HeaderLogoContext';

interface ImageFields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

interface ImageProps extends ComponentProps {
  fields: ImageFields;
}

const ImageWrapper: React.FC<{
  className: string;
  id?: string;
  children: React.ReactNode;
  centerContent?: boolean;
}> = ({ className, id, children, centerContent }) => (
  <div className={className.trim()} id={id}>
    <div className={`component-content${centerContent ? 'flex items-center' : ''}`.trim()}>
      {children}
    </div>
  </div>
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={`component image ${params.styles}`}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Default: React.FC<ImageProps> = (props) => {
  const { page } = useSitecore();
  const isInHeaderLogo = useHeaderLogo();
  const { fields, params } = props;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const imgValue = fields.Image?.value;
  const width = (imgValue as { width?: number })?.width ?? 120;
  const height = (imgValue as { height?: number })?.height ?? 40;
  const editable = page.mode.isEditing;
  const Image = () => (
    <ContentSdkImage field={fields.Image} width={width} height={height} editable={editable} />
  );
  const shouldWrapWithLink = !page.mode.isEditing && fields.TargetUrl?.value?.href;
  const isLogo = isInHeaderLogo || params.Display === 'Logo';

  return (
    <ImageWrapper
      className={`component image ${styles} ${isLogo ? 'flex items-center' : ''}`.trim()}
      id={id}
      centerContent={isLogo}
    >
      {shouldWrapWithLink ? (
        <ContentSdkLink field={fields.TargetUrl}>
          <Image />
        </ContentSdkLink>
      ) : (
        <Image />
      )}
      {!isLogo && (
        <Text
          tag="span"
          className="image-caption"
          field={fields.ImageCaption}
          editable={editable}
        />
      )}
    </ImageWrapper>
  );
};
