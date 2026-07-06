import { useState } from 'react';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x800?text=SQH';

export default function ImageWithFallback({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMAGE);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt || 'Product image'}
      className={className}
      onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
    />
  );
}
