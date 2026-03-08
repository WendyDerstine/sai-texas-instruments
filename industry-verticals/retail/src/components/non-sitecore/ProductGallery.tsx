import { ImageField, NextImage as ContentSdkImage } from '@sitecore-content-sdk/nextjs';
import { useMemo, useState } from 'react';
import { Product } from '@/types/products';

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const images: ImageField[] = useMemo(
    () =>
      [product.Image1, product.Image2, product.Image3, product.Image4, product.Image5].filter(
        (img): img is ImageField => Boolean(img?.value?.src)
      ),
    [product]
  );

  return (
    <div className="flex w-full flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:flex-col sm:justify-start">
        {images.map((img, idx) => {
          const isActive = idx === mainImageIndex;

          return (
            <button
              key={img?.value?.src || idx}
              type="button"
              onClick={() => setMainImageIndex(idx)}
              disabled={isActive}
              aria-label={`View image ${idx + 1}`}
              className={`focus:ring-accent size-15 overflow-hidden bg-white focus:ring-2 focus:outline-none xl:size-18 ${
                isActive ? 'cursor-not-allowed opacity-50' : 'hover:ring-accent hover:ring-2'
              }`}
            >
              <ContentSdkImage field={img} className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>

      <div className="grow">
        {images[mainImageIndex] ? (
          <ContentSdkImage
            field={images[mainImageIndex]}
            className="aspect-square w-full bg-white object-contain p-4"
          />
        ) : (
          <div className="aspect-square w-full bg-white" />
        )}
      </div>
    </div>
  );
};
