import { NextImage as ContentSdkImage, Text } from '@sitecore-content-sdk/nextjs';
import StarRating from './StarRating';
import Link from 'next/link';
import { Product } from '@/types/products';
import { useLocale } from '@/hooks/useLocaleOptions';

type ProductCardVariant = 'default' | 'compact';

interface ProductCardProps {
  product: Partial<Product> & {
    Rating: number;
  };
  url: string;
  className?: string;
  variant?: ProductCardVariant;
}

export const ProductCard = ({ product, url, className, variant = 'default' }: ProductCardProps) => {
  const { currencySymbol } = useLocale();
  const formattedPrice =
    product.Price?.value && !isNaN(product.Price?.value)
      ? product.Price.value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : product.Price?.value;

  const isCompact = variant === 'compact';
  const detailsClasses = isCompact
    ? 'bg-background flex flex-col items-center px-5 pt-3 pb-3 text-center'
    : 'bg-background flex grow-1 flex-col items-start px-5 pt-3 pb-9 text-left';
  const ratingClasses = isCompact ? '!text-accent mt-1 mb-0' : '!text-accent mt-1 mb-5';
  const priceClasses = isCompact
    ? '!text-foreground mt-1 font-semibold'
    : '!text-foreground mt-auto font-semibold';

  const cardClassName = `flex w-full flex-col overflow-hidden rounded-2xl hover:drop-shadow-sm${!isCompact ? ' min-h-123' : ''}${className ? ` ${className}` : ''}`;

  return (
    <Link href={url} passHref>
      <div className={cardClassName}>
        {/* Product Image */}
        <div className="bg-background-surface flex h-72 w-full items-center justify-center p-6">
          <ContentSdkImage
            field={product.Image1}
            className="max-h-full max-w-full object-contain"
            priority
          />
        </div>

        {/* Product Details */}
        <div className={detailsClasses}>
          <p className="!text-foreground-light">
            <Text field={product.Category?.fields?.CategoryName} />
          </p>

          <h6 className="!text-foreground mt-1 line-clamp-2 font-semibold">
            <Text field={product.Title} />
          </h6>

          <StarRating rating={product.Rating || 0} showOnlyFilled className={ratingClasses} />

          <h6 className={priceClasses}>
            <span className="mr-1 align-super text-sm">{currencySymbol} </span>
            {formattedPrice}
          </h6>
        </div>
      </div>
    </Link>
  );
};
