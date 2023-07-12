import type { Invalidator, Subscriber, Unsubscriber } from 'svelte/store';

export interface DataPoint {
	group: string;
	date: Date;
	value: number | null;
	min?: number;
	max?: number;
}

export interface TreeMapPoint {
	name: string;
	children: { name: string; value: number; showLabel?: boolean }[];
}

export interface CachedChartData {
	subscribe: (
		this: void,
		run: Subscriber<unknown>,
		invalidate?: Invalidator<unknown>
	) => Unsubscriber;
	set: (v: unknown) => void;
	reload: () => void;
}
