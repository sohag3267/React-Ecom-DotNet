"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/shared/ui/card";
import { Avatar, AvatarFallback } from "@/components/shared/ui/avatar";
import { Progress } from "@/components/shared/ui/progress";
import { Star } from "lucide-react";
import type {
	ProductReview,
	RatingCounts,
} from "@/(app-routes)/products/model";

const StarRating = ({
	rating,
	size = "w-4 h-4",
}: {
	rating: number;
	size?: string;
}) => (
	<div className="flex items-center">
		{[...Array(5)].map((_, i) => (
			<Star
				key={i}
				className={`${size} ${i < Math.floor(rating)
						? "fill-yellow-400 text-yellow-400"
						: "text-muted-foreground"
					}`}
			/>
		))}
	</div>
);

const formatReviewDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const RatingBreakdown = ({
	ratingCounts,
	totalReviews,
}: {
	ratingCounts: RatingCounts;
	totalReviews: number;
}) => (
	<div className="flex-1 space-y-2">
		{[5, 4, 3, 2, 1].map((rating) => {
			const count =
				ratingCounts[rating.toString() as keyof RatingCounts] || 0;
			const percentage =
				totalReviews > 0 ? (count / totalReviews) * 100 : 0;

			return (
				<div
					key={rating}
					className="flex items-center gap-2 text-xs sm:text-sm"
				>
					<span className="w-8 text-right">{rating}.0</span>
					<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
					<Progress value={percentage} className="flex-1 h-2" />
					<span className="w-12 text-right text-muted-foreground">
						{count}
					</span>
				</div>
			);
		})}
	</div>
);

const ReviewCard = ({ review }: { review: ProductReview }) => (
	<Card className="border">
		<CardContent className="p-4">
			<div className="flex gap-3">
				<Avatar className="h-10 w-10 flex-shrink-0">
					<AvatarFallback className="bg-primary/10 text-primary">
						{review.reviewer_name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 space-y-2">
					<div className="flex items-start justify-between gap-2">
						<div>
							<p className="font-medium text-sm">
								{review.reviewer_name}
							</p>
							<p className="text-xs text-muted-foreground">
								{formatReviewDate(review.created_at)}
							</p>
						</div>
						<StarRating rating={review.rating} size="w-3.5 h-3.5" />
					</div>

					<p className="text-sm text-muted-foreground leading-relaxed">
						{review.review}
					</p>
				</div>
			</div>
		</CardContent>
	</Card>
);

interface ProductReviewsProps {
	averageRating: number;
	totalReviews: number;
	ratingCounts: RatingCounts;
	reviews?: ProductReview[];
}

export function ProductReviews({
	averageRating,
	totalReviews,
	ratingCounts,
	reviews,
}: ProductReviewsProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Reviews Summary */}
			<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-4 border-b">
				{/* Average Rating */}
				<div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
					<div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
						{averageRating.toFixed(1)}
					</div>
					<StarRating rating={averageRating} />
					<p className="text-xs text-muted-foreground">
						{t("productDetails.fromReviews", {
							count: totalReviews,
						})}
					</p>
				</div>

				{/* Rating Breakdown */}
				<RatingBreakdown
					ratingCounts={ratingCounts}
					totalReviews={totalReviews}
				/>
			</div>

			{/* Reviews List */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{reviews && reviews.length > 0 ? (
					reviews.map((review) => (
						<ReviewCard key={review.id} review={review} />
					))
				) : (
					<p className="text-center text-muted-foreground py-8">
						{t("productDetails.noReviews") ||
							"No reviews yet for this product."}
					</p>
				)}
			</div>
		</div>
	);
}
