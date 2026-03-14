"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
	productName: string;
	thumbnailImage: string;
	galleryImages?: string[];
	colorImage?: string;
}

export function ProductImageGallery({
	productName,
	thumbnailImage,
	galleryImages,
	colorImage,
}: ProductImageGalleryProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [showColorImage, setShowColorImage] = useState(false);

	// Fallback image for products without thumbnails
	const fallbackImage = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format`;

	const baseImages = [
		{ url: thumbnailImage || fallbackImage, alt: `${productName} thumbnail` },
		...(galleryImages ? galleryImages.map((url) => ({ url, alt: productName })) : []),
	].filter((img) => img.url);

	useEffect(() => {
		if (colorImage) {
			setShowColorImage(true);
		} else {
			setShowColorImage(false);
		}
	}, [colorImage]);

	const mainImage = showColorImage && colorImage ? colorImage : baseImages[selectedImage]?.url || fallbackImage;

	return (
		<div className="space-y-2 sm:space-y-3 lg:space-y-4">
			<div className="aspect-square rounded-md sm:rounded-lg overflow-hidden bg-muted">
				<Image
					src={mainImage}
					alt={productName}
					width={600}
					height={600}
					className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					priority
				/>
			</div>
			{(baseImages.length > 1 || colorImage) && (
				<div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-1">
					{baseImages.map((image, index) => (
						<button
							key={index}
							onClick={() => {
								setSelectedImage(index);
								setShowColorImage(false);
							}}
							className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${!showColorImage && selectedImage === index
								? "border-primary"
								: "border-border"
								}`}
						>
							<Image
								src={image.url}
								alt={image.alt}
								width={80}
								height={80}
								className="w-full h-full object-cover"
							/>
						</button>
					))}
					{colorImage && (
						<button
							onClick={() => setShowColorImage(true)}
							className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${showColorImage ? "border-primary" : "border-border"}`}
						>
							<Image
								src={colorImage}
								alt={`${productName} color`}
								width={80}
								height={80}
								className="w-full h-full object-cover"
							/>
						</button>
					)}
				</div>
			)}
		</div>
	);
}