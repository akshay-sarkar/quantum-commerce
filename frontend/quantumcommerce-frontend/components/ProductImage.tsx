import React from 'react';
import Image from 'next/image';
import { IProduct } from '@/models';

interface ProductImageProps {    
    product: IProduct;
    imageClass?: string;
    height?: number;
    width?: number;
}

const ProductImage = ({product, imageClass, height, width}: ProductImageProps) => {
    return (
            <Image
                src={product.imageUrl}
                alt={product.name}
                className={imageClass || "w-full h-48 object-cover"}
                height={height || 200}
                width={width || 200}
                unoptimized />
    );
};

export default ProductImage;