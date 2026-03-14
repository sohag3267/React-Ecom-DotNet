import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function HistoryCardLoader() {
	return (
		<Card>
			<CardContent className="p-6">
				<Skeleton className="h-6 w-32 mb-4" />

				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="border rounded-lg p-4 space-y-2"
						>
							<div className="flex justify-between">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-5 w-20" />
							</div>
							<div className="flex gap-4">
								<Skeleton className="h-16 w-16" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
