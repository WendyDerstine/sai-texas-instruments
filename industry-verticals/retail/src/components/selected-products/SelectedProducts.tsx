import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Text, Field, LinkField, Link, useSitecore } from '@sitecore-content-sdk/nextjs';
import { isParamEnabled } from '@/helpers/isParamEnabled';
import ProductCarousel from '../non-sitecore/ProductCarousel';
import { SitecoreItem } from '@/types/common';
import { Product } from '@/types/products';

interface Fields {
  Title: Field<string>;
  ProductsLink: LinkField;
  ProductsList: SitecoreItem<Product>[];
}

interface RelatedProductsProps extends ComponentProps {
  fields: Fields;
}

export const Default = (props: RelatedProductsProps): JSX.Element => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const { styles, RenderingIdentifier: id } = props.params;
  const autoPlay = isParamEnabled(props.params.Autoplay);
  const loop = isParamEnabled(props.params.Loop);

  return (
    <section className={`component related-products ${styles}`} id={id || undefined}>
      <div className="container flex flex-col items-center p-8 md:p-10">
        <h2 className="mb-10 inline-block">
          <Text field={props.fields?.Title} editable={editable} />
        </h2>
        <ProductCarousel
          products={props.fields.ProductsList}
          autoPlay={autoPlay}
          loop={loop}
          cardVariant="compact"
        />
        <Link field={props.fields.ProductsLink} className="arrow-btn" editable={editable} />
      </div>
    </section>
  );
};
