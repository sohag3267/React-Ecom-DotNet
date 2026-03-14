import { useEffect, useState } from "react";

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set up a timer to update the debounced value after the delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timer if value changes before delay completes
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

/**
 * Custom hook for debounced callbacks
 * @param callback - The callback function to debounce
 * @param delay - The debounce delay in milliseconds
 * @param dependencies - Dependencies array for the callback
 * @returns The debounced callback function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
	dependencies: React.DependencyList = []
): T {
	const [debouncedCallback, setDebouncedCallback] = useState<T>(
		() => callback
	);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const debouncedFn = ((...args: Parameters<T>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				callback(...args);
			}, delay);
		}) as T;

		setDebouncedCallback(() => debouncedFn);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [callback, delay, ...dependencies]);

	return debouncedCallback;
}
